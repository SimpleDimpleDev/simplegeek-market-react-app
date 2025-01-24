import { OrderStatus } from "@appTypes/Order";
import { PreorderStatus } from "@appTypes/Preorder";
import { Chip, Tooltip } from "@mui/material";

export const orderStatusBadges: Record<OrderStatus, JSX.Element> = {
	CANCELLED: (
		<Tooltip title={"Заказ отменен."}>
			<Chip color="error" label="Отменен" />
		</Tooltip>
	),
	UNPAID: (
		<Tooltip title={"Заказ не оплачен. Пожалуйста, оплатите заказ."}>
			<Chip color="warning" label="Не оплачен" />
		</Tooltip>
	),
	ACCEPTED: (
		<Tooltip
			title={
				'Заказ оплачен. Ожидайте смены статуса на "Готов к выдаче" или "Передан в доставку" в зависимости от вашего заказа.'
			}
		>
			<Chip color="warning" label="Оформлен" />
		</Tooltip>
	),
	DELIVERY: (
		<Tooltip title={"Вы можете отследить заказ в службе доставки."}>
			<Chip color="info" label="Передан в доставку" />
		</Tooltip>
	),
	READY_FOR_PICKUP: (
		<Tooltip title={"Заказ ожидает в пункте выдачи."}>
			<Chip color="success" label="Готов к выдаче" />
		</Tooltip>
	),
	FINISHED: (
		<Tooltip title={"Спасибо за заказ!"}>
			<Chip color="success" label="Выдан" />
		</Tooltip>
	),
};

export const preorderBadge: JSX.Element = <Chip color="success" label="Предзаказ" />;

export const preorderStatusBadges: Record<PreorderStatus, JSX.Element> = {
	WAITING_FOR_RELEASE: (
		<Tooltip title={"Ожидание производства товаров."}>
			<Chip color="warning" label="Ожидание релиза" />
		</Tooltip>
	),
	FOREIGN_SHIPPING: (
		<Tooltip title={"Товары в пути на зарубежный склад."}>
			<Chip color="info" label="Доставка на зарубежный склад" />
		</Tooltip>
	),
	LOCAL_SHIPPING: (
		<Tooltip title={"Товары в пути на наш склад."}>
			<Chip color="info" label="Доставка на склад РФ" />
		</Tooltip>
	),
	DISPATCH: (
		<Tooltip title={"Товары уже прибыли к нам на склад. Выберите способ доставки, если ещё не сделали этого."}>
			<Chip color="success" label="Идёт выдача предзаказов" />
		</Tooltip>
	),
	FINISHED: (
		<Tooltip title={"Предзаказ завершен."}>
			<Chip color="success" label="Завершен" />
		</Tooltip>
	),
};