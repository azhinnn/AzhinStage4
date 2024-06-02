import { z } from "zod";

// We're keeping a simple non-relational schema here.
// IRL, you will have a schema for your data models.
export const doctorFieldSchema = z.object({
  id: z.number(),
  name: z.string(),
  _count: z.object({
    DoctorType: z.number(),
    Doctor: z.number(),
  }),
});

export type doctorField = z.infer<typeof doctorFieldSchema>;
