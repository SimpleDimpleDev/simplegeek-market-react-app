import { OrderStatus } from "@appTypes/Order";
import { PreorderStatus } from "@appTypes/Preorder";
import { StatusBadge } from "./StatusBadge";
import { Tooltip } from "@mui/material";

export const orderStatusBadges: Record<OrderStatus, JSX.Element> = {
	CANCELLED: (
		<Tooltip title={"Заказ отменен."}>
			<StatusBadge color="icon.secondary">Отменен</StatusBadge>
		</Tooltip>
	),
	UNPAID: (
		<Tooltip title={"Заказ не оплачен. Пожалуйста, оплатите заказ."}>
			<StatusBadge color="icon.attention">Не оплачен</StatusBadge>
		</Tooltip>
	),
	ACCEPTED: (
		<Tooltip
			title={
				'Заказ оплачен. Ожидайте смены статуса на "Готов к выдаче" или "Передан в доставку" в зависимости от вашего заказа.'
			}
		>
			<StatusBadge color="warning.main">Оформлен</StatusBadge>
		</Tooltip>
	),
	DELIVERY: (
		<Tooltip title={"Вы можете отследить заказ в службе доставки."}>
			<StatusBadge color="rgb(0, 175, 134)">Передан в доставку</StatusBadge>
		</Tooltip>
	),
	READY_FOR_PICKUP: (
		<Tooltip title={"Заказ ожидает в пункте выдачи."}>
			<StatusBadge color="icon.success">Готов к выдаче</StatusBadge>
		</Tooltip>
	),
	FINISHED: (
		<Tooltip title={"Спасибо за заказ!"}>
			<StatusBadge color="icon.success">Выдан</StatusBadge>
		</Tooltip>
	),
};

export const preorderBadge: JSX.Element = <StatusBadge color="rgb(0, 175, 134)">Предзаказ</StatusBadge>;

export const preorderStatusBadges: Record<PreorderStatus, JSX.Element> = {
	WAITING_FOR_RELEASE: (
		<Tooltip title={"Ожидание производства товаров."}>
			<StatusBadge color="icon.brandSecondary">Ожидание релиза</StatusBadge>
		</Tooltip>
	),
	FOREIGN_SHIPPING: (
		<Tooltip title={"Товары в пути на зарубежный склад."}>
			<StatusBadge color="rgb(0, 175, 134)">Доставка на зарубежный склад</StatusBadge>
		</Tooltip>
	),
	LOCAL_SHIPPING: (
		<Tooltip title={"Товары в пути на наш склад."}>
			<StatusBadge color="rgb(0, 175, 134)">Доставка на склад РФ</StatusBadge>
		</Tooltip>
	),
	DISPATCH: (
		<Tooltip title={"Товары уже прибыли к нам на склад. Выберите способ доставки, если ещё не сделали этого."}>
			<StatusBadge color="icon.success">Идёт выдача предзаказов</StatusBadge>
		</Tooltip>
	),
	FINISHED: (
		<Tooltip title={"Предзаказ завершен."}>
			<StatusBadge color="icon.success">Завершен</StatusBadge>
		</Tooltip>
	),
};
