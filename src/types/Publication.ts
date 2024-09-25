import { z } from "zod";
import { PublicationShopSchema } from "../schemas/Publication";

export type PublicationShop = z.infer<typeof PublicationShopSchema>;

