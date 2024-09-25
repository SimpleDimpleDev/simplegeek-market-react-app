import { z } from "zod";

import { IdSchema, ISOToDateSchema } from "./Primitives";

export const BaseCreditPaymentInfo = z.object({
	sum: z.number(),
	deadline: ISOToDateSchema,
});

export const CreditInfoSchema = z.object({
	payments: BaseCreditPaymentInfo.array(),
});

export const InvoiceShopSchema = z.object({
	id: IdSchema,
	amount: z.number(),
	isPaid: z.boolean(),
	expiresAt: ISOToDateSchema.nullable(),
});

export const CreditShopSchema = CreditInfoSchema.extend({
	paidParts: z.number(),
	invoice: InvoiceShopSchema.nullable(),
});

