import { z } from "zod";

export const IdSchema = z.string({ description: "Id" }).uuid();

export const ISOToDateSchema = z.string({ description: "ISO Date" }).datetime().pipe(z.coerce.date());
