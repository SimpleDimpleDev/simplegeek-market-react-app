import { z } from "zod";
import { DeliveryServiceSchema, DeliveryPointSchema, DeliverySchema, RecipientSchema } from "~/schemas/Delivery";

export type Recipient = z.infer<typeof RecipientSchema>;
export type DeliveryService = z.infer<typeof DeliveryServiceSchema>;
export type DeliveryPoint = z.infer<typeof DeliveryPointSchema>;
export type DeliveryCreate = z.infer<typeof DeliverySchema>;
