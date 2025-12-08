"use server";

import { db } from "@/db";
import { users } from "@/db/schema";
import { stackServerApp } from "@/stack";
import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";

export type PlanType = "free" | "pro" | "enterprise";

export async function mockSubscribeAction(plan: PlanType) {
  const user = await stackServerApp.getUser();
  if (!user) throw new Error("No autorizado");

  // Simular delay de procesamiento de pago (1.5-2s)
  await new Promise((resolve) => setTimeout(resolve, 1800));

  // Calcular fecha de fin de suscripción (30 días)
  const subscriptionEndDate = plan === "free"
    ? null
    : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

  // Actualizar usuario en DB
  await db.update(users)
    .set({
      plan: plan,
      subscriptionStatus: plan === "free" ? "inactive" : "active",
      subscriptionEndDate: subscriptionEndDate,
      updatedAt: new Date(),
    })
    .where(eq(users.stackId, user.id));

  // Revalidar rutas afectadas
  revalidatePath("/pricing");
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/mechanic-ai");

  return { success: true, plan };
}

export async function getCurrentUserPlan() {
  const user = await stackServerApp.getUser();
  if (!user) return { plan: "free" as PlanType, status: "inactive" };

  const dbUser = await db.query.users.findFirst({
    where: eq(users.stackId, user.id),
  });

  return {
    plan: (dbUser?.plan || "free") as PlanType,
    status: dbUser?.subscriptionStatus || "inactive",
    endDate: dbUser?.subscriptionEndDate,
  };
}
