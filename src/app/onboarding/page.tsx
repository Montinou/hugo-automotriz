import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Car, Wrench } from "lucide-react";
import { completeOnboarding } from "@/app/actions/onboarding";
import { WorkshopDescriptionInput } from "@/components/onboarding/WorkshopDescriptionInput";

export default function OnboardingPage() {
  return (
    <div className="container mx-auto flex min-h-screen flex-col items-center justify-center py-10">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold">
          ¡Bienvenido a <span className="text-accent">Asistencia</span>{" "}
          <span className="text-primary">Vehicular AI</span>!
        </h1>
        <p className="text-muted-foreground">Para comenzar, cuéntanos cómo planeas usar la plataforma.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 max-w-4xl w-full px-4">
        {/* Driver Option */}
        <form action={completeOnboarding} className="h-full">
          <input type="hidden" name="role" value="driver" />
          <button type="submit" className="w-full h-full text-left">
            <Card className="h-full cursor-pointer transition-all hover:border-primary hover:shadow-lg">
              <CardHeader>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <Car className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Soy Conductor</CardTitle>
                <CardDescription>
                  Busco asistencia vehicular, grúas o talleres mecánicos confiables.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="list-disc pl-4 text-sm text-muted-foreground space-y-2">
                  <li>Solicita grúas y auxilio mecánico 24/7</li>
                  <li>Encuentra talleres cercanos y calificados</li>
                  <li>Agenda citas de mantenimiento</li>
                  <li>Lleva el historial de tu vehículo</li>
                </ul>
              </CardContent>
            </Card>
          </button>
        </form>

        {/* Workshop Option */}
        <form action={completeOnboarding} className="h-full">
          <input type="hidden" name="role" value="workshop_owner" />
          <button type="submit" className="w-full h-full text-left group">
            <Card className="h-full cursor-pointer transition-all hover:border-accent hover:shadow-lg group-focus-within:border-accent group-focus-within:shadow-lg">
              <CardHeader>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-accent/10">
                  <Wrench className="h-6 w-6 text-accent" />
                </div>
                <CardTitle>Soy Dueño de Taller</CardTitle>
                <CardDescription>
                  Quiero ofrecer mis servicios, gestionar citas y conseguir más clientes.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="list-disc pl-4 text-sm text-muted-foreground space-y-2">
                  <li>Recibe solicitudes de auxilio cercanas</li>
                  <li>Gestiona tu agenda de citas online</li>
                  <li>Promociona tus servicios y ofertas</li>
                </ul>
                
                <WorkshopDescriptionInput />
              </CardContent>
            </Card>
          </button>
        </form>
      </div>
    </div>
  );
}
