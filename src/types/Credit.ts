import { CreditGetSchema, CreditInfoGetSchema } from "@schemas/Credit";
import { z } from "zod";

export type CreditInfoGet = z.infer<typeof CreditInfoGetSchema>;
export type CreditGet = z.infer<typeof CreditGetSchema>;
