import { Box, Button, IconButton, Modal, TextField, Typography } from "@mui/material";
import { CDEKDeliveryInfo, CDEKWidget } from "./widgets/cdek";
import { Controller, useForm } from "react-hook-form";
import { Delivery, DeliveryPackage, DeliveryPoint, DeliveryService, Recipient } from "@appTypes/Delivery";

import { CDEKDeliveryData } from "@appTypes/CDEK";
import { CardRadio } from "./CardRadio";
import { Close } from "@mui/icons-material";
import cdekLogo from "@assets/SdekLogo.webp";
import mainLogoSmall from "@assets/MainLogoSmall.webp";
import { useEffect, useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { DeliverySchema } from "@schemas/Delivery";

import { MuiTelInput, matchIsValidTel } from "mui-tel-input";
import { phoneOnlyCountries } from "@config/phone";

type DeliveryFormData = {
	recipient: Recipient;
	service: DeliveryService | null;
	point: DeliveryPoint | null;
	cdekDeliveryData: CDEKDeliveryData | null;
};

const DeliveryFormResolver = z
	.object({
		recipient: z.object({
			fullName: z.string({ message: "Укажите ФИО" }).min(2, "ФИО должно быть не менее 2 символов"),
			phone: z
				.string()
				.min(1, { message: "Укажите номер телефона" })
				.refine((value) => matchIsValidTel(value, { onlyCountries: phoneOnlyCountries }), {
					message: "Неверный номер телефона",
				}),
		}),
		service: z.enum(["SELF_PICKUP", "CDEK"], { message: "Укажите способ доставки" }),
		point: z
			.object({
				address: z.string(),
				code: z.string(),
			})
			.nullable(),
	})
	.refine(
		(data) => {
			if (data.service === "CDEK") {
				return data.point !== null;
			}
			return true;
		},
		{
			message: "Укажите адрес доставки",
			path: ["point"],
		}
	);

interface DeliveryFormProps {
	isMobile?: boolean;
	delivery: Delivery | null;
	packages: DeliveryPackage[] | null;
	defaultEditing: boolean;
	canModify: boolean;
	onChange: (data: z.infer<typeof DeliverySchema>) => void;
}

const DeliveryForm: React.FC<DeliveryFormProps> = ({
	isMobile,
	delivery,
	packages,
	defaultEditing,
	canModify,
	onChange,
}) => {
	const {
		control,
		watch,
		setValue,
		handleSubmit,
		reset,
		formState: { isDirty, errors },
	} = useForm<DeliveryFormData>({
		resolver: zodResolver(DeliveryFormResolver),
		defaultValues: delivery
			? {
					recipient: delivery.recipient,
					service: delivery.service,
					point: delivery.point,
					cdekDeliveryData: null,
			  }
			: {
					recipient: {
						fullName: "",
						phone: "",
					},
					point: null,
					service: null,
					cdekDeliveryData: null,
			  },
	});

	const service = watch("service");
	const deliveryPoint = watch("point");
	const cdekDeliveryData = watch("cdekDeliveryData");

	const [isEditing, setIsEditing] = useState(defaultEditing);
	const [cdekWidgetOpen, setCdekWidgetOpen] = useState(false);

	useEffect(() => {
		if (delivery) {
			reset(delivery);
		}
	}, [reset, delivery]);

	const handleSave = (data: DeliveryFormData) => {
		onChange(DeliverySchema.parse(data));
		setIsEditing(false);
	};

	const handleStopEditing = () => {
		reset();
		setIsEditing(false);
	};

	const handleChooseCdekAddress = (data: CDEKDeliveryData) => {
		setValue("cdekDeliveryData", data);
		setValue("point", {
			code: data.address.code,
			address: `${data.address.city}, ${data.address.address}`,
		});
		setCdekWidgetOpen(false);
	};

	return (
		<>
			<Modal
				open={cdekWidgetOpen && isEditing}
				onClose={() => setCdekWidgetOpen(false)}
				aria-labelledby="cdek-widget-title"
				aria-describedby="cdek-widget-description"
				keepMounted={false}
				sx={{ justifyContent: "center", alignItems: "center", padding: 3 }}
			>
				<Box
					position={"relative"}
					width={"100%"}
					height={"100%"}
					bgcolor={"white"}
					borderRadius={3}
					padding={2}
					boxShadow={24}
				>
					<IconButton
						sx={{ zIndex: 10000, width: 48, height: 48, position: "absolute", top: 0, right: 0 }}
						onClick={() => setCdekWidgetOpen(false)}
					>
						<Close sx={{ width: 40, height: 40 }} />
					</IconButton>
					<CDEKWidget
						onCalculate={(tariffs, address) => {
							console.log("%cCalculate function", "color: yellow", {
								tariffs: tariffs,
								address: address,
							});
						}}
						onChoose={(deliveryType, tariff, address) => {
							handleChooseCdekAddress({ deliveryType, tariff, address });
						}}
						onReady={() => {}}
						// TODO: mass vs weight
						packages={
							packages?.map((pkg) => ({
								width: pkg.width,
								height: pkg.height,
								length: pkg.length,
								weight: pkg.weight,
							})) || []
						}
					/>
				</Box>
			</Modal>
			<form className="section" onSubmit={handleSubmit(handleSave)}>
				<div className="gap-2 d-f fd-c">
					<Typography variant={"h5"}>{isMobile ? "Доставка" : "Адрес и способ доставки"} </Typography>
					<Box>
						<CardRadio
							isChecked={service === "SELF_PICKUP"}
							disabled={!isEditing}
							onChange={() => setValue("service", "SELF_PICKUP")}
							mainText={"Самовывоз"}
							imgUrl={mainLogoSmall}
						/>

						<CardRadio
							isChecked={service === "CDEK"}
							disabled={!isEditing}
							onChange={() => setValue("service", "CDEK")}
							mainText={"СДЭК"}
							subText={"Оплата доставки при получении в пункте выдачи."}
							imgUrl={cdekLogo}
						/>
					</Box>

					{service === "SELF_PICKUP" && (
						<Box display={"flex"} flexDirection={"column"} gap={"8px"}>
							<Typography variant="h6">Самовывоз</Typography>
						</Box>
					)}

					{service === "CDEK" && (
						<Box display={"flex"} flexDirection={"column"} gap={"8px"}>
							{deliveryPoint && !cdekDeliveryData ? (
								<Typography>
									{deliveryPoint.address} - {deliveryPoint.code}
								</Typography>
							) : cdekDeliveryData ? (
								<CDEKDeliveryInfo {...cdekDeliveryData} />
							) : (
								<Typography variant="h6">Адрес не выбран</Typography>
							)}
							{isEditing && (
								<Button
									variant="text"
									color="warning"
									size="medium"
									sx={{ width: "fit-content", padding: 0, color: "warning.main" }}
									onClick={() => setCdekWidgetOpen(true)}
								>
									{cdekDeliveryData ? "Изменить" : "Выбрать"}
								</Button>
							)}
						</Box>
					)}
					{errors.service && (
						<Typography color="error" variant="body1">
							{errors.service.message}
						</Typography>
					)}
					{errors.point && (
						<Typography color="error" variant="body1">
							{errors.point.message}
						</Typography>
					)}
				</div>

				<div>
					<Typography variant="h5">Получатель</Typography>
					<div
						className="gap-1 ai-bl d-f"
						style={{
							flexDirection: isMobile ? "column" : "row",
							paddingTop: isMobile ? "16px" : 0,
						}}
					>
						<Controller
							name="recipient.phone"
							control={control}
							render={({ field: { value, ...fieldProps }, fieldState: { error } }) => (
								<MuiTelInput
									{...fieldProps}
									disabled={!isEditing}
									fullWidth
									label="Номер телефона"
									defaultCountry={"RU"}
									onlyCountries={phoneOnlyCountries}
									langOfCountryName="RU"
									value={value}
									error={!!error}
									helperText={error?.message}
								/>
							)}
						/>

						<Controller
							name="recipient.fullName"
							control={control}
							render={({ field, fieldState: { error } }) => (
								<TextField
									{...field}
									disabled={!isEditing}
									label="ФИО"
									variant="outlined"
									fullWidth
									margin="normal"
									error={!!error}
									helperText={error?.message}
								/>
							)}
						/>
					</div>
				</div>

				{isEditing ? (
					<div className="gap-2 d-f fd-r">
						<Button
							sx={{ width: "max-content" }}
							disabled={!isDirty}
							type="submit"
							variant="contained"
							color="success"
						>
							{!delivery ? "Подтвердить" : "Сохранить"}
						</Button>
						{delivery && (
							<Button
								sx={{ width: "max-content" }}
								onClick={handleStopEditing}
								variant="contained"
								color="error"
							>
								Отменить
							</Button>
						)}
					</div>
				) : (
					canModify && (
						<>
							<Button
								sx={{ width: "max-content" }}
								onClick={() => setIsEditing(true)}
								variant="contained"
								color="primary"
							>
								Изменить
							</Button>
						</>
					)
				)}
			</form>
		</>
	);
};

export { DeliveryForm };
