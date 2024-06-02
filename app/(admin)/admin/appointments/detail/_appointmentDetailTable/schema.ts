import { z } from "zod";

export const visitSchema = z.object({
  id: z.string(),
  date: z.string(),
  status: z.string(),
  note: z.string().nullable().optional(),
});

export type visit = z.infer<typeof visitSchema>;
