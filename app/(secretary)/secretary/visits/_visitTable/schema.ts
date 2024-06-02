import { z } from "zod";

// We're keeping a simple non-relational schema here.
// IRL, you will have a schema for your data models.
export const visitSchema = z.object({
  pname: z.string(),
  id: z.number(),
  date: z.string(),
  status: z.string(),
  image: z.string().optional().nullable(),
  note: z.string().optional().nullable(),
  Appointment: z.object({
    id: z.number(),
    date: z.string(),
    Doctor: z.object({
      id: z.number(),
      name: z.string(),
      image: z.string().optional().nullable(),
    }),
    DoctorType: z.object({
      id: z.number(),
      name: z.string(),
      price: z.number(),
      DoctorField: z.object({
        id: z.number(),
        name: z.string(),
      }),
    }),
    Patient: z.object({
      id: z.number(),
      name: z.string(),
      email: z.string(),
      phone: z.string(),
    }),

    Transaction: z
      .array(
        z.object({
          id: z.number(),
          amount: z.number(),
        })
      )
      .optional()
      .nullable(),

    Discount: z
      .object({
        id: z.number(),
        code: z.string(),
        percentage: z.number(),
      })
      .optional()
      .nullable(),
  }),
});

export type VisitSchema = z.infer<typeof visitSchema>;
