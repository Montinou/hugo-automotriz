'use server';

import { db } from "@/db";
import { reviews, assistanceRequests, workshops, users } from "@/db/schema";
import { stackServerApp } from "@/stack";
import { eq, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function submitReview(requestId: number, rating: number, comment: string) {
  const user = await stackServerApp.getUser();
  if (!user) throw new Error("Unauthorized");

  const dbUser = await db.query.users.findFirst({
    where: eq(users.clerkId, user.id),
  });

  if (!dbUser) throw new Error("User not found");

  const request = await db.query.assistanceRequests.findFirst({
    where: eq(assistanceRequests.id, requestId),
  });

  if (!request || !request.providerId) throw new Error("Request not found or no provider");

  // Insert review
  await db.insert(reviews).values({
    userId: dbUser.id,
    providerId: request.providerId,
    rating,
    comment,
  });

  // Update workshop rating if provider is a workshop owner
  // Find workshop owned by provider
  const workshop = await db.query.workshops.findFirst({
    where: eq(workshops.ownerId, request.providerId),
  });

  if (workshop) {
    // Recalculate average
    // This is a simplified average calculation. Ideally use aggregation query.
    const currentRating = Number(workshop.rating);
    const currentCount = workshop.reviewCount || 0;
    
    const newCount = currentCount + 1;
    const newRating = ((currentRating * currentCount) + rating) / newCount;

    await db.update(workshops)
      .set({ 
        rating: newRating.toFixed(2),
        reviewCount: newCount,
        updatedAt: new Date()
      })
      .where(eq(workshops.id, workshop.id));
  }

  revalidatePath("/dashboard/request");
}
