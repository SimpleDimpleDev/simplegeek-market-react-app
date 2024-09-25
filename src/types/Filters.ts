import { z } from "zod";
import { FilterGroupGetSchema } from "../schemas/FilterGroup";

export type FilterGroupGet = z.infer<typeof FilterGroupGetSchema>;
