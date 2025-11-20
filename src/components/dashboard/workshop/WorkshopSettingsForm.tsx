'use client';

import { useTransition } from "react";
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

export function WorkshopSettingsForm({ initialData }: WorkshopSettingsFormProps) {
  const [isPending, startTransition] = useTransition();

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

  return (
    <form action={handleSubmit} className="space-y-4">
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
        <div className="flex gap-2">
          <Input 
            id="address" 
            name="address" 
            defaultValue={initialData?.address || ""} 
            placeholder="Av. Banzer 4to Anillo..." 
            required 
          />
          <Button type="button" variant="outline" size="icon" title="Usar mi ubicación actual">
            <MapPin className="h-4 w-4" />
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">
          Coordenadas actuales: {initialData?.latitude ?? "N/A"}, {initialData?.longitude ?? "N/A"}
        </p>
      </div>

      <Button type="submit" disabled={isPending}>
        {isPending ? "Guardando..." : "Guardar Cambios"}
      </Button>
    </form>
  );
}
