"use server";

import { generateObject } from "ai";
import { openai } from "@ai-sdk/openai";
import { z } from "zod";

const improvedDescriptionSchema = z.object({
  improvedDescription: z.string().describe("Descripción profesional y atractiva del taller"),
});

export async function improveDescription(rawDescription: string): Promise<string> {
  if (!rawDescription || rawDescription.trim().length < 10) {
    throw new Error("La descripción debe tener al menos 10 caracteres");
  }

  try {
    const { object } = await generateObject({
      model: openai("gpt-4o-mini"),
      schema: improvedDescriptionSchema,
      prompt: `
        Eres un experto en marketing automotriz.
        Mejora la siguiente descripción de un taller mecánico para hacerla más profesional y atractiva:

        "${rawDescription}"

        Reglas:
        - Mantén la esencia y servicios mencionados
        - Hazla profesional y confiable
        - Máximo 200 caracteres
        - El resultado debe estar en español
        - No uses emojis
        - Usa un tono amigable pero profesional
      `,
    });

    return object.improvedDescription;
  } catch (error) {
    console.error("Error mejorando descripción:", error);
    throw new Error("No se pudo mejorar la descripción. Intenta de nuevo.");
  }
}
