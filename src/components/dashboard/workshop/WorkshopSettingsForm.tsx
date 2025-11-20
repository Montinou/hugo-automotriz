'use client';

import { useTransition, useState } from "react";
import { updateWorkshopSettings } from "@/app/actions/workshop";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { MapPin } from "lucide-react";
import { toast } from "sonner";

interface WorkshopSettingsFormProps {
  initialData: {
    name: string;
    description: string | null;
    phone: string | null;
    address: string;
    latitude: string;
    longitude: string;
  } | null;
}

import { AddressAutocomplete } from "@/components/dashboard/AddressAutocomplete";

export function WorkshopSettingsForm({ initialData }: WorkshopSettingsFormProps) {
  const [isPending, startTransition] = useTransition();
  const [address, setAddress] = useState(initialData?.address || "");
  const [coordinates, setCoordinates] = useState<{ lat: string; lng: string } | null>(
    initialData?.latitude && initialData?.longitude 
      ? { lat: initialData.latitude, lng: initialData.longitude } 
      : null
  );
  const [isLocating, setIsLocating] = useState(false);

  async function handleSubmit(formData: FormData) {
    startTransition(async () => {
      try {
        await updateWorkshopSettings(formData);
        toast.success("Configuración del taller actualizada");
      } catch (error) {
        console.error(error);
        toast.error("Error al actualizar la configuración");
      }
    });
  }

  function handleGeolocation() {
    if (!navigator.geolocation) {
      toast.error("Tu navegador no soporta geolocalización");
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCoordinates({
          lat: position.coords.latitude.toString(),
          lng: position.coords.longitude.toString(),
        });
        setIsLocating(false);
        toast.success("Ubicación actualizada");
      },
      (error) => {
        console.error(error);
        setIsLocating(false);
        toast.error("No se pudo obtener tu ubicación. Verifica los permisos.");
      }
    );
  }

  return (
    <form action={handleSubmit} className="space-y-4">
      <input type="hidden" name="latitude" value={coordinates?.lat || "0"} />
      <input type="hidden" name="longitude" value={coordinates?.lng || "0"} />
      
      <div className="grid gap-2">
        <Label htmlFor="name">Nombre del Taller</Label>
        <Input 
          id="name" 
          name="name" 
          defaultValue={initialData?.name || ""} 
          placeholder="Ej: Taller Mecánico Hugo" 
          required 
        />
      </div>
      
      <div className="grid gap-2">
        <Label htmlFor="description">Descripción</Label>
        <Textarea 
          id="description" 
          name="description"
          defaultValue={initialData?.description || ""} 
          placeholder="Describe tus especialidades y servicios..." 
          className="min-h-[100px]"
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="phone">Teléfono de Contacto</Label>
        <Input 
          id="phone" 
          name="phone" 
          defaultValue={initialData?.phone || ""} 
          placeholder="+591 ..." 
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="address">Dirección</Label>
        <input type="hidden" name="address" value={address} />
        <div className="flex gap-2">
          <div className="flex-1">
            <AddressAutocomplete 
              defaultValue={address}
              onAddressSelect={(newAddress, lat, lng) => {
                setAddress(newAddress);
                setCoordinates({ lat, lng });
                toast.success("Ubicación actualizada desde Google Maps");
              }}
            />
          </div>
          <Button 
            type="button" 
            variant="outline" 
            size="icon" 
            title="Usar mi ubicación actual"
            onClick={handleGeolocation}
            disabled={isLocating}
          >
            <MapPin className={`h-4 w-4 ${isLocating ? 'animate-pulse text-primary' : ''}`} />
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">
          Coordenadas: {coordinates ? `${coordinates.lat}, ${coordinates.lng}` : "No definidas"}
        </p>
      </div>

      <Button type="submit" disabled={isPending}>
        {isPending ? "Guardando..." : "Guardar Cambios"}
      </Button>
    </form>
  );
}
