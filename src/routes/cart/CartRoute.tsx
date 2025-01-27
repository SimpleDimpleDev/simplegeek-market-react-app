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
import { useGetCatalogQuery, useGetItemsAvailabilityQuery } from "@api/shop/catalog";
import { useGetCartItemListQuery } from "@api/shop/cart";
import { useGetFavoriteItemListQuery } from "@api/shop/favorites";
import { useCheckoutMutation } from "@api/shop/order";
import { formCart } from "./utils";
import { useIsMobile } from "src/hooks/useIsMobile";
import { availabilityPollingInterval, catalogPollingInterval } from "@config/polling";
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

	const { data: catalog, isLoading: catalogIsLoading } = useGetCatalogQuery(void 0, {
		refetchOnMountOrArgChange: true,
		pollingInterval: catalogPollingInterval,
		skipPollingIfUnfocused: true,
		refetchOnFocus: true,
	});

	const {
		data: availableItemList,
		isLoading: availabilityIsLoading,
		refetch: refetchAvailability,
	} = useGetItemsAvailabilityQuery(void 0, {
		refetchOnMountOrArgChange: true,
		pollingInterval: availabilityPollingInterval,
		skipPollingIfUnfocused: true,
		refetchOnFocus: true,
	});

	const { data: favoriteItemList, isLoading: favoriteItemListIsLoading } = useGetFavoriteItemListQuery();
	const {
		data: cartItemList,
		isLoading: cartItemListIsLoading,
		refetch: refetchCart,
	} = useGetCartItemListQuery(void 0, {
		refetchOnMountOrArgChange: true,
		pollingInterval: availabilityPollingInterval,
		skipPollingIfUnfocused: true,
		refetchOnFocus: true,
	});

	const availableItemIds = useMemo(() => {
		if (!availableItemList) return undefined;
		const idSet = new Set<string>();
		availableItemList?.items.forEach((item) => idSet.add(item));
		return idSet;
	}, [availableItemList]);

	const favoriteItemIds = useMemo(() => {
		if (!favoriteItemList) return undefined;
		const idSet = new Set<string>();
		favoriteItemList?.items.forEach((item) => idSet.add(item.id));
		return idSet;
	}, [favoriteItemList]);

	const cartItemIds = useMemo(() => {
		if (!cartItemList) return undefined;
		const idSet = new Set<string>();
		cartItemList?.items.forEach((item) => idSet.add(item.id));
		return idSet;
	}, [cartItemList]);

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
				} else if ( checkoutError.data.title === "UnverifiedError") {
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
			refetchCart();
			refetchAvailability();
		}
	}, [orderError, refetchCart, refetchAvailability]);

	const formedCart = useMemo(
		() =>
			catalog && availableItemIds && cartItemList
				? formCart({ catalogItems: catalog.items, userCart: cartItemList.items, availableItemIds })
				: { sections: [] },
		[catalog, availableItemIds, cartItemList]
	);

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
			{catalogIsLoading || availabilityIsLoading || cartItemListIsLoading || favoriteItemListIsLoading ? (
				<div className="w-100 h-100 ai-c d-f jc-c">
					<CircularProgress />
				</div>
			) : !catalog || !availableItemIds || !cartItemList ? (
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
							cartItemList
								? `${cartItemList.items.length} ${getRuGoodsWord(cartItemList.items.length)}`
								: ""
						}
					/>
					<Stack direction={"column"} gap={4} divider={<Divider />}>
						{formedCart.sections.map((section) => {
							const userSectionItems =
								cartItemList.items.filter((item) =>
									section.items.some((sectionItem) => sectionItem.id === item.id)
								) || [];
							return (
								userSectionItems.length > 0 && (
									<CartSection
										isMobile={isMobile}
										key={section.title}
										data={section}
										availableItemIds={availableItemIds}
										availabilityIsLoading={availabilityIsLoading}
										cartItemIds={cartItemIds}
										cartItemListIsLoading={cartItemListIsLoading}
										favoriteItemIds={favoriteItemIds}
										favoriteItemListIsLoading={favoriteItemListIsLoading}
										onMakeOrder={createOrder}
									/>
								)
							);
						})}
					</Stack>
					{cartItemList.items.length === 0 && (
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
