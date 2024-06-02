import { z } from "zod";

// We're keeping a simple non-relational schema here.
// IRL, you will have a schema for your data models.
export const visitSchema = z.object({
  id: z.string(),
  date: z.string(),
  status: z.string(),
  note: z.string().nullable().optional(),
  Appointment: z.object({}),
});

export type visit = z.infer<typeof visitSchema>;
