"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ServiceSelector, ServiceType } from "@/components/assistance/ServiceSelector";
import { TrackingView } from "@/components/assistance/TrackingView";
import { ArrowLeft, MapPin } from "lucide-react";
import { toast } from "sonner";

// Dynamically import MapPicker to avoid SSR issues with Leaflet
const MapPicker = dynamic(() => import("@/components/assistance/MapPicker"), {
  ssr: false,
  loading: () => <div className="h-[400px] w-full bg-muted animate-pulse rounded-lg flex items-center justify-center">Cargando mapa...</div>,
});

type Step = "location" | "service" | "summary" | "tracking";

export default function RequestPage() {
  const [step, setStep] = useState<Step>("location");
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [service, setService] = useState<ServiceType | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  const handleLocationSelect = (lat: number, lng: number) => {
    setLocation({ lat, lng });
  };

  const handleRequest = async () => {
    setIsSearching(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 3000));
    setIsSearching(false);
    setStep("tracking");
    toast.success("¡Proveedor encontrado!");
  };

  if (step === "tracking") {
    return (
      <div className="container max-w-md mx-auto py-6 px-4">
        <TrackingView />
      </div>
    );
  }

  return (
    <div className="container max-w-2xl mx-auto py-6 px-4 space-y-6">
      <div className="flex items-center gap-4 mb-6">
        {step !== "location" && (
          <Button variant="ghost" size="icon" onClick={() => setStep(step === "summary" ? "service" : "location")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
        )}
        <h1 className="text-2xl font-bold">
          {step === "location" && "Confirmar Ubicación"}
          {step === "service" && "Seleccionar Servicio"}
          {step === "summary" && "Resumen del Pedido"}
        </h1>
      </div>

      {step === "location" && (
        <div className="space-y-4">
          <p className="text-muted-foreground">Mueve el pin a tu ubicación exacta.</p>
          <MapPicker onLocationSelect={handleLocationSelect} />
          <Button 
            className="w-full" 
            size="lg" 
            disabled={!location}
            onClick={() => setStep("service")}
          >
            Confirmar Ubicación
          </Button>
        </div>
      )}

      {step === "service" && (
        <div className="space-y-4">
          <ServiceSelector selected={service} onSelect={setService} />
          <Button 
            className="w-full" 
            size="lg" 
            disabled={!service}
            onClick={() => setStep("summary")}
          >
            Continuar
          </Button>
        </div>
      )}

      {step === "summary" && (
        <Card>
          <CardHeader>
            <CardTitle>Detalles del Servicio</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
              <MapPin className="h-5 w-5 text-primary" />
              <div>
                <div className="font-medium">Ubicación Seleccionada</div>
                <div className="text-sm text-muted-foreground">
                  {location?.lat.toFixed(4)}, {location?.lng.toFixed(4)}
                </div>
              </div>
            </div>
            
            <div className="flex justify-between items-center py-4 border-t border-b">
              <span className="font-medium capitalize">{service}</span>
              <span className="font-bold text-lg">Bs. 150.00</span>
            </div>
            
            <p className="text-xs text-muted-foreground text-center">
              El precio final puede variar según la complejidad del servicio.
            </p>
          </CardContent>
          <CardFooter>
            <Button 
              className="w-full" 
              size="lg" 
              onClick={handleRequest} 
              disabled={isSearching}
            >
              {isSearching ? "Buscando conductor..." : "Confirmar Pedido"}
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}
