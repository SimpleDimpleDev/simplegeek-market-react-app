import { z } from "zod";
import { CategoryAdminSchema, CategoryCreateSchema } from "~/schemas/Category";
import { FAQItemSchema } from "~/schemas/FAQ";
import { FilterGroupAdminSchema, FilterGroupCreateSchema } from "~/schemas/FilterGroup";
import { OrderAdminSchema } from "~/schemas/Order";
import { IdSchema } from "~/schemas/Primitives";
import { ProductAdminSchema, ProductCreateSchema } from "~/schemas/Product";
import { PublicationAdminSchema, PublicationCreateSchema } from "~/schemas/Publication";
import { UserAdminSchema } from "~/schemas/User";

export const CreateResponseSchema = z.object({
	id: IdSchema,
});

export const FAQItemTableAdminResponseSchema = z.object({
	items: FAQItemSchema.array(),
});

export const CategoryCreateAdminRequestSchema = CategoryCreateSchema;
export const CategoryListAdminResponseSchema = z.object({
	items: CategoryAdminSchema.array(),
});

export const FilterGroupCreateAdminRequestSchema = FilterGroupCreateSchema;
export const FilterGroupListAdminResponseSchema = z.object({
	items: FilterGroupAdminSchema.array(),
});

export const ProductCreateAdminRequestSchema = ProductCreateSchema;
export const ProductGetAdminResponseSchema = ProductAdminSchema;
export const ProductListGetAdminResponseSchema = z.object({
	items: ProductAdminSchema.array(),
});

export const PublicationCreateAdminRequestSchema = PublicationCreateSchema;
export const PublicationGetAdminResponseSchema = PublicationAdminSchema;
export const PublicationListGetAdminResponseSchema = z.object({
	items: PublicationAdminSchema.array(),
});
export const OrderGetAdminResponseSchema = OrderAdminSchema;
export const OrderListGetAdminResponseSchema = z.object({
	items: OrderAdminSchema.array(),
});
export const UserGetAdminResponseSchema = UserAdminSchema;
export const UserListGetAdminResponseSchema = z.object({
	items: UserAdminSchema.array(),
});
