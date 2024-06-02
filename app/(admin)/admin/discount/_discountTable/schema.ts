import { z } from "zod";

// We're keeping a simple non-relational schema here.
// IRL, you will have a schema for your data models.
export const discountSchema = z.object({
  id: z.number(),
  name: z.string(),
  code: z.string(),
  percentage: z.number(),
  startDate: z.string(),
  endDate: z.string(),
  Doctor: z.object({
    id: z.number(),
    name: z.string(),
    image: z.string().optional().nullable(),
  }),
  Doctortype: z.object({
    id: z.number(),
    name: z.string(),
    price: z.number(),
  }),
});

export type discount = z.infer<typeof discountSchema>;
