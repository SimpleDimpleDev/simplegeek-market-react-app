import { z } from "zod";
import { UserAdminSchema, UserAuthoritySchema } from "../schemas/User";

export type UserAuthority = z.infer<typeof UserAuthoritySchema>;
export type UserAdmin = z.infer<typeof UserAdminSchema>;
