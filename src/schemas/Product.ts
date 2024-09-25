import { z } from "zod";
import { FilterGroupGetSchema } from "./FilterGroup";
import { PhysicalPropertiesSchema } from "./PhysicalProperties";
import { CategoryShopSchema } from "./Category";
import { AttachmentSchema } from "./Attachment";

export const ProductShopSchema = z.object({
	category: CategoryShopSchema,
	title: z.string(),
	images: AttachmentSchema.array(),
	description: z.string().nullable(),
	filterGroups: FilterGroupGetSchema.array(),
	physicalProperties: PhysicalPropertiesSchema.nullable(),
});
