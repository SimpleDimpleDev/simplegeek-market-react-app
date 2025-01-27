import { ShoppingCart } from "@mui/icons-material";
import {
	Alert,
	Button,
	CircularProgress,
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
	Divider,
	Stack,
} from "@mui/material";
import { useActionData, useNavigate } from "react-router-dom";
import { PageHeading } from "@components/PageHeading";
import { Empty } from "@components/Empty";
import { UserCartItem } from "@appTypes/UserItems";
import { useEffect, useMemo, useState } from "react";

import { CartSection } from "./CartSection";

import { useSelector } from "react-redux";
import { RootState } from "@state/store";
import { useGetCartItemListQuery, useGetDetailedCartQuery } from "@api/shop/cart";
import { useGetFavoriteItemListQuery } from "@api/shop/favorites";
import { useCheckoutMutation } from "@api/shop/order";
import { useIsMobile } from "src/hooks/useIsMobile";
import { availabilityPollingInterval } from "@config/polling";
import SomethingWentWrong from "@components/SomethingWentWrong";
import { isExpectedApiError } from "@utils/api";
import RecentItems from "@components/RecentItems";
import { Helmet } from "react-helmet";
import { getRuGoodsWord } from "@utils/format";

export function Component() {
	const isMobile = useIsMobile();
	const navigate = useNavigate();

	const actionData = useActionData() as
		| { orderError: { message: string; details: string[] | null } | null | undefined }
		| undefined;

	const user = useSelector((state: RootState) => state.user.identity);

	const { data: favoriteItemList, isLoading: favoriteItemListIsLoading } = useGetFavoriteItemListQuery();
	const { data: detailedCart, isLoading: detailedCartIsLoading } = useGetDetailedCartQuery(void 0, {
		refetchOnMountOrArgChange: true,
		pollingInterval: availabilityPollingInterval,
		skipPollingIfUnfocused: true,
		refetchOnFocus: true,
	});
	const { refetch: refetchCartItemList } = useGetCartItemListQuery();

	const favoriteItemIds = useMemo(() => {
		if (!favoriteItemList) return undefined;
		const idSet = new Set<string>();
		favoriteItemList?.items.forEach((item) => idSet.add(item.id));
		return idSet;
	}, [favoriteItemList]);

	const [checkout, { isSuccess: checkoutIsSuccess, isError: checkoutIsError, error: checkoutError }] =
		useCheckoutMutation();

	const [orderError, setOrderError] = useState<{ message: string; details: string[] | null } | null>(
		actionData?.orderError || null
	);
	const [errorDialogOpen, setErrorDialogOpen] = useState(!!actionData);

	useEffect(() => {
		if (checkoutIsSuccess) {
			navigate("/order");
		}
		if (checkoutIsError) {
			let message = "Что-то пошло не так";
			let details = null;
			if (isExpectedApiError(checkoutError)) {
				if (checkoutError.data.title === "OrderItemsError") {
					if (checkoutError.data.details) {
						details = checkoutError.data.details;
					}
					message = checkoutError.data.message;
				} else if (checkoutError.data.title === "UnverifiedError") {
					message = checkoutError.data.message;
					navigate("/auth/verification?return_to=https://simplegeek.ru/cart");
				}
			}
			setOrderError({ message: message, details });
			setErrorDialogOpen(true);
		}
	}, [checkoutIsSuccess, navigate, checkoutIsError, checkoutError]);

	useEffect(() => {
		if (orderError) {
			refetchCartItemList();
		}
	}, [orderError, refetchCartItemList]);

	const createOrder = async (items: UserCartItem[]) => {
		if (!user) {
			navigate("/auth/login?return_to=https://simplegeek.ru/cart");
		} else {
			checkout({ items });
		}
	};

	return (
		<>
			<Helmet>
				<title>Корзина - SimpleGeek</title>
			</Helmet>
			{detailedCartIsLoading || favoriteItemListIsLoading ? (
				<div className="w-100 h-100 ai-c d-f jc-c">
					<CircularProgress />
				</div>
			) : !detailedCart ? (
				<SomethingWentWrong />
			) : (
				<>
					<Dialog
						open={errorDialogOpen}
						onClose={() => setErrorDialogOpen(false)}
						aria-labelledby="error-dialog-title"
						aria-describedby="error-dialog-description"
					>
						<DialogTitle id="error-dialog-title">{orderError?.message}</DialogTitle>
						<DialogContent>
							<DialogContentText id="error-dialog-description">
								{orderError?.details?.map((detail, index) => (
									<Alert severity="error" key={index}>
										{detail}
									</Alert>
								))}
							</DialogContentText>
						</DialogContent>
						<DialogActions>
							<Button onClick={() => setErrorDialogOpen(false)}>Понятно</Button>
						</DialogActions>
					</Dialog>
					<PageHeading
						title="Корзина"
						infoText={
							detailedCart
								? `${
										detailedCart.sections.flatMap((section) =>
											section.availableItems.concat(section.unavailableItems)
										).length
								  } ${getRuGoodsWord(
										detailedCart.sections.flatMap((section) =>
											section.availableItems.concat(section.unavailableItems)
										).length
								  )}`
								: ""
						}
					/>
					{/* TODO: Show only one section */}
					<Stack direction={"column"} gap={4} divider={<Divider />}>
						{detailedCart.sections.map((section) => (
							<>
								{section.availableItems.length > 0 && (
									<CartSection
										isMobile={isMobile}
										key={section.title}
										data={section}
										items={section.availableItems}
										unavailable={false}
										favoriteItemIds={favoriteItemIds}
										favoriteItemListIsLoading={favoriteItemListIsLoading}
										onMakeOrder={createOrder}
									/>
								)}
								{section.unavailableItems.length > 0 && (
									<CartSection
										isMobile={isMobile}
										key={section.title}
										data={section}
										items={section.unavailableItems}
										unavailable={true}
										favoriteItemIds={favoriteItemIds}
										favoriteItemListIsLoading={favoriteItemListIsLoading}
										onMakeOrder={createOrder}
									/>
								)}
							</>
						))}
					</Stack>
					{detailedCart.sections.length === 0 && (
						<Empty
							title="В корзине ничего нет"
							description="Добавьте в корзину что-нибудь"
							icon={
								<ShoppingCart
									sx={{
										width: 91,
										height: 91,
										color: "icon.tertiary",
									}}
								/>
							}
						/>
					)}
					<RecentItems />
				</>
			)}
		</>
	);
}
