import { RevenueChart } from "@/components/dashboard/RevenueChart";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DollarSign, Users, Calendar, Star, Car } from "lucide-react";
import { db } from "@/db";
import { appointments, users, workshops } from "@/db/schema";
import { stackServerApp } from "@/stack";
import { eq, and, gte, lte, desc } from "drizzle-orm";
import { startOfDay, endOfDay, subDays, format, isSameDay } from "date-fns";
import { es } from "date-fns/locale";
import { redirect } from "next/navigation";
import { getWorkshopStats } from "@/app/actions/workshop";

export default async function WorkshopDashboard() {
  const stats = await getWorkshopStats();

  if (!stats) {
    return <div>No tienes un taller registrado o no se pudieron cargar los datos.</div>;
  }

  // Fetch recent appointments for the table
  const user = await stackServerApp.getUser();
  const dbUser = await db.query.users.findFirst({ where: eq(users.clerkId, user!.id) });
  const workshop = await db.query.workshops.findFirst({ where: eq(workshops.ownerId, dbUser!.id) });
  
  const recentActivity = await db.query.appointments.findMany({
    where: eq(appointments.workshopId, workshop!.id),
    with: {
      service: true,
      user: true,
      vehicle: true,
    },
    orderBy: [desc(appointments.date)],
    limit: 5
  });

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Panel de Control</h1>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ingresos Totales</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Bs. {stats.revenue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Histórico total</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Citas Completadas</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.appointments}</div>
            <p className="text-xs text-muted-foreground">Total histórico</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Calificación</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.rating.toFixed(1)}</div>
            <p className="text-xs text-muted-foreground">Promedio general</p>
          </CardContent>
        </Card>
        <Card className="bg-primary/10 border-primary/20 cursor-pointer hover:bg-primary/20 transition-colors">
          <Link href="/dashboard/workshop/tickets" className="block h-full">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-primary">Solicitudes</CardTitle>
              <Car className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">Ver Tickets</div>
              <p className="text-xs text-primary/80">Gestionar asistencia</p>
            </CardContent>
          </Link>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        {/* Chart */}
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Ingresos Mensuales (Estimado)</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <RevenueChart data={stats.monthlyRevenue} />
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Actividad Reciente</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Servicio</TableHead>
                  <TableHead className="text-right">Monto</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentActivity.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center text-muted-foreground">
                      No hay actividad reciente
                    </TableCell>
                  </TableRow>
                ) : (
                  recentActivity.map((appointment) => (
                    <TableRow key={appointment.id}>
                      <TableCell>
                        <div className="font-medium">{appointment.user.fullName || "Usuario"}</div>
                        <div className="text-xs text-muted-foreground">
                          {appointment.vehicle.make} {appointment.vehicle.model}
                        </div>
                      </TableCell>
                      <TableCell>{appointment.service.name}</TableCell>
                      <TableCell className="text-right">Bs. {appointment.service.price}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
