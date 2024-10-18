import { z } from "zod";

import { IdSchema, ISOToDateSchema } from "./Primitives";

export const InvoiceGetSchema = z
	.object({
		id: IdSchema,
		amount: z.number(),
		isPaid: z.boolean(),
		expiresAt: ISOToDateSchema.nullable(),
	})
	.describe("InvoiceGet");

export const CreditPaymentInfoGetSchema = z
	.object({
		sum: z.number(),
		deadline: ISOToDateSchema,
	})
	.describe("CreditPaymentInfoGet");

export const CreditInfoGetSchema = z
	.object({
		deposit: z.number(),
		payments: CreditPaymentInfoGetSchema.array(),
	})
	.describe("CreditInfoGet");

export const CreditPaymentGetSchema = z
	.object({
		invoice: InvoiceGetSchema,
		deadline: ISOToDateSchema,
	})
	.describe("CreditPaymentGet");

export const CreditGetSchema = z
	.object({
		deposit: z.number(),
		payments: CreditPaymentGetSchema.array(),
	})
	.describe("CreditGet");
