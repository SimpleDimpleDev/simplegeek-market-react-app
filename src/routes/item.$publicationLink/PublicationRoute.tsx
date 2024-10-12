import { useNavigate, useParams, useSearchParams } from "react-router-dom";
// import SuggestedItems from "@components/SuggestedItems";

import { lazy, Suspense, useMemo } from "react";

import { getImageUrl } from "@utils/image";
import { useAddCartItemMutation, useGetCartItemListQuery } from "@api/shop/cart";
import { useGetCatalogQuery, useGetItemsAvailabilityQuery } from "@api/shop/catalog";
import {
	useAddFavoriteItemMutation,
	useGetFavoriteItemListQuery,
	useRemoveFavoriteItemMutation,
} from "@api/shop/favorites";
import { Loading } from "@components/Loading";
import { useIsMobile } from "src/hooks/useIsMobile";

const MobilePublication = lazy(() => import("./MobilePublication"));
const DesktopPublication = lazy(() => import("./DesktopPublication"));

export function Component() {
	const isMobile = useIsMobile();

	const params = useParams();
	const [searchParams, setSearchParams] = useSearchParams();
	const navigate = useNavigate();

	const publicationLink = params.publicationLink;
	if (publicationLink === undefined) {
		throw new Response("No item link provided", { status: 404 });
	}

	const itemVariationIndexString = searchParams.get("v");
	const itemVariationIndex = itemVariationIndexString === null ? 0 : parseInt(itemVariationIndexString);
	const setItemVariationIndex = (index: number) => setSearchParams({ ["v"]: index.toString() }, { replace: true });

	const { data: catalog, isLoading: catalogIsLoading } = useGetCatalogQuery();

	const { data: availableItemIds, isLoading: availableItemIdsIsLoading } = useGetItemsAvailabilityQuery();
	const { data: favoriteItemList, isLoading: favoriteItemListIsLoading } = useGetFavoriteItemListQuery();
	const { data: cartItemList, isLoading: cartItemListIsLoading } = useGetCartItemListQuery();

	const [addCartItem] = useAddCartItemMutation();
	const [addFavoriteItem] = useAddFavoriteItemMutation();
	const [removeFavoriteItem] = useRemoveFavoriteItemMutation();

	const publication = useMemo(
		() => catalog?.publications.find((publication) => publication.link === publicationLink),
		[catalog, publicationLink]
	);
	const selectedVariation = publication?.items.at(itemVariationIndex);

	const selectedVariationIsAvailable = useMemo(
		() => (selectedVariation === undefined ? undefined : availableItemIds?.includes(selectedVariation.id)),
		[availableItemIds, selectedVariation]
	);
	const selectedVariationIsInCart = useMemo(
		() =>
			selectedVariation === undefined
				? undefined
				: cartItemList?.items.some((cartItem) => cartItem.id === selectedVariation.id),
		[cartItemList, selectedVariation]
	);
	const selectedVariationIsFavorite = useMemo(
		() =>
			selectedVariation === undefined
				? undefined
				: favoriteItemList?.items.some((favoriteItem) => favoriteItem.id === selectedVariation.id),
		[favoriteItemList, selectedVariation]
	);
	const preparedImageUrls = useMemo(
		() => selectedVariation?.product.images.map((image) => getImageUrl(image.url, "large")) || [],
		[selectedVariation]
	);

	console.log({preparedImageUrls});

	const handleToggleFavorite = () => {
		if (selectedVariationIsFavorite === undefined || selectedVariation === undefined) return;
		if (selectedVariationIsFavorite) {
			removeFavoriteItem({ itemId: selectedVariation.id });
		} else {
			addFavoriteItem({ itemId: selectedVariation.id });
		}
	};

	const handleCartClick = () => {
		if (
			selectedVariationIsAvailable === undefined ||
			selectedVariationIsInCart === undefined ||
			selectedVariation === undefined
		)
			return;
		if (selectedVariationIsInCart) {
			navigate("/cart");
		} else if (selectedVariationIsAvailable) {
			addCartItem({ itemId: selectedVariation.id });
		} else {
			// TODO: implement tracked items
			alert("Товар отсутствует в наличии");
		}
	};

	return (
		<Loading
			isLoading={catalogIsLoading}
			necessaryDataIsPersisted={!!catalog && !!publication && !!selectedVariation}
		>
			{!publication || !selectedVariation ? null : isMobile ? (
				<Suspense fallback={<Loading isLoading={true} />}>
					<MobilePublication
						publication={publication}
						selectedVariation={selectedVariation}
						imageUrls={preparedImageUrls}
						selectedVariationIndex={itemVariationIndex}
						onChangeSelectedVariationIndex={setItemVariationIndex}
						availableItemIdsIsLoading={availableItemIdsIsLoading}
						selectedVariationIsAvailable={selectedVariationIsAvailable}
						cartItemListIsLoading={cartItemListIsLoading}
						selectedVariationIsInCart={selectedVariationIsInCart}
						onCartClick={handleCartClick}
						favoriteItemListIsLoading={favoriteItemListIsLoading}
						selectedVariationIsFavorite={selectedVariationIsFavorite}
						onFavoriteClick={handleToggleFavorite}
					/>
				</Suspense>
			) : (
				<Suspense fallback={<Loading isLoading={true} />}>
					<DesktopPublication
						publication={publication}
						selectedVariation={selectedVariation}
						imageUrls={preparedImageUrls}
						selectedVariationIndex={itemVariationIndex}
						onChangeSelectedVariationIndex={setItemVariationIndex}
						availableItemIdsIsLoading={availableItemIdsIsLoading}
						selectedVariationIsAvailable={selectedVariationIsAvailable}
						cartItemListIsLoading={cartItemListIsLoading}
						selectedVariationIsInCart={selectedVariationIsInCart}
						onCartClick={handleCartClick}
						favoriteItemListIsLoading={favoriteItemListIsLoading}
						selectedVariationIsFavorite={selectedVariationIsFavorite}
						onFavoriteClick={handleToggleFavorite}
					/>
				</Suspense>
			)}
			{/* <SuggestedItems /> */}
		</Loading>
	);
}
