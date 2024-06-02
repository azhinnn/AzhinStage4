import { z } from "zod";

export const citySchema = z.object({
  id: z.number(),
  name: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type city = z.infer<typeof citySchema>;
