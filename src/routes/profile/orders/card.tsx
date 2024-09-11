import { Box, Button, Divider, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { orderStatusBadges, preorderStatusBadges } from "@components/Badges";
import CountdownTimer from "@components/CountdownTimer";
import { SmallItemCard } from "@components/ItemCard";
import { OrderShop } from "@appTypes/Order";
import { DateFormatter } from "@utils/format";
import { getImageUrl } from "@utils/image";
import { PriorityHigh } from "@mui/icons-material";

interface OrderCardProps {
	order: OrderShop;
	isMobile: boolean;
	onPay: (invoiceId: string) => void;
}

const OrderTask = ({ title }: { title: string }) => {
	return (
		<div className="d-f fd-r gap-1 ai-c">
			<PriorityHigh />
			<Typography variant="subtitle1">{title}</Typography>
		</div>
	);
};

const OrderCard: React.FC<OrderCardProps> = ({ isMobile, order, onPay }) => {
	const navigate = useNavigate();
	const total = order.items.reduce((acc, item) => acc + item.sum, 0);

	const OrderInfoSection = () => {
		return (
			<Box display={"flex"} flexDirection={"column"} gap={"12px"}>
				<Box display={"flex"} flexDirection={"row"} gap={1}>
					{order.preorder && order.status === "ACCEPTED" ? (
						<>{preorderStatusBadges[order.preorder.status]}</>
					) : (
						<>{orderStatusBadges[order.status]}</>
					)}
				</Box>
				{order.status === "UNPAID" && order.initialInvoice?.expiresAt && (
					<div className="d-f fd-c gap-1">
						<Typography variant="subtitle1">
							В случае неоплаты заказ отменится через 15 минут после оформления
						</Typography>
					</div>
				)}

				{order.preorder && (
					<>
						{order.preorder.status === "DISPATCH" && order.delivery === null && (
							<OrderTask title="Необходимо выбрать способ доставки" />
						)}
						{!order.preorder.foreignShippingInvoice?.isPaid && (
							<OrderTask title="Необходимо оплатить доставку до зарубежного склада" />
						)}
						{!order.preorder.localShippingInvoice?.isPaid && (
							<OrderTask title="Необходимо оплатить доставку в Россию" />
						)}
					</>
				)}
			</Box>
		);
	};

	return (
		<div className="w-100 d-f fd-c gap-3 px-3 pt-2 pb-3 br-3 bg-primary">
			<div>
				{isMobile ? (
					<div className="d-f fd-c gap-1 pb-12px">
						<Typography variant="h5">Заказ от {DateFormatter.DDMMYYYY(order.createdAt)}</Typography>
						<Typography variant="body1" sx={{ color: "typography.secondary" }}>
							ID: {order.id}
						</Typography>
						<Typography variant="h5">{total} ₽</Typography>
					</div>
				) : (
					<div className="d-f fd-c jc-sb gap-1 pb-12px">
						<div className="d-f fd-r jc-sb">
							<Typography variant="h5">Заказ от {DateFormatter.DDMMYYYY(order.createdAt)}</Typography>
							<Typography variant="h5">{total} ₽</Typography>
						</div>
						<Typography variant="body1" sx={{ color: "typography.secondary" }}>
							ID: {order.id}
						</Typography>
					</div>
				)}
				<Divider />
			</div>
			{isMobile ? (
				<>
					<div className="d-f fd-r gap-1" style={{ overflowX: "auto" }}>
						{order.items.map((item, index) => (
							<SmallItemCard
								key={index}
								price={item.sum}
								quantity={item.quantity}
								imgUrl={getImageUrl(item.image, "small")}
							/>
						))}
					</div>
					<div className="d-f fd-c gap-2">
						<OrderInfoSection />
						<div className="d-f fd-r gap-2">
							{order.status === "UNPAID" && order.initialInvoice?.expiresAt && (
								<Button
									onClick={() => !order.initialInvoice.isPaid && onPay(order.initialInvoice.id)}
									variant="contained"
									sx={{ width: "fit-content", display: "flex", gap: 1 }}
								>
									Оплатить
									<CountdownTimer deadline={order.initialInvoice.expiresAt} />
								</Button>
							)}
							<Button
								onClick={() => navigate(`/orders/${order.id}`)}
								variant="contained"
								sx={{ width: "fit-content", display: "flex", gap: 1 }}
							>
								Подробнее
							</Button>
						</div>
					</div>
				</>
			) : (
				<div className="d-f fd-r jc-sb">
					<div className="d-f fd-c jc-sb">
						<OrderInfoSection />
						<div className="d-f fd-r gap-2">
							{order.status === "UNPAID" && order.initialInvoice?.expiresAt && (
								<Button
									onClick={() => !order.initialInvoice.isPaid && onPay(order.initialInvoice.id)}
									variant="contained"
									sx={{ width: "fit-content", display: "flex", gap: 1 }}
								>
									Оплатить
									<CountdownTimer deadline={order.initialInvoice.expiresAt} />
								</Button>
							)}
							<Button
								onClick={() => navigate(`/orders/${order.id}`)}
								variant="contained"
								sx={{ width: "fit-content", display: "flex", gap: 1 }}
							>
								Подробнее
							</Button>
						</div>
					</div>
					<div className="d-f fd-r gap-2">
						{order.items.slice(0, 3).map((item, index) => (
							<SmallItemCard
								key={index}
								price={item.sum}
								quantity={item.quantity}
								imgUrl={getImageUrl(item.image, "small")}
							/>
						))}
						{order.items.length > 3 && (
							<Button style={{ padding: 0, margin: 0 }}>
								<div className="d-f jc-c ai-c bg-secondary br-2" style={{ width: 96, height: 148 }}>
									<Typography variant="h5" color="typography.secondary">
										+{order.items.length - 3}
									</Typography>
								</div>
							</Button>
						)}
					</div>
				</div>
			)}
		</div>
	);
};

export { OrderCard };
