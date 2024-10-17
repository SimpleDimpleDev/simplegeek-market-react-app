import { z } from "zod";

import { IdSchema, ISOToDateSchema } from "./Primitives";

export const PaymentUrlSchema = z.object({
	paymentUrl: z.string().url(),
});

export const InvoiceShopSchema = z.object(
	{
		id: IdSchema,
		amount: z.number(),
		isPaid: z.boolean(),
		expiresAt: ISOToDateSchema.nullable(),
	},
	{ description: "Invoice" }
);

export const CreditPaymentInfo = z.object(
	{
		sum: z.number(),
		deadline: ISOToDateSchema,
	},
	{ description: "CreditPaymentInfo" }
);

export const CreditInfoSchema = z.object(
	{
		deposit: z.number(),
		payments: CreditPaymentInfo.array(),
	},
	{ description: "CreditInfo" }
);

export const CreditPayment = z.object(
	{
		invoice: InvoiceShopSchema,
		deadline: ISOToDateSchema,
	},
	{ description: "CreditPayment" }
);

export const CreditSchema = z.object(
	{
		deposit: z.number(),
		payments: CreditPayment.array(),
	},
	{ description: "OrderCredit" }
);
