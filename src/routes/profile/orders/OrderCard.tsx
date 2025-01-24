import { Box, Button, Divider, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { orderStatusBadges, preorderBadge, preorderStatusBadges } from "@components/Badges";
import CountdownTimer from "@components/CountdownTimer";
import { SmallItemCard } from "@components/ItemCard";
import { OrderGet } from "@appTypes/Order";
import { DateFormatter } from "@utils/format";
import { getImageUrl } from "@utils/image";
import { PriorityHigh } from "@mui/icons-material";
import { PreorderStatus } from "@appTypes/Preorder";

const preorderStatusListToRender: PreorderStatus[] = [
	"WAITING_FOR_RELEASE",
	"FOREIGN_SHIPPING",
	"LOCAL_SHIPPING",
	"DISPATCH",
];

interface OrderCardProps {
	order: OrderGet;
	isMobile: boolean;
	onPay: (invoiceId: string) => void;
}

const OrderTask = ({ title }: { title: string }) => {
	return (
		<div className="ai-c d-f fd-r">
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
					{orderStatusBadges[order.status]}
					{order.preorder &&
						order.status === "ACCEPTED" &&
						preorderStatusListToRender.includes(order.preorder.status) && (
							<>{preorderStatusBadges[order.preorder.status]}</>
						)}
				</Box>
				{order.status === "UNPAID" && order.initialInvoice?.expiresAt && (
					<div className="gap-1 d-f fd-c">
						<Typography variant="subtitle1">
							В случае неоплаты заказ отменится через 3 часа после оформления.
						</Typography>
					</div>
				)}
				{order.preorder && (
					<>
						{order.preorder.status === "DISPATCH" && order.delivery === null && (
							<OrderTask title="Необходимо выбрать способ доставки." />
						)}
						{order.preorder.foreignShippingInvoice && !order.preorder.foreignShippingInvoice.isPaid && (
							<OrderTask title="Необходимо оплатить доставку до зарубежного склада." />
						)}
						{order.preorder.localShippingInvoice && !order.preorder.localShippingInvoice.isPaid && (
							<OrderTask title="Необходимо оплатить доставку в Россию." />
						)}
					</>
				)}
			</Box>
		);
	};

	return (
		<div className="gap-3 bg-primary px-3 pt-2 pb-3 w-100 br-3 d-f fd-c">
			<div>
				{isMobile ? (
					<div className="gap-1 pb-12px d-f fd-c">
						<div className="gap-1 d-f fd-r">
							<Typography variant="h5">Заказ от {DateFormatter.DDMMYYYY(order.createdAt)}</Typography>
							{order.preorder && preorderBadge}
						</div>
						<Typography variant="body1" sx={{ color: "typography.secondary" }}>
							ID: {order.id}
						</Typography>
						<Typography variant="h5">{total} ₽</Typography>
					</div>
				) : (
					<div className="gap-1 pb-12px d-f fd-c jc-sb">
						<div className="d-f fd-r jc-sb">
							<div className="gap-1 d-f fd-r">
								<Typography variant="h5">Заказ от {DateFormatter.DDMMYYYY(order.createdAt)}</Typography>
								{order.preorder && preorderBadge}
							</div>
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
					<div className="gap-1 d-f fd-r" style={{ overflowX: "auto" }}>
						{order.items.map((item, index) => (
							<SmallItemCard
								key={index}
								price={item.sum}
								quantity={item.quantity}
								imgUrl={getImageUrl(item.image, "small")}
							/>
						))}
					</div>
					<div className="gap-2 d-f fd-c">
						<OrderInfoSection />
						<div className="gap-2 d-f fd-r">
							{order.status === "UNPAID" && order.initialInvoice?.expiresAt && (
								<Button
									onClick={() => !order.initialInvoice.isPaid && onPay(order.initialInvoice.id)}
									variant="contained"
									sx={{ width: "fit-content", display: "flex", gap: 1 }}
								>
									{"Оплатить "}
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
						<div className="gap-2 d-f fd-r">
							{order.status === "UNPAID" && order.initialInvoice?.expiresAt && (
								<Button
									onClick={() => !order.initialInvoice.isPaid && onPay(order.initialInvoice.id)}
									variant="contained"
									sx={{ width: "fit-content", display: "flex", gap: 1 }}
								>
									{"Оплатить "}
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
					<div className="gap-2 d-f fd-r">
						{order.items.slice(0, 3).map((item, index) => (
							<SmallItemCard
								key={index}
								price={item.sum}
								quantity={item.quantity}
								imgUrl={getImageUrl(item.image, "small")}
							/>
						))}
						{order.items.length > 3 && (
							<Button onClick={() => navigate(`/orders/${order.id}`)} style={{ padding: 0, margin: 0 }}>
								<div className="bg-secondary ai-c br-2 d-f jc-c" style={{ width: 96, height: 148 }}>
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
