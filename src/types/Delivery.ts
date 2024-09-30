import { z } from "zod";
import { DeliveryServiceSchema, DeliveryPointSchema, DeliverySelectSchema, RecipientSchema, DeliveryPackageSchema } from "../schemas/Delivery";

export type Recipient = z.infer<typeof RecipientSchema>;
export type DeliveryService = z.infer<typeof DeliveryServiceSchema>;
export type DeliveryPoint = z.infer<typeof DeliveryPointSchema>;
export type DeliveryPackage = z.infer<typeof DeliveryPackageSchema>;
export type DeliverySelect = z.infer<typeof DeliverySelectSchema>;
