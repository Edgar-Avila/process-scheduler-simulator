import { z } from "zod";
import { ProcessSchema } from "./process";

export const ConfigSchema = z.object({
  algorithm: z.enum(["FCFS", "SJF", "RR", "PS"]),
  burstTime: z.number().int().positive(),
  processes: z.array(ProcessSchema).min(2),
  quantum: z.number().int().positive().optional(),
});

export type Config = z.infer<typeof ConfigSchema>;
