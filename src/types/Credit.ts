import { CreditInfoSchema, OrderCreditSchema } from "../schemas/Payment";
import { z } from "zod";

export type CreditInfo = z.infer<typeof CreditInfoSchema>;
export type OrderCredit = z.infer<typeof OrderCreditSchema>;
