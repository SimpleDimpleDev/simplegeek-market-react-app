import { ChevronLeft } from "@mui/icons-material";
import { Box, Button, Divider, FormControlLabel, Modal, Radio, Stack, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import mainLogoSmall from "@assets/MainLogoSmall.png";
import cdekLogo from "@assets/SdekLogo.png";
import { CDEKWidget, CDEKDeliveryInfo } from "@components/widgets/cdek";
import { DateFormatter, getRuGoodsWord } from "@utils/format";
import { useEffect, useMemo, useRef, useState } from "react";
import { getImageUrl } from "@utils/image";
import { CreditInfo } from "@appTypes/Credit";
import { DeliveryService, DeliveryPoint, Recipient } from "@appTypes/Delivery";
import { ShopOrderItemCard, ShopOrderItemCardCredit } from "@components/ItemCard";
import { CDEKDeliveryData } from "@appTypes/CDEK";
import RecipientForm from "@components/RecipientForm";
import { UserCartItem } from "@appTypes/UserItems";
import { useSelector } from "react-redux";
import { RootState } from "@state/store";
import ShopApiClient from "@api/shop/client";

interface CardRadioProps {
	isChecked: boolean;
	onChange: (event: React.SyntheticEvent) => void;
	mainText: string;
	subText: string;
	imgUrl: string;
}

const CardRadio = ({ isChecked, onChange, mainText, subText, imgUrl }: CardRadioProps) => {
	return (
		<Box
			display={"flex"}
			flexDirection={"row"}
			justifyContent={"space-between"}
			padding={"8px 16px 8px 8px"}
			sx={{
				backgroundColor: isChecked ? "surface.secondary" : "surface.primary",
				transition: "background-color 0.05s ease-in-out",
				borderRadius: "16px",
			}}
		>
			<FormControlLabel
				control={<Radio color="warning" />}
				label={
					<>
						<Typography variant={"body1"}>{mainText}</Typography>
						<Typography color={"typography.secondary"} variant={"body2"}>
							{subText}
						</Typography>
					</>
				}
				checked={isChecked}
				onChange={onChange}
			/>
			<Box height={"42px"} width={"42px"} display={"flex"} justifyContent={"center"} alignItems={"center"}>
				<img src={imgUrl} alt="" />
			</Box>
		</Box>
	);
};

// export const links: LinksFunction = () => {
// 	return [
// 		{
// 			rel: "script",
// 			href: "https://cdn.jsdelivr.net/npm/@cdek-it/widget@3",
// 			type: "text/javascript",
// 		},
// 	];
// };

export default function OrderMakeRoute() {
	const navigate = useNavigate();
	const recipientFormRef = useRef<{ submit: () => void }>(null);
	const isMobile = useSelector((state: RootState) => state.responsive.isMobile);

	const catalogItems = useSelector((state: RootState) => state.catalog.items);
	const [checkoutItems, setCheckoutItems] = useState<UserCartItem[]>([]);

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

	const [service, setService] = useState<DeliveryService>("SELF_PICKUP");
	const [cdekDeliveryData, setCdekDeliveryData] = useState<CDEKDeliveryData | null>(null);
	const [cdekWidgetOpen, setCdekWidgetOpen] = useState(false);

	useEffect(() => {
		console.log(cdekDeliveryData);
	}, [cdekDeliveryData]);

	const handleCreateOrder = async (recipient: Recipient) => {
		let point: DeliveryPoint | null;
		switch (service) {
			case "CDEK": {
				if (!cdekDeliveryData || !("code" in cdekDeliveryData.address)) return;
				point = {
					address: cdekDeliveryData.address.address,
					code: cdekDeliveryData.address.code,
				};
				break;
			}
			default: {
				point = null;
			}
		}
		const { paymentUrl } = await ShopApiClient.createOrder({
			creditIds: itemsCredit.filter((item) => item.isCredit).map((item) => item.id),
			delivery: {
				point,
				service,
				recipient,
			},
		});
		window.location.href = paymentUrl;
	};

	return (
		<>
			<Modal
				open={cdekWidgetOpen}
				aria-labelledby="cdek-widget-title"
				aria-describedby="cdek-widget-description"
				keepMounted={service === "CDEK"}
				sx={{ justifyContent: "center", alignItems: "center", padding: 3 }}
			>
				<Box width={"100%"} height={"100%"} bgcolor={"white"} borderRadius={3} padding={2} boxShadow={24}>
					<CDEKWidget
						onCalculate={(tariffs, address) => {
							console.log("%cCalculate function", "color: yellow", {
								tariffs: tariffs,
								address: address,
							});
						}}
						onChoose={(deliveryType, tariff, address) => {
							setCdekDeliveryData({ deliveryType, tariff, address });
							setCdekWidgetOpen(false);
						}}
						onReady={() => {}}
						packages={[
							{
								width: 10,
								height: 10,
								length: 10,
								weight: 1000,
							},
						]}
					/>
				</Box>
			</Modal>
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
								<div className="section">
									<Typography variant={"h5"}>
										{isMobile ? "Доставка" : "Адрес и способ доставки"}{" "}
									</Typography>

									<Box>
										<CardRadio
											isChecked={service === "SELF_PICKUP"}
											onChange={() => setService("SELF_PICKUP")}
											mainText={"Самовывоз"}
											subText={"Оплата при получении"}
											imgUrl={mainLogoSmall}
										/>

										<CardRadio
											isChecked={service === "CDEK"}
											onChange={() => setService("CDEK")}
											mainText={"СДЭК"}
											subText={"Оплата доставки при получении"}
											imgUrl={cdekLogo}
										/>
									</Box>

									{service === "SELF_PICKUP" && (
										<Box display={"flex"} flexDirection={"column"} gap={"8px"}>
											<Typography variant="subtitle0">Самовывоз</Typography>
										</Box>
									)}

									{service === "CDEK" && (
										<Box display={"flex"} flexDirection={"column"} gap={"8px"}>
											{cdekDeliveryData ? (
												<CDEKDeliveryInfo {...cdekDeliveryData} />
											) : (
												<Typography variant="h6">Адрес не выбран</Typography>
											)}
											<Button
												variant="text"
												color="warning"
												size="large"
												sx={{ width: "fit-content", padding: 0, color: "warning.main" }}
												onClick={() => setCdekWidgetOpen(true)}
											>
												{cdekDeliveryData ? "Изменить" : "Выбрать"}
											</Button>
										</Box>
									)}
								</div>

								<div className="section">
									<Typography variant="h5">Получатель</Typography>
									<RecipientForm ref={recipientFormRef} onSubmit={handleCreateOrder} />
								</div>
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
							<Button variant="contained" onClick={() => recipientFormRef.current?.submit()}>
								Оплатить
							</Button>
						</Box>
					</Box>
				</Box>
			</Box>
		</>
	);
}
