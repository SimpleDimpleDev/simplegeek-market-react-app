import { OrderStatus } from "@appTypes/Order";
import { PreorderStatus } from "@appTypes/Preorder";
import { StatusBadge } from "./StatusBadge";

export const orderStatusBadges: Record<OrderStatus, JSX.Element> = {
	CANCELLED: <StatusBadge color="icon.secondary">Отменен</StatusBadge>,
	UNPAID: <StatusBadge color="icon.attention">Не оплачен</StatusBadge>,
	ACCEPTED: <StatusBadge color="warning.main">Оформлен</StatusBadge>,
	DELIVERY: <StatusBadge color="rgb(0, 175, 134)">Передан в доставку</StatusBadge>,
	READY_FOR_PICKUP: <StatusBadge color="icon.success">Готов к выдаче</StatusBadge>,
	FINISHED: <StatusBadge color="icon.success">Выдан</StatusBadge>,
};

export const preorderStatusBadges: Record<PreorderStatus, JSX.Element> = {
	NEW: <StatusBadge color="primary.main">Новый</StatusBadge>,
	FUNDING: <StatusBadge color="icon.brandSecondary">Сбор</StatusBadge>,
	WAITING_FOR_RELEASE: <StatusBadge color="icon.brandSecondary">Ожидание релиза</StatusBadge>,
	FOREIGN_SHIPPING: <StatusBadge color="icon.brandSecondary">Доставка на зарубежный склад</StatusBadge>,
	LOCAL_SHIPPING: <StatusBadge color="icon.brandSecondary">Доставка на склад РФ</StatusBadge>,
	DISPATCH: <StatusBadge color="icon.brandSecondary">На складе</StatusBadge>,
	FINISHED: <StatusBadge color="icon.brandSecondary">Завершен</StatusBadge>,
};

