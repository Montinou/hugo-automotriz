import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { db } from "@/db";
import { users } from "@/db/schema";
import { stackServerApp } from "@/stack";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await stackServerApp.getUser();

  if (!user) {
    redirect("/sign-in");
  }

  // Fetch role from DB
  const dbUser = await db.query.users.findFirst({
    where: eq(users.clerkId, user.id),
  });

  // Default to driver if not found (or redirect to onboarding)
  if (!dbUser) {
    redirect("/onboarding");
  }

  return (
    <div className="flex min-h-screen bg-background">
      <DashboardSidebar role={dbUser.role as "driver" | "workshop_owner"} />
      <main className="flex-1 overflow-y-auto p-4 md:p-8 pt-16 md:pt-8">
        {children}
      </main>
    </div>
  );
}
