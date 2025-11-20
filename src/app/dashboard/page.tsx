import { db } from "@/db";
import { users } from "@/db/schema";
import { stackServerApp } from "@/stack";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const user = await stackServerApp.getUser();

  if (!user) {
    redirect("/sign-in");
  }

  const dbUser = await db.query.users.findFirst({
    where: eq(users.stackId, user.id),
  });

  if (!dbUser) {
    redirect("/onboarding");
  }

  if (dbUser.role === "workshop_owner") {
    redirect("/dashboard/workshop");
  } else {
    // Default to driver for 'driver' role and any others for now
    redirect("/dashboard/driver");
  }
}
