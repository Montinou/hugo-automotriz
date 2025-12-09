"use server";

import { db } from "@/db";
import { users, paymentMethods } from "@/db/schema";
import { stackServerApp } from "@/stack";
import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";

export async function savePaymentMethodAction(formData: FormData) {
  const user = await stackServerApp.getUser();
  if (!user) throw new Error("No autorizado");

  // Obtener datos del formulario
  const cardholderName = formData.get("cardholderName") as string;
  const cardNumber = formData.get("cardNumber") as string;
  const expiryMonth = parseInt(formData.get("expiryMonth") as string);
  const expiryYear = parseInt(formData.get("expiryYear") as string);
  const cardType = formData.get("cardType") as string;

  // Validar que los campos requeridos existan
  if (!cardholderName || !cardNumber || !expiryMonth || !expiryYear || !cardType) {
    throw new Error("Todos los campos son requeridos");
  }

  // Obtener usuario de la DB
  const dbUser = await db.query.users.findFirst({
    where: eq(users.stackId, user.id),
  });

  if (!dbUser) {
    throw new Error("Usuario no encontrado");
  }

  // Insertar metodo de pago
  await db.insert(paymentMethods).values({
    userId: dbUser.id,
    cardholderName,
    cardNumber,
    expiryMonth,
    expiryYear,
    cardType,
    isDefault: true,
  });

  // Calcular fecha de fin de suscripcion (30 dias)
  const subscriptionEndDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

  // Actualizar usuario a plan PRO
  await db.update(users)
    .set({
      plan: "pro",
      subscriptionStatus: "active",
      subscriptionEndDate: subscriptionEndDate,
      updatedAt: new Date(),
    })
    .where(eq(users.stackId, user.id));

  // Revalidar rutas afectadas
  revalidatePath("/pricing");
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/driver");
  revalidatePath("/dashboard/mechanic-ai");

  return { success: true };
}
