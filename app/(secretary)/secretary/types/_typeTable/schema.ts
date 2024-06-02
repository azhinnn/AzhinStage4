import { z } from "zod";

// We're keeping a simple non-relational schema here.
// IRL, you will have a schema for your data models.
export const doctorTypeSchema = z.object({
  id: z.number(),
  name: z.string(),
  price: z.number(),
  DoctorField: z.object({
    id: z.number(),
    name: z.string(),
  }),
  Doctor: z
    .object({
      id: z.number(),
      name: z.string(),
    })
    .array()
    .nullable(),
});

export type doctorType = z.infer<typeof doctorTypeSchema>;
