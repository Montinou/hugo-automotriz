import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Car, Wrench } from "lucide-react";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-background py-12 md:py-20">
      <div className="container relative z-10 mx-auto px-4 md:px-6">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-8 items-center">
          <div className="flex flex-col justify-center space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
                Tu Copiloto en Cada Ruta
              </h1>
              <p className="max-w-[600px] text-muted-foreground md:text-xl">
                Asistencia vehicular inmediata y gestión de talleres confiables. 
                Desde una llanta pinchada en el Urubó hasta un mantenimiento completo en Santa Cruz.
              </p>
            </div>
            <div className="flex flex-col gap-4 min-[400px]:flex-row">
              <Link href="/dashboard/request">
                <Button size="lg" className="w-full min-[400px]:w-auto gap-2 bg-accent hover:bg-accent/90 text-white border-0">
                  <Car className="h-5 w-5" />
                  Pedir Asistencia Ahora
                </Button>
              </Link>
              <Link href="/sign-up?role=workshop">
                <Button size="lg" variant="outline" className="w-full min-[400px]:w-auto gap-2">
                  <Wrench className="h-5 w-5" />
                  Registrar mi Taller
                </Button>
              </Link>
            </div>
            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <span className="font-bold text-foreground">500+</span> Talleres
              </div>
              <div className="h-4 w-px bg-border" />
              <div className="flex items-center gap-1">
                <span className="font-bold text-foreground">24/7</span> Soporte
              </div>
              <div className="h-4 w-px bg-border" />
              <div className="flex items-center gap-1">
                <span className="font-bold text-foreground">Bolivia</span> Cobertura
              </div>
            </div>
          </div>
          <div className="mx-auto lg:mr-0 relative">
             {/* Placeholder for a nice 3D car image or illustration */}
            <div className="relative h-[400px] w-[400px] sm:h-[500px] sm:w-[500px] rounded-full bg-gradient-to-tr from-primary/20 to-accent/20 blur-3xl absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
            <div className="relative rounded-xl border bg-card p-2 shadow-2xl ring-1 ring-border">
                <div className="aspect-video overflow-hidden rounded-lg bg-muted flex items-center justify-center relative">
                    <img 
                      src="https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?q=80&w=1600&auto=format&fit=crop" 
                      alt="Asistencia Vehicular AI Luxury SUV" 
                      className="object-cover w-full h-full"
                    />
                </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
