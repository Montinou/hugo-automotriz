'use server';

import { db } from "@/db";
import { assistanceRequests, users } from "@/db/schema";
import { stackServerApp } from "@/stack";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function acceptRequest(requestId: number) {
  const user = await stackServerApp.getUser();
  if (!user) throw new Error("Unauthorized");

  const dbUser = await db.query.users.findFirst({
    where: eq(users.clerkId, user.id),
  });

  if (!dbUser) throw new Error("User not found");

  // Verify user is a workshop owner or mechanic (logic can be stricter)
  // For now, we assume if they are on the dashboard they have access
  
  await db.update(assistanceRequests)
    .set({ 
      status: "accepted",
      providerId: dbUser.id,
      updatedAt: new Date()
    })
    .where(eq(assistanceRequests.id, requestId));

  revalidatePath("/dashboard/workshop/tickets");
}

export async function completeRequest(requestId: number) {
  const user = await stackServerApp.getUser();
  if (!user) throw new Error("Unauthorized");

  // Verify ownership/provider status logic here
  
  await db.update(assistanceRequests)
    .set({ 
      status: "completed",
      updatedAt: new Date()
    })
    .where(eq(assistanceRequests.id, requestId));

  revalidatePath("/dashboard/workshop/tickets");
}
