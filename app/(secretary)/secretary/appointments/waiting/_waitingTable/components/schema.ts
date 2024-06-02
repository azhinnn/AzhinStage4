import { z } from "zod";

// We're keeping a simple non-relational schema here.
// IRL, you will have a schema for your data models.
export const waitingSchema = z.object({
  id: z.number(),
  createdAt: z.string(),
  status: z.string(),
  name: z.string(),
  Patient: z.object({
    id: z.number(),
    name: z.string(),
    phone: z.string(),
  }),
  Doctor: z.object({
    id: z.number(),
    name: z.string(),
    phone: z.string(),
    image: z.string().optional().nullable(),
  }),
  DoctorType: z.object({
    id: z.number(),
    name: z.string(),
  }),
});

export type waiting = z.infer<typeof waitingSchema>;
