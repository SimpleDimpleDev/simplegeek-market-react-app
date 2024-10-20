import { ExpectedApiErrorSchema } from "@schemas/Api";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { z } from "zod";

export function isFetchBaseQueryError(error: unknown): error is FetchBaseQueryError {
	return typeof error === "object" && error != null && "status" in error;
}

export function isExpectedApiError(
	error: unknown
): error is { data: z.infer<typeof ExpectedApiErrorSchema> } & FetchBaseQueryError {
	if (!isFetchBaseQueryError(error)) return false;
	if (!error.data || typeof error.data !== "object") return false;
	try {
		ExpectedApiErrorSchema.parse(error.data);
		return true;
	} catch {
		return false;
	}
}
