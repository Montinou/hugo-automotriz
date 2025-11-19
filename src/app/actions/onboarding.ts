"use server";

import { db } from "@/db";
import { users } from "@/db/schema";
import { stackServerApp } from "@/stack";
import { redirect } from "next/navigation";

export async function completeOnboarding(formData: FormData) {
  const user = await stackServerApp.getUser();
  if (!user) throw new Error("No autorizado");

  const role = formData.get("role") as "driver" | "workshop_owner";
  
  if (!role) throw new Error("Rol no seleccionado");

  // Sync user to DB
  await db.insert(users).values({
    clerkId: user.id, // We can keep the column name or rename it to stackId later
    email: user.primaryEmail!,
    fullName: user.displayName || "",
    role: role,
    avatarUrl: user.profileImageUrl,
  }).onConflictDoUpdate({
    target: users.clerkId,
    set: { role: role },
  });

  if (role === "workshop_owner") {
    redirect("/dashboard/workshop");
  } else {
    redirect("/dashboard/driver");
  }
}
