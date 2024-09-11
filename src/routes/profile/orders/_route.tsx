import { useEffect, useState } from "react";

import { Box, CircularProgress, Divider, Tab, Tabs, Typography } from "@mui/material";
import { ShoppingBag } from "@mui/icons-material";

import { Empty } from "@components/Empty";
import { OrderCard } from "./card";

import type { OrderShop } from "@appTypes/Order";
import { useSelector } from "react-redux";
import { RootState } from "@state/store";
import ShopApiClient from "@api/shop/client";

function tabsProps(index: number) {
	return {
		id: `order-tab-${index}`,
		"aria-controls": `order-tabpanel-${index}`,
	};
}

const finishedOrderStatuses: OrderShop["status"][] = ["CANCELLED", "FINISHED"];

const getOrdersByTab = ({ currentTab, orders }: { currentTab: number; orders: OrderShop[] }) => {
	switch (currentTab) {
		case 1:
			return orders.filter((order) => !finishedOrderStatuses.includes(order.status));
		case 2:
			return orders.filter((order) => finishedOrderStatuses.includes(order.status));
		default:
			return orders;
	}
};

export default function UserOrders() {
	const isMobile = useSelector((state: RootState) => state.responsive.isMobile);

	const [orders, setOrders] = useState<OrderShop[] | undefined>(undefined);
	const [currentTab, setCurrentTab] = useState<number>(1);

	useEffect(() => {
		const fetchOrders = async () => {
			const { items } = await ShopApiClient.getOrderList();
			setOrders(items);
		};
		fetchOrders();
	}, []);

	const ordersToRender = !orders
		? []
		: getOrdersByTab({ currentTab, orders }).sort((a, b) => {
				return b.createdAt.getTime() - a.createdAt.getTime();
		  });

	const handleChangeTab = (_: React.SyntheticEvent, newValue: number) => {
		setCurrentTab(newValue);
	};

	const handlePay = async (invoiceId: string) => {
		const { paymentUrl } = await ShopApiClient.getPaymentUrl(invoiceId);
		window.location.href = paymentUrl;
	};

	return (
		<Box display={"flex"} flexDirection={"column"} gap={3} width={"100%"}>
			<Box display={"flex"} flexDirection={"column"} gap={2}>
				<Box p={"16px 0"}>
					<Typography variant={"h3"}>Заказы</Typography>
				</Box>
				<Box display={"flex"} flexDirection={"column"}>
					<Tabs value={currentTab} onChange={handleChangeTab} aria-label="basic tabs example">
						<Tab label="Активные" {...tabsProps(1)} />
						<Tab label="Завершенные" {...tabsProps(2)} />
						<Tab label="Все" {...tabsProps(0)} />
					</Tabs>
					<Divider />
				</Box>
			</Box>
			{orders === undefined ? (
				<div className="w-100 h-100 d-f jc-c ai-c">
					<CircularProgress />
				</div>
			) : ordersToRender.length > 0 ? (
				ordersToRender.map((order, index) => (
					<OrderCard isMobile={isMobile} key={index} order={order} onPay={handlePay} />
				))
			) : (
				<Empty
					icon={
						<ShoppingBag
							sx={{
								width: 91,
								height: 91,
								color: "icon.tetriary",
							}}
						/>
					}
					title={"Заказы не найдены"}
				/>
			)}
		</Box>
	);
}
