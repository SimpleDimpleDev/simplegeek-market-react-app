import { CreditInfoSchema, CreditSchema } from "../schemas/Payment";
import { z } from "zod";

export type CreditInfo = z.infer<typeof CreditInfoSchema>;
export type OrderCredit = z.infer<typeof CreditSchema>;
