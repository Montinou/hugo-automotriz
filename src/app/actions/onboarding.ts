"use server";

import { db } from "@/db";
import { users, workshops, vehicles } from "@/db/schema";
import { stackServerApp } from "@/stack";
import { redirect } from "next/navigation";
import { classifyWorkshop } from "@/lib/ai-classification";

interface DriverOnboardingData {
  role: "driver";
  fullName: string;
  phone: string;
  vehicleMake: string;
  vehicleModel: string;
  vehicleYear: string;
  vehiclePlate: string;
  vehicleColor?: string;
}

interface WorkshopOnboardingData {
  role: "workshop_owner";
  workshopName: string;
  description: string;
  phone: string;
  address: string;
  latitude: string;
  longitude: string;
}

type OnboardingData = DriverOnboardingData | WorkshopOnboardingData;

export async function completeOnboarding(data: OnboardingData) {
  const user = await stackServerApp.getUser();
  if (!user) throw new Error("No autorizado");

  if (!data.role) throw new Error("Rol no seleccionado");

  if (data.role === "driver") {
    // Validar campos requeridos
    if (!data.fullName || !data.phone || !data.vehicleMake || !data.vehicleModel || !data.vehicleYear || !data.vehiclePlate) {
      throw new Error("Faltan campos requeridos");
    }

    // Crear usuario
    const [newUser] = await db.insert(users).values({
      stackId: user.id,
      email: user.primaryEmail!,
      fullName: data.fullName,
      phone: data.phone,
      role: "driver",
      avatarUrl: user.profileImageUrl,
    }).onConflictDoUpdate({
      target: users.stackId,
      set: {
        role: "driver",
        fullName: data.fullName,
        phone: data.phone,
      },
    }).returning();

    // Crear vehículo
    await db.insert(vehicles).values({
      userId: newUser.id,
      make: data.vehicleMake,
      model: data.vehicleModel,
      year: parseInt(data.vehicleYear),
      plate: data.vehiclePlate.toUpperCase(),
      color: data.vehicleColor || null,
    });

    redirect("/dashboard/driver");
  } else if (data.role === "workshop_owner") {
    // Validar campos requeridos
    if (!data.workshopName || !data.description || !data.phone || !data.address || !data.latitude || !data.longitude) {
      throw new Error("Faltan campos requeridos");
    }

    // Crear usuario
    const [newUser] = await db.insert(users).values({
      stackId: user.id,
      email: user.primaryEmail!,
      fullName: user.displayName || data.workshopName,
      phone: data.phone,
      role: "workshop_owner",
      avatarUrl: user.profileImageUrl,
    }).onConflictDoUpdate({
      target: users.stackId,
      set: {
        role: "workshop_owner",
        phone: data.phone,
      },
    }).returning();

    // Clasificar con IA
    let tags: string[] = [];
    let finalDescription = data.description;

    try {
      const classification = await classifyWorkshop(data.description);
      tags = classification.tags;
      finalDescription = classification.improvedDescription;
    } catch (error) {
      console.error("Error clasificando taller:", error);
      tags = ["Taller General"];
    }

    // Crear taller
    await db.insert(workshops).values({
      ownerId: newUser.id,
      name: data.workshopName,
      description: finalDescription,
      phone: data.phone,
      address: data.address,
      latitude: data.latitude,
      longitude: data.longitude,
      tags: tags,
    });

    redirect("/dashboard/workshop");
  }

  throw new Error("Rol inválido");
}
