import { ChevronLeft } from "@mui/icons-material";
import { Box, Button, Divider, Stack, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

import { DateFormatter, getRuGoodsWord } from "@utils/format";
import { useEffect, useMemo, useState } from "react";
import { getImageUrl } from "@utils/image";
import { CreditInfo } from "@appTypes/Credit";
import { Delivery } from "@appTypes/Delivery";
import { ShopOrderItemCard, ShopOrderItemCardCredit } from "@components/ItemCard";
import { UserCartItem } from "@appTypes/UserItems";
import { useSelector } from "react-redux";
import { RootState } from "@state/store";
import ShopApiClient from "@api/shop/client";
import { DeliveryForm } from "@components/DeliveryForm";

export default function OrderMakeRoute() {
	const navigate = useNavigate();
	const isMobile = useSelector((state: RootState) => state.responsive.isMobile);

	const catalogItems = useSelector((state: RootState) => state.catalog.items);
	const [checkoutItems, setCheckoutItems] = useState<UserCartItem[]>([]);
	const [delivery, setDelivery] = useState<Delivery | undefined>(undefined);

	useEffect(() => {
		const setup = async () => {
			const result = await ShopApiClient.getCheckoutItems();
			if (!result) {
				navigate("/cart");
			} else {
				setCheckoutItems(result.items);
			}
		};
		setup();
	}, [navigate]);

	const items = useMemo(() => {
		return checkoutItems.map((item) => {
			const catalogItem = catalogItems.find((catalogItem) => catalogItem.id === item.id);
			if (!catalogItem) {
				throw new Response("Catalog item not found", { status: 404 });
			}
			return { ...catalogItem, quantity: item.quantity };
		});
	}, [catalogItems, checkoutItems]);

	const itemsCreditAvailable = useMemo(() => items.filter((item) => item.creditInfo !== null), [items]);
	const itemsCreditUnavailable = useMemo(() => items.filter((item) => item.creditInfo === null), [items]);

	const preorder = useMemo(() => items.at(0)?.preorder || null, [items]);

	
	const [itemsCredit, setItemsCredit] = useState<{ id: string; isCredit: boolean }[]>(
		items.map((item) => ({ id: item.id, isCredit: false }))
	);

	const [deliveryError, setDeliveryError] = useState<string | null>(null);

	const handleCreateOrder = async () => {
		if (!delivery) {
			setDeliveryError("Укажите данные доставки");
			return;
		}
		const { paymentUrl } = await ShopApiClient.createOrder({
			creditIds: itemsCredit.filter((item) => item.isCredit).map((item) => item.id),
			delivery,
		});
		window.location.href = paymentUrl;
	};

	return (
		<>
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
									defaultDelivery={delivery}
									packages={items
										.map((item) => item.product.physicalProperties)
										.filter((pkg) => !!pkg)}
									isMobile={isMobile}
									onSave={setDelivery}
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
											{preorder.expectedArrival
												? DateFormatter.DDMMYYYY(preorder.expectedArrival)
												: "Неизвестно"}
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
							<Typography variant="subtitle0">Итого:</Typography>
							<Box display="flex" flexDirection="row" alignItems={"baseline"} gap={1}>
								<Typography variant="h4">
									{items.reduce((sum, item) => sum + item.price * item.quantity, 0)} ₽
								</Typography>
								<Typography color="typography.secondary" variant="body1">
									/ {items.length} {getRuGoodsWord(items.length)}
								</Typography>
							</Box>
							<Button variant="contained" onClick={handleCreateOrder}>
								Оплатить
							</Button>
							{deliveryError && <Typography variant="subtitle0" color="error">{deliveryError}</Typography>}
						</Box>
					</Box>
				</Box>
			</Box>
		</>
	);
}
