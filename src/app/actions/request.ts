'use server';

import { db } from "@/db";
import { assistanceRequests, users, vehicles } from "@/db/schema";
import { stackServerApp } from "@/stack";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function createAssistanceRequest(data: {
  latitude: number;
  longitude: number;
  serviceType: string;
  description?: string;
  vehicleId?: number;
}) {
  const user = await stackServerApp.getUser();
  if (!user) throw new Error("Unauthorized");

  const dbUser = await db.query.users.findFirst({
    where: eq(users.clerkId, user.id),
    with: {
      vehicles: true
    }
  });

  if (!dbUser) throw new Error("User not found");

  // Use first vehicle as default if not provided (logic can be improved)
  const vehicleId = data.vehicleId || (dbUser.vehicles.length > 0 ? dbUser.vehicles[0].id : null);

  const [newRequest] = await db.insert(assistanceRequests).values({
    userId: dbUser.id,
    vehicleId: vehicleId,
    type: data.serviceType as any,
    description: data.description || "Solicitud de asistencia",
    latitude: data.latitude.toString(),
    longitude: data.longitude.toString(),
    status: "pending",
    price: "150.00", // Base price, logic should be dynamic
  }).returning();

  revalidatePath("/dashboard/request");
  return newRequest;
}

export async function getRequestStatus(requestId: number) {
  const request = await db.query.assistanceRequests.findFirst({
    where: eq(assistanceRequests.id, requestId),
    with: {
      provider: true,
    }
  });
  return request;
}
