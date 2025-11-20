import { db } from "@/db";
import { users } from "@/db/schema";
import { stackServerApp } from "@/stack";
import { eq } from "drizzle-orm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ProfileForm } from "@/components/dashboard/driver/ProfileForm";
import { VehicleManager } from "@/components/dashboard/driver/VehicleManager";

export default async function DriverSettingsPage() {
  const user = await stackServerApp.getUser();
  
  if (!user) return null;

  const dbUser = await db.query.users.findFirst({
    where: eq(users.clerkId, user.id),
    with: {
      vehicles: true,
    }
  });

  if (!dbUser) return null;

  return (
    <div className="max-w-2xl space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Configuración</h1>
        <p className="text-muted-foreground">Administra tu perfil y tus vehículos.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Perfil de Usuario</CardTitle>
          <CardDescription>Tus datos personales de contacto.</CardDescription>
        </CardHeader>
        <CardContent>
          <ProfileForm initialData={{
            email: dbUser.email,
            fullName: dbUser.fullName,
            phone: dbUser.phone,
          }} />
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <VehicleManager vehicles={dbUser.vehicles} />
        </CardContent>
      </Card>
    </div>
  );
}
