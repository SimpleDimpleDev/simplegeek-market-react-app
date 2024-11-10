import { useEffect, useState } from "react";

import { Box, Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Divider, Tab, Tabs } from "@mui/material";
import { ShoppingBag } from "@mui/icons-material";

import { Empty } from "@components/Empty";
import { OrderCard } from "./OrderCard";

import type { OrderGet, OrderStatus } from "@appTypes/Order";
import { useGetOrderListQuery } from "@api/shop/profile";
import { useLazyGetPaymentUrlQuery } from "@api/shop/order";
import { useIsMobile } from "src/hooks/useIsMobile";
import SomethingWentWrong from "@components/SomethingWentWrong";
import { Helmet } from "react-helmet";
import { PageHeading } from "@components/PageHeading";
import { isExpectedApiError } from "@utils/api";

function tabsProps(index: number) {
	return {
		id: `order-tab-${index}`,
		"aria-controls": `order-tabpanel-${index}`,
	};
}

const activeOrderStatuses: OrderStatus[] = ["UNPAID", "ACCEPTED", "DELIVERY", "READY_FOR_PICKUP"];
const finishedOrderStatuses: OrderStatus[] = ["FINISHED"];

const getOrdersByTab = ({ currentTab, orders }: { currentTab: number; orders: OrderGet[] }) => {
	switch (currentTab) {
		case 0:
			return orders.filter((order) => activeOrderStatuses.includes(order.status));
		case 1:
			return orders.filter((order) => finishedOrderStatuses.includes(order.status));
		case 2:
			return [...orders];
		default:
			return [...orders];
	}
};

export function Component() {
	const isMobile = useIsMobile();

	const { data: orderList, isLoading: orderListIsLoading } = useGetOrderListQuery();
	const [currentTab, setCurrentTab] = useState<number>(0);

	const [paymentErrorDialogOpen, setPaymentErrorDialogOpen] = useState(false);
	const [paymentError, setPaymentError] = useState<{ message: string; orderId: string } | null>(null);

	const [
		initPayment,
		{ data: initPaymentData, isSuccess: initPaymentIsSuccess, isError: initPaymentIsError, error: initPaymentError },
	] = useLazyGetPaymentUrlQuery();

	const ordersToRender = !orderList
		? []
		: getOrdersByTab({ currentTab, orders: orderList.items }).sort((a, b) => {
				return b.createdAt.getTime() - a.createdAt.getTime();
		  });

	const handleChangeTab = (_: React.SyntheticEvent, newValue: number) => {
		setCurrentTab(newValue);
	};

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
				<title>Заказы - SimpleGeek</title>
			</Helmet>
			{orderListIsLoading ? (
				<Box width={"100%"} height={"100%"} display={"flex"} justifyContent={"center"} alignItems={"center"}>
					<CircularProgress />
				</Box>
			) : !orderList ? (
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
					<PageHeading title={"Заказы"} />
					<Box>
						<Tabs value={currentTab} onChange={handleChangeTab} aria-label="basic tabs example">
							<Tab label="Активные" {...tabsProps(0)} />
							<Tab label="Завершенные" {...tabsProps(1)} />
							<Tab label="Все" {...tabsProps(2)} />
						</Tabs>
						<Divider />
					</Box>
					<Box display={"flex"} flexDirection={"column"} gap={2} pt={2}>
						{ordersToRender.length > 0 ? (
							ordersToRender.map((order, index) => (
								<OrderCard isMobile={isMobile} key={index} order={order} onPay={handlePay} />
							))
						) : (
							<Box
								width={"100%"}
								height={"100%"}
								display={"flex"}
								justifyContent={"center"}
								alignItems={"center"}
							>
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
							</Box>
						)}
					</Box>
				</>
			)}
		</>
	);
}
