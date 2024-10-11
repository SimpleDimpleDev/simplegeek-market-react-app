import { PriorityHigh, ShoppingCart } from "@mui/icons-material";
import { Divider, Stack, Typography } from "@mui/material";
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
import { Loading } from "@components/Loading";
import { formCart } from "./utils";
import { useIsMobile } from "src/hooks/useIsMobile";

export function Component() {
	const isMobile = useIsMobile();
	const navigate = useNavigate();

	const actionData = useActionData() as { orderItemsUnavailableError: boolean } | undefined;
	const actionOrderItemsUnavailableError = actionData?.orderItemsUnavailableError;

	const user = useSelector((state: RootState) => state.user.identity);

	const { data: catalog, isLoading: catalogIsLoading } = useGetCatalogQuery();
	const {
		data: availableItemsIds,
		isLoading: availableItemsIdsIsLoading,
		refetch: refetchAvailable,
	} = useGetItemsAvailabilityQuery();

	const { data: cartItemList, isLoading: cartItemListIsLoading, refetch: refetchCart } = useGetCartItemListQuery();
	const { data: favoriteItemList, isLoading: favoriteItemListIsLoading } = useGetFavoriteItemListQuery();

	const [checkout, { isSuccess: checkoutIsSuccess, isError: checkoutIsError }] = useCheckoutMutation();

	const [orderItemsUnavailableError, setOrderItemsUnavailableError] = useState<boolean>(
		actionOrderItemsUnavailableError ?? false
	);

	useEffect(() => {
		if (checkoutIsSuccess) {
			navigate("/order");
		}
		if (checkoutIsError) {
			setOrderItemsUnavailableError(true);
		}
	}, [checkoutIsSuccess, navigate, checkoutIsError]);

	useEffect(() => {
		if (orderItemsUnavailableError) {
			refetchCart();
			refetchAvailable();
		}
	}, [orderItemsUnavailableError, refetchCart, refetchAvailable]);

	const formedCart = useMemo(
		() =>
			catalog && availableItemsIds && cartItemList
				? formCart({ catalogItems: catalog.items, userCart: cartItemList.items, availableItemsIds })
				: { sections: [] },
		[catalog, availableItemsIds, cartItemList]
	);

	const createOrder = async (items: UserCartItem[]) => {
		if (!user) {
			navigate("/auth/login?return_to=cart");
		} else {
			checkout({ items });
		}
	};

	const showLoading =
		catalogIsLoading || availableItemsIdsIsLoading || cartItemListIsLoading || favoriteItemListIsLoading;

	return (
		<>
			<CountPageHeader isMobile={isMobile} title="Корзина" count={cartItemList?.items.length || 0} />
			<Loading
				isLoading={showLoading}
				necessaryDataIsPersisted={!!catalog && !!availableItemsIds && !!cartItemList && !!favoriteItemList}
			>
				<>
					{orderItemsUnavailableError && (
						<div className="gap-1 bg-primary p-3 w-100 ai-c br-3 d-f fd-r">
							<PriorityHigh color="error" />

							<Typography variant="body1">
								В вашем заказе содержались товары, указанное количество которых отсутствует на складе.
								Количество товаров в корзине было скорректировано.
							</Typography>
						</div>
					)}
					<Stack direction={"column"} gap={4} divider={<Divider />} p={"24px 0"}>
						{formedCart.sections.map((section) => {
							const userSectionItems =
								cartItemList?.items.filter((item) =>
									section.items.some((sectionItem) => sectionItem.id === item.id)
								) || [];
							return (
								userSectionItems.length > 0 && (
									<CartSection
										isMobile={isMobile}
										key={section.title}
										data={section}
										onMakeOrder={createOrder}
									/>
								)
							);
						})}
					</Stack>
					{cartItemList?.items.length === 0 && (
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
			</Loading>
		</>
	);
}
