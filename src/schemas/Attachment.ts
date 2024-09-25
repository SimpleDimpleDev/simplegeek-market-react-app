import { z } from "zod";

export const AttachmentSchema = z.object({
	id: z.string(),
	index: z.number(),
	url: z.string(),
});
