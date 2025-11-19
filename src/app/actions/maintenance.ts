"use server";

import { openai } from "@/lib/ai";
import { generateObject } from "ai";
import { z } from "zod";

const MaintenanceSchema = z.object({
  services: z.array(z.object({
    service: z.string(),
    urgency: z.enum(["low", "medium", "high"]),
    reason: z.string(),
    estimatedCost: z.string(),
  })),
  summary: z.string(),
});

export async function analyzeMaintenance(vehicleDetails: string) {
  const { object } = await generateObject({
    model: openai("gpt-4o-mini"),
    schema: MaintenanceSchema,
    prompt: `Analiza el siguiente vehículo y sugiere mantenimiento preventivo basado en su kilometraje y antigüedad. Ten en cuenta el contexto de Bolivia (caminos, altura).
    
    Vehículo: ${vehicleDetails}
    
    Genera una lista de servicios recomendados.`,
  });

  return object;
}
