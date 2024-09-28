import { z } from "zod";

export const AttachmentSchema = z.object({
	index: z.number(),
	url: z.string(),
});
