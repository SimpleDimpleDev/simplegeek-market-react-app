import { useNavigate, useParams, useSearchParams } from "react-router-dom";

import { lazy, Suspense, useEffect, useMemo } from "react";

import { getImageUrl } from "@utils/image";
import { useAddCartItemMutation, useGetCartItemListQuery } from "@api/shop/cart";
import { useGetCatalogQuery, useGetItemsAvailabilityQuery } from "@api/shop/catalog";
import {
	useAddFavoriteItemMutation,
	useGetFavoriteItemListQuery,
	useRemoveFavoriteItemMutation,
} from "@api/shop/favorites";
import { useIsMobile } from "src/hooks/useIsMobile";
import { useAddTrackedItemMutation, useGetTrackedItemListQuery, useRemoveTrackedItemMutation } from "@api/shop/tracked";
import CircularProgress from "@mui/material/CircularProgress/CircularProgress";
import SomethingWentWrong from "@components/SomethingWentWrong";
import { Helmet } from "react-helmet";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@state/store";
import { addVisit } from "@state/visits/visitsSlice";
import SimilarItems from "@components/SimilarItems";
import NotFound from "@components/NotFound";

const MobilePublication = lazy(() => import("./MobilePublication"));
const DesktopPublication = lazy(() => import("./DesktopPublication"));

export function Component() {
	const isMobile = useIsMobile();

	const params = useParams();
	const [searchParams, setSearchParams] = useSearchParams();
	const navigate = useNavigate();

	const dispatch = useDispatch<AppDispatch>();

	const publicationLink = params.publicationLink;
	if (publicationLink === undefined) {
		throw new Response("No item link provided", { status: 404 });
	}

	const itemVariationIndexString = searchParams.get("v");
	const itemVariationIndex = itemVariationIndexString === null ? 0 : parseInt(itemVariationIndexString);
	const setItemVariationIndex = (index: number) =>
		setSearchParams({ ["v"]: index.toString() }, { replace: true, preventScrollReset: true });

	const { data: catalog, isLoading: catalogIsLoading } = useGetCatalogQuery();

	const { data: availableItemList, isLoading: availableItemListIsLoading } = useGetItemsAvailabilityQuery();

	const { data: cartItemList, isLoading: cartItemListIsLoading } = useGetCartItemListQuery();
	const { data: favoriteItemList, isLoading: favoriteItemListIsLoading } = useGetFavoriteItemListQuery();
	const { data: trackedItemList, isLoading: trackedItemListIsLoading } = useGetTrackedItemListQuery();

	const [addCartItem] = useAddCartItemMutation();

	const [addFavoriteItem] = useAddFavoriteItemMutation();
	const [removeFavoriteItem] = useRemoveFavoriteItemMutation();

	const [addTrackedItem] = useAddTrackedItemMutation();
	const [removeTrackedItem] = useRemoveTrackedItemMutation();

	const publication = useMemo(
		() => catalog?.publications.find((publication) => publication.link === publicationLink),
		[catalog, publicationLink]
	);

	const selectedVariation = useMemo(
		() => publication?.items.at(itemVariationIndex),
		[publication, itemVariationIndex]
	);

	const selectedVariationIsAvailable = useMemo(
		() => (selectedVariation === undefined ? undefined : availableItemList?.items.includes(selectedVariation.id)),
		[availableItemList, selectedVariation]
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
	const selectedVariationIsTracked = useMemo(
		() =>
			selectedVariation === undefined
				? undefined
				: trackedItemList?.items.some((trackedItem) => trackedItem.id === selectedVariation.id),
		[trackedItemList, selectedVariation]
	);

	useEffect(() => {
		if (selectedVariation) {
			dispatch(addVisit({ id: selectedVariation.id }));
		}
	}, [dispatch, selectedVariation]);

	const preparedImageUrls = useMemo(
		() => selectedVariation?.product.images.map((image) => getImageUrl(image.url, "large")) || [],
		[selectedVariation]
	);

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
			selectedVariation === undefined ||
			selectedVariationIsAvailable === undefined ||
			selectedVariationIsInCart === undefined ||
			selectedVariationIsTracked === undefined
		)
			return;
		if (selectedVariationIsInCart) {
			navigate("/cart");
		} else if (selectedVariationIsAvailable) {
			addCartItem({ itemId: selectedVariation.id });
		} else if (selectedVariationIsTracked) {
			removeTrackedItem({ itemId: selectedVariation.id });
		} else {
			addTrackedItem({ itemId: selectedVariation.id });
		}
	};

	return (
		<>
			{catalogIsLoading ? (
				<div className="w-100 h-100 ai-c d-f jc-c">
					<CircularProgress />
				</div>
			) : !catalog ? (
				<SomethingWentWrong />
			) : !publication || !selectedVariation ? (
				<NotFound />
			) : (
				<>
					<Helmet>
						<title>{selectedVariation.product.title} - SimpleGeek</title>
						<meta name="description" content={selectedVariation.product.description || ""} />
						<meta
							name="keywords"
							content={
								selectedVariation.product.category.title +
								", " +
								selectedVariation.product.filterGroups
									.flatMap((g) => g.filters.map((f) => f.value))
									.join(", ")
							}
						/>

						<meta property="og:locale" content="ru_RU" />
						<meta property="og:type" content="product" />
						<meta property="og:site_name" content="SimpleGeek" />
						<meta property="og:title" content={selectedVariation.product.title} />
						<meta property="og:description" content={selectedVariation.product.description || ""} />
						<meta
							property="og:image"
							content={getImageUrl(selectedVariation.product.images.at(0)?.url || "", "large")}
						/>
						<meta property="og:url" content={window.location.href} />

						<meta name="twitter:card" content="summary_large_image" />
						<meta name="twitter:title" content={selectedVariation.product.title} />
						<meta name="twitter:description" content={selectedVariation.product.description || ""} />
						<meta
							name="twitter:image"
							content={getImageUrl(selectedVariation.product.images.at(0)?.url || "", "large")}
						/>
						<meta name="twitter:url" content={window.location.href} />

						<script type="application/ld+json">
							{JSON.stringify({
								"@context": "https://schema.org/",
								"@type": "Product",
								name: selectedVariation.product.title,
								image: getImageUrl(selectedVariation.product.images.at(0)?.url || "", "large"),
								description: selectedVariation.product.description,
								category: selectedVariation.product.category.title,
								offers: {
									"@type": "Offer",
									priceCurrency: "RUB",
									price: selectedVariation.price,
									availability: publication.preorder
										? "https://schema.org/PreOrder"
										: selectedVariationIsAvailable
										? "https://schema.org/InStock"
										: "https://schema.org/OutOfStock",
								},
							})}
						</script>
						<link
							rel="preload"
							href={getImageUrl(selectedVariation.product.images.at(0)?.url || "", "large")}
							as="image"
						/>
					</Helmet>
					{isMobile ? (
						<Suspense
							fallback={
								<div className="w-100 h-100 ai-c d-f jc-c">
									<CircularProgress />
								</div>
							}
						>
							<MobilePublication
								publication={publication}
								selectedVariation={selectedVariation}
								imageUrls={preparedImageUrls}
								selectedVariationIndex={itemVariationIndex}
								onChangeSelectedVariationIndex={setItemVariationIndex}
								availableItemIdsIsLoading={availableItemListIsLoading}
								selectedVariationIsAvailable={selectedVariationIsAvailable}
								cartItemListIsLoading={cartItemListIsLoading}
								selectedVariationIsInCart={selectedVariationIsInCart}
								onCartClick={handleCartClick}
								favoriteItemListIsLoading={favoriteItemListIsLoading}
								selectedVariationIsFavorite={selectedVariationIsFavorite}
								onFavoriteClick={handleToggleFavorite}
								trackedItemListIsLoading={trackedItemListIsLoading}
								selectedVariationIsTracked={selectedVariationIsTracked}
							/>
							<SimilarItems itemId={selectedVariation.id} />
						</Suspense>
					) : (
						<Suspense
							fallback={
								<div className="w-100 h-100 ai-c d-f jc-c">
									<CircularProgress />
								</div>
							}
						>
							<DesktopPublication
								publication={publication}
								selectedVariation={selectedVariation}
								imageUrls={preparedImageUrls}
								selectedVariationIndex={itemVariationIndex}
								onChangeSelectedVariationIndex={setItemVariationIndex}
								availableItemIdsIsLoading={availableItemListIsLoading}
								selectedVariationIsAvailable={selectedVariationIsAvailable}
								cartItemListIsLoading={cartItemListIsLoading}
								selectedVariationIsInCart={selectedVariationIsInCart}
								onCartClick={handleCartClick}
								favoriteItemListIsLoading={favoriteItemListIsLoading}
								selectedVariationIsFavorite={selectedVariationIsFavorite}
								onFavoriteClick={handleToggleFavorite}
								trackedItemListIsLoading={trackedItemListIsLoading}
								selectedVariationIsTracked={selectedVariationIsTracked}
							/>
							<SimilarItems itemId={selectedVariation.id} />
						</Suspense>
					)}
				</>
			)}
		</>
	);
}
