import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Car, Calendar, History, MapPin } from "lucide-react";
import Link from "next/link";

import { MaintenanceCard } from "@/components/dashboard/MaintenanceCard";

export default function DriverDashboard() {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Hola, Conductor</h1>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Registrar Vehículo
        </Button>
      </div>

      {/* AI Insights */}
      <MaintenanceCard 
        vehicleName="Toyota Hilux 2020" 
        details="Toyota Hilux 2020, 45,000 km, uso en ciudad y campo, último mantenimiento hace 6 meses." 
      />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* Vehicles Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Car className="h-5 w-5" />
              Mis Vehículos
            </CardTitle>
            <CardDescription>Gestiona tu flota personal</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <div className="font-bold">Toyota Hilux</div>
                <div className="text-sm text-muted-foreground">ABC-123 • 2020</div>
              </div>
              <Button variant="ghost" size="sm">Editar</Button>
            </div>
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <div className="font-bold">Suzuki Swift</div>
                <div className="text-sm text-muted-foreground">XYZ-987 • 2018</div>
              </div>
              <Button variant="ghost" size="sm">Editar</Button>
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Appointments */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Próximas Citas
            </CardTitle>
            <CardDescription>Mantenimiento programado</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-3 bg-primary/5 rounded-lg border border-primary/20">
              <div className="font-bold text-primary">Mañana, 10:00 AM</div>
              <div className="text-sm font-medium">Cambio de Aceite</div>
              <div className="text-xs text-muted-foreground">Taller "El Rápido"</div>
            </div>
            <div className="text-center py-4">
              <Link href="/dashboard/workshops">
                <Button variant="link">Agendar nueva cita</Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Recent History */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <History className="h-5 w-5" />
              Historial Reciente
            </CardTitle>
            <CardDescription>Tus últimas asistencias</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-3 text-sm">
              <MapPin className="h-4 w-4 mt-1 text-muted-foreground" />
              <div>
                <div className="font-medium">Grúa - 4to Anillo</div>
                <div className="text-xs text-muted-foreground">15 Nov, 2023 • Completado</div>
              </div>
            </div>
            <div className="flex items-start gap-3 text-sm">
              <MapPin className="h-4 w-4 mt-1 text-muted-foreground" />
              <div>
                <div className="font-medium">Batería - Equipetrol</div>
                <div className="text-xs text-muted-foreground">02 Nov, 2023 • Completado</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
