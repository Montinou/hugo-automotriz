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

import { db } from "@/db";
import { appointments, users, vehicles } from "@/db/schema";
import { stackServerApp } from "@/stack";
import { eq, desc } from "drizzle-orm";

export async function analyzeMaintenance(vehicleDetails: string) {
  try {
    const user = await stackServerApp.getUser();
    let serviceHistory = "No disponible";

    if (user) {
      const dbUser = await db.query.users.findFirst({
        where: eq(users.stackId, user.id),
      });

      if (dbUser) {
        // Try to find the vehicle mentioned in details or just get all recent services
        // For simplicity, we'll get the last 5 appointments for this user
        const recentAppointments = await db.query.appointments.findMany({
          where: eq(appointments.userId, dbUser.id),
          with: {
            service: true,
            vehicle: true
          },
          orderBy: [desc(appointments.date)],
          limit: 5
        });

        if (recentAppointments.length > 0) {
          serviceHistory = recentAppointments.map(app => 
            `- ${app.date.toLocaleDateString()}: ${app.service.name} (${app.vehicle.make} ${app.vehicle.model})`
          ).join("\n");
        }
      }
    }

    const workerUrl = process.env.NEXT_PUBLIC_AI_WORKER_URL || "http://127.0.0.1:8787";
    
    const response = await fetch(workerUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        action: "maintenance",
        vehicleDetails,
        serviceHistory,
      }),
    });

    if (!response.ok) {
      throw new Error(`Worker error: ${response.statusText}`);
    }

    const data = await response.json();
    return data;

  } catch (error) {
    console.error("Error in analyzeMaintenance:", error);
    throw new Error("Failed to analyze maintenance needs. Please check server logs.");
  }
}
