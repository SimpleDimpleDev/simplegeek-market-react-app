import { z } from "zod";
import { AdminGetBaseSchema } from "./Admin";

export const UserAuthoritySchema = z.object({
	email: z.string(),
	isAdmin: z.boolean(),
});

export const UserAdminSchema = AdminGetBaseSchema.extend({
	email: z.string(),
});
