import { z } from "zod";
import { FilterGroupNewSchema, FilterGroupGetSchema } from "./FilterGroup";
import { PhysicalPropertiesSchema } from "./PhysicalProperties";
import { CategoryShopSchema } from "./Category";
import { AdminGetBaseSchema, ImageEditPropsSchema } from "./Admin";

export const ProductCreateSchema = z.object({
	title: z.string(),
	description: z.string().nullable(),
	categoryId: z.string(),
	physicalProperties: PhysicalPropertiesSchema.nullable(),
	filterGroups: FilterGroupNewSchema.array(),
	images: z.object({ file: z.instanceof(File), properties: ImageEditPropsSchema }).array(),
});

export const ProductShopSchema = z.object({
	category: CategoryShopSchema,
	title: z.string(),
	images: z.string().array(),
	description: z.string().nullable(),
	filterGroups: FilterGroupGetSchema.array(),
	physicalProperties: PhysicalPropertiesSchema.nullable(),
});

export const ProductAdminSchema = AdminGetBaseSchema.merge(ProductShopSchema).extend({
	// Ya ponyal
	isPublished: z.boolean().default(true),
});
