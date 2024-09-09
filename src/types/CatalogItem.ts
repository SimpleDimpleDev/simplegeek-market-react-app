import { z } from "zod";
import {
	CatalogItemPublishSchema,
	CatalogItemShopSchema,
	CatalogItemAdminSchema,
	CatalogItemsAvailabilitySchema,
} from "../schemas/CatalogItem";
import { PreorderShop } from "./Preorder";

export type CatalogItemPublish = z.infer<typeof CatalogItemPublishSchema>;
export type CatalogItemShop = z.infer<typeof CatalogItemShopSchema>;
export type CatalogItem = CatalogItemShop & {
	preorder: PreorderShop | null;
	publicationLink: string;
};
export type CatalogItemAdmin = z.infer<typeof CatalogItemAdminSchema>;
export type CatalogItemsAvailability = z.infer<typeof CatalogItemsAvailabilitySchema>;
