"use client";

import { useState } from "react";
import { PricingCard } from "@/components/pricing/PricingCard";
import { mockSubscribeAction, type PlanType } from "@/app/actions/subscription";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Car, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const PLANS = [
  {
    id: "free" as PlanType,
    name: "Gratis",
    price: 0,
    description: "Perfecto para comenzar",
    features: [
      "Chat IA Hugo (5 mensajes/dia)",
      "1 vehiculo registrado",
      "Busqueda de talleres cercanos",
      "Solicitar asistencia vial",
    ],
    isPopular: false,
  },
  {
    id: "pro" as PlanType,
    name: "Pro",
    price: 99,
    description: "Para conductores frecuentes",
    features: [
      "Chat IA Hugo ilimitado",
      "Hasta 5 vehiculos",
      "Analisis de mantenimiento predictivo",
      "Historial completo de servicios",
      "Soporte prioritario",
      "Descuentos en talleres asociados",
    ],
    isPopular: true,
  },
  {
    id: "enterprise" as PlanType,
    name: "Empresarial",
    price: 299,
    description: "Para flotas y empresas",
    features: [
      "Todo lo de Pro",
      "Vehiculos ilimitados",
      "Panel de administracion de flota",
      "Reportes avanzados (CSV/PDF)",
      "API de integracion",
      "Gerente de cuenta dedicado",
    ],
    isPopular: false,
  },
];

interface PricingPageClientProps {
  initialPlan: PlanType;
}

export function PricingPageClient({ initialPlan }: PricingPageClientProps) {
  const [loadingPlan, setLoadingPlan] = useState<PlanType | null>(null);
  const [currentPlan, setCurrentPlan] = useState<PlanType>(initialPlan);
  const router = useRouter();

  const handleSubscribe = async (plan: PlanType) => {
    if (plan === currentPlan) return;

    setLoadingPlan(plan);

    try {
      const result = await mockSubscribeAction(plan);

      if (result.success) {
        setCurrentPlan(plan);
        toast.success(
          plan === "free"
            ? "Has vuelto al plan gratuito"
            : `Bienvenido al plan ${plan.charAt(0).toUpperCase() + plan.slice(1)}!`,
          {
            description: plan !== "free"
              ? "Tu suscripcion esta activa por 30 dias"
              : undefined,
          }
        );
        router.refresh();
      }
    } catch (error) {
      toast.error("Error al procesar la suscripcion");
      console.error(error);
    } finally {
      setLoadingPlan(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      <div className="container mx-auto px-4 py-12">
        {/* Back button */}
        <div className="mb-8">
          <Button variant="ghost" asChild>
            <Link href="/dashboard">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver al Dashboard
            </Link>
          </Button>
        </div>

        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-full mb-4">
            <Car className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight mb-4">
            Elige tu Plan
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Desbloquea todo el potencial de Hugo AI y lleva el cuidado de tu vehiculo al siguiente nivel
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {PLANS.map((plan) => (
            <PricingCard
              key={plan.id}
              name={plan.name}
              price={plan.price}
              description={plan.description}
              features={plan.features}
              isPopular={plan.isPopular}
              isCurrentPlan={currentPlan === plan.id}
              isLoading={loadingPlan === plan.id}
              onSubscribe={() => handleSubscribe(plan.id)}
            />
          ))}
        </div>

        {/* Footer note */}
        <p className="text-center text-sm text-muted-foreground mt-12">
          Todos los precios estan en Bolivianos (Bs). Cancela cuando quieras.
        </p>
      </div>
    </div>
  );
}
