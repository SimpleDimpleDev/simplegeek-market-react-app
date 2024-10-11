import { z } from "zod";

export const UserSchema = z.object({
	email: z.string(),
	isAdmin: z.boolean(),
});
