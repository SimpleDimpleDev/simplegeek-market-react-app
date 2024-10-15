import { z } from "zod";

import { IdSchema, ISOToDateSchema } from "./Primitives";

export const PaymentUrlSchema = z.object({
	paymentUrl: z.string().url(),
});

export const BaseCreditPaymentInfo = z.object(
	{
		sum: z.number(),
		deadline: ISOToDateSchema,
	},
	{ description: "BaseCreditPaymentInfo" }
);

export const CreditInfoSchema = z.object(
	{
		payments: BaseCreditPaymentInfo.array(),
	},
	{ description: "CreditInfo" }
);

export const InvoiceShopSchema = z.object(
	{
		id: IdSchema,
		amount: z.number(),
		isPaid: z.boolean(),
		expiresAt: ISOToDateSchema.nullable(),
	},
	{ description: "Invoice" }
);

export const OrderCreditSchema = CreditInfoSchema.extend({
	paidParts: z.number(),
	invoice: InvoiceShopSchema.nullable(),
});
