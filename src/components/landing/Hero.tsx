import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Car, Wrench } from "lucide-react";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-background">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />

      <div className="container relative z-10 mx-auto px-4 md:px-6 py-8 md:py-12">
        <div className="grid gap-8 lg:grid-cols-2 items-center">
          {/* Text Content */}
          <div className="flex flex-col justify-center space-y-6">
            <div className="space-y-4">
              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
                Tu Copiloto en Cada Ruta
              </h1>
              <p className="text-muted-foreground text-base md:text-lg max-w-lg">
                Asistencia vehicular inmediata y gestión de talleres confiables.
                Desde una llanta pinchada en el Urubó hasta un mantenimiento completo en Santa Cruz.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Link href="/dashboard/request">
                <Button size="lg" className="w-full sm:w-auto gap-2 bg-accent hover:bg-accent/90 text-white">
                  <Car className="h-5 w-5" />
                  Pedir Asistencia Ahora
                </Button>
              </Link>
              <Link href="/sign-up?role=workshop">
                <Button size="lg" variant="outline" className="w-full sm:w-auto gap-2">
                  <Wrench className="h-5 w-5" />
                  Registrar mi Taller
                </Button>
              </Link>
            </div>

            <div className="flex items-center gap-6 text-sm text-muted-foreground pt-2">
              <div className="flex items-center gap-1.5">
                <span className="font-semibold text-foreground">500+</span> Talleres
              </div>
              <div className="h-4 w-px bg-border" />
              <div className="flex items-center gap-1.5">
                <span className="font-semibold text-foreground">24/7</span> Soporte
              </div>
              <div className="h-4 w-px bg-border" />
              <div className="flex items-center gap-1.5">
                <span className="font-semibold text-foreground">Bolivia</span> Cobertura
              </div>
            </div>
          </div>

          {/* Image */}
          <div className="relative order-first lg:order-last">
            <div className="absolute -inset-4 bg-gradient-to-tr from-primary/10 to-accent/10 rounded-3xl blur-2xl" />
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border bg-card">
              <img
                src="https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?q=80&w=1600&auto=format&fit=crop"
                alt="Mecánico profesional trabajando"
                className="w-full h-[280px] sm:h-[320px] md:h-[380px] object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
