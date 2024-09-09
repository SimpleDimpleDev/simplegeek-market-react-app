import { z } from "zod";
import { ImageEditPropsSchema } from "~/schemas/Admin";

export type ImageEditProps = z.infer<typeof ImageEditPropsSchema>;
