import { PreorderShop } from "@appTypes/Preorder";
import { Box, Typography } from "@mui/material";

interface VariationAvailabilityProps {
	availabilityIsLoading: boolean;
	variationIsAvailable: boolean | undefined;
	price: number;
	preorder: PreorderShop | null;
}

const PublicationAvailability: React.FC<VariationAvailabilityProps> = ({
	availabilityIsLoading,
	variationIsAvailable,
	price,
	preorder,
}) => {
	return (
		<Box display="flex" flexDirection="column" gap={1}>
			<Typography variant="h4">{price} ₽</Typography>
			{availabilityIsLoading ? (
				<Typography variant="body2">Загрузка...</Typography>
			) : variationIsAvailable === undefined ? null : variationIsAvailable ? (
				preorder ? (
					<>
						<Typography variant="body2" color={"typography.success"}>
							Доступно для предзаказа
						</Typography>
						<Box display="flex" flexDirection="row">
							<Typography variant="body2" color={"typography.secondary"}>
								На складе ожидается:
							</Typography>
							<Typography variant="body2">{preorder.expectedArrival ?? "Неизвестно"}</Typography>
						</Box>
					</>
				) : (
					<Typography variant="body2" color={"typography.success"}>
						В наличии
					</Typography>
				)
			) : (
				<Typography variant="body2" color={"typography.error"}>
					Нет в наличии
				</Typography>
			)}
		</Box>
	);
};

export { PublicationAvailability };
