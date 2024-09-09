import { z } from "zod";
import { PublicationCreateSchema, PublicationShopSchema, PublicationAdminSchema } from "../schemas/Publication";

export type PublicationCreate = z.infer<typeof PublicationCreateSchema>;
export type PublicationShop = z.infer<typeof PublicationShopSchema>;
export type PublicationAdmin = z.infer<typeof PublicationAdminSchema>;
