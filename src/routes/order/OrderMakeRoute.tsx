import { ChevronLeft } from "@mui/icons-material";
import { Box, Button, Divider, Stack, Typography } from "@mui/material";
import { useNavigate, useSubmit } from "react-router-dom";

import { getRuGoodsWord } from "@utils/format";
import { useEffect, useMemo, useState } from "react";
import { getImageUrl } from "@utils/image";
import { CreditInfo } from "@appTypes/Credit";
import { Delivery } from "@appTypes/Delivery";
import { ShopOrderItemCard, ShopOrderItemCardCredit } from "@components/ItemCard";
import { DeliveryForm } from "@components/DeliveryForm";
import { useGetCatalogQuery } from "@api/shop/catalog";
import { Loading } from "@components/Loading";
import { useCreateOrderMutation, useGetCheckoutItemsQuery } from "@api/shop/order";
import { useIsMobile } from "src/hooks/useIsMobile";

export function Component() {
	const isMobile = useIsMobile();
	const submit = useSubmit();
	const navigate = useNavigate();

	const { data: catalog, isLoading: catalogIsLoading } = useGetCatalogQuery();
	const { data: checkoutItemList, isLoading: checkoutItemListIsLoading } = useGetCheckoutItemsQuery();
	const [
		createOrder,
		{
			isLoading: orderMakeIsLoading,
			isSuccess: orderMakeIsSuccess,
			data: orderMakeSuccessData,
			isError: orderMakeIsError,
			error: orderMakeError,
		},
	] = useCreateOrderMutation();

	const [delivery, setDelivery] = useState<Delivery | undefined>(undefined);

	useEffect(() => {
		if (!checkoutItemListIsLoading && (!checkoutItemList || checkoutItemList.items.length === 0)) {
			navigate("/cart");
		}
	}, [checkoutItemList, checkoutItemListIsLoading, navigate]);

	useEffect(() => {
		if (orderMakeIsSuccess) {
			const paymentUrl = orderMakeSuccessData.paymentUrl;
			window.location.href = paymentUrl;
		}
	}, [orderMakeIsSuccess, orderMakeSuccessData]);

	useEffect(() => {
		if (orderMakeIsError) {
			console.error(orderMakeError);
			submit({ orderItemsUnavailableError: true }, { action: "/cart", method: "post" });
		}
	}, [orderMakeIsError, orderMakeError, submit]);

	const items = useMemo(() => {
		if (!catalog) return [];
		return (
			checkoutItemList?.items.map((item) => {
				const catalogItem = catalog.items.find((catalogItem) => catalogItem.id === item.id);
				if (!catalogItem) {
					throw new Response("Catalog item not found", { status: 404 });
				}
				return { ...catalogItem, quantity: item.quantity };
			}) || []
		);
	}, [catalog, checkoutItemList]);

	const itemsCreditAvailable = useMemo(() => items.filter((item) => item.creditInfo !== null), [items]);
	const itemsCreditUnavailable = useMemo(() => items.filter((item) => item.creditInfo === null), [items]);

	const preorder = useMemo(() => items.at(0)?.preorder || null, [items]);

	const [itemsCredit, setItemsCredit] = useState<{ id: string; isCredit: boolean }[]>(
		items.map((item) => ({ id: item.id, isCredit: false }))
	);

	const [deliveryError, setDeliveryError] = useState<string | null>(null);

	const totalNonCreditPrice = useMemo(
		() =>
			items
				.filter((cartItem) => !itemsCredit.some((creditItem) => cartItem.id === creditItem.id))
				.map((checkoutItem) => checkoutItem.price * checkoutItem.quantity)
				.reduce((a, b) => a + b, 0),
		[items, itemsCredit]
	);

	const totalCreditPrice = useMemo(
		() =>
			items
				.filter((cartItem) => itemsCredit.some((creditItem) => cartItem.id === creditItem.id))
				.map((checkoutItem) => (checkoutItem.creditInfo?.payments[0].sum || 0) * checkoutItem.quantity)
				.reduce((a, b) => a + b, 0),
		[items, itemsCredit]
	);

	const totalPrice = useMemo(() => totalNonCreditPrice - totalCreditPrice, [totalNonCreditPrice, totalCreditPrice]);

	const totalDiscount = items
		.map((cartItem) => (cartItem.discount ?? 0) * cartItem.quantity)
		.reduce((a, b) => a + b, 0);

	const handleCreateOrder = async () => {
		if (!delivery) {
			setDeliveryError("Укажите данные доставки");
			return;
		}
		createOrder({
			creditIds: itemsCredit.filter((item) => item.isCredit).map((item) => item.id),
			delivery,
		});
	};

	return (
		<Loading isLoading={catalogIsLoading} necessaryDataIsPersisted={!!catalog}>
			<Box display={"flex"} flexDirection={"column"} alignItems={"flex-start"} gap={2}>
				<Button variant="text" sx={{ color: "warning.main" }} onClick={() => navigate(-1)}>
					<ChevronLeft />
					<Typography color="inherit">Назад в корзину</Typography>
				</Button>

				<Box padding={"16px 0"}>
					<Typography variant={isMobile ? "h4" : "h3"}>Оформление заказа</Typography>
				</Box>

				<Box display={"flex"} flexDirection={isMobile ? "column" : "row"} gap={2} width={"100%"}>
					<Box display={"flex"} flexDirection={"column"} gap={2} width={"100%"}>
						{preorder === null ? (
							<>
								<DeliveryForm
									delivery={delivery}
									packages={items
										.map((item) => item.product.physicalProperties)
										.filter((pkg) => !!pkg)}
									isMobile={isMobile}
									onChange={setDelivery}
								/>
							</>
						) : (
							<div className="section">
								<Typography variant="h5">Доставка и дата получения на склад</Typography>
								<Box gap={"8px"}>
									<Typography variant="subtitle1">
										Доставка к вам оформляется после полной оплаты товара и его приезда на склад
									</Typography>
									<Box display={"flex"} flexDirection={"row"} gap={"8px"}>
										<Typography color="typography.secondary" variant="subtitle1">
											На складе ожидается:
										</Typography>
										<Typography variant="subtitle1">
											{preorder.expectedArrival ?? "Неизвестно"}
										</Typography>
									</Box>
								</Box>
							</div>
						)}

						<div className="section">
							<Typography variant="h5">
								{items.length} {getRuGoodsWord(items.length)}
							</Typography>
							{itemsCreditAvailable.length > 0 && (
								<div className="gap-1 d-f fd-c">
									<Typography variant="h4">Доступна рассрочка</Typography>
									<Stack divider={<Divider />} direction={"column"}>
										{itemsCreditAvailable.map((item) => (
											<ShopOrderItemCardCredit
												key={item.id}
												imgUrl={getImageUrl(item.product.images.at(0)?.url ?? "", "small")}
												title={item.product.title}
												price={item.price}
												quantity={item.quantity}
												creditInfo={item.creditInfo as CreditInfo}
												isCredit={itemsCredit.some((creditItem) => creditItem.id === item.id)}
												onCreditChange={(isCredit) => {
													const newItemsCredit = [...itemsCredit];
													const creditItem = newItemsCredit.find(
														(creditItem) => creditItem.id === item.id
													);
													if (!creditItem) return;
													creditItem.isCredit = isCredit;
													setItemsCredit(newItemsCredit);
												}}
											/>
										))}
									</Stack>
								</div>
							)}
							{itemsCreditUnavailable.length > 0 && (
								<div className="gap-1 d-f fd-c">
									<Stack divider={<Divider />} direction={"column"}>
										{itemsCreditUnavailable.map((item) => (
											<ShopOrderItemCard
												key={item.id}
												imgUrl={getImageUrl(item.product.images.at(0)?.url ?? "", "small")}
												title={item.product.title}
												price={item.price}
												quantity={item.quantity}
											/>
										))}
									</Stack>
								</div>
							)}
						</div>
					</Box>
					<Box
						position={"sticky"}
						top={8}
						display="flex"
						flexDirection="column"
						flexShrink={0}
						gap={2} // assuming the theme's spacing unit is 8px, otherwise adjust accordingly
						p={2}
						bgcolor="white"
						borderRadius={3}
						width={isMobile ? "100%" : 360}
						height="fit-content"
					>
						<Box display="flex" flexDirection="column" gap={1}>
							{totalDiscount > 0 ? (
								<Stack direction={"column"} gap={1} divider={<Divider flexItem />}>
									<div className="d-f fd-r jc-sb" style={{ alignItems: "baseline" }}>
										<Typography variant="body1">Цена без скидки:</Typography>
										<Typography variant="h4" sx={{ color: "typography.secondary" }}>
											{totalPrice} ₽
										</Typography>
									</div>
									<div className="d-f fd-r jc-sb" style={{ alignItems: "baseline" }}>
										<Typography variant="body1">Скидка:</Typography>
										<Typography variant="h4" color="warning">
											{totalDiscount} ₽
										</Typography>
									</div>
									<div className="d-f fd-r jc-sb" style={{ alignItems: "baseline" }}>
										<Typography variant="body1">Итого:</Typography>
										<Typography variant="h4">{totalPrice - totalDiscount} ₽</Typography>
									</div>
								</Stack>
							) : (
								<div className="d-f fd-r jc-sb" style={{ alignItems: "baseline" }}>
									<Typography variant="body1">Итого:</Typography>
									<Typography variant="h4">{totalPrice} ₽</Typography>
								</div>
							)}
							<Button variant="contained" disabled={orderMakeIsLoading} onClick={handleCreateOrder}>
								Оплатить
							</Button>
							{deliveryError && (
								<Typography variant="subtitle0" color="error">
									{deliveryError}
								</Typography>
							)}
						</Box>
					</Box>
				</Box>
			</Box>
		</Loading>
	);
}
