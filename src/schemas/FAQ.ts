import { z } from "zod";

import { IdSchema } from "./Primitives";

export const FAQItemSchema = z.object(
	{
		id: IdSchema,
		question: z.string().min(1, { message: "Введите вопрос" }),
		answer: z.string().min(1, { message: "Введите ответ" }),
	},
	{ description: "FAQItem" }
);
