import { ChevronLeft } from "@mui/icons-material";
import { Button, Divider, Stack, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useEffect, useMemo } from "react";
import { orderStatusBadges } from "@components/Badges";
import CountdownTimer from "@components/CountdownTimer";
import { OrderItemCredit } from "@components/CreditTimeline";
import { DeliveryService } from "@appTypes/Delivery";
import { DateFormatter, getRuGoodsWord } from "@utils/format";
import { getImageUrl } from "@utils/image";
import { useParams } from "react-router-dom";
import { useGetOrderQuery } from "@api/shop/profile";
import { Loading } from "@components/Loading";
import { useLazyGetPaymentUrlQuery } from "@api/shop/order";
import SomethingWentWrong from "@components/SomethingWentWrong";
import { useIsMobile } from "src/hooks/useIsMobile";

const deliveryServiceMapping: Record<DeliveryService, string> = {
	CDEK: "СДЕК",
	SELF_PICKUP: "Самовывоз",
};

export function Component() {
	const isMobile = useIsMobile();

	const params = useParams();
	const orderId = params.orderId;
	if (orderId === undefined) {
		throw new Response("No order id provided", { status: 404 });
	}
	const { data: order, isLoading: orderIsLoading } = useGetOrderQuery({ id: orderId });
	const [fetchPaymentUrl, { data: paymentUrlData, isSuccess: paymentUrlIsSuccess }] = useLazyGetPaymentUrlQuery();

	const navigate = useNavigate();

	const goodsTotal = useMemo(() => (!order ? 0 : order.items.reduce((acc, item) => acc + item.sum, 0)), [order]);
	const shippingTotal = useMemo(
		() =>
			!order
				? 0
				: order.preorder
				? (order.preorder.foreignShippingInvoice?.amount || 0) +
				  (order.preorder.localShippingInvoice?.amount || 0)
				: 0,
		[order]
	);

	useEffect(() => {
		if (paymentUrlIsSuccess) {
			window.location.href = paymentUrlData.paymentUrl;
		}
	}, [paymentUrlIsSuccess, paymentUrlData]);

	const handlePay = async (invoiceId: string) => {
		fetchPaymentUrl({ invoiceId });
	};

	return (
		<>
			<div className="gap-2 ai-fs d-f fd-c">
				<Button variant="text" sx={{ color: "warning.main" }} onClick={() => navigate(-1)}>
					<ChevronLeft />
					<Typography color="inherit">Все заказы</Typography>
				</Button>
			</div>

			<Loading isLoading={orderIsLoading}>
				{!order ? (
					<SomethingWentWrong />
				) : (
					<>
						<div className="py-2">
							<Typography variant="h3">Заказ от {DateFormatter.DDMMYYYY(order.createdAt)}</Typography>
							<Typography variant="subtitle0">ID: {order.id}</Typography>
						</div>
						<div className="gap-1 pb-4 d-f fd-r">{orderStatusBadges[order.status]}</div>
						<div className="gap-2 w-100 d-f" style={{ flexDirection: isMobile ? "column" : "row" }}>
							<div className="gap-2 w-100 d-f fd-c">
								<div className="section">
									{order.delivery ? (
										<Stack
											gap={1}
											direction={"column"}
											divider={<Divider orientation="horizontal" flexItem />}
										>
											<div className="gap-2 d-f fd-c">
												<Typography variant={"h5"}>Доставка</Typography>
												<div className={`d-f ${isMobile ? " fd-c gap-1" : " fd-r jc-sb"}`}>
													<div className="gap-05 w-100 d-f fd-c">
														<Typography
															variant="body1"
															sx={{ color: "typography.secondary" }}
														>
															Способ получения
														</Typography>
														<Typography variant="subtitle0">
															{deliveryServiceMapping[order.delivery.service]}
														</Typography>
													</div>
													<div className="gap-05 w-100 d-f fd-c">
														<Typography
															variant="body1"
															sx={{ color: "typography.secondary" }}
														>
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
													<Typography variant="body1">
														{order.delivery.point?.address}
													</Typography>
												</div>
											</div>
											<div className="gap-2 d-f fd-c">
												<Typography variant="h5">Получатель</Typography>
												<div className={`d-f ${isMobile ? " fd-c gap-1" : " fd-r jc-sb"}`}>
													<div className="gap-05 w-100 d-f fd-c">
														<Typography
															variant="body1"
															sx={{ color: "typography.secondary" }}
														>
															ФИО
														</Typography>
														<Typography variant="subtitle0">
															{order.delivery.recipient.fullName}
														</Typography>
													</div>
													<div className="gap-05 w-100 d-f fd-c">
														<Typography
															variant="body1"
															sx={{ color: "typography.secondary" }}
														>
															Номер телефона
														</Typography>
														<Typography variant="body1">
															{order.delivery.recipient.phone}
														</Typography>
													</div>
												</div>
											</div>
										</Stack>
									) : (
										<div className="gap-1">
											<Typography variant="subtitle1">
												Доставка к вам оформляется после полной оплаты товара и приезда его на
												склад
											</Typography>
											<div className="gap-1 d-f fd-r">
												<Typography variant="subtitle1" sx={{ color: "typography.secondary" }}>
													На складе ожидается:
												</Typography>
												<Typography variant="body1">
													{order.preorder?.expectedArrival ?? "Неизвестно"}
												</Typography>
											</div>
										</div>
									)}
								</div>

								<div className="section">
									<Typography variant="h5">
										{order.items.length} {getRuGoodsWord(order.items.length)}
									</Typography>
									<Stack divider={<Divider />}>
										{order.items.map((item) => (
											<div className="gap-1 pt-1 d-f fd-c" key={item.id}>
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
												{!!item.credit && (
													<div style={{ paddingBottom: 32 }}>
														<OrderItemCredit
															lineColor="#E0E0E0"
															payments={item.credit.payments}
															width="90%"
															lastPayedIndex={item.credit.paidParts - 1}
															onPayButtonClick={() =>
																item.credit?.invoice &&
																!item.credit.invoice.isPaid &&
																handlePay(item.credit.invoice.id)
															}
														/>
													</div>
												)}
											</div>
										))}
									</Stack>
								</div>
							</div>
							<div
								className="top-0 gap-2 bg-primary p-2 h-mc br-3 d-f fd-c fs-0 ps-s"
								style={{ width: isMobile ? "100%" : 360 }}
							>
								<Stack direction="column" divider={<Divider />}>
									{order.preorder && (
										<>
											{order.preorder.foreignShippingInvoice && (
												<div className="gap-1">
													<Typography variant="subtitle0">
														Доставка на зарубежный склад
													</Typography>
													<div className="gap-1 d-f fd-r">
														<Typography
															variant="subtitle1"
															sx={{ color: "typography.secondary" }}
														>
															Стоимость:
														</Typography>
														<Typography variant="subtitle0">
															{order.preorder.foreignShippingInvoice.amount} ₽
														</Typography>
														{order.preorder.foreignShippingInvoice.isPaid ? (
															<Typography
																variant="subtitle1"
																sx={{ color: "success.main" }}
															>
																Оплачено
															</Typography>
														) : (
															<Button
																onClick={() =>
																	order.preorder?.foreignShippingInvoice &&
																	!order.preorder.foreignShippingInvoice.isPaid &&
																	handlePay(order.preorder.foreignShippingInvoice.id)
																}
															>
																Оплатить
															</Button>
														)}
													</div>
												</div>
											)}
											{order.preorder.localShippingInvoice && (
												<div className="gap-1">
													<Typography variant="subtitle0">Доставка в Россию</Typography>
													<div className="gap-1 d-f fd-r">
														<Typography
															variant="subtitle1"
															sx={{ color: "typography.secondary" }}
														>
															Стоимость:
														</Typography>
														<Typography variant="subtitle0">
															{order.preorder.localShippingInvoice.amount} ₽
														</Typography>
													</div>
													{order.preorder.localShippingInvoice.isPaid ? (
														<Typography variant="subtitle1" sx={{ color: "success.main" }}>
															Оплачено
														</Typography>
													) : (
														<Button
															onClick={() =>
																order.preorder?.localShippingInvoice &&
																!order.preorder.localShippingInvoice.isPaid &&
																handlePay(order.preorder.localShippingInvoice.id)
															}
														>
															Оплатить
														</Button>
													)}
												</div>
											)}
										</>
									)}

									{order.preorder && (
										<div className="gap-1">
											<Typography variant="subtitle1" sx={{ color: "typography.secondary" }}>
												Товары:
											</Typography>
											<Typography variant="subtitle0">{goodsTotal} ₽</Typography>
										</div>
									)}

									<div className="gap-1 pt-2">
										<div className="gap-1">
											<Typography variant="subtitle1" sx={{ color: "typography.secondary" }}>
												Итого:
											</Typography>
											<Typography variant="subtitle0">{goodsTotal + shippingTotal} ₽</Typography>
										</div>
									</div>

									{order.status === "CANCELLED" && (
										<Typography variant="subtitle1">Заказ отменен</Typography>
									)}

									{order.status === "UNPAID" && (
										<div className="gap-1 d-f fd-r">
											<Typography variant="subtitle1" sx={{ color: "typography.error" }}>
												Заказ не оплачен
											</Typography>
											<Button
												onClick={() => handlePay(order.initialInvoice.id)}
												variant="contained"
												sx={{ width: "fit-content", display: "flex", gap: 1 }}
											>
												{"Оплатить "} <CountdownTimer deadline={order.initialInvoice.expiresAt!} />
											</Button>
										</div>
									)}
								</Stack>
							</div>
						</div>
					</>
				)}
			</Loading>
		</>
	);
}
