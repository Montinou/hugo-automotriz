import { db } from "@/db";
import { users, workshops } from "@/db/schema";
import { stackServerApp } from "@/stack";
import { eq } from "drizzle-orm";
import { ServiceManager } from "@/components/dashboard/workshop/ServiceManager";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Package } from "lucide-react";

export default async function WorkshopServicesPage() {
  const user = await stackServerApp.getUser();
  
  if (!user) return null;

  // Find the workshop owned by this user
  const dbUser = await db.query.users.findFirst({
    where: eq(users.stackId, user.id),
  });

  if (!dbUser) return null;

  const workshop = await db.query.workshops.findFirst({
    where: eq(workshops.ownerId, dbUser.id),
    with: {
      services: true,
    }
  });

  if (!workshop) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold">No tienes un taller registrado</h2>
        <p className="text-muted-foreground">Registra tu taller en la configuración para gestionar servicios.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Button asChild variant="outline">
          <Link href="/dashboard/workshop/inventory">
            <Package className="mr-2 h-4 w-4" />
            Gestionar Inventario
          </Link>
        </Button>
      </div>
      <ServiceManager services={workshop.services.map(s => ({
        ...s,
        price: s.price.toString(), // Convert decimal to string for client component
      }))} />
    </div>
  );
}
