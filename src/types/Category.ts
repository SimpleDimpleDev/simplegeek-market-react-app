import { z } from "zod";
import { CategoryGetSchema } from "@schemas/Category";

export type CategoryGet = z.infer<typeof CategoryGetSchema>;
