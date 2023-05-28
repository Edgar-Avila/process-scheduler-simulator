import { z } from "zod";
import { ProcessSchema } from "./process";

export const TimestampSchema = z.object({
  process: ProcessSchema.optional(),
  time: z.number().int().positive(),
});

export type Timestamp = z.infer<typeof TimestampSchema>;