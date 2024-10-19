import { z } from "zod";
import {
	CDEKDeliveryDataFullSchema,
	CDEKDeliveryTypeSchema,
	CDEKDoorAddressSchema,
	CDEKOfficeAddressSchema,
	CDEKTariffSchema,
} from "@schemas/CDEK";

export type CDEKDeliveryType = z.infer<typeof CDEKDeliveryTypeSchema>;
export type CDEKDoorAddress = z.infer<typeof CDEKDoorAddressSchema>;
export type CDEKOfficeAddress = z.infer<typeof CDEKOfficeAddressSchema>;
export type CDEKTariff = z.infer<typeof CDEKTariffSchema>;
export type CDEKDeliveryData = z.infer<typeof CDEKDeliveryDataFullSchema>;
