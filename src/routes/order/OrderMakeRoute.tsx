import { ChevronLeft } from "@mui/icons-material";
import {
	Box,
	Button,
	CircularProgress,
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
	Divider,
	Stack,
	Typography,
} from "@mui/material";
import { Link, useNavigate, useSubmit } from "react-router-dom";

import { getRuGoodsWord } from "@utils/format";
import { useEffect, useRef, useState } from "react";
import { getImageUrl } from "@utils/image";
import { Delivery } from "@appTypes/Delivery";
import { ShopOrderItemCard, ShopOrderItemCardCredit } from "@components/ItemCard";
import { useGetCatalogQuery } from "@api/shop/catalog";
import { useCreateOrderMutation, useGetCheckoutDataQuery } from "@api/shop/order";
import { useIsMobile } from "src/hooks/useIsMobile";
import { useGetSavedDeliveryQuery } from "@api/shop/profile";

import SomethingWentWrong from "@components/SomethingWentWrong";
import { isExpectedApiError } from "@utils/api";

import { Helmet } from "react-helmet";
import { PageHeading } from "@components/PageHeading";
import { useGetCartItemListQuery } from "@api/shop/cart";

import { DeliveryForm, DeliveryFormRef } from "@components/DeliveryForm";

export function Component() {
	const isMobile = useIsMobile();
	const submit = useSubmit();
	const navigate = useNavigate();
	const deliveryFormRef = useRef<DeliveryFormRef>(null);

	const { refetch: refetchCart } = useGetCartItemListQuery();
	const { data: catalog, isLoading: catalogIsLoading } = useGetCatalogQuery();

	const { data: userSavedDelivery, isLoading: userSavedDeliveryIsLoading } = useGetSavedDeliveryQuery();
	const { data: checkoutData, isLoading: checkoutDataIsLoading } = useGetCheckoutDataQuery(void 0, {
		refetchOnMountOrArgChange: true,
	});

	useEffect(() => {
		if (!checkoutDataIsLoading && (!checkoutData || checkoutData.items.length === 0)) {
			navigate("/cart");
		}
	}, [checkoutData, checkoutDataIsLoading, navigate]);

	const [selectedCreditItemIds, setSelectedCreditItemIds] = useState<Set<string>>(new Set());

	const [
		createOrder,
		{
			isLoading: createOrderIsLoading,
			isSuccess: createOrderIsSuccess,
			data: createOrderSuccessData,
			isError: createOrderIsError,
			error: createOrderError,
		},
	] = useCreateOrderMutation();

	const handleDeliveryFormSubmit = (delivery: Delivery, saveDelivery: boolean) => {
		createOrder({
			delivery,
			saveDelivery,
			creditIds: Array.from(selectedCreditItemIds),
		});
	};

	const handleCreateOrder = () => {
		if (checkoutData?.shouldSelectDelivery && deliveryFormRef.current) {
			deliveryFormRef.current.submit();
		} else {
			createOrder({
				creditIds: Array.from(selectedCreditItemIds),
				delivery: null,
				saveDelivery: false,
			});
		}
	};

	const [errorPaymentErrorDialogOpen, setPaymentErrorDialogOpen] = useState(false);
	const [paymentError, setPaymentError] = useState<{ message: string; orderId: string } | null>(null);

	useEffect(() => {
		if (createOrderIsSuccess) {
			const paymentUrl = createOrderSuccessData.paymentUrl;
			window.location.href = paymentUrl;
		}
	}, [createOrderIsSuccess, createOrderSuccessData]);

	useEffect(() => {
		let messageString = "Что-то пошло не так";
		if (createOrderIsError) {
			if (isExpectedApiError(createOrderError)) {
				switch (createOrderError.data.title) {
					case "OrderItemsError": {
						let details = null;
						if (createOrderError.data.details) {
							details = createOrderError.data.details;
						}
						messageString = createOrderError.data.message;
						const detailsJSON = JSON.stringify(details);
						console.debug("OrderItemsError", { messageString, detailsJSON });
						submit({ message: messageString, details: detailsJSON }, { action: "/cart", method: "post" });
						break;
					}
					case "PaymentInitError": {
						const message = createOrderError.data.message;
						const details = createOrderError.data.details as string[];
						const orderId = details[0] as string;
						setPaymentError({ message, orderId });
						setPaymentErrorDialogOpen(true);
						console.debug("PaymentInitError", { message, orderId });
						break;
					}
				}
			}
			refetchCart();
		}
	}, [createOrderIsError, createOrderError, submit, refetchCart]);

	return (
		<>
			<Helmet>
				<title>Оформление заказа - SimpleGeek</title>
			</Helmet>
			{catalogIsLoading || checkoutDataIsLoading || userSavedDeliveryIsLoading ? (
				<div className="w-100 h-100 ai-c d-f jc-c">
					<CircularProgress />
				</div>
			) : !catalog || !checkoutData ? (
				<SomethingWentWrong />
			) : (
				<>
					<Dialog
						open={errorPaymentErrorDialogOpen}
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
										Повторите оплату на странице заказа. При повторной ошибке свяжитесь с
										администратором.
									</DialogContentText>
								</DialogContent>
								<DialogActions>
									<Button
										variant="contained"
										onClick={() => navigate(`/orders/${paymentError.orderId}`)}
									>
										К заказу
									</Button>
								</DialogActions>
							</>
						)}
					</Dialog>
					<Box display={"flex"} flexDirection={"column"} alignItems={"flex-start"} gap={2}>
						<Button variant="text" sx={{ color: "warning.main" }} onClick={() => navigate(-1)}>
							<ChevronLeft />
							<Typography color="inherit">Назад в корзину</Typography>
						</Button>

						<PageHeading title={"Оформление заказа"} />

						<div className="gap-2 w-100 d-f" style={{ flexDirection: isMobile ? "column" : "row" }}>
							<Box display={"flex"} flexDirection={"column"} gap={2} width={"100%"}>
								{checkoutData.shouldSelectDelivery ? (
									<DeliveryForm
										ref={deliveryFormRef}
										defaultDelivery={userSavedDelivery}
										packages={checkoutData.packages}
										onSubmit={handleDeliveryFormSubmit}
										isMobile={isMobile}
									/>
								) : (
									<div className="section">
										<Typography variant="h5">Доставка</Typography>
										<Box gap={"8px"}>
											<Typography variant="subtitle1">
												Способ доставки можно будет выбрать после полной оплаты товара и его
												приезда на склад
											</Typography>
											<Box display={"flex"} flexDirection={"row"} gap={"8px"}>
												<Typography color="typography.secondary" variant="subtitle1">
													На складе ожидается:
												</Typography>
												<Typography variant="subtitle1">
													{checkoutData.preorder?.expectedArrival ?? "Неизвестно"}
												</Typography>
											</Box>
										</Box>
									</div>
								)}

								<Typography variant="h5">
									{checkoutData.items.length} {getRuGoodsWord(checkoutData.items.length)}
								</Typography>

								{checkoutData.items.map((item) =>
									item.creditInfo ? (
										<div className="section">
											<ShopOrderItemCardCredit
												key={item.id}
												imgUrl={getImageUrl(item.product.images.at(0)?.url ?? "", "small")}
												title={item.product.title}
												price={item.price}
												quantity={item.quantity}
												creditInfo={item.creditInfo}
												isCredit={selectedCreditItemIds.has(item.id)}
												onCreditChange={(isCredit) => {
													const newItemsCredit = new Set(selectedCreditItemIds);
													if (isCredit) {
														newItemsCredit.add(item.id);
													} else {
														newItemsCredit.delete(item.id);
													}
													setSelectedCreditItemIds(newItemsCredit);
												}}
											/>
										</div>
									) : (
										<div className="section">
											<ShopOrderItemCard
												key={item.id}
												imgUrl={getImageUrl(item.product.images.at(0)?.url ?? "", "small")}
												title={item.product.title}
												price={item.price}
												quantity={item.quantity}
											/>
										</div>
									)
								)}
							</Box>
							<Box
								position={"sticky"}
								top={8}
								display="flex"
								flexDirection="column"
								flexShrink={0}
								gap={2}
								p={2}
								bgcolor="white"
								borderRadius={3}
								width={isMobile ? "100%" : 360}
								height="fit-content"
							>
								<Box display="flex" flexDirection="column" gap={1}>
									{checkoutData.price.discount ? (
										<Stack direction={"column"} gap={1} divider={<Divider flexItem />}>
											<div className="d-f fd-r jc-sb" style={{ alignItems: "baseline" }}>
												<Typography variant="body1">Цена без скидки:</Typography>
												<Typography variant="h6" sx={{ color: "typography.secondary" }}>
													{checkoutData.price.original} ₽
												</Typography>
											</div>
											<div className="d-f fd-r jc-sb" style={{ alignItems: "baseline" }}>
												<Typography variant="body1">Скидка:</Typography>
												<Typography variant="h6" color="warning">
													{checkoutData.price.discount} ₽
												</Typography>
											</div>
											<div className="d-f fd-r jc-sb" style={{ alignItems: "baseline" }}>
												<Typography variant="body1">Итого:</Typography>
												<Typography variant="h6">{checkoutData.price.total} ₽</Typography>
											</div>
										</Stack>
									) : (
										<div className="d-f fd-r jc-sb" style={{ alignItems: "baseline" }}>
											<Typography variant="body1">Итого:</Typography>
											<Typography variant="h6">{checkoutData.price.total} ₽</Typography>
										</div>
									)}

									<Button
										variant="contained"
										disabled={createOrderIsLoading}
										onClick={handleCreateOrder}
									>
										Оплатить
									</Button>

									<Typography variant="caption">
										Ваши личные данные будут использоваться для обработки заказов, упрощения работы
										с сайтом и для других целей, описанных в нашей{" "}
										{<Link to={"/policy"}>политике конфиденциальности.</Link>}
									</Typography>
								</Box>
							</Box>
						</div>
					</Box>
				</>
			)}
		</>
	);
}
