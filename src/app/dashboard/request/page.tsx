"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ServiceSelector, ServiceType } from "@/components/assistance/ServiceSelector";
import { TrackingView } from "@/components/assistance/TrackingView";
import { ArrowLeft, MapPin, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useGeolocation } from "@/hooks/useGeolocation";
import { createAssistanceRequest } from "@/app/actions/request";

// Dynamically import MapPicker to avoid SSR issues with Leaflet
const MapPicker = dynamic(() => import("@/components/assistance/MapPicker"), {
  ssr: false,
  loading: () => <div className="h-[400px] w-full bg-muted animate-pulse rounded-lg flex items-center justify-center">Cargando mapa...</div>,
});

type Step = "location" | "service" | "summary" | "tracking";

const SERVICE_DETAILS: Record<ServiceType, { label: string; price: number }> = {
  tow: { label: "Grúa", price: 250 },
  battery: { label: "Batería", price: 100 },
  tire: { label: "Llanta Baja", price: 80 },
  fuel: { label: "Gasolina", price: 120 },
  mechanic: { label: "Mecánico", price: 150 },
};

export default function RequestPage() {
  const [step, setStep] = useState<Step>("location");
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [service, setService] = useState<ServiceType | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [requestId, setRequestId] = useState<number | null>(null);
  
  const { latitude, longitude, loading: geoLoading } = useGeolocation();

  // Auto-set location when geolocation is available and not yet set manually
  useEffect(() => {
    if (latitude && longitude && !location) {
      setLocation({ lat: latitude, lng: longitude });
    }
  }, [latitude, longitude, location]);

  const handleLocationSelect = (lat: number, lng: number) => {
    setLocation({ lat, lng });
  };

  const handleRequest = async () => {
    if (!location || !service) return;

    setIsSearching(true);
    try {
      const request = await createAssistanceRequest({
        latitude: location.lat,
        longitude: location.lng,
        serviceType: service,
      });
      
      setRequestId(request.id);
      setStep("tracking");
      toast.success("¡Solicitud enviada! Buscando proveedores cercanos...");
    } catch (error) {
      console.error(error);
      toast.error("Error al crear la solicitud. Intenta nuevamente.");
    } finally {
      setIsSearching(false);
    }
  };

  if (step === "tracking" && requestId) {
    return (
      <div className="container max-w-md mx-auto py-6 px-4">
        <TrackingView requestId={requestId} startTime={new Date()} estimatedDurationMinutes={15} />
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
          <p className="text-muted-foreground">
            {geoLoading ? "Obteniendo tu ubicación..." : "Mueve el pin a tu ubicación exacta."}
          </p>
          <MapPicker 
            onLocationSelect={handleLocationSelect} 
            initialLocation={location || undefined}
          />
          <Button 
            className="w-full" 
            size="lg" 
            disabled={!location}
            onClick={() => setStep("service")}
          >
            {location ? "Confirmar Ubicación" : "Selecciona una ubicación"}
          </Button>
        </div>
      )}

      {step === "service" && (
        <div className="space-y-4">
          <ServiceSelector selected={service} onSelect={setService} />
          <div className="flex gap-4">
            <Button 
              className="flex-1" 
              size="lg" 
              disabled={!service}
              onClick={() => setStep("summary")}
            >
              Continuar
            </Button>
          </div>
          <p className="text-xs text-center text-muted-foreground">
            ¿Necesitas registrar un vehículo? <a href="/dashboard/driver/settings" className="underline text-primary">Ve a Configuración</a>
          </p>
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
              <span className="font-medium capitalize">{service && SERVICE_DETAILS[service].label}</span>
              <span className="font-bold text-lg">Bs. {service && SERVICE_DETAILS[service].price.toFixed(2)}</span>
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
              {isSearching ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creando solicitud...
                </>
              ) : "Confirmar Pedido"}
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}
