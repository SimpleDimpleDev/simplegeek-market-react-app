import { z } from "zod";
import { FilterGroupGetSchema } from "@schemas/FilterGroup";

export type FilterGroupGet = z.infer<typeof FilterGroupGetSchema>;

export type CheckedFilter = {
	filterGroupId: string;
	id: string;
};
export type AvailabilityFilter = boolean;
export type PriceRangeFilter = [number, number];
export type PreorderFilter = string | null;
