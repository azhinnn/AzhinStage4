import { z } from "zod";

// We're keeping a simple non-relational schema here.
// IRL, you will have a schema for your data models.
export const secretarySchema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string(),
  phone: z.string(),
  gender: z.string(),
  image: z.string().optional().nullable(),
});

export type secretary = z.infer<typeof secretarySchema>;
