import { z } from "zod";

export const ExpectedApiErrorSchema = z.object({
	title: z.string(),
	message: z.string(),
	details: z.string().array().nullable(),
});
