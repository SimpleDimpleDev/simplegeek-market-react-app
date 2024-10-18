import { z } from "zod";
import { PublicationGetSchema } from "@schemas/Publication";

export type PublicationGet = z.infer<typeof PublicationGetSchema>;

