import { z } from "zod";
import { FilterGroupGetSchema } from "./FilterGroup";
import { PhysicalPropertiesSchema } from "./PhysicalProperties";
import { CategoryGetSchema } from "./Category";
import { AttachmentGetSchema } from "./Attachment";

export const ProductGetSchema = z
	.object({
		category: CategoryGetSchema,
		title: z.string(),
		images: AttachmentGetSchema.array(),
		description: z.string().nullable(),
		filterGroups: FilterGroupGetSchema.array(),
		physicalProperties: PhysicalPropertiesSchema.nullable(),
	})
	.describe("ProductGet");
