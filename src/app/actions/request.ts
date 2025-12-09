'use server';

import { db } from "@/db";
import { assistanceRequests, users, vehicles } from "@/db/schema";
import { stackServerApp } from "@/stack";
import { eq, and, gte, inArray } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { sendPushNotification } from "@/lib/push";

// Límites de solicitudes exitosas por mes según plan
const REQUEST_LIMITS: Record<string, number> = {
  free: 1,
  pro: Infinity,
  enterprise: Infinity,
};

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
    where: eq(users.stackId, user.id),
    with: {
      vehicles: true
    }
  });

  if (!dbUser) throw new Error("User not found");

  // Verificar límite de solicitudes exitosas mensuales para usuarios free
  const limit = REQUEST_LIMITS[dbUser.plan] || 1;

  if (limit !== Infinity) {
    // Calcular inicio del mes actual
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    // Contar solicitudes exitosas del mes (accepted, in_progress, completed)
    const successfulRequests = await db.query.assistanceRequests.findMany({
      where: and(
        eq(assistanceRequests.userId, dbUser.id),
        gte(assistanceRequests.createdAt, startOfMonth),
        inArray(assistanceRequests.status, ["accepted", "in_progress", "completed"])
      ),
    });

    if (successfulRequests.length >= limit) {
      throw new Error("REQUEST_LIMIT_REACHED");
    }
  }

  // Use first vehicle as default if not provided
  const vehicleId = data.vehicleId || (dbUser.vehicles.length > 0 ? dbUser.vehicles[0].id : null);

  const [newRequest] = await db.insert(assistanceRequests).values({
    userId: dbUser.id,
    vehicleId: vehicleId,
    type: data.serviceType as any,
    description: data.description || "Solicitud de asistencia",
    latitude: data.latitude.toString(),
    longitude: data.longitude.toString(),
    status: "pending",
    price: "150.00",
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

export async function cancelRequest(requestId: number) {
  const user = await stackServerApp.getUser();
  if (!user) throw new Error("Unauthorized");

  // Get the request to check if there's an assigned provider
  const request = await db.query.assistanceRequests.findFirst({
    where: eq(assistanceRequests.id, requestId),
    with: { provider: true },
  });

  await db.update(assistanceRequests)
    .set({ status: "cancelled", updatedAt: new Date() })
    .where(eq(assistanceRequests.id, requestId));

  // Notify the provider if one was assigned
  if (request?.provider?.pushSubscription) {
    await sendPushNotification(request.provider.pushSubscription, {
      title: "Solicitud Cancelada",
      body: "El conductor ha cancelado la solicitud de asistencia.",
      url: "/dashboard/workshop/tickets",
    });
  }

  revalidatePath("/dashboard/request");
  revalidatePath("/dashboard/workshop/tickets");
  return { success: true };
}
