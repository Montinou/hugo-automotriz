'use server';

import { db } from "@/db";
import { users, workshops, services } from "@/db/schema";
import { stackServerApp } from "@/stack";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function updateWorkshopSettings(formData: FormData) {
  const user = await stackServerApp.getUser();
  if (!user) throw new Error("Unauthorized");

  const dbUser = await db.query.users.findFirst({
    where: eq(users.clerkId, user.id),
  });
  if (!dbUser) throw new Error("User not found");

  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const phone = formData.get("phone") as string;
  const address = formData.get("address") as string;

  // Check if workshop exists for this owner
  const existingWorkshop = await db.query.workshops.findFirst({
    where: eq(workshops.ownerId, dbUser.id),
  });

  if (existingWorkshop) {
    await db.update(workshops)
      .set({ name, description, phone, address, updatedAt: new Date() })
      .where(eq(workshops.id, existingWorkshop.id));
  } else {
    // Create new workshop (basic implementation, lat/long should be handled better)
    await db.insert(workshops).values({
      ownerId: dbUser.id,
      name,
      description,
      phone,
      address,
      latitude: "0", // Placeholder
      longitude: "0", // Placeholder
    });
  }

  revalidatePath("/dashboard/workshop/settings");
}

export async function addService(formData: FormData) {
  const user = await stackServerApp.getUser();
  if (!user) throw new Error("Unauthorized");

  const dbUser = await db.query.users.findFirst({
    where: eq(users.clerkId, user.id),
  });
  if (!dbUser) throw new Error("User not found");

  const workshop = await db.query.workshops.findFirst({
    where: eq(workshops.ownerId, dbUser.id),
  });
  if (!workshop) throw new Error("Workshop not found");

  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const price = formData.get("price") as string;
  const durationMinutes = parseInt(formData.get("durationMinutes") as string);
  const type = formData.get("type") as any;

  await db.insert(services).values({
    workshopId: workshop.id,
    name,
    description,
    price,
    durationMinutes,
    type,
  });

  revalidatePath("/dashboard/workshop/services");
}

export async function deleteService(serviceId: number) {
  const user = await stackServerApp.getUser();
  if (!user) throw new Error("Unauthorized");

  const dbUser = await db.query.users.findFirst({
    where: eq(users.clerkId, user.id),
  });
  if (!dbUser) throw new Error("User not found");

  const workshop = await db.query.workshops.findFirst({
    where: eq(workshops.ownerId, dbUser.id),
  });
  if (!workshop) throw new Error("Workshop not found");

  // Verify ownership of service via workshop
  const service = await db.query.services.findFirst({
    where: eq(services.id, serviceId),
  });

  if (!service || service.workshopId !== workshop.id) {
    throw new Error("Unauthorized or service not found");
  }

  await db.delete(services).where(eq(services.id, serviceId));
  revalidatePath("/dashboard/workshop/services");
}
