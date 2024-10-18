import { z } from "zod";

export const AttachmentGetSchema = z
	.object({
		index: z.number(),
		url: z.string(),
	})
	.describe("AttachmentGet");
