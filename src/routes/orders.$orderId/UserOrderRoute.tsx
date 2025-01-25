import { ChevronLeft, OpenInNew, PriorityHigh } from "@mui/icons-material";
import {
	Button,
	CircularProgress,
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
	Divider,
	IconButton,
	Modal,
	Snackbar,
	Stack,
	Tooltip,
	Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { orderStatusBadges, preorderBadge, preorderStatusBadges } from "@components/Badges";
import CountdownTimer from "@components/CountdownTimer";
import { Delivery, DeliveryService } from "@appTypes/Delivery";
import { DateFormatter, getRuGoodsWord } from "@utils/format";
import { getImageUrl } from "@utils/image";
import { useParams } from "react-router-dom";
import { useGetOrderActionsQuery, useGetOrderQuery, useSetOrderDeliveryMutation } from "@api/shop/profile";
import { useLazyGetPaymentUrlQuery } from "@api/shop/order";
import SomethingWentWrong from "@components/SomethingWentWrong";
import { useIsMobile } from "src/hooks/useIsMobile";
import { CreditGet } from "@appTypes/Credit";
import { Helmet } from "react-helmet";
import { PageHeading } from "@components/PageHeading";
import { isExpectedApiError } from "@utils/api";
import { DeliveryFormRef, DeliveryForm } from "@components/DeliveryForm";
import { PreorderStatus } from "@appTypes/Preorder";

const preorderStatusListToRender: PreorderStatus[] = [
	"WAITING_FOR_RELEASE",
	"FOREIGN_SHIPPING",
	"LOCAL_SHIPPING",
	"DISPATCH",
];

const deliveryServiceMapping: Record<DeliveryService, string> = {
	CDEK: "СДЭК",
	SELF_PICKUP: "Самовывоз",
};

interface OrderItemCreditProps {
	credit: CreditGet;
	onPayClick: (invoiceId: string) => void;
}

const OrderItemCredit: React.FC<OrderItemCreditProps> = ({ credit, onPayClick }) => {
	const paidParts = useMemo(() => {
		return credit.payments.findIndex((payment) => !payment.invoice.isPaid);
	}, [credit]);
	return (
		<div>
			<Stack direction="column" divider={<Divider />}>
				{credit.payments.map((payment, index) => (
					<div className="d-f fd-r">
						<div className="w-100">
							<Typography variant="body2" sx={{ color: "typography.secondary" }}>
								{payment.invoice.amount} ₽
							</Typography>
						</div>
						<div className="w-100">
							<Typography variant="body2" sx={{ color: "typography.secondary" }}>
								{DateFormatter.DDMMYYYY(payment.deadline)}
							</Typography>
						</div>
						{payment.invoice.isPaid ? (
							<Typography variant="body2" sx={{ color: "typography.success" }}>
								Оплачено
							</Typography>
						) : paidParts === index ? (
							<Button onClick={() => onPayClick(payment.invoice.id)} variant="contained">
								Оплатить
							</Button>
						) : (
							<Typography variant="body2" sx={{ color: "typography.secondary" }}>
								Не оплачено
							</Typography>
						)}
					</div>
				))}
			</Stack>
		</div>
	);
};

export function Component() {
	const params = useParams();
	const orderId = params.orderId;
	if (orderId === undefined) {
		throw new Response("No order id provided", { status: 404 });
	}

	const isMobile = useIsMobile();
	const navigate = useNavigate();

	const deliveryFormRef = useRef<DeliveryFormRef>(null);
	const [editingDelivery, setEditingDelivery] = useState(false);

	const [snackbarOpen, setSnackbarOpen] = useState(false);
	const [snackbarMessage, setSnackbarMessage] = useState("");

	const {
		data: order,
		isLoading: orderIsLoading,
		refetch: refetchOrder,
		isFetching: orderIsFetching,
	} = useGetOrderQuery({ id: orderId });
	const { data: orderActions, isLoading: orderActionsIsLoading } = useGetOrderActionsQuery({ id: orderId });

	const hasAdditionalPayments = useMemo(() => {
		const preorder = order?.preorder;
		if (!preorder) {
			return false;
		}
		return (
			!!preorder.credit ||
			!!preorder.foreignShippingInvoice ||
			!!(!preorder.foreignShippingInvoice && preorder.shippingCostIncluded === "NOT") ||
			!!preorder.localShippingInvoice ||
			!!(!preorder.localShippingInvoice && preorder.shippingCostIncluded !== "FULL")
		);
	}, [order]);

	const [
		setOrderDelivery,
		{
			isLoading: setOrderDeliveryIsLoading,
			isSuccess: setOrderDeliveryIsSuccess,
			isError: setOrderDeliveryIsError,
		},
	] = useSetOrderDeliveryMutation();

	useEffect(() => {
		if (setOrderDeliveryIsSuccess) {
			setSnackbarMessage("Способ доставки успешно изменён");
			setSnackbarOpen(true);
			refetchOrder();
			setEditingDelivery(false);
		}
	}, [setOrderDeliveryIsSuccess, refetchOrder]);

	useEffect(() => {
		if (setOrderDeliveryIsError) {
			setSnackbarMessage("Не удалось изменить способ доставки");
			setSnackbarOpen(true);
			setEditingDelivery(false);
		}
	}, [setOrderDeliveryIsError]);

	const changeDelivery = ({ delivery, saveDelivery }: { delivery: Delivery; saveDelivery: boolean }) => {
		setOrderDelivery({
			orderId,
			delivery,
			saveDelivery,
		});
	};

	const handleDeliveryFormSubmit = (delivery: Delivery, saveDelivery: boolean) => {
		changeDelivery({ delivery, saveDelivery });
	};

	const handleChangeDelivery = () => {
		if (orderActions?.setDelivery.enabled && deliveryFormRef.current) {
			deliveryFormRef.current.submit();
		}
	};

	const [
		initPayment,
		{
			data: initPaymentData,
			isLoading: initPaymentIsLoading,
			isSuccess: initPaymentIsSuccess,
			isError: initPaymentIsError,
			error: initPaymentError,
		},
	] = useLazyGetPaymentUrlQuery();

	const [paymentErrorDialogOpen, setPaymentErrorDialogOpen] = useState(false);
	const [paymentError, setPaymentError] = useState<{ message: string; orderId: string } | null>(null);

	useEffect(() => {
		if (initPaymentIsSuccess) {
			window.location.href = initPaymentData.paymentUrl;
		}
	}, [initPaymentIsSuccess, initPaymentData]);

	useEffect(() => {
		if (initPaymentIsError) {
			if (isExpectedApiError(initPaymentError)) {
				switch (initPaymentError.data.title) {
					case "PaymentInitError": {
						const message = initPaymentError.data.message;
						const details = initPaymentError.data.details as string[];
						const orderId = details[0] as string;
						setPaymentError({ message, orderId });
						setPaymentErrorDialogOpen(true);
						console.debug("PaymentInitError", { message, orderId });
						break;
					}
				}
			}
		}
	}, [initPaymentIsError, initPaymentError]);

	const handlePay = (invoiceId: string) => {
		initPayment({ invoiceId });
	};

	return (
		<>
			<Helmet>
				<title>{order ? `Заказ от ${DateFormatter.DDMMYYYY(order.createdAt)} - ` : ""}SimpleGeek</title>
			</Helmet>
			{orderIsLoading || orderActionsIsLoading ? (
				<div className="w-100 h-100 ai-c d-f jc-c">
					<CircularProgress />
				</div>
			) : !order || !orderActions ? (
				<SomethingWentWrong />
			) : (
				<>
					<Modal open={setOrderDeliveryIsLoading || initPaymentIsLoading || orderIsFetching}>
						<div className="w-100v h-100v ai-c d-f jc-c" style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}>
							<CircularProgress />
						</div>
					</Modal>
					<Snackbar
						autoHideDuration={3000}
						open={snackbarOpen}
						message={snackbarMessage}
						onClose={() => setSnackbarOpen(false)}
					/>
					<Dialog
						open={paymentErrorDialogOpen}
						onClose={() => setPaymentErrorDialogOpen(false)}
						aria-labelledby="error-dialog-title"
						aria-describedby="error-dialog-description"
					>
						{paymentError && (
							<>
								<DialogTitle id="error-dialog-title">Ошибка оплаты</DialogTitle>
								<DialogContent>
									<DialogContentText id="error-dialog-description">
										{paymentError.message}
										<br />
										Попробуйте ещё раз. При повторной ошибке свяжитесь с администратором.
									</DialogContentText>
								</DialogContent>
								<DialogActions>
									<Button variant="contained" onClick={() => setPaymentErrorDialogOpen(false)}>
										Понятно
									</Button>
								</DialogActions>
							</>
						)}
					</Dialog>
					<div className="gap-2 ai-fs d-f fd-c">
						<Button
							variant="text"
							sx={{ color: "warning.main" }}
							onClick={() => navigate("/profile/orders")}
						>
							<ChevronLeft />
							<Typography color="inherit">Все заказы</Typography>
						</Button>
					</div>

					<PageHeading
						title={
							<div className="gap-1 ai-c d-f fd-r">
								<Typography sx={{ verticalAlign: "baseline" }} variant={"h4"}>
									Заказ от {DateFormatter.DDMMYYYY(order.createdAt)}
								</Typography>
								{order.preorder && preorderBadge}
							</div>
						}
						subText={`ID: ${order.id}`}
						additional={
							<div className="gap-1 d-f fd-r">
								{orderStatusBadges[order.status]}
								{order.preorder &&
									order.status === "ACCEPTED" &&
									preorderStatusListToRender.includes(order.preorder.status) && (
										<>{preorderStatusBadges[order.preorder.status]}</>
									)}
							</div>
						}
					/>
					{order.preorder?.expectedArrival && (
						<Typography variant="subtitle0" sx={{ paddingBottom: "16px" }}>
							Ожидаемая дата прибытия предзаказа на склад: {order.preorder.expectedArrival}
						</Typography>
					)}
					<div className="gap-2 w-100 d-f" style={{ flexDirection: isMobile ? "column" : "row" }}>
						<div className="gap-2 w-100 d-f fd-c">
							{order.delivery === null ? (
								orderActions.setDelivery.enabled ? (
									editingDelivery ? (
										<div className="gap-1 d-f fd-c">
											<DeliveryForm
												ref={deliveryFormRef}
												isMobile={isMobile}
												defaultDelivery={order.delivery}
												packages={orderActions.setDelivery.packages}
												onSubmit={handleDeliveryFormSubmit}
											/>
											<div className="gap-1 d-f fd-r jc-fe">
												<Button
													sx={{ color: "white" }}
													color="error"
													variant="contained"
													onClick={() => setEditingDelivery(false)}
												>
													Оформить
												</Button>
												<Button
													sx={{ color: "white" }}
													color="success"
													variant="contained"
													onClick={() => handleChangeDelivery()}
												>
													Сохранить
												</Button>
											</div>
										</div>
									) : (
										<div className="section">
											<div className="gap-1">
												<div className="gap-1 d-f fd-r">
													<PriorityHigh />
													<Typography variant="subtitle1">
														Необходимо указать способ доставки.
													</Typography>
												</div>
												<Button
													sx={{ width: "fit-content" }}
													variant="contained"
													onClick={() => setEditingDelivery(true)}
												>
													Выбрать
												</Button>
											</div>
										</div>
									)
								) : (
									<div className="section">
										<div className="gap-1">
											<Typography variant="subtitle1">
												Доставка к вам оформляется после полной оплаты заказа и его прибытия на
												склад в Москве.
											</Typography>
											{/* <div className="gap-1 d-f fd-r">
												<Typography variant="subtitle1" sx={{ color: "typography.secondary" }}>
													На складе ожидается:
												</Typography>
												<Typography variant="body1">
													{order.preorder?.expectedArrival ?? "Неизвестно"}
												</Typography>
											</div> */}
										</div>
									</div>
								)
							) : editingDelivery ? (
								<div className="gap-1 d-f fd-c">
									<DeliveryForm
										ref={deliveryFormRef}
										isMobile={isMobile}
										defaultDelivery={order.delivery}
										packages={orderActions.setDelivery.packages}
										onSubmit={handleDeliveryFormSubmit}
									/>
									<div className="gap-1 d-f fd-r jc-fe">
										<Button
											sx={{ color: "white" }}
											color="error"
											variant="contained"
											onClick={() => setEditingDelivery(false)}
										>
											Отменить
										</Button>
										<Button
											sx={{ color: "white" }}
											color="success"
											variant="contained"
											onClick={() => handleChangeDelivery()}
										>
											Сохранить
										</Button>
									</div>
								</div>
							) : (
								<div className="section">
									<Stack
										gap={1}
										direction={"column"}
										divider={<Divider orientation="horizontal" flexItem />}
									>
										<div className="gap-2 d-f fd-c">
											<div className="d-f fd-r jc-sb">
												<Typography variant={"h5"}>Доставка</Typography>
												{orderActions.setDelivery.enabled && (
													<Button
														sx={{ width: "fit-content" }}
														variant="contained"
														onClick={() => setEditingDelivery(true)}
													>
														Изменить
													</Button>
												)}
											</div>

											<div className={`d-f ${isMobile ? " fd-c gap-1" : " fd-r jc-sb"}`}>
												<div className="gap-05 w-100 d-f fd-c">
													<Typography variant="body1" sx={{ color: "typography.secondary" }}>
														Способ получения
													</Typography>
													<Typography variant="subtitle0">
														{deliveryServiceMapping[order.delivery.service]}
													</Typography>
												</div>
												<div className="gap-05 w-100 d-f fd-c">
													<Typography variant="body1" sx={{ color: "typography.secondary" }}>
														Пункт выдачи
													</Typography>
													<Typography variant="body1">
														{order.delivery.point?.code}
													</Typography>
												</div>
											</div>
											<div className="gap-05 d-f fd-c">
												<Typography variant="body1" sx={{ color: "typography.secondary" }}>
													Адрес
												</Typography>
												<Typography variant="body1">{order.delivery.point?.address}</Typography>
											</div>
											{order.delivery.tracking?.code && (
												<div className="gap-05 d-f fd-c">
													<Typography variant="body1" sx={{ color: "typography.secondary" }}>
														Трек-номер
													</Typography>
													<div className="gap-1 ai-c d-f fd-r">
														<Typography variant="body1">
															{order.delivery.tracking.code}
														</Typography>
														<Tooltip title="Открыть в новой вкладке">
															<IconButton
																onClick={() =>
																	window.open(
																		order.delivery!.tracking!.link,
																		"_blank"
																	)
																}
															>
																<OpenInNew />
															</IconButton>
														</Tooltip>
													</div>
												</div>
											)}
										</div>
										<div className="gap-2 d-f fd-c">
											<Typography variant="h5">Получатель</Typography>
											<div className={`d-f ${isMobile ? " fd-c gap-1" : " fd-r jc-sb"}`}>
												<div className="gap-05 w-100 d-f fd-c">
													<Typography variant="body1" sx={{ color: "typography.secondary" }}>
														ФИО
													</Typography>
													<Typography variant="subtitle0">
														{order.delivery.recipient.fullName}
													</Typography>
												</div>
												<div className="gap-05 w-100 d-f fd-c">
													<Typography variant="body1" sx={{ color: "typography.secondary" }}>
														Номер телефона
													</Typography>
													<Typography variant="body1">
														{order.delivery.recipient.phone}
													</Typography>
												</div>
											</div>
										</div>
									</Stack>
								</div>
							)}

							<div className="section">
								<Typography variant="h5">
									{order.items.length} {getRuGoodsWord(order.items.length)}
								</Typography>
								<div className="gap-2 d-f fd-c">
									{order.items.map((item) => (
										<div className="section" key={item.id}>
											<div className="gap-1 d-f fd-c">
												<div className="w-100 d-f fd-r jc-sb">
													<div className="gap-1 w-100 d-f fd-r">
														<div className="br-2" style={{ width: 96, height: 96 }}>
															<img
																className="contain"
																src={getImageUrl(item.image, "small")}
															/>
														</div>
														<div className="gap-1">
															<Typography variant="h6">{item.title}</Typography>
															<Typography variant="body1">{item.quantity} шт.</Typography>
														</div>
													</div>
													<div className="d-f fd-r fs-0">
														<Typography variant="subtitle1">{item.sum} ₽</Typography>
													</div>
												</div>
												{item.credit && (
													<OrderItemCredit onPayClick={handlePay} credit={item.credit} />
												)}
											</div>
										</div>
									))}
								</div>
							</div>
						</div>
						<div
							className="top-0 gap-2 bg-primary p-2 h-mc br-3 d-f fd-c fs-0 ps-s"
							style={{ width: isMobile ? "100%" : 360 }}
						>
							{order.status === "CANCELLED" ? (
								<>
									<Typography variant="subtitle1">Заказ отменен</Typography>
									<Divider orientation="horizontal" flexItem />
									{order.initialInvoice.status === "REFUNDED" ? (
										<Typography variant="subtitle0">Произведён возврат средств</Typography>
									) : (
										order.initialInvoice.status === "UNPAID" && (
											<Typography variant="subtitle0">Платёж просрочен</Typography>
										)
									)}
								</>
							) : order.status === "UNPAID" ? (
								order.initialInvoice.status === "WAITING" ? (
									<Typography variant="subtitle1">Ожидаем подтверждение банка</Typography>
								) : (
									<>
										<Typography variant="subtitle1" sx={{ color: "typography.error" }}>
											Заказ не оплачен
										</Typography>
										<Button
											onClick={() => handlePay(order.initialInvoice.id)}
											variant="contained"
											sx={{ width: "fit-content", display: "flex", gap: 1 }}
										>
											Оплатить <CountdownTimer deadline={order.initialInvoice.expiresAt!} />
										</Button>
									</>
								)
							) : order.preorder !== null && hasAdditionalPayments ? (
								<>
									<Typography variant="h6">Оплачено</Typography>
									<Stack direction="column" divider={<Divider />} spacing={1}>
										<div className="d-f fd-r jc-sb">
											<Typography variant="body1">Депозит:</Typography>
											<Typography variant="subtitle0">{order.initialInvoice.amount} ₽</Typography>
										</div>
										{order.preorder.credit?.paidAmount && (
											<div className="d-f fd-r jc-sb">
												<Typography variant="body1">Рассрочка:</Typography>
												<Typography variant="subtitle0">
													{order.preorder.credit.paidAmount} ₽
												</Typography>
											</div>
										)}
										{order.preorder.foreignShippingInvoice &&
											order.preorder.foreignShippingInvoice.isPaid && (
												<div className="d-f fd-r jc-sb">
													<Typography variant="body1">
														Доставка на зарубежный склад:
													</Typography>
													<Typography variant="subtitle0">
														{order.preorder.foreignShippingInvoice.amount} ₽
													</Typography>
												</div>
											)}
										{order.preorder.localShippingInvoice &&
											order.preorder.localShippingInvoice.isPaid && (
												<div className="d-f fd-r jc-sb">
													<Typography variant="body1">Доставка в Россию:</Typography>
													<Typography variant="subtitle0">
														{order.preorder.localShippingInvoice.amount} ₽
													</Typography>
												</div>
											)}
									</Stack>
									<Typography variant="h6">Доплата</Typography>
									<Stack direction="column" divider={<Divider />} spacing={1}>
										{order.preorder.credit?.unpaidAmount && (
											<div className="d-f fd-r jc-sb">
												<Typography variant="body1">Рассрочка:</Typography>
												<Typography variant="subtitle0">
													{order.preorder.credit.unpaidAmount} ₽
												</Typography>
											</div>
										)}
										{order.preorder.foreignShippingInvoice
											? !order.preorder.foreignShippingInvoice.isPaid && (
													<div className="gap-1 d-f fd-c">
														<div className="d-f fd-r jc-sb">
															<Typography variant="body1">
																Доставка на зарубежный склад:
															</Typography>
															<Typography variant="subtitle0">
																{order.preorder.foreignShippingInvoice.amount} ₽
															</Typography>
														</div>
														<Button
															onClick={() =>
																// TODO: Check for correct way
																handlePay(order.preorder!.foreignShippingInvoice!.id)
															}
														>
															Оплатить
														</Button>
													</div>
											  )
											: order.preorder.shippingCostIncluded === "NOT" && (
													<div className="gap-05 d-f fd-c">
														<Typography variant="body1">
															Доставка на зарубежный склад:
														</Typography>
														<Typography variant="body2">
															TODO: Стоимость доставки станет известна
														</Typography>
													</div>
											  )}
										{order.preorder.localShippingInvoice ? (
											!order.preorder.localShippingInvoice.isPaid && (
												<div className="gap-1 d-f fd-c">
													<div className="d-f fd-r jc-sb">
														<Typography variant="body1">Доставка в Россию:</Typography>
														<Typography variant="subtitle0">
															{order.preorder.localShippingInvoice.amount} ₽
														</Typography>
													</div>
													<Button
														onClick={() =>
															// TODO: Check for correct way
															handlePay(order.preorder!.localShippingInvoice!.id)
														}
													>
														Оплатить
													</Button>
												</div>
											)
										) : (
											<div className="gap-05 d-f fd-c">
												<Typography variant="body1">Доставка в Россию:</Typography>
												<Typography variant="caption">
													TODO: Стоимость доставки станет известна
												</Typography>
											</div>
										)}
									</Stack>
								</>
							) : (
								<>
									<div className="gap-1">
										<Typography variant="subtitle1" sx={{ color: "typography.secondary" }}>
											Итого:
										</Typography>
										<Typography variant="subtitle0">{order.initialInvoice.amount} ₽</Typography>
									</div>
									<Divider orientation="horizontal" flexItem />
									<Typography variant="h6" sx={{ color: "typography.success" }}>
										Оплачено!
									</Typography>
								</>
							)}
						</div>
					</div>
				</>
			)}
		</>
	);
}
