import { Suspense } from "react";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { DashboardProviders } from "@/components/providers/DashboardProviders";
import { db } from "@/db";
import { users } from "@/db/schema";
import { stackServerApp } from "@/stack";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { Loader2 } from "lucide-react";

function SidebarFallback() {
  return (
    <div className="hidden md:flex w-64 flex-col border-r bg-card h-screen sticky top-0 items-center justify-center">
      <Loader2 className="h-6 w-6 animate-spin text-primary" />
    </div>
  );
}

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
    where: eq(users.stackId, user.id),
  });

  // Default to driver if not found (or redirect to onboarding)
  if (!dbUser || !dbUser.role) {
    redirect("/onboarding");
  }

  const userPlan = (dbUser.plan || "free") as "free" | "pro" | "enterprise";

  return (
    <DashboardProviders userPlan={userPlan}>
      <div className="flex min-h-screen bg-background">
        <Suspense fallback={<SidebarFallback />}>
          <DashboardSidebar
            role={dbUser.role as "driver" | "workshop_owner"}
            userPlan={userPlan}
          />
        </Suspense>
        <main className="flex-1 overflow-y-auto p-4 md:p-8 pt-16 md:pt-8">
          <Suspense fallback={<div className="flex items-center justify-center min-h-[50vh]"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>}>
            {children}
          </Suspense>
        </main>
      </div>
    </DashboardProviders>
  );
}
