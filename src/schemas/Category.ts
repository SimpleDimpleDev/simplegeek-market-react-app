import { z } from "zod";
import { IdSchema } from "./Primitives";
import { AttachmentGetSchema } from "./Attachment";

const CategoryBaseSchema = z
	.object({
		title: z.string(),
		link: z.string(),
	})
	.describe("CategoryBase");

export const CategoryGetSchema = CategoryBaseSchema.extend({
	id: IdSchema,
	icon: AttachmentGetSchema,
	banner: AttachmentGetSchema,
}).describe("CategoryGet");
