import { z } from "zod";

// We're keeping a simple non-relational schema here.
// IRL, you will have a schema for your data models.
export const transactionchema = z.object({
  id: z.number(),
  type: z.enum(["payment", "payback"]),
  amount: z.number(),
  date: z.string(),
  Appointment: z.object({
    id: z.number(),
    date: z.string(),
    Doctor: z.object({
      id: z.number(),
      name: z.string(),
      image: z.string().optional().nullable(),
    }),
    Patient: z.object({
      id: z.number(),
      name: z.string(),
      phone: z.string(),
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
  }),
});

export type transaction = z.infer<typeof transactionchema>;
