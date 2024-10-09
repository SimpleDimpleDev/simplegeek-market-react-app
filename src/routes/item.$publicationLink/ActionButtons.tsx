import { ShoppingCart, AddShoppingCart, NotificationAdd, Favorite, FavoriteBorder } from "@mui/icons-material";
import { Box, Button, CircularProgress, Typography, IconButton } from "@mui/material";

interface ActionButtonsProps {
	isFavorite: boolean | undefined;
	isInCart: boolean | undefined;
	isAvailable: boolean | undefined;
	onFavoriteClick: () => void;
	onCartClick: () => void;
	favoritesIsLoading: boolean;
	cartIsLoading: boolean;
	availabilityIsLoading: boolean;
}

const PublicationActionButtons: React.FC<ActionButtonsProps> = ({
	isFavorite,
	onFavoriteClick,
	favoritesIsLoading,
	isInCart,
	onCartClick,
	cartIsLoading,
	isAvailable,
	availabilityIsLoading,
}) => {
	return (
		<Box display="flex" flexDirection="row" gap={1}>
			<Button variant="contained" size="large" fullWidth onClick={onCartClick} disabled={isInCart === undefined}>
				{availabilityIsLoading || cartIsLoading ? (
					<CircularProgress />
				) : isAvailable ? (
					isInCart ? (
						<ShoppingCart sx={{ color: "icon.primary" }} />
					) : (
						<AddShoppingCart sx={{ color: "icon.primary" }} />
					)
				) : (
					<NotificationAdd />
				)}
				<Typography>{isInCart ? "Перейти" : "Добавить"} в корзину</Typography>
			</Button>
			<IconButton onClick={onFavoriteClick} disabled={isFavorite === undefined}>
				{favoritesIsLoading ? (
					<CircularProgress />
				) : isFavorite ? (
					<Favorite sx={{ color: "icon.attention" }} />
				) : (
					<FavoriteBorder color="secondary" />
				)}
			</IconButton>
		</Box>
	);
};

export { PublicationActionButtons };
