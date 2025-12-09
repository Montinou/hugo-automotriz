import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Car, Calendar, History, MapPin } from "lucide-react";
import Link from "next/link";

import { ChatInterface } from "@/components/ai/ChatInterface";
import { NearbyServices } from "@/components/dashboard/NearbyServices";
import { db } from "@/db";
import { users } from "@/db/schema";
import { stackServerApp } from "@/stack";
import { eq } from "drizzle-orm";

export default async function DriverDashboard() {
  const user = await stackServerApp.getUser();

  let userPlan: "free" | "pro" | "enterprise" = "free";
  let dailyMessageCount = 0;
  let vehicleContext = "No se encontraron vehiculos registrados.";
  let userVehicles: { make: string; model: string; year: number; plate: string }[] = [];

  if (user) {
    const dbUser = await db.query.users.findFirst({
      where: eq(users.stackId, user.id),
      with: {
        vehicles: true,
        chatSessions: {
          with: {
            messages: true,
          },
        },
      },
    });

    if (dbUser) {
      userPlan = dbUser.plan as "free" | "pro" | "enterprise";

      // Count today's messages
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      dailyMessageCount = dbUser.chatSessions
        ?.flatMap((s) => s.messages)
        .filter((m) => m.role === "user" && new Date(m.createdAt) >= today)
        .length || 0;

      if (dbUser.vehicles && dbUser.vehicles.length > 0) {
        userVehicles = dbUser.vehicles.map((v) => ({
          make: v.make,
          model: v.model,
          year: v.year,
          plate: v.plate,
        }));
        vehicleContext = dbUser.vehicles
          .map((v) => `${v.make} ${v.model} ${v.year} (${v.plate})`)
          .join(", ");
      }
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <Link href="/dashboard/driver/settings">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Registrar Vehiculo
          </Button>
        </Link>
      </div>

      {/* Main Grid: Chat + Sidebar */}
      <div className="grid gap-6 lg:grid-cols-5">
        {/* Chat Section - 3/5 width */}
        <div className="lg:col-span-3">
          <ChatInterface
            vehicleContext={vehicleContext}
            userPlan={userPlan}
            dailyMessageCount={dailyMessageCount}
          />
        </div>

        {/* Sidebar - 2/5 width */}
        <div className="lg:col-span-2 space-y-4">
          {/* Vehicles Card */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <Car className="h-4 w-4" />
                Mis Vehiculos
              </CardTitle>
              <CardDescription className="text-xs">Gestiona tu flota personal</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {userVehicles.length > 0 ? (
                userVehicles.slice(0, 2).map((v, i) => (
                  <div key={i} className="flex items-center justify-between p-2 border rounded-lg text-sm">
                    <div>
                      <div className="font-medium">{v.make} {v.model}</div>
                      <div className="text-xs text-muted-foreground">{v.plate} - {v.year}</div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">No hay vehiculos registrados</p>
              )}
              <Link href="/dashboard/driver/settings" className="block">
                <Button variant="ghost" size="sm" className="w-full text-xs">
                  Gestionar vehiculos
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Upcoming Appointments */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <Calendar className="h-4 w-4" />
                Proximas Citas
              </CardTitle>
              <CardDescription className="text-xs">Mantenimiento programado</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="p-2 bg-primary/5 rounded-lg border border-primary/20">
                <div className="font-medium text-primary text-sm">Manana, 10:00 AM</div>
                <div className="text-xs">Cambio de Aceite</div>
                <div className="text-xs text-muted-foreground">Taller "El Rapido"</div>
              </div>
              <Link href="/dashboard/workshops" className="block">
                <Button variant="ghost" size="sm" className="w-full text-xs">
                  Agendar cita
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Recent History */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <History className="h-4 w-4" />
                Historial Reciente
              </CardTitle>
              <CardDescription className="text-xs">Tus ultimas asistencias</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-start gap-2 text-xs">
                <MapPin className="h-3 w-3 mt-0.5 text-muted-foreground" />
                <div>
                  <div className="font-medium">Grua - 4to Anillo</div>
                  <div className="text-muted-foreground">15 Nov, 2023</div>
                </div>
              </div>
              <div className="flex items-start gap-2 text-xs">
                <MapPin className="h-3 w-3 mt-0.5 text-muted-foreground" />
                <div>
                  <div className="font-medium">Bateria - Equipetrol</div>
                  <div className="text-muted-foreground">02 Nov, 2023</div>
                </div>
              </div>
              <Link href="/dashboard/driver/history" className="block">
                <Button variant="ghost" size="sm" className="w-full text-xs">
                  Ver historial completo
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Nearby Services */}
          <NearbyServices />
        </div>
      </div>
    </div>
  );
}
