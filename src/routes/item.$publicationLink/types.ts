import { CatalogItemGet } from "@appTypes/CatalogItem";
import { PublicationGet } from "@appTypes/Publication";

export type PublicationProps = {
	publication: PublicationGet;
	selectedVariation: CatalogItemGet;
	imageUrls: string[];

	selectedVariationIndex: number;
	onChangeSelectedVariationIndex: (index: number) => void;

	availableItemIdsIsLoading: boolean;
	selectedVariationIsAvailable: boolean | undefined;

	cartItemListIsLoading: boolean;
	selectedVariationIsInCart: boolean | undefined;
	onCartClick: () => void;

	favoriteItemListIsLoading: boolean;
	selectedVariationIsFavorite: boolean | undefined;
	onFavoriteClick: () => void;

	trackedItemListIsLoading: boolean;
	selectedVariationIsTracked: boolean | undefined;
};
