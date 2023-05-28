import { z } from "zod";
import { ProcessSchema } from "./process";

export const IntervalSchema = z.object({
  process: ProcessSchema.optional(),
  startTime: z.number().int().positive(),
  duration: z.number().int().positive(),
});

export type Interval = z.infer<typeof IntervalSchema>;