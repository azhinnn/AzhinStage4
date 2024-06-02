import { z } from "zod";

// We're keeping a simple non-relational schema here.
// IRL, you will have a schema for your data models.
export const appointmentSchema = z.object({
  id: z.number(),
  name: z.string(),
  phone: z.string(),
  status: z.string(),
  Doctor: z.object({
    id: z.number(),
    name: z.string(),
    image: z.string().nullable(),
  }),
  Patient: z.object({
    id: z.number(),
    name: z.string(),
    phone: z.string(),
  }),
  DoctorType: z.object({
    id: z.number(),
    name: z.string(),
    DoctorField: z.object({
      id: z.number(),
      name: z.string(),
    }),
  }),
  Visit: z
    .object({
      id: z.number(),
      date: z.string(),
    })
    .array(),
  visitDate: z.string(),
});

export type appointment = z.infer<typeof appointmentSchema>;
