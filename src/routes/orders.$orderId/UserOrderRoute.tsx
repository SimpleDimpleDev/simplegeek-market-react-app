import { ChevronLeft } from "@mui/icons-material";
import { Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Divider, Stack, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import React, { useEffect, useMemo, useState } from "react";
import { orderStatusBadges } from "@components/Badges";
import CountdownTimer from "@components/CountdownTimer";
import { DeliveryPackage, DeliveryService } from "@appTypes/Delivery";
import { DateFormatter, getRuGoodsWord } from "@utils/format";
import { getImageUrl } from "@utils/image";
import { useParams } from "react-router-dom";
import { useGetOrderQuery } from "@api/shop/profile";
import { useLazyGetPaymentUrlQuery } from "@api/shop/order";
import SomethingWentWrong from "@components/SomethingWentWrong";
import { useIsMobile } from "src/hooks/useIsMobile";
import { CreditGet } from "@appTypes/Credit";
import { DeliveryForm } from "@components/DeliveryForm";
import { Helmet } from "react-helmet";
import { PageHeading } from "@components/PageHeading";
import { isExpectedApiError } from "@utils/api";

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
	const isMobile = useIsMobile();

	const navigate = useNavigate();
	const params = useParams();
	const orderId = params.orderId;
	if (orderId === undefined) {
		throw new Response("No order id provided", { status: 404 });
	}
	const { data: order, isLoading: orderIsLoading } = useGetOrderQuery({ id: orderId });
	const [initPayment, { data: initPaymentData, isSuccess: initPaymentIsSuccess, isError: initPaymentIsError, error: initPaymentError }] = useLazyGetPaymentUrlQuery();

	const [paymentErrorDialogOpen, setPaymentErrorDialogOpen] = useState(false);
	const [paymentError, setPaymentError] = useState<{ message: string; orderId: string } | null>(null);
	
	const packages: DeliveryPackage[] = useMemo(() => {
		if (!order) return [];
		const packages: DeliveryPackage[] = [];
		for (const item of order.items) {
			if (!item.physicalProperties) continue;
			for (let i = 0; i < item.quantity; i++) {
				packages.push(item.physicalProperties);
			}
		}
		return packages;
	}, [order]);

	const canChangeDelivery = useMemo(() => {
		// TODO: check if it's possible to change delivery
		return false;
	}, []);

	const { paidCreditAmount, unpaidCreditAmount, orderHasCredit } = useMemo(() => {
		if (!order) return { paidCreditAmount: undefined, unpaidCreditAmount: undefined, orderHasCredit: undefined };
		let paidCreditAmount = 0;
		let unpaidCreditAmount = 0;
		let orderHasCredit = false;
		for (const item of order.items) {
			const credit = item.credit;
			if (!credit) continue;
			orderHasCredit = true;
			for (const payment of credit.payments) {
				if (payment.invoice.isPaid) {
					paidCreditAmount += payment.invoice.amount;
				} else {
					unpaidCreditAmount += payment.invoice.amount;
				}
			}
		}
		return { paidCreditAmount, unpaidCreditAmount, orderHasCredit };
	}, [order]);

	const foreignShippingInvoice = useMemo(() => {
		if (!order) return undefined;
		return order.preorder?.foreignShippingInvoice || null;
	}, [order]);

	const foreignShippingInvoicePending = useMemo(() => {
		if (!order) return undefined;
		if (!order.preorder) return false;
		return !foreignShippingInvoice && order.preorder.shippingCostIncluded === "NOT";
	}, [order, foreignShippingInvoice]);

	const localShippingInvoice = useMemo(() => {
		if (!order) return undefined;
		return order.preorder?.localShippingInvoice || null;
	}, [order]);

	const localShippingInvoicePending = useMemo(() => {
		if (!order) return undefined;
		if (!order.preorder) return false;
		return !localShippingInvoice && order.preorder.shippingCostIncluded !== "FULL";
	}, [order, localShippingInvoice]);

	const showDetailedOrder = useMemo(() => {
		return (
			!!orderHasCredit ||
			!!foreignShippingInvoice ||
			!!foreignShippingInvoicePending ||
			!!localShippingInvoice ||
			!!localShippingInvoicePending
		);
	}, [
		orderHasCredit,
		foreignShippingInvoice,
		foreignShippingInvoicePending,
		localShippingInvoice,
		localShippingInvoicePending,
	]);

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
	
	const handlePay = async (invoiceId: string) => {
		initPayment({ invoiceId });
	};

	return (
		<>
			<Helmet>
				<title>{order ? `Заказ от ${DateFormatter.DDMMYYYY(order.createdAt)} - ` : ""}SimpleGeek</title>
			</Helmet>
			{orderIsLoading ? (
				<div className="w-100 h-100 ai-c d-f jc-c">
					<CircularProgress />
				</div>
			) : !order ? (
				<SomethingWentWrong />
			) : (
				<>
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
										Попробуйте ещё раз. При повторной ошибке свяжитесь с
										администратором.
									</DialogContentText>
								</DialogContent>
								<DialogActions>
									<Button
										variant="contained"
										onClick={() => setPaymentErrorDialogOpen(false)}
									>
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
						title={`Заказ от ${DateFormatter.DDMMYYYY(order.createdAt)}`}
						subText={`ID: ${order.id}`}
					/>

					<div className="gap-1 pb-4 d-f fd-r">{orderStatusBadges[order.status]}</div>
					<div className="gap-2 w-100 d-f" style={{ flexDirection: isMobile ? "column" : "row" }}>
						<div className="gap-2 w-100 d-f fd-c">
							<div className="section">
								{order.delivery === null ? (
									order.preorder ? (
										order.preorder.status === "DISPATCH" &&
										unpaidCreditAmount === 0 &&
										!(foreignShippingInvoice && !foreignShippingInvoice.isPaid) &&
										!(localShippingInvoice && !localShippingInvoice.isPaid) ? (
											<DeliveryForm
												isMobile={isMobile}
												delivery={null}
												packages={packages}
												defaultEditing={true}
												canModify={false}
												onChange={(data) => {
													console.log(data);
												}}
											/>
										) : (
											<div className="gap-1">
												<Typography variant="subtitle1">
													Доставка к вам оформляется после полной оплаты заказа и его прибытия
													на склад в Москве.
												</Typography>
												<div className="gap-1 d-f fd-r">
													<Typography
														variant="subtitle1"
														sx={{ color: "typography.secondary" }}
													>
														На складе ожидается:
													</Typography>
													<Typography variant="body1">
														{order.preorder?.expectedArrival ?? "Неизвестно"}
													</Typography>
												</div>
											</div>
										)
									) : (
										<>Ошибка</>
									)
								) : canChangeDelivery ? (
									<DeliveryForm
										isMobile={isMobile}
										delivery={order.delivery}
										packages={packages}
										defaultEditing={false}
										canModify={true}
										onChange={(data) => {
											console.log(data);
										}}
									/>
								) : (
									<Stack
										gap={1}
										direction={"column"}
										divider={<Divider orientation="horizontal" flexItem />}
									>
										<div className="gap-2 d-f fd-c">
											<Typography variant={"h5"}>Доставка</Typography>
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
								)}
							</div>

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
								<Typography variant="subtitle1">Заказ отменен</Typography>
							) : order.status === "UNPAID" ? (
								<>
									<Typography variant="h6" sx={{ color: "typography.error" }}>
										Заказ не оплачен
									</Typography>
									<Button
										onClick={() => handlePay(order.initialInvoice.id)}
										variant="contained"
										sx={{ width: "fit-content", display: "flex", gap: 1 }}
									>
										{"Оплатить "} <CountdownTimer deadline={order.initialInvoice.expiresAt!} />
									</Button>
								</>
							) : order.preorder !== null && showDetailedOrder ? (
								<>
									<Typography variant="h6">Оплачено</Typography>
									<Stack direction="column" divider={<Divider />} spacing={1}>
										<div className="d-f fd-r jc-sb">
											<Typography variant="body1">Депозит:</Typography>
											<Typography variant="subtitle0">{order.initialInvoice.amount} ₽</Typography>
										</div>
										{paidCreditAmount && (
											<div className="d-f fd-r jc-sb">
												<Typography variant="body1">Рассрочка:</Typography>
												<Typography variant="subtitle0">{paidCreditAmount} ₽</Typography>
											</div>
										)}
										{foreignShippingInvoice && foreignShippingInvoice.isPaid && (
											<div className="d-f fd-r jc-sb">
												<Typography variant="body1">Доставка на зарубежный склад:</Typography>
												<Typography variant="subtitle0">
													{foreignShippingInvoice.amount} ₽
												</Typography>
											</div>
										)}
										{localShippingInvoice && localShippingInvoice.isPaid && (
											<div className="d-f fd-r jc-sb">
												<Typography variant="body1">Доставка в Россию:</Typography>
												<Typography variant="subtitle0">
													{localShippingInvoice.amount} ₽
												</Typography>
											</div>
										)}
									</Stack>
									<Typography variant="h6">Доплата</Typography>
									<Stack direction="column" divider={<Divider />} spacing={1}>
										{unpaidCreditAmount && (
											<div className="d-f fd-r jc-sb">
												<Typography variant="body1">Рассрочка:</Typography>
												<Typography variant="subtitle0">{unpaidCreditAmount} ₽</Typography>
											</div>
										)}
										{foreignShippingInvoicePending && (
											<div className="gap-05 d-f fd-c">
												<Typography variant="body1">Доставка на зарубежный склад:</Typography>
												<Typography variant="body2">
													TODO: Стоимость доставки станет известна
												</Typography>
											</div>
										)}
										{foreignShippingInvoice && !foreignShippingInvoice.isPaid && (
											<div className="gap-1 d-f fd-c">
												<div className="d-f fd-r jc-sb">
													<Typography variant="body1">
														Доставка на зарубежный склад:
													</Typography>
													<Typography variant="subtitle0">
														{foreignShippingInvoice.amount} ₽
													</Typography>
												</div>
												<Button onClick={() => handlePay(foreignShippingInvoice.id)}>
													Оплатить
												</Button>
											</div>
										)}
										{localShippingInvoicePending && (
											<div className="gap-05 d-f fd-c">
												<Typography variant="body1">Доставка в Россию:</Typography>
												<Typography variant="caption">
													TODO: Стоимость доставки станет известна
												</Typography>
											</div>
										)}
										{localShippingInvoice && !localShippingInvoice.isPaid && (
											<div className="gap-1 d-f fd-c">
												<div className="d-f fd-r jc-sb">
													<Typography variant="body1">Доставка в Россию:</Typography>
													<Typography variant="subtitle0">
														{localShippingInvoice.amount} ₽
													</Typography>
												</div>
												<Button onClick={() => handlePay(localShippingInvoice.id)}>
													Оплатить
												</Button>
											</div>
										)}
									</Stack>
								</>
							) : (
								<>
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
								</>
							)}
						</div>
					</div>
				</>
			)}
		</>
	);
}
