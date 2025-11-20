import { db } from "@/db";
import { assistanceRequests, appointments, users } from "@/db/schema";
import { stackServerApp } from "@/stack";
import { eq, desc } from "drizzle-orm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Wrench } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

export default async function DriverHistoryPage() {
  const user = await stackServerApp.getUser();
  
  if (!user) return null;

  const dbUser = await db.query.users.findFirst({
    where: eq(users.stackId, user.id),
  });

  if (!dbUser) return null;

  const requests = await db.query.assistanceRequests.findMany({
    where: eq(assistanceRequests.userId, dbUser.id),
    orderBy: [desc(assistanceRequests.createdAt)],
    limit: 10,
  });

  const myAppointments = await db.query.appointments.findMany({
    where: eq(appointments.userId, dbUser.id),
    with: {
      workshop: true,
      service: true,
    },
    orderBy: [desc(appointments.date)],
    limit: 10,
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Historial</h1>
        <p className="text-muted-foreground">Tus solicitudes y citas pasadas.</p>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        <section className="space-y-4">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Solicitudes de Asistencia
          </h2>
          {requests.length === 0 ? (
            <p className="text-muted-foreground text-sm">No hay solicitudes recientes.</p>
          ) : (
            requests.map((req) => (
              <Card key={req.id}>
                <CardHeader className="p-4 pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-base font-medium capitalize">
                      {req.type === 'tow' ? 'Grúa' : req.type}
                    </CardTitle>
                    <Badge variant={req.status === 'completed' ? 'default' : 'secondary'}>
                      {req.status}
                    </Badge>
                  </div>
                  <CardDescription className="text-xs">
                    {format(req.createdAt, "PPP", { locale: es })}
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-4 pt-2 text-sm">
                  <p>{req.description || "Sin descripción"}</p>
                  {req.price && (
                    <p className="font-medium mt-2 text-primary">Bs. {req.price}</p>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Citas de Taller
          </h2>
          {myAppointments.length === 0 ? (
            <p className="text-muted-foreground text-sm">No hay citas registradas.</p>
          ) : (
            myAppointments.map((app) => (
              <Card key={app.id}>
                <CardHeader className="p-4 pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-base font-medium">
                      {app.service.name}
                    </CardTitle>
                    <Badge variant={app.status === 'completed' ? 'default' : 'outline'}>
                      {app.status}
                    </Badge>
                  </div>
                  <CardDescription className="text-xs">
                    {format(app.date, "PPP p", { locale: es })}
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-4 pt-2 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground mb-1">
                    <Wrench className="h-3 w-3" />
                    <span>{app.workshop.name}</span>
                  </div>
                  {app.notes && <p className="italic text-xs">"{app.notes}"</p>}
                </CardContent>
              </Card>
            ))
          )}
        </section>
      </div>
    </div>
  );
}
