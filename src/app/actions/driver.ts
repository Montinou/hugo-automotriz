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

export async function addVehicle(formData: FormData) {
  const user = await stackServerApp.getUser();
  if (!user) throw new Error("Unauthorized");

  const dbUser = await db.query.users.findFirst({
    where: eq(users.clerkId, user.id),
  });

  if (!dbUser) throw new Error("User not found");

  const make = formData.get("make") as string;
  const model = formData.get("model") as string;
  const year = parseInt(formData.get("year") as string);
  const plate = formData.get("plate") as string;
  const color = formData.get("color") as string;

  await db.insert(vehicles).values({
    userId: dbUser.id,
    make,
    model,
    year,
    plate,
    color,
  });

  revalidatePath("/dashboard/driver/settings");
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
