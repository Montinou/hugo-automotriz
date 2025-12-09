"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { PricingCard } from "./PricingCard";
import { mockSubscribeAction, type PlanType } from "@/app/actions/subscription";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Crown, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

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
      "1 solicitud de asistencia/mes",
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
      "Solicitudes ilimitadas",
      "Analisis de mantenimiento predictivo",
      "Historial completo de servicios",
      "Soporte prioritario",
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

interface PricingModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentPlan: PlanType;
  reason?: string;
}

export function PricingModal({
  open,
  onOpenChange,
  currentPlan,
  reason,
}: PricingModalProps) {
  const [loadingPlan, setLoadingPlan] = useState<PlanType | null>(null);
  const [activePlan, setActivePlan] = useState<PlanType>(currentPlan);
  const router = useRouter();

  const handleSubscribe = async (plan: PlanType) => {
    if (plan === activePlan) return;

    setLoadingPlan(plan);

    try {
      const result = await mockSubscribeAction(plan);

      if (result.success) {
        setActivePlan(plan);
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
        onOpenChange(false);
      }
    } catch (error) {
      toast.error("Error al procesar la suscripcion");
      console.error(error);
    } finally {
      setLoadingPlan(null);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="text-center pb-4">
          <div className="flex justify-center mb-4">
            <div className="bg-primary/10 p-3 rounded-full">
              <Crown className="h-8 w-8 text-primary" />
            </div>
          </div>
          <DialogTitle className="text-2xl">Actualiza tu Plan</DialogTitle>
          <DialogDescription>
            Desbloquea todo el potencial de Hugo AI
          </DialogDescription>
        </DialogHeader>

        {reason && (
          <Alert className="mb-4 border-orange-200 bg-orange-50 dark:bg-orange-950/20">
            <AlertCircle className="h-4 w-4 text-orange-600" />
            <AlertDescription className="text-orange-700 dark:text-orange-400">
              {reason}
            </AlertDescription>
          </Alert>
        )}

        <div className="grid md:grid-cols-3 gap-4">
          {PLANS.map((plan) => (
            <PricingCard
              key={plan.id}
              name={plan.name}
              price={plan.price}
              description={plan.description}
              features={plan.features}
              isPopular={plan.isPopular}
              isCurrentPlan={activePlan === plan.id}
              isLoading={loadingPlan === plan.id}
              onSubscribe={() => handleSubscribe(plan.id)}
            />
          ))}
        </div>

        <p className="text-center text-xs text-muted-foreground mt-4">
          Todos los precios estan en Bolivianos (Bs). Cancela cuando quieras.
        </p>
      </DialogContent>
    </Dialog>
  );
}
