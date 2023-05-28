import { z } from "zod";
import { ProcessSchema } from "./process";

export const ModeSchema = z.enum(["STEP", "ALL"]);
export type Mode = z.infer<typeof ModeSchema>;

export const ConfigSchema = z.object({
  algorithm: z.enum(["FCFS", "SJF", "RR", "PS"]),
  processes: z.array(ProcessSchema).min(2),
  quantum: z.number().int().positive().optional(),
  mode: ModeSchema,
});

export type Config = z.infer<typeof ConfigSchema>;
