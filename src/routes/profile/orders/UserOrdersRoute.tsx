import { useEffect, useState } from "react";

import { Box, Divider, Tab, Tabs, Typography } from "@mui/material";
import { ShoppingBag } from "@mui/icons-material";

import { Empty } from "@components/Empty";
import { OrderCard } from "./OrderCard";

import type { OrderShop } from "@appTypes/Order";
import { useSelector } from "react-redux";
import { RootState } from "@state/store";
import { useGetOrderListQuery } from "@api/shop/profile";
import { Loading } from "@components/Loading";
import { useLazyGetPaymentUrlQuery } from "@api/shop/order";

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

export function Component() {
	const isMobile = useSelector((state: RootState) => state.responsive.isMobile);

	const { data: orderList, isLoading: orderListIsLoading } = useGetOrderListQuery();
	const [currentTab, setCurrentTab] = useState<number>(1);

	const [fetchPaymentUrl, { data: paymentUrlData, isSuccess: paymentUrlIsSuccess }] = useLazyGetPaymentUrlQuery();

	const ordersToRender = !orderList
		? []
		: getOrdersByTab({ currentTab, orders: orderList.items }).sort((a, b) => {
				return b.createdAt.getTime() - a.createdAt.getTime();
		  });

	const handleChangeTab = (_: React.SyntheticEvent, newValue: number) => {
		setCurrentTab(newValue);
	};

	useEffect(() => {
		if (paymentUrlIsSuccess) {
			window.location.href = paymentUrlData.paymentUrl;
		}
	}, [paymentUrlIsSuccess, paymentUrlData]);

	const handlePay = async (invoiceId: string) => {
		fetchPaymentUrl({ invoiceId });
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
			<Loading isLoading={orderListIsLoading} necessaryDataIsPersisted={!!orderList}>
				{ordersToRender.length > 0 ? (
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
									color: "icon.tertiary",
								}}
							/>
						}
						title={"Заказы не найдены"}
					/>
				)}
			</Loading>
		</Box>
	);
}
