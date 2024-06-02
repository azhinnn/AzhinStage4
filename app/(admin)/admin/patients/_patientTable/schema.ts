import { z } from "zod";

// We're keeping a simple non-relational schema here.
// IRL, you will have a schema for your data models.
export const patientSchema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string().nullable(),
  phone: z.string(),
  age: z.number(),
  gender: z.string(),
  City: z
    .object({
      id: z.number(),
      name: z.string(),
    })
    .nullable()
    .optional(),
  street: z.string().nullable().optional(),
  image: z.string().nullable(),
  note: z.string().nullable().optional(),
});

export type patient = z.infer<typeof patientSchema>;
