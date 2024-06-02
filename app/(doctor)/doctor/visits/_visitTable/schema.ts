import { z } from "zod";

// We're keeping a simple non-relational schema here.
// IRL, you will have a schema for your data models.
export const visitSchema = z.object({
  name: z.string(),
  phone: z.string(),
  id: z.number(),
  date: z.date(),
  image: z.string().optional().nullable(),
  status: z.string(),
  note: z.string().optional().nullable(),
  Appointment: z.object({
    id: z.number(),
    DoctorType: z.object({
      id: z.number(),
      name: z.string(),
      price: z.number(),
    }),
    Patient: z.object({
      id: z.number(),
      name: z.string(),
      email: z.string(),
      phone: z.string(),
    }),
    Discount: z
      .object({
        id: z.number(),
        code: z.string(),
        percentage: z.number(),
      })
      .optional()
      .nullable(),
    Transaction: z
      .object({
        id: z.number(),
        amount: z.number(),
      })
      .array(),
  }),
});

export type VisitSchema = z.infer<typeof visitSchema>;
