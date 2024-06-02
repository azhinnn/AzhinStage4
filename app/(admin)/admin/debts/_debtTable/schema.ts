import { z } from "zod";

// We're keeping a simple non-relational schema here.
// IRL, you will have a schema for your data models.
export const debtSchema = z.object({
  id: z.number(),
  date: z.string(),
  Transaction: z.array(
    z.object({
      id: z.number(),
      amount: z.number(),
    })
  ),
  Discount: z
    .object({
      id: z.number(),
      percentage: z.number(),
    })
    .nullable()
    .optional(),
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
});

export type transaction = z.infer<typeof debtSchema>;
