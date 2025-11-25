"use server";

import { db } from "@/db";
import { users } from "@/db/schema";
import { stackServerApp } from "@/stack";
import { eq } from "drizzle-orm";

export async function savePushSubscription(subscription: string) {
  const user = await stackServerApp.getUser();
  if (!user) throw new Error("Unauthorized");

  await db
    .update(users)
    .set({ pushSubscription: subscription, updatedAt: new Date() })
    .where(eq(users.stackId, user.id));

  return { success: true };
}

export async function removePushSubscription() {
  const user = await stackServerApp.getUser();
  if (!user) throw new Error("Unauthorized");

  await db
    .update(users)
    .set({ pushSubscription: null, updatedAt: new Date() })
    .where(eq(users.stackId, user.id));

  return { success: true };
}
