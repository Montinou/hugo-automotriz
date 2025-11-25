import { db } from "@/db";
import { assistanceRequests, users } from "@/db/schema";
import { stackServerApp } from "@/stack";
import { eq, desc, or } from "drizzle-orm";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Car, Clock, CheckCircle } from "lucide-react";
import { acceptRequest, completeRequest, cancelRequest } from "@/app/actions/workshop";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default async function WorkshopTicketsPage() {
  const user = await stackServerApp.getUser();
  if (!user) return null;

  const dbUser = await db.query.users.findFirst({
    where: eq(users.stackId, user.id),
  });

  if (!dbUser) return <div>Usuario no encontrado</div>;

  // Fetch pending requests (available for everyone)
  const pendingRequests = await db.query.assistanceRequests.findMany({
    where: eq(assistanceRequests.status, "pending"),
    with: {
      user: true,
      vehicle: true,
    },
    orderBy: [desc(assistanceRequests.createdAt)],
  });

  // Fetch active requests (assigned to this provider)
  const activeRequests = await db.query.assistanceRequests.findMany({
    where: (requests, { and, eq }) => and(
      eq(requests.status, "accepted"),
      eq(requests.providerId, dbUser.id)
    ),
    with: {
      user: true,
      vehicle: true,
    },
    orderBy: [desc(assistanceRequests.updatedAt)],
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Gestión de Tickets</h1>
        <p className="text-muted-foreground">Administra las solicitudes de asistencia.</p>
      </div>

      <Tabs defaultValue="pending">
        <TabsList>
          <TabsTrigger value="pending">Bolsa de Tickets ({pendingRequests.length})</TabsTrigger>
          <TabsTrigger value="active">Mis Trabajos Activos ({activeRequests.length})</TabsTrigger>
        </TabsList>
        
        <TabsContent value="pending" className="space-y-4">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {pendingRequests.length === 0 ? (
              <div className="col-span-full text-center py-12 border-2 border-dashed rounded-lg">
                <p className="text-muted-foreground">No hay solicitudes pendientes en este momento.</p>
              </div>
            ) : (
              pendingRequests.map((request) => (
                <RequestCard key={request.id} request={request} type="pending" />
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="active" className="space-y-4">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {activeRequests.length === 0 ? (
              <div className="col-span-full text-center py-12 border-2 border-dashed rounded-lg">
                <p className="text-muted-foreground">No tienes trabajos activos.</p>
              </div>
            ) : (
              activeRequests.map((request) => (
                <RequestCard key={request.id} request={request} type="active" />
              ))
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function RequestCard({ request, type }: { request: any, type: 'pending' | 'active' }) {
  return (
    <Card className="flex flex-col">
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg capitalize">{request.type}</CardTitle>
          <Badge variant={type === 'pending' ? "secondary" : "default"}>
            {type === 'pending' ? 'Pendiente' : 'En Progreso'}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="flex-1 space-y-4">
        <div className="flex items-start gap-3">
          <MapPin className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
          <div className="text-sm">
            <span className="font-medium">Ubicación:</span>
            <div className="text-muted-foreground truncate">
              {request.latitude}, {request.longitude}
            </div>
            <a 
              href={`https://www.google.com/maps?q=${request.latitude},${request.longitude}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-primary hover:underline"
            >
              Ver en mapa
            </a>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <Car className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
          <div className="text-sm">
            <span className="font-medium">Vehículo:</span>
            <div className="text-muted-foreground">
              {request.vehicle?.make} {request.vehicle?.model} ({request.vehicle?.year})
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <Clock className="h-4 w-4" />
          Hace {formatDistanceToNow(request.createdAt, { locale: es })}
        </div>
      </CardContent>
      <CardFooter>
        {type === 'pending' ? (
          <form action={acceptRequest.bind(null, request.id)} className="w-full">
            <Button className="w-full">Aceptar Ticket</Button>
          </form>
        ) : (
          <div className="w-full space-y-2">
            <form action={completeRequest.bind(null, request.id)} className="w-full">
              <Button className="w-full bg-green-600 hover:bg-green-700">
                <CheckCircle className="mr-2 h-4 w-4" />
                Finalizar Trabajo
              </Button>
            </form>
            <form action={cancelRequest.bind(null, request.id)} className="w-full">
              <Button variant="outline" className="w-full text-destructive hover:text-destructive">
                Cancelar
              </Button>
            </form>
          </div>
        )}
      </CardFooter>
    </Card>
  );
}
