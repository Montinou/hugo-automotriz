import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, MapPin, User } from "lucide-react";
import { Button } from "@/components/ui/button";

const APPOINTMENTS = [
  {
    id: 1,
    client: "Juan Pérez",
    vehicle: "Toyota Hilux (2020)",
    service: "Cambio de Aceite",
    date: "Hoy",
    time: "10:00 AM",
    status: "confirmed",
  },
  {
    id: 2,
    client: "María López",
    vehicle: "Suzuki Swift (2018)",
    service: "Afinado de Motor",
    date: "Hoy",
    time: "02:30 PM",
    status: "pending",
  },
  {
    id: 3,
    client: "Carlos Ruiz",
    vehicle: "Nissan Patrol (2015)",
    service: "Revisión de Frenos",
    date: "Mañana",
    time: "09:00 AM",
    status: "confirmed",
  },
];

export default function WorkshopCalendar() {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Calendario de Citas</h1>
        <Button>Nueva Cita Manual</Button>
      </div>

      <Tabs defaultValue="upcoming" className="w-full">
        <TabsList>
          <TabsTrigger value="upcoming">Próximas</TabsTrigger>
          <TabsTrigger value="past">Historial</TabsTrigger>
          <TabsTrigger value="cancelled">Canceladas</TabsTrigger>
        </TabsList>
        
        <TabsContent value="upcoming" className="space-y-4 mt-4">
          {APPOINTMENTS.map((apt) => (
            <Card key={apt.id}>
              <CardContent className="flex items-center justify-between p-6">
                <div className="flex gap-6 items-center">
                  <div className="flex flex-col items-center justify-center w-16 h-16 bg-muted rounded-lg">
                    <span className="text-sm font-bold uppercase text-muted-foreground">{apt.date}</span>
                    <span className="text-lg font-bold">{apt.time.split(" ")[0]}</span>
                  </div>
                  
                  <div className="space-y-1">
                    <h3 className="font-bold text-lg">{apt.service}</h3>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <User className="h-4 w-4" />
                        {apt.client}
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {apt.vehicle}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <Badge variant={apt.status === "confirmed" ? "default" : "secondary"}>
                    {apt.status === "confirmed" ? "Confirmada" : "Pendiente"}
                  </Badge>
                  <Button variant="outline" size="sm">Detalles</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
        
        <TabsContent value="past">
          <div className="text-center py-12 text-muted-foreground">
            No hay citas pasadas recientes.
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
