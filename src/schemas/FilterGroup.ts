import { z } from "zod";
import { IdSchema } from "./Primitives";

export const FilterGroupGetSchema = z.object(
	{
		id: IdSchema,
		title: z.string(),
		filters: z
			.object({
				id: IdSchema,
				value: z.string(),
			})
			.array()
			.nonempty(),
	},
	{ description: "FilterGroup" }
);
