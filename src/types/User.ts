import { z } from "zod";
import { UserSchema } from "@schemas/User";

export type User = z.infer<typeof UserSchema>;
