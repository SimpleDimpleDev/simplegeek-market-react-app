import { z } from "zod";
import { UserAuthoritySchema } from "../schemas/User";

export type UserAuthority = z.infer<typeof UserAuthoritySchema>;
