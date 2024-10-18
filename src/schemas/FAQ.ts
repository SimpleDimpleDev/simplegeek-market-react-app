import { z } from "zod";

export const FAQItemGetSchema = z
	.object({
		question: z.string(),
		answer: z.string(),
	})
	.describe("FAQItemGet");

export const FAQItemListGetSchema = z
	.object({
		items: FAQItemGetSchema.array(),
	})
	.describe("FAQItemListGet");
