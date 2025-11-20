import { ChatInterface } from "@/components/ai/ChatInterface";
import { db } from "@/db";
import { users } from "@/db/schema";
import { stackServerApp } from "@/stack";
import { eq } from "drizzle-orm";

export default async function MechanicAIPage() {
  const user = await stackServerApp.getUser();
  
  // Fetch user's vehicles
  const userVehicles = user ? await db.query.vehicles.findMany({
    where: (vehicles, { eq }) => eq(vehicles.userId, db.query.users.findFirst({
      where: eq(users.stackId, user.id),
    }).then(u => u?.id ?? 0) as any), // This is a bit complex due to async subquery not being directly supported in where like this usually
  }) : [];

  // Better approach: get user first then vehicles
  let vehicleContext = "No se encontraron vehículos registrados.";
  
  if (user) {
    const dbUser = await db.query.users.findFirst({
      where: eq(users.stackId, user.id),
      with: {
        vehicles: true
      }
    });

    if (dbUser?.vehicles && dbUser.vehicles.length > 0) {
      vehicleContext = dbUser.vehicles.map(v => 
        `${v.make} ${v.model} ${v.year} (${v.plate})`
      ).join(", ");
    }
  }

  return (
    <div className="container max-w-4xl mx-auto py-8 px-4 space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Asistencia Vehicular AI</h1>
        <p className="text-muted-foreground">
          Consulta cualquier duda sobre tu vehículo, ruidos extraños o mantenimiento.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        <div className="md:col-span-2">
          <ChatInterface vehicleContext={vehicleContext} />
        </div>
        
        <div className="space-y-6">
          <div className="bg-blue-50 dark:bg-blue-950/30 p-4 rounded-lg border border-blue-100 dark:border-blue-900">
            <h3 className="font-bold text-blue-800 dark:text-blue-300 mb-2">Consejos Rápidos</h3>
            <ul className="text-sm space-y-2 text-blue-700 dark:text-blue-400 list-disc pl-4">
              <li>Describe el ruido (chillido, golpe, zumbido).</li>
              <li>Indica cuándo ocurre (al frenar, al acelerar).</li>
              <li>Menciona si se prende alguna luz en el tablero.</li>
            </ul>
          </div>
          
          <div className="bg-yellow-50 dark:bg-yellow-950/30 p-4 rounded-lg border border-yellow-100 dark:border-yellow-900">
            <h3 className="font-bold text-yellow-800 dark:text-yellow-300 mb-2">⚠️ Advertencia</h3>
            <p className="text-sm text-yellow-700 dark:text-yellow-400">
              Hugo es una IA de Asistencia Vehicular y puede cometer errores. Para diagnósticos críticos, siempre visita un taller certificado.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
