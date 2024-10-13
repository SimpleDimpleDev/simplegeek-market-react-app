import {
	ShoppingCart,
	AddShoppingCart,
	NotificationAdd,
	Favorite,
	FavoriteBorder,
	NotificationsOff,
} from "@mui/icons-material";
import { Box, Button, CircularProgress, Typography, IconButton } from "@mui/material";

interface ActionButtonsProps {
	availabilityIsLoading: boolean;
	isAvailable: boolean | undefined;

	cartIsLoading: boolean;
	isInCart: boolean | undefined;
	onCartClick: () => void;

	favoritesIsLoading: boolean;
	isFavorite: boolean | undefined;
	onFavoriteClick: () => void;

	trackedIsLoading: boolean;
	isTracked: boolean | undefined;
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
	trackedIsLoading,
	isTracked,
}) => {
	return (
		<Box display="flex" flexDirection="row" gap={1}>
			<Button
				variant="contained"
				size="large"
				fullWidth
				onClick={onCartClick}
				disabled={
					isAvailable === undefined ||
					isInCart === undefined ||
					isTracked === undefined
				}
			>
				{availabilityIsLoading || cartIsLoading || trackedIsLoading ? (
					<CircularProgress />
				) : isAvailable ? (
					isInCart ? (
						<>
							<ShoppingCart sx={{ color: "icon.primary" }} />
							<Typography>Перейти в корзину</Typography>
						</>
					) : (
						<>
							<AddShoppingCart sx={{ color: "icon.primary" }} />
							<Typography>Добавить в корзину</Typography>
						</>
					)
				) : isTracked ? (
					<>
						<NotificationsOff />
						<Typography>Отключить уведомление</Typography>
					</>
				) : (
					<>
						<NotificationAdd />
						<Typography>Уведомить при поступлении</Typography>
					</>
				)}
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
