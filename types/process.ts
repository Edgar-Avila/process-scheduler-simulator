import { z } from "zod";

export const ProcessSchema = z.object({
  id: z.number().int().nonnegative(),
  burstTime: z.number().int().positive(),
  arrivalTime: z.number().int().nonnegative(),
});

export type Process = z.infer<typeof ProcessSchema>;