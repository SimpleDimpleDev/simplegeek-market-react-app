import { Typography } from "@mui/material";
import { CDEKFromPoint, CDEKWidgetServicePath, YandexMapsApiKey, defaultLocation, tariffs } from "@config/cdek";
import React from "react";
import {
	CDEKDeliveryData,
	CDEKDeliveryType,
	CDEKOfficeAddress,
	CDEKTariff,
} from "@appTypes/CDEK";

declare global {
	interface Window {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		CDEKWidget: any; // You can replace `any` with a more specific type if you have one
	}
}

interface CDEKPackage {
	width?: number;
	height?: number;
	length?: number;
	weight: number;
}

type CalculateCDEKTariffs = {
	office: {
		tariff_code: number;
		tariff_name: string;
		tariff_description: string;
		delivery_mode: number;
		period_min: number;
		period_max: number;
		delivery_sum: number;
	}[];
	door: {
		tariff_code: number;
		tariff_name: string;
		tariff_description: string;
		delivery_mode: number;
		period_min: number;
		period_max: number;
		delivery_sum: number;
	}[];
	pickup: {
		tariff_code: number;
		tariff_name: string;
		tariff_description: string;
		delivery_mode: number;
		period_min: number;
		period_max: number;
		delivery_sum: number;
	}[];
};

type CalculateCDEKAddress = { code?: number; address?: string };

type CalculateCallback = (tariffs: CalculateCDEKTariffs, address: CalculateCDEKAddress) => void;

type ChooseCallback = (deliveryType: CDEKDeliveryType, tariff: CDEKTariff, address: CDEKOfficeAddress) => void;

interface CdekWidgetProps {
	onReady: () => void;
	onCalculate: CalculateCallback;
	onChoose: ChooseCallback;
	packages: CDEKPackage[];
}

const CDEKWidget = ({ onCalculate, onChoose, packages }: CdekWidgetProps) => {
	React.useEffect(() => {
		const script = document.createElement("script");
		script.type = "text/javascript";
		script.async = true;
		console.log("init widget", {packages});
		script.onload = () => {
			new window.CDEKWidget({
				from: CDEKFromPoint,
				root: "cdek-map",
				apiKey: YandexMapsApiKey,
				servicePath: CDEKWidgetServicePath,
				hideDeliveryOptions: {
					office: false,
					door: true,
				},
				debug: true,
				goods: packages,
				defaultLocation: defaultLocation,
				lang: "rus",
				currency: "RUB",
				tariffs: tariffs,
				onReady: console.log("onReady"),
				onCalculate: onCalculate,
				onChoose: onChoose,
			});
		};

		script.src = "https://cdn.jsdelivr.net/npm/@cdek-it/widget@3";
		document.head.appendChild(script);

		return () => {
			document.head.removeChild(script);
		};
	}, [onCalculate, onChoose, packages]);

	return <div id="cdek-map" style={{ width: "100%", height: "100%" }}></div>;
};

const CDEKDeliveryInfo: React.FC<CDEKDeliveryData> = ({ deliveryType, tariff, address }) => {
	let AddressInfo;

	if (deliveryType === "office") {
		const definedAddress = address as CDEKOfficeAddress;
		AddressInfo = () => (
			<>
				<Typography variant={"body1"}>
					Адрес: {definedAddress.city} {definedAddress.address}
				</Typography>
				<Typography variant={"body1"}>Время работы: {definedAddress.work_time}</Typography>
			</>
		);
	} else {
		console.error("Unknown delivery type");
		return (
			<Typography variant={"body1"} color={"error"}>
				Что-то пошло не так
			</Typography>
		);
	}

	return (
		<div>
			<Typography variant={"h6"}>СДЭК {tariff.tariff_name}</Typography>
			<Typography variant={"body1"}>Примерная стоимость доставки: {tariff.delivery_sum} ₽</Typography>
			<AddressInfo />
		</div>
	);
};

export { CDEKWidget, CDEKDeliveryInfo };
