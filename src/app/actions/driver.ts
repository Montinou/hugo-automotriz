'use server';

import { db } from "@/db";
import { users, vehicles } from "@/db/schema";
import { stackServerApp } from "@/stack";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function updateDriverProfile(formData: FormData) {
  const user = await stackServerApp.getUser();
  if (!user) throw new Error("Unauthorized");

  const fullName = formData.get("fullName") as string;
  const phone = formData.get("phone") as string;

  await db.update(users)
    .set({ fullName, phone, updatedAt: new Date() })
    .where(eq(users.clerkId, user.id));

  revalidatePath("/dashboard/driver/settings");
}

import { z } from "zod";

const vehicleSchema = z.object({
  make: z.string().min(1, "La marca es requerida"),
  model: z.string().min(1, "El modelo es requerido"),
  year: z.coerce.number().min(1900).max(new Date().getFullYear() + 1),
  plate: z.string().min(1, "La placa es requerida"),
  color: z.string().optional(),
});

export async function addVehicle(formData: FormData) {
  console.log("addVehicle action started");
  const user = await stackServerApp.getUser();
  if (!user) {
    console.error("No user found in stackServerApp");
    throw new Error("Unauthorized");
  }

  const dbUser = await db.query.users.findFirst({
    where: eq(users.clerkId, user.id),
  });

  if (!dbUser) {
    console.error("No dbUser found for clerkId:", user.id);
    throw new Error("User not found in database");
  }

  try {
    const rawData = {
      make: formData.get("make"),
      model: formData.get("model"),
      year: formData.get("year"),
      plate: formData.get("plate"),
      color: formData.get("color"),
    };
    console.log("Raw form data:", rawData);

    const validatedData = vehicleSchema.parse(rawData);

    await db.insert(vehicles).values({
      userId: dbUser.id,
      ...validatedData,
      color: validatedData.color || null,
    });
    console.log("Vehicle inserted successfully");

    revalidatePath("/dashboard/driver/settings");
  } catch (error) {
    console.error("Error adding vehicle:", error);
    throw new Error("Failed to add vehicle: " + (error instanceof Error ? error.message : "Unknown error"));
  }
}

export async function deleteVehicle(vehicleId: number) {
  const user = await stackServerApp.getUser();
  if (!user) throw new Error("Unauthorized");

  // Verify ownership
  const vehicle = await db.query.vehicles.findFirst({
    where: eq(vehicles.id, vehicleId),
    with: {
      user: true,
    }
  });

  if (!vehicle || vehicle.user.clerkId !== user.id) {
    throw new Error("Unauthorized or vehicle not found");
  }

  await db.delete(vehicles).where(eq(vehicles.id, vehicleId));
  revalidatePath("/dashboard/driver/settings");
}
