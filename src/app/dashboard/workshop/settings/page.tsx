import { db } from "@/db";
import { users, workshops } from "@/db/schema";
import { stackServerApp } from "@/stack";
import { eq } from "drizzle-orm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { WorkshopSettingsForm } from "@/components/dashboard/workshop/WorkshopSettingsForm";

export default async function WorkshopSettingsPage() {
  const user = await stackServerApp.getUser();
  
  if (!user) return null;

  // Find the workshop owned by this user
  const dbUser = await db.query.users.findFirst({
    where: eq(users.stackId, user.id),
  });

  if (!dbUser) return null;

  const workshop = await db.query.workshops.findFirst({
    where: eq(workshops.ownerId, dbUser.id),
  });

  return (
    <div className="max-w-2xl space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Configuración del Taller</h1>
        <p className="text-muted-foreground">Actualiza la información pública de tu negocio.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Información General</CardTitle>
          <CardDescription>Estos datos serán visibles para los conductores.</CardDescription>
        </CardHeader>
        <CardContent>
          <WorkshopSettingsForm initialData={workshop ? {
            name: workshop.name,
            description: workshop.description,
            phone: workshop.phone,
            address: workshop.address,
            latitude: workshop.latitude,
            longitude: workshop.longitude,
          } : null} />
        </CardContent>
      </Card>
    </div>
  );
}
