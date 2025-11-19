import { RevenueChart } from "@/components/dashboard/RevenueChart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { DollarSign, Users, Calendar, Star } from "lucide-react";

export default function WorkshopDashboard() {
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
            <div className="text-2xl font-bold">Bs. 45,231.89</div>
            <p className="text-xs text-muted-foreground">+20.1% mes pasado</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Citas Hoy</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+12</div>
            <p className="text-xs text-muted-foreground">4 pendientes de confirmar</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Clientes Activos</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+573</div>
            <p className="text-xs text-muted-foreground">+201 nuevos clientes</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Calificación</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4.8</div>
            <p className="text-xs text-muted-foreground">Basado en 124 reseñas</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        {/* Chart */}
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Ingresos Semanales</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <RevenueChart />
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
                <TableRow>
                  <TableCell>
                    <div className="font-medium">Juan Pérez</div>
                    <div className="text-xs text-muted-foreground">Toyota Hilux</div>
                  </TableCell>
                  <TableCell>Cambio de Aceite</TableCell>
                  <TableCell className="text-right">Bs. 250</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <div className="font-medium">María López</div>
                    <div className="text-xs text-muted-foreground">Suzuki Swift</div>
                  </TableCell>
                  <TableCell>Afinado</TableCell>
                  <TableCell className="text-right">Bs. 450</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <div className="font-medium">Carlos Ruiz</div>
                    <div className="text-xs text-muted-foreground">Nissan Patrol</div>
                  </TableCell>
                  <TableCell>Frenos</TableCell>
                  <TableCell className="text-right">Bs. 180</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <div className="font-medium">Ana Silva</div>
                    <div className="text-xs text-muted-foreground">Kia Sportage</div>
                  </TableCell>
                  <TableCell>Diagnóstico</TableCell>
                  <TableCell className="text-right">Bs. 150</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
