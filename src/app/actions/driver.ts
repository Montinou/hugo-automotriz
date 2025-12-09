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
    .where(eq(users.stackId, user.id));

  revalidatePath("/dashboard/driver/settings");
}

import { z } from "zod";

const vehicleSchema = z.object({
  make: z.string().min(1, "La marca es requerida"),
  model: z.string().min(1, "El modelo es requerido"),
  year: z.coerce.number().min(1900).max(new Date().getFullYear() + 1),
  plate: z.string().min(1, "La placa es requerida"),
  color: z.string().optional(),
  mileage: z.coerce.number().min(0).optional(),
});

// Límites de vehículos por plan
const VEHICLE_LIMITS: Record<string, number> = {
  free: 1,
  pro: 5,
  enterprise: Infinity,
};

export async function addVehicle(formData: FormData) {
  const user = await stackServerApp.getUser();
  if (!user) {
    throw new Error("Unauthorized");
  }

  const dbUser = await db.query.users.findFirst({
    where: eq(users.stackId, user.id),
    with: {
      vehicles: true,
    },
  });

  if (!dbUser) {
    throw new Error("User not found in database");
  }

  // Verificar límite de vehículos según el plan
  const vehicleCount = dbUser.vehicles?.length || 0;
  const limit = VEHICLE_LIMITS[dbUser.plan] || 1;

  if (vehicleCount >= limit) {
    throw new Error("VEHICLE_LIMIT_REACHED");
  }

  try {
    const rawData = {
      make: formData.get("make"),
      model: formData.get("model"),
      year: formData.get("year"),
      plate: formData.get("plate"),
      color: formData.get("color"),
      mileage: formData.get("mileage") || undefined,
    };

    const validatedData = vehicleSchema.parse(rawData);

    await db.insert(vehicles).values({
      userId: dbUser.id,
      ...validatedData,
      color: validatedData.color || null,
      mileage: validatedData.mileage || null,
    });

    revalidatePath("/dashboard/driver/settings");
  } catch (error) {
    if (error instanceof Error && error.message === "VEHICLE_LIMIT_REACHED") {
      throw error;
    }
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

  if (!vehicle || vehicle.user.stackId !== user.id) {
    throw new Error("Unauthorized or vehicle not found");
  }

  await db.delete(vehicles).where(eq(vehicles.id, vehicleId));
  revalidatePath("/dashboard/driver/settings");
}

export async function updateVehicle(vehicleId: number, formData: FormData) {
  const user = await stackServerApp.getUser();
  if (!user) throw new Error("Unauthorized");

  // Verify ownership
  const vehicle = await db.query.vehicles.findFirst({
    where: eq(vehicles.id, vehicleId),
    with: {
      user: true,
    }
  });

  if (!vehicle || vehicle.user.stackId !== user.id) {
    throw new Error("Unauthorized or vehicle not found");
  }

  const updateData: Partial<{
    make: string;
    model: string;
    year: number;
    plate: string;
    color: string | null;
    mileage: number | null;
  }> = {};

  const make = formData.get("make");
  const model = formData.get("model");
  const year = formData.get("year");
  const plate = formData.get("plate");
  const color = formData.get("color");
  const mileage = formData.get("mileage");

  if (make) updateData.make = make as string;
  if (model) updateData.model = model as string;
  if (year) updateData.year = parseInt(year as string);
  if (plate) updateData.plate = plate as string;
  if (color !== null) updateData.color = color as string || null;
  if (mileage !== null) updateData.mileage = mileage ? parseInt(mileage as string) : null;

  await db.update(vehicles)
    .set({ ...updateData, updatedAt: new Date() })
    .where(eq(vehicles.id, vehicleId));

  revalidatePath("/dashboard/driver/settings");
}
