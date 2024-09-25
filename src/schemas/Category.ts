import { z } from "zod";
import { IdSchema } from "./Primitives";
import { AttachmentSchema } from "./Attachment";

const CategoryBaseSchema = z.object({
	title: z.string(),
	link: z.string(),
});

export const CategoryShopSchema = CategoryBaseSchema.extend({
	id: IdSchema,
	icon: AttachmentSchema,
	banner: AttachmentSchema,
});
