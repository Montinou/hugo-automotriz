import { db } from "@/db";
import { appointments, users, workshops, services, vehicles } from "@/db/schema";
import { stackServerApp } from "@/stack";
import { eq, desc } from "drizzle-orm";
import { format } from "date-fns";
import { es } from "date-fns/locale";

export async function GET() {
  const user = await stackServerApp.getUser();
  if (!user) {
    return new Response("Unauthorized", { status: 401 });
  }

  const dbUser = await db.query.users.findFirst({
    where: eq(users.stackId, user.id),
  });

  if (!dbUser) {
    return new Response("User not found", { status: 404 });
  }

  const workshop = await db.query.workshops.findFirst({
    where: eq(workshops.ownerId, dbUser.id),
  });

  if (!workshop) {
    return new Response("Workshop not found", { status: 404 });
  }

  const workshopAppointments = await db.query.appointments.findMany({
    where: eq(appointments.workshopId, workshop.id),
    with: {
      service: true,
      user: true,
      vehicle: true,
    },
    orderBy: [desc(appointments.date)],
  });

  // CSV Header
  const headers = [
    "Fecha",
    "Cliente",
    "Vehículo",
    "Placa",
    "Servicio",
    "Precio (Bs)",
    "Estado",
    "Notas"
  ];

  // CSV Rows
  const rows = workshopAppointments.map((app) => {
    return [
      format(app.date, "dd/MM/yyyy HH:mm", { locale: es }),
      app.user.fullName || "Sin nombre",
      `${app.vehicle.make} ${app.vehicle.model} (${app.vehicle.year})`,
      app.vehicle.plate,
      app.service.name,
      app.service.price,
      app.status,
      app.notes || ""
    ].map(field => `"${String(field).replace(/"/g, '""')}"`).join(","); // Escape quotes and join
  });

  const csvContent = [headers.join(","), ...rows].join("\n");

  return new Response(csvContent, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="reporte_taller_${format(new Date(), "yyyyMMdd")}.csv"`,
    },
  });
}
