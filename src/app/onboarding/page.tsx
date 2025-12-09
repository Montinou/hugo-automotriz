"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Car, Wrench, ArrowLeft, ArrowRight, Loader2, CheckCircle2 } from "lucide-react";
import { completeOnboarding } from "@/app/actions/onboarding";
import { DriverOnboardingForm } from "@/components/onboarding/DriverOnboardingForm";
import { WorkshopOnboardingForm } from "@/components/onboarding/WorkshopOnboardingForm";
import { toast } from "sonner";

type Role = "driver" | "workshop_owner" | null;

interface DriverFormData {
  fullName: string;
  phone: string;
  vehicleMake: string;
  vehicleModel: string;
  vehicleYear: string;
  vehiclePlate: string;
  vehicleColor: string;
}

interface WorkshopFormData {
  workshopName: string;
  description: string;
  phone: string;
  address: string;
  latitude: string;
  longitude: string;
}

export default function OnboardingPage() {
  const [step, setStep] = useState(1);
  const [selectedRole, setSelectedRole] = useState<Role>(null);
  const [isPending, startTransition] = useTransition();

  const [driverData, setDriverData] = useState<DriverFormData>({
    fullName: "",
    phone: "",
    vehicleMake: "",
    vehicleModel: "",
    vehicleYear: "",
    vehiclePlate: "",
    vehicleColor: "",
  });

  const [workshopData, setWorkshopData] = useState<WorkshopFormData>({
    workshopName: "",
    description: "",
    phone: "",
    address: "",
    latitude: "",
    longitude: "",
  });

  const handleRoleSelect = (role: Role) => {
    setSelectedRole(role);
    setStep(2);
  };

  const handleBack = () => {
    setStep(1);
    setSelectedRole(null);
  };

  const handleDriverChange = (field: string, value: string) => {
    setDriverData((prev) => ({ ...prev, [field]: value }));
  };

  const handleWorkshopChange = (field: string, value: string) => {
    setWorkshopData((prev) => ({ ...prev, [field]: value }));
  };

  const validateDriverForm = (): boolean => {
    if (!driverData.fullName.trim()) {
      toast.error("El nombre completo es requerido");
      return false;
    }
    if (!driverData.phone.trim()) {
      toast.error("El teléfono es requerido");
      return false;
    }
    if (!driverData.vehicleMake.trim()) {
      toast.error("La marca del vehículo es requerida");
      return false;
    }
    if (!driverData.vehicleModel.trim()) {
      toast.error("El modelo del vehículo es requerido");
      return false;
    }
    if (!driverData.vehicleYear.trim()) {
      toast.error("El año del vehículo es requerido");
      return false;
    }
    if (!driverData.vehiclePlate.trim()) {
      toast.error("La placa del vehículo es requerida");
      return false;
    }
    return true;
  };

  const validateWorkshopForm = (): boolean => {
    if (!workshopData.workshopName.trim()) {
      toast.error("El nombre del taller es requerido");
      return false;
    }
    if (!workshopData.description.trim()) {
      toast.error("La descripción es requerida");
      return false;
    }
    if (!workshopData.phone.trim()) {
      toast.error("El teléfono es requerido");
      return false;
    }
    if (!workshopData.address.trim()) {
      toast.error("La dirección es requerida");
      return false;
    }
    return true;
  };

  const handleSubmit = () => {
    if (selectedRole === "driver") {
      if (!validateDriverForm()) return;

      startTransition(async () => {
        try {
          await completeOnboarding({
            role: "driver",
            ...driverData,
          });
        } catch (error) {
          toast.error("Error al completar el registro");
          console.error(error);
        }
      });
    } else if (selectedRole === "workshop_owner") {
      if (!validateWorkshopForm()) return;

      startTransition(async () => {
        try {
          await completeOnboarding({
            role: "workshop_owner",
            ...workshopData,
          });
        } catch (error) {
          toast.error("Error al completar el registro");
          console.error(error);
        }
      });
    }
  };

  return (
    <div className="container mx-auto flex min-h-screen flex-col items-center justify-center py-10 px-4">
      {/* Progress Indicator */}
      <div className="mb-8 flex items-center gap-2">
        <div
          className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium ${
            step >= 1 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
          }`}
        >
          {step > 1 ? <CheckCircle2 className="h-5 w-5" /> : "1"}
        </div>
        <div className={`h-1 w-12 rounded ${step >= 2 ? "bg-primary" : "bg-muted"}`} />
        <div
          className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium ${
            step >= 2 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
          }`}
        >
          2
        </div>
      </div>

      {/* Step 1: Role Selection */}
      {step === 1 && (
        <>
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold">
              ¡Bienvenido a <span className="text-accent">Asistencia</span>{" "}
              <span className="text-primary">Vehicular AI</span>!
            </h1>
            <p className="text-muted-foreground mt-2">
              Para comenzar, cuéntanos cómo planeas usar la plataforma.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 max-w-4xl w-full">
            {/* Driver Option */}
            <button
              type="button"
              onClick={() => handleRoleSelect("driver")}
              className="w-full h-full text-left"
            >
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

            {/* Workshop Option */}
            <button
              type="button"
              onClick={() => handleRoleSelect("workshop_owner")}
              className="w-full h-full text-left"
            >
              <Card className="h-full cursor-pointer transition-all hover:border-accent hover:shadow-lg">
                <CardHeader>
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-accent/10">
                    <Wrench className="h-6 w-6 text-accent" />
                  </div>
                  <CardTitle>Soy Dueño de Taller</CardTitle>
                  <CardDescription>
                    Quiero ofrecer mis servicios, gestionar citas y conseguir más clientes.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc pl-4 text-sm text-muted-foreground space-y-2">
                    <li>Recibe solicitudes de auxilio cercanas</li>
                    <li>Gestiona tu agenda de citas online</li>
                    <li>Promociona tus servicios y ofertas</li>
                  </ul>
                </CardContent>
              </Card>
            </button>
          </div>
        </>
      )}

      {/* Step 2: Complete Profile */}
      {step === 2 && (
        <>
          <div className="mb-8 text-center">
            <h1 className="text-2xl font-bold">
              {selectedRole === "driver" ? "Completa tu Perfil" : "Configura tu Taller"}
            </h1>
            <p className="text-muted-foreground mt-2">
              {selectedRole === "driver"
                ? "Ingresa tus datos y registra tu primer vehículo"
                : "Ingresa la información de tu taller para comenzar"}
            </p>
          </div>

          {selectedRole === "driver" && (
            <DriverOnboardingForm formData={driverData} onChange={handleDriverChange} />
          )}

          {selectedRole === "workshop_owner" && (
            <WorkshopOnboardingForm formData={workshopData} onChange={handleWorkshopChange} />
          )}

          {/* Navigation Buttons */}
          <div className="mt-8 flex w-full max-w-2xl justify-between gap-4">
            <Button type="button" variant="outline" onClick={handleBack} disabled={isPending}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Atrás
            </Button>
            <Button type="button" onClick={handleSubmit} disabled={isPending}>
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Guardando...
                </>
              ) : (
                <>
                  Finalizar
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
