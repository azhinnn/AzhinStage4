import { z } from "zod";

// We're keeping a simple non-relational schema here.
// IRL, you will have a schema for your data models.
export const appointmentSchema = z.object({
  id: z.number(),
  name: z.string(),
  phone: z.string(),
  status: z.string(),
  Patient: z.object({
    id: z.number(),
    name: z.string(),
    phone: z.string(),
  }),
  DoctorType: z.object({
    name: z.string(),
  }),
  Visit: z
    .object({
      id: z.number(),
      status: z.string(),
      date: z.date(),
    })
    .array(),
  visitDate: z.date(),
});

export type appointment = z.infer<typeof appointmentSchema>;
