'use server';

import { db } from "@/db";
import { assistanceRequests, users, workshops, services } from "@/db/schema";
import { stackServerApp } from "@/stack";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { sendPushNotification } from "@/lib/push";

export async function acceptRequest(requestId: number) {
  const user = await stackServerApp.getUser();
  if (!user) throw new Error("Unauthorized");

  const dbUser = await db.query.users.findFirst({
    where: eq(users.stackId, user.id),
  });

  if (!dbUser) throw new Error("User not found");

  // Get the request to find the driver
  const request = await db.query.assistanceRequests.findFirst({
    where: eq(assistanceRequests.id, requestId),
    with: { user: true },
  });

  if (!request) throw new Error("Request not found");

  await db.update(assistanceRequests)
    .set({
      status: "accepted",
      providerId: dbUser.id,
      updatedAt: new Date()
    })
    .where(eq(assistanceRequests.id, requestId));

  // Send push notification to the driver
  if (request.user.pushSubscription) {
    await sendPushNotification(request.user.pushSubscription, {
      title: "Solicitud Aceptada",
      body: "Tu solicitud de asistencia ha sido aceptada. El técnico está en camino.",
      url: "/dashboard/driver",
    });
  }

  revalidatePath("/dashboard/workshop/tickets");
}

export async function completeRequest(requestId: number) {
  const user = await stackServerApp.getUser();
  if (!user) throw new Error("Unauthorized");

  const request = await db.query.assistanceRequests.findFirst({
    where: eq(assistanceRequests.id, requestId),
    with: { user: true },
  });

  if (!request) throw new Error("Request not found");

  await db.update(assistanceRequests)
    .set({
      status: "completed",
      updatedAt: new Date()
    })
    .where(eq(assistanceRequests.id, requestId));

  // Send push notification to the driver
  if (request.user.pushSubscription) {
    await sendPushNotification(request.user.pushSubscription, {
      title: "Servicio Completado",
      body: "Tu servicio de asistencia ha sido completado. ¡Gracias por confiar en nosotros!",
      url: "/dashboard/driver/history",
    });
  }

  revalidatePath("/dashboard/workshop/tickets");
}

export async function cancelRequest(requestId: number) {
  const user = await stackServerApp.getUser();
  if (!user) throw new Error("Unauthorized");

  const request = await db.query.assistanceRequests.findFirst({
    where: eq(assistanceRequests.id, requestId),
    with: { user: true },
  });

  if (!request) throw new Error("Request not found");

  await db.update(assistanceRequests)
    .set({
      status: "cancelled",
      updatedAt: new Date()
    })
    .where(eq(assistanceRequests.id, requestId));

  // Send push notification to the driver
  if (request.user.pushSubscription) {
    await sendPushNotification(request.user.pushSubscription, {
      title: "Solicitud Cancelada",
      body: "Tu solicitud de asistencia ha sido cancelada.",
      url: "/dashboard/driver",
    });
  }

  revalidatePath("/dashboard/workshop/tickets");
  revalidatePath("/dashboard/driver");
}

export async function getWorkshops(filter?: string) {
  const allWorkshops = await db.query.workshops.findMany({
    with: {
      services: true,
      reviews: true,
    }
  });
  
  if (filter === 'rating') {
    return allWorkshops.sort((a, b) => Number(b.rating) - Number(a.rating));
  }
  
  return allWorkshops;
}

export async function getWorkshopById(id: number) {
  const workshop = await db.query.workshops.findFirst({
    where: eq(workshops.id, id),
    with: {
      services: true,
      reviews: {
        with: {
          user: true
        },
        orderBy: (reviews, { desc }) => [desc(reviews.createdAt)],
        limit: 5
      },
      owner: true
    }
  });
  return workshop;
}

export async function getWorkshopStats() {
  const user = await stackServerApp.getUser();
  if (!user) throw new Error("Unauthorized");

  const dbUser = await db.query.users.findFirst({
    where: eq(users.stackId, user.id),
  });
  
  if (!dbUser) throw new Error("User not found");

  const workshop = await db.query.workshops.findFirst({
    where: eq(workshops.ownerId, dbUser.id),
  });

  if (!workshop) return null;

  const completedRequests = await db.query.assistanceRequests.findMany({
    where: (req, { and, eq }) => and(
      eq(req.providerId, dbUser.id),
      eq(req.status, "completed")
    )
  });

  const revenue = completedRequests.reduce((acc, req) => acc + (Number(req.price) || 0), 0);
  
  const monthlyRevenue = [
    { name: "Ene", total: revenue * 0.1 },
    { name: "Feb", total: revenue * 0.15 },
    { name: "Mar", total: revenue * 0.1 },
    { name: "Abr", total: revenue * 0.2 },
    { name: "May", total: revenue * 0.25 },
    { name: "Jun", total: revenue * 0.2 },
  ];

  return {
    revenue,
    appointments: completedRequests.length,
    rating: Number(workshop.rating),
    monthlyRevenue
  };
}

export async function addService(formData: FormData) {
  const user = await stackServerApp.getUser();
  if (!user) throw new Error("Unauthorized");

  const dbUser = await db.query.users.findFirst({
    where: eq(users.stackId, user.id),
  });
  if (!dbUser) throw new Error("User not found");

  const workshop = await db.query.workshops.findFirst({
    where: eq(workshops.ownerId, dbUser.id),
  });
  if (!workshop) throw new Error("Workshop not found");

  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const price = formData.get("price") as string;
  const durationMinutes = formData.get("durationMinutes") as string;
  const type = formData.get("type") as any;

  await db.insert(services).values({
    workshopId: workshop.id,
    name,
    description,
    price: price,
    durationMinutes: durationMinutes ? parseInt(durationMinutes) : 60,
    type,
  });

  revalidatePath("/dashboard/workshop/services");
}

export async function deleteService(serviceId: number) {
  const user = await stackServerApp.getUser();
  if (!user) throw new Error("Unauthorized");

  // Verify ownership logic here
  
  await db.delete(services).where(eq(services.id, serviceId));
  revalidatePath("/dashboard/workshop/services");
}

export async function updateWorkshopSettings(formData: FormData) {
  const user = await stackServerApp.getUser();
  if (!user) throw new Error("Unauthorized");

  const dbUser = await db.query.users.findFirst({
    where: eq(users.stackId, user.id),
  });
  if (!dbUser) throw new Error("User not found");

  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const phone = formData.get("phone") as string;
  const address = formData.get("address") as string;
  const latitude = formData.get("latitude") as string;
  const longitude = formData.get("longitude") as string;

  await db.update(workshops)
    .set({
      name,
      description,
      phone,
      address,
      latitude: latitude,
      longitude: longitude,
      imageUrl: formData.get("imageUrl") as string,
    })
    .where(eq(workshops.ownerId, dbUser.id));

  revalidatePath("/dashboard/workshop/settings");
}
