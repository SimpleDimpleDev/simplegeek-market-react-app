import { PriorityHigh, ShoppingCart } from "@mui/icons-material";
import { CircularProgress, Divider, Stack, Typography } from "@mui/material";
import { useActionData, useNavigate } from "react-router-dom";
import { CountPageHeader } from "@components/CountPageHeader";
import { Empty } from "@components/Empty";
import { UserCartItem } from "@appTypes/UserItems";
import { useEffect, useMemo, useState } from "react";

import { CartSection } from "./CartSection";

import SuggestedItems from "@components/SuggestedItems";
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

export function Component() {
	const isMobile = useIsMobile();
	const navigate = useNavigate();

	const actionData = useActionData() as { orderItemsUnavailableError: boolean } | undefined;
	const actionOrderItemsUnavailableError = actionData?.orderItemsUnavailableError;

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

	const [checkout, { isSuccess: checkoutIsSuccess, isError: checkoutIsError }] = useCheckoutMutation();

	const [orderItemsUnavailableError, setOrderItemsUnavailableError] = useState<boolean>(
		actionOrderItemsUnavailableError ?? false
	);

	useEffect(() => {
		if (checkoutIsSuccess) {
			navigate("/order");
		}
		if (checkoutIsError) {
			// TODO: parse server error and render messages
			setOrderItemsUnavailableError(true);
		}
	}, [checkoutIsSuccess, navigate, checkoutIsError]);

	useEffect(() => {
		if (orderItemsUnavailableError) {
			refetchCart();
			refetchAvailability();
		}
	}, [orderItemsUnavailableError, refetchCart, refetchAvailability]);

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
			{catalogIsLoading || availabilityIsLoading || cartItemListIsLoading || favoriteItemListIsLoading ? (
				<div className="w-100 h-100 ai-c d-f jc-c">
					<CircularProgress />
				</div>
			) : !catalog || !availableItemIds || !cartItemList ? (
				<SomethingWentWrong />
			) : (
				<>
					<CountPageHeader isMobile={isMobile} title="Корзина" count={cartItemList?.items.length || 0} />
					{orderItemsUnavailableError && (
						<div className="gap-1 bg-primary p-3 w-100 ai-c br-3 d-f fd-r">
							<PriorityHigh color="error" />
							<Typography variant="body1">
								В вашем заказе содержались товары, которые теперь недоступны.
								<br />
								Корзина была скорректирована.
							</Typography>
						</div>
					)}
					<Stack direction={"column"} gap={4} divider={<Divider />} p={"24px 0"}>
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
					<SuggestedItems />
				</>
			)}
		</>
	);
}
