import { z } from "zod";

export const UserAuthoritySchema = z.object({
	email: z.string(),
	isAdmin: z.boolean(),
});
