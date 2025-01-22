import { CDEKDeliveryData } from "@appTypes/CDEK";
import { Recipient, DeliveryService, DeliveryPoint, Delivery, DeliveryPackage } from "@appTypes/Delivery";
import { PHONE_ONLY_COUNTRIES } from "@config/phone";
import { zodResolver } from "@hookform/resolvers/zod";
import { Close } from "@mui/icons-material";
import { Box, Button, Checkbox, FormControlLabel, IconButton, Modal, TextField, Typography } from "@mui/material";
import { DeliverySchema } from "@schemas/Delivery";
import { matchIsValidTel, MuiTelInput } from "mui-tel-input";
import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { CDEKDeliveryInfo, CDEKWidget } from "./widgets/cdek";
import { CardRadio } from "./CardRadio";

import cdekLogo from "@assets/SdekLogo.webp";
import mainLogoSmall from "@assets/MainLogoSmall.webp";
import { useGetSavedDeliveryQuery } from "@api/shop/profile";

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
				.refine((value) => matchIsValidTel(value, { onlyCountries: PHONE_ONLY_COUNTRIES }), {
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

type DeliveryFormRef = {
	submit: () => void;
};

type DeliveryFormProps = {
	isMobile?: boolean;
	defaultDelivery?: Delivery | null;
	packages: DeliveryPackage[];
	onSubmit: (delivery: Delivery, saveDelivery: boolean) => void;
};

const DeliveryForm = forwardRef<DeliveryFormRef, DeliveryFormProps>(
	({ isMobile, defaultDelivery, packages, onSubmit }: DeliveryFormProps, ref) => {
		console.log("DeliveryForm defaultDelivery", defaultDelivery);
		const {
			control,
			watch,
			setValue,
			handleSubmit,
			reset,
			formState: { errors },
		} = useForm<DeliveryFormData>({
			resolver: zodResolver(DeliveryFormResolver),
			defaultValues: defaultDelivery
				? {
						recipient: defaultDelivery.recipient,
						point: defaultDelivery.point,
						service: defaultDelivery.service,
						cdekDeliveryData: null,
				  }
				: {
						recipient: {
							fullName: "",
							phone: "",
						},
						service: null,
						point: null,
						cdekDeliveryData: null,
				  },
		});

		const { data: userSavedDelivery } = useGetSavedDeliveryQuery();

		useImperativeHandle(ref, () => ({
			submit: handleSubmit((data: DeliveryFormData) => {
				onSubmit(DeliverySchema.parse(data), saveDelivery);
			}),
		}));

		useEffect(() => {
			if (defaultDelivery) {
				reset({
					recipient: defaultDelivery.recipient,
					service: defaultDelivery.service,
					point: defaultDelivery.point,
					cdekDeliveryData: null,
				});
			}
		}, [defaultDelivery, reset]);

		useEffect(() => {
			if (defaultDelivery) return;
			if (userSavedDelivery) {
				reset({
					recipient: userSavedDelivery.recipient,
					service: userSavedDelivery.service,
					point: userSavedDelivery.point,
					cdekDeliveryData: null,
				});
			}
		}, [userSavedDelivery, defaultDelivery, reset]);

		const service = watch("service");
		const deliveryPoint = watch("point");
		const cdekDeliveryData = watch("cdekDeliveryData");

		useEffect(() => {
			if (!service) return;
			setValue("point", null);
			setValue("cdekDeliveryData", null);
		}, [service, setValue]);

		const [cdekWidgetOpen, setCdekWidgetOpen] = useState(false);
		const [saveDelivery, setSaveDelivery] = useState(!defaultDelivery);

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
					open={cdekWidgetOpen}
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
							sx={{
								zIndex: 10000,
								width: 48,
								height: 48,
								position: "absolute",
								top: 0,
								right: 0,
							}}
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
							packages={packages}
						/>
					</Box>
				</Modal>
				<form className="section">
					<div className="gap-2 d-f fd-c">
						<Typography variant={"h5"}>{isMobile ? "Доставка" : "Адрес и способ доставки"} </Typography>
						<Box>
							<CardRadio
								isChecked={service === "SELF_PICKUP"}
								onChange={() => setValue("service", "SELF_PICKUP")}
								mainText={"Самовывоз"}
								imgUrl={mainLogoSmall}
							/>

							<CardRadio
								isChecked={service === "CDEK"}
								onChange={() => setValue("service", "CDEK")}
								mainText={"СДЭК"}
								subText={"Оплата доставки при получении в пункте выдачи."}
								imgUrl={cdekLogo}
							/>
						</Box>

						{service === "SELF_PICKUP" && (
							<Box display={"flex"} flexDirection={"column"} gap={"8px"}>
								<Typography variant="h6">Самовывоз</Typography>
								<Typography>
									г. Москва, м. Красные Ворота, ул. Новая Басманная, д.12, с2 (выход из метро №2)
									<br />
									Время работы: пн-пт 13:00 - 21:00
								</Typography>
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

								<Button
									variant="contained"
									sx={{ width: "fit-content" }}
									onClick={() => setCdekWidgetOpen(true)}
								>
									{cdekDeliveryData ? "Изменить" : "Выбрать"}
								</Button>
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
										fullWidth
										label="Номер телефона"
										defaultCountry={"RU"}
										onlyCountries={PHONE_ONLY_COUNTRIES}
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

					<FormControlLabel
						control={
							<Checkbox checked={saveDelivery} onChange={(_, checked) => setSaveDelivery(checked)} />
						}
						label={`${defaultDelivery ? "Обновить" : "Сохранить"} способ доставки для следующих заказов.`}
					/>
				</form>
			</>
		);
	}
);

export { DeliveryForm };
export type { DeliveryFormRef };
