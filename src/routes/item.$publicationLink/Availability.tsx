import { PreorderShop } from "@appTypes/Preorder";
import { Box, Typography } from "@mui/material";

interface VariationAvailabilityProps {
	availabilityIsLoading: boolean;
	variationIsAvailable: boolean | undefined;
	price: number;
	discount: number | null;
	preorder: PreorderShop | null;
}

const PublicationAvailability: React.FC<VariationAvailabilityProps> = ({
	availabilityIsLoading,
	variationIsAvailable,
	price,
	discount,
	preorder,
}) => {
	return (
		<Box display="flex" flexDirection="column" gap={1}>
			{discount ? (
				<div className="gap-1 ai-c d-f">
					<Typography
						variant="h4"
						sx={{
							textDecoration: "line-through",
							color: "typography.secondary",
						}}
					>
						{price} ₽
					</Typography>
					<Typography variant="h4">{price - discount} ₽</Typography>
				</div>
			) : (
				<Typography variant="h4">{price} ₽</Typography>
			)}
			{availabilityIsLoading ? (
				<Typography variant="body2">Загрузка...</Typography>
			) : variationIsAvailable === undefined ? null : variationIsAvailable ? (
				preorder ? (
					<>
						<Typography variant="body2" color={"typography.success"}>
							Доступно для предзаказа
						</Typography>
						<Box display="flex" flexDirection="row" gap={1}>
							<Typography variant="body2" color={"typography.secondary"}>
								На складе ожидается:
							</Typography>{" "}
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
