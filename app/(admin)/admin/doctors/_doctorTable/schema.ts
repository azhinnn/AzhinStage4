import { z } from "zod";

// We're keeping a simple non-relational schema here.
// IRL, you will have a schema for your data models.
export const doctorSchema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string(),
  phone: z.string(),
  gender: z.string(),
  street: z.string().nullable(),
  image: z.string().nullable(),

  DoctorField: z.object({
    id: z.number(),
    name: z.string(),
  }),
  DoctorType: z.array(
    z.object({
      id: z.number(),
      name: z.string(),
    })
  ),
  City: z
    .object({
      id: z.number(),
      name: z.string(),
    })
    .optional()
    .nullable(),
});

export type doctor = z.infer<typeof doctorSchema>;
