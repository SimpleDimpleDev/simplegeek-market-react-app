import { ShoppingCart } from "@mui/icons-material";
import { CircularProgress, Divider, Stack, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { CountPageHeader } from "@components/CountPageHeader";
import { Empty } from "@components/Empty";
import { UserCartItem } from "@appTypes/UserItems";
import { useMemo, useState } from "react";

import { CartSection } from "./section";

import type { CatalogItemCart, FormedCart, FormedCartSection } from "@appTypes/Cart";
import { CatalogItem } from "@appTypes/CatalogItem";
import SuggestedItems from "@components/SuggestedItems";
import { getSuggestedItems } from "@utils/items";
import { useSelector } from "react-redux";
import { RootState } from "@state/store";
import ShopApiClient from "@api/shop/client";
import { addCartItem, addFavoriteItem, patchCartItem, removeCartItems, removeFavoriteItem } from "@state/user/thunks";

interface FormCartArgs {
	catalogItems: CatalogItem[];
	userCart: UserCartItem[];
	availableItemsIds: string[];
}

function formCart({ catalogItems, userCart, availableItemsIds }: FormCartArgs): FormedCart {
	const stockSection: FormedCartSection = {
		title: "В наличии",
		unavailable: false,
		preorder: null,
		creditAvailable: false,
		items: [],
	};
	const unavailableSection: FormedCartSection = {
		title: "Нет в наличии",
		unavailable: true,
		preorder: null,
		creditAvailable: false,
		items: [],
	};
	const preorderSections: FormedCartSection[] = [];

	for (const userCartItem of userCart) {
		const catalogItem = catalogItems.find((item) => item.id === userCartItem.id);
		if (catalogItem === undefined) {
			continue;
		}
		const item: CatalogItemCart = { ...catalogItem, quantity: userCartItem.quantity };
		const isAvailable = availableItemsIds.includes(item.id);
		if (!isAvailable) {
			unavailableSection.items.push(item);
		} else {
			const itemPreorder = item.preorder;
			if (itemPreorder !== null) {
				const preorderSection = preorderSections.find((section) => section.title === itemPreorder.title);
				const itemCreditAvailable = item.creditInfo !== null;
				if (preorderSection === undefined) {
					preorderSections.push({
						title: itemPreorder.title,
						unavailable: false,
						preorder: itemPreorder,
						creditAvailable: itemCreditAvailable,
						items: [item],
					});
				} else {
					preorderSection.items.push(item);
					if (itemCreditAvailable) {
						preorderSection.creditAvailable = true;
					}
				}
			} else {
				stockSection.items.push(item);
			}
		}
	}

	return {
		sections: [stockSection, ...preorderSections, unavailableSection],
	};
}

export default function Cart() {
	const navigate = useNavigate();

	const isMobile = useSelector((state: RootState) => state.responsive.isMobile);

	const catalogItems = useSelector((state: RootState) => state.catalog.items);
	const availableItemsIds = useSelector((state: RootState) => state.availability.items);

	const userAuthority = useSelector((state: RootState) => state.userAuthority.authority);
	const userCartItems = useSelector((state: RootState) => state.userCart.items);
	const userCartLoading = useSelector((state: RootState) => state.userCart.loading);
	const userFavoriteItems = useSelector((state: RootState) => state.userFavorites.items);

	console.log("availableItemsIds", availableItemsIds);
	console.log("userCartItems", userCartItems);
	console.log("catalogItems", catalogItems);

	const formedCart = useMemo(
		() => formCart({ catalogItems, userCart: userCartItems, availableItemsIds }),
		[userCartItems, catalogItems, availableItemsIds]
	);

	console.log("formedCart", formedCart);

	const [orderIsOk, setOrderIsOk] = useState(true);

	const createOrder = async (items: UserCartItem[]) => {
		if (!userAuthority) navigate("/auth/login");
		const checkoutResult = await ShopApiClient.checkout(items);

		if (checkoutResult.ok) {
			navigate("/order");
		} else {
			setOrderIsOk(false);
		}
	};

	return (
		<>
			<CountPageHeader isMobile={isMobile} title="Корзина" count={userCartItems.length} />
			{!orderIsOk && (
				<div className="w-100 br-3 bg-primary p-3">
					<Typography variant="body2">
						В вашем заказе содержались товары, указанное количество которых отсутствует на складе.
						Количество товаров в корзине было скорректировано
					</Typography>
				</div>
			)}
			<Stack direction={"column"} gap={4} divider={<Divider />} p={"24px 0"}>
				{formedCart.sections.map((section) => {
					const userSectionItems = userCartItems.filter((item) =>
						section.items.some((sectionItem) => sectionItem.id === item.id)
					);
					return (
						userSectionItems.length > 0 && (
							<CartSection
								isMobile={isMobile}
								key={section.title}
								data={section}
								userCart={userSectionItems}
								userFavorites={userFavoriteItems}
								onDeleteItemsFromCart={(ids) => removeCartItems({ itemIds: ids })}
								onIncrementItemQuantity={(id) => patchCartItem({ itemId: id, action: "INCREMENT" })}
								onDecrementItemQuantity={(id) => patchCartItem({ itemId: id, action: "DECREMENT" })}
								onAddItemToFavorites={(id) => addFavoriteItem({itemId: id})}
								onRemoveItemFromFavorites={(id) => removeFavoriteItem({itemId: id})}
								onMakeOrder={createOrder}
							/>
						)
					);
				})}
			</Stack>
			{userCartLoading ? (
				<div className="w-100 h-100 d-f jc-c ai-c">
					<CircularProgress />
				</div>
			) : (
				userCartItems.length === 0 && (
					<Empty
						title="В корзине ничего нет"
						description="Добавьте в корзину что-нибудь"
						icon={
							<ShoppingCart
								sx={{
									width: 91,
									height: 91,
									color: "icon.tetriary",
								}}
							/>
						}
					/>
				)
			)}
			<SuggestedItems
				isMobile={isMobile}
				itemsData={getSuggestedItems(catalogItems)}
				userFavorites={userFavoriteItems}
				userCart={userCartItems}
				onAddToCart={(id) => addCartItem({ itemId: id })}
				onAddToFavorites={(id) => addFavoriteItem({ itemId: id })}
				onRemoveFromFavorites={(id) => removeFavoriteItem({ itemId: id })}
				availableItemIds={availableItemsIds}
			/>
		</>
	);
}
