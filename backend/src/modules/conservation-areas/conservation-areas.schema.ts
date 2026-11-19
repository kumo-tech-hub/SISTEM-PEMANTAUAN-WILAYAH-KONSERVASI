import { z } from "zod";

export const getConservationAreasQuerySchema = z.object({
  query: z.object({
    ecosystem: z.string().optional(),
    condition: z.string().optional()
  })
});

