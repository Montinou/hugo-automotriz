'use server';

import OpenAI from "openai";
import { put } from "@vercel/blob";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function generateWorkshopImage(prompt: string, workshopName: string) {
  try {
    // 1. Generate image with DALL-E 3
    const response = await client.images.generate({
      model: "dall-e-3",
      prompt: `A professional, modern automotive workshop named "${workshopName}". ${prompt}. Photorealistic, high quality, 4k.`,
      n: 1,
      size: "1024x1024",
      response_format: "b64_json", // Get base64 to upload to blob directly
    });

    const imageBase64 = response.data?.[0]?.b64_json;
    if (!imageBase64) throw new Error("No image generated");

    // 2. Upload to Vercel Blob
    const buffer = Buffer.from(imageBase64, 'base64');
    const filename = `workshops/${workshopName.replace(/\s+/g, '-').toLowerCase()}-${Date.now()}.png`;
    
    const blob = await put(filename, buffer, {
      access: 'public',
    });

    return blob.url;
  } catch (error) {
    console.error("Error generating workshop image:", error);
    throw new Error("Failed to generate image");
  }
}
