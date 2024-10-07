import {
	Box,
	Button,
	Checkbox,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	Divider,
	Grow,
	Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { baseFadeTime } from "@config/animation";
import { useEffect, useState } from "react";
import { FormedCartSection } from "@appTypes/Cart";
import { UserCartItem } from "@appTypes/UserItems";
import { useDeleteCartItemsMutation } from "@api/shop/cart";
import { CartItem } from "./CartItem";

interface CartSectionHeaderProps {
	allChecked: boolean;
	onCheckAll: () => void;
	anySelected: boolean;
	onDeleteSelected: () => void;
}

const CartSectionHeader = ({ allChecked, onCheckAll, anySelected, onDeleteSelected }: CartSectionHeaderProps) => {
	return (
		<>
			<Box width="100%" display="flex" flexDirection="row" justifyContent="space-between">
				<Box display="flex" flexDirection="row" alignItems="center" gap={1}>
					<Checkbox checked={allChecked} onChange={onCheckAll} />
					<Typography variant="body1">Выбрать все</Typography>
				</Box>
				<Button variant="text" disabled={!anySelected} onClick={onDeleteSelected}>
					<Typography color="warning.main" variant="body1">
						Удалить выбранное
					</Typography>
				</Button>
			</Box>
		</>
	);
};

const CartSectionWrapper = ({ isMobile, children }: { isMobile: boolean; children: React.ReactNode }) => (
	<Box display="flex" flexDirection={isMobile ? "column" : "row"} gap={2}>
		{children}
	</Box>
);

const CartSectionItemsWrapper = ({ isMobile, children }: { isMobile: boolean; children: React.ReactNode }) => (
	<Box
		width="100%"
		display="flex"
		flexDirection="column"
		gap={2}
		padding={isMobile ? "16px 16px 24px 8px" : "16px 24px 24px 24px"}
		borderRadius={3}
		sx={{
			backgroundColor: "surface.primary",
		}}
	>
		{children}
	</Box>
);

interface CartSectionProps {
	isMobile: boolean;
	data: FormedCartSection;
	onMakeOrder: (items: UserCartItem[]) => void;
}

export const CartSection = ({ isMobile, data, onMakeOrder }: CartSectionProps) => {
	const navigate = useNavigate();

	const [checkedIds, setCheckedIds] = useState<string[]>(data.unavailable ? [] : data.items.map((item) => item.id));
	const [deleteModalIsOpened, setDeleteModalIsOpened] = useState(false);

	const [removeCartItems] = useDeleteCartItemsMutation();

	useEffect(() => {
		setCheckedIds((prev) => prev.filter((id) => data.items.some((item) => item.id === id)));
	}, [data]);

	const checkedItemsCount = checkedIds.length;
	const allChecked = checkedItemsCount === data.items.length;

	const totalPrice = data.items
		.filter((cartItem) => checkedIds.includes(cartItem.id))
		.map((cartItem) => cartItem.price * cartItem.quantity)
		.reduce((a, b) => a + b, 0);

	const handleDeleteSelected = () => {
		removeCartItems({ itemIds: checkedIds });
		setCheckedIds([]);
		setDeleteModalIsOpened(false);
	};

	const handleCheckItem = (id: string) => {
		if (checkedIds.includes(id)) {
			setCheckedIds(checkedIds.filter((checkedId) => checkedId !== id));
		} else {
			setCheckedIds([...checkedIds, id]);
		}
	};

	const handleCheckAll = () => {
		if (allChecked) {
			setCheckedIds([]);
		} else {
			setCheckedIds(data.items.map((item) => item.id));
		}
	};

	return (
		<Box display="flex" flexDirection="column" gap={2}>
			<Dialog
				sx={{ borderRadius: "24px", "& .MuiPaper-root": { width: isMobile ? "100%" : "444px" } }}
				open={deleteModalIsOpened}
				onClose={() => setDeleteModalIsOpened(false)}
			>
				<DialogTitle>Удалить выбранные товары?</DialogTitle>
				<DialogContent>После удаления отменить действие будет невозможно</DialogContent>
				<DialogActions>
					<Button
						onClick={() => setDeleteModalIsOpened(false)}
						sx={{ borderRadius: "8px" }}
						fullWidth
						variant="contained"
						color="secondary"
					>
						Отмена
					</Button>
					<Button onClick={handleDeleteSelected} sx={{ borderRadius: "8px" }} fullWidth variant="contained">
						Удалить
					</Button>
				</DialogActions>
			</Dialog>

			<Typography variant="h6">{data.title}</Typography>
			{data.preorder && data.preorder.expectedArrival && (
				<Box display={"flex"} flexDirection={"row"} gap={"8px"}>
					<Typography color="typography.secondary" variant="subtitle1">
						На складе ожидается:
					</Typography>
					<Typography variant="subtitle1">{data.preorder.expectedArrival ?? "Неизвестно"}</Typography>
				</Box>
			)}
			<CartSectionWrapper isMobile={isMobile}>
				<CartSectionItemsWrapper isMobile={isMobile}>
					<CartSectionHeader
						allChecked={allChecked}
						onCheckAll={handleCheckAll}
						anySelected={checkedIds.length > 0}
						onDeleteSelected={() => setDeleteModalIsOpened(true)}
					/>
					{data.items.map((cartItem, cartItemIndex) => {
						return (
							<Grow key={cartItem.id} in timeout={(cartItemIndex + 1) * baseFadeTime}>
								<Box display="flex" flexDirection="column" gap={2}>
									<Divider></Divider>
									<CartItem
										isMobile={isMobile}
										key={cartItem.id}
										item={cartItem}
										checked={checkedIds.includes(cartItem.id)}
										onClick={() => {
											const variationParam =
												cartItem.variationIndex !== null ? `?v=${cartItem.variationIndex}` : "";
											navigate(`/item/${cartItem.publicationLink}${variationParam}`);
										}}
										onCheck={() => {
											handleCheckItem(cartItem.id);
										}}
									/>
								</Box>
							</Grow>
						);
					})}
				</CartSectionItemsWrapper>
				{!data.unavailable ? (
					<Box
						position={isMobile ? "relative" : "sticky"}
						top={16}
						display="flex"
						flexShrink={0}
						flexDirection="column"
						gap={2} // assuming the theme's spacing unit is 8px, otherwise adjust accordingly
						p={2}
						bgcolor="white"
						borderRadius={3}
						width={isMobile ? "100%" : 360}
						height="fit-content"
					>
						<Box display="flex" flexDirection="column" gap={1}>
							<Typography variant="subtitle0">Итого:</Typography>
							<Box display="flex" flexDirection="row" alignItems={"baseline"} gap={1}>
								<Typography variant="h4">{totalPrice} ₽</Typography>
								<Typography color="typography.secondary" variant="body1">
									/ {checkedItemsCount} товаров
								</Typography>
							</Box>
							{data.creditAvailable && (
								<Typography variant="body2" color="typography.success">
									Доступна рассрочка
								</Typography>
							)}
						</Box>
						<Button
							onClick={() => {
								const checkedItems = data.items.filter((item) => checkedIds.includes(item.id));
								onMakeOrder(checkedItems);
							}}
							variant="contained"
							disabled={checkedItemsCount === 0}
						>
							Оформить
						</Button>
						{data.preorder && (
							<Typography variant="caption" color="typography.disabled">
								В сумме заказа не учитывается стоимость доставки до склада. Она будет известна после его
								приезда.
							</Typography>
						)}
					</Box>
				) : (
					<Box display={isMobile ? "none" : "flex"} width={360} flexShrink={0}></Box>
				)}
			</CartSectionWrapper>
		</Box>
	);
};
