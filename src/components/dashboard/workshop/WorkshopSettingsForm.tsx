import { useTransition, useState, useRef } from "react";
import { updateWorkshopSettings } from "@/app/actions/workshop";
import { generateWorkshopImage } from "@/app/actions/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { MapPin, Upload, Sparkles, Loader2, ImageIcon } from "lucide-react";
import { toast } from "sonner";
import { put } from '@vercel/blob';
import Image from "next/image";

interface WorkshopSettingsFormProps {
  initialData: {
    name: string;
    description: string | null;
    phone: string | null;
    address: string;
    latitude: string;
    longitude: string;
    imageUrl: string | null;
  } | null;
}

import { AddressAutocomplete } from "@/components/dashboard/AddressAutocomplete";

export function WorkshopSettingsForm({ initialData }: WorkshopSettingsFormProps) {
  const [isPending, startTransition] = useTransition();
  const [isGenerating, setIsGenerating] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [address, setAddress] = useState(initialData?.address || "");
  const [imageUrl, setImageUrl] = useState(initialData?.imageUrl || "");
  const [coordinates, setCoordinates] = useState<{ lat: string; lng: string } | null>(
    initialData?.latitude && initialData?.longitude 
      ? { lat: initialData.latitude, lng: initialData.longitude } 
      : null
  );
  const [isLocating, setIsLocating] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const nameInputRef = useRef<HTMLInputElement>(null);

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

  async function handleImageUpload(event: React.ChangeEvent<HTMLInputElement>) {
    if (!event.target.files || event.target.files.length === 0) {
      return;
    }
    const file = event.target.files[0];
    setIsUploading(true);

    try {
      const response = await fetch(`/api/upload?filename=${file.name}`, {
        method: 'POST',
        body: file,
      });

      if (!response.ok) throw new Error('Upload failed');
      
      const newBlob = await response.json();
      setImageUrl(newBlob.url);
      toast.success("Imagen subida exitosamente");
    } catch (error) {
      console.error(error);
      toast.error("Error al subir la imagen");
    } finally {
      setIsUploading(false);
    }
  }

  async function handleGenerateImage() {
    const name = nameInputRef.current?.value;
    if (!name) {
      toast.error("Ingresa el nombre del taller primero");
      return;
    }

    setIsGenerating(true);
    try {
      const url = await generateWorkshopImage("modern exterior view, professional signage, clean environment", name);
      setImageUrl(url);
      toast.success("Imagen generada con IA exitosamente");
    } catch (error) {
      console.error(error);
      toast.error("Error al generar la imagen");
    } finally {
      setIsGenerating(false);
    }
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
    <form action={handleSubmit} className="space-y-6">
      <input type="hidden" name="latitude" value={coordinates?.lat || "0"} />
      <input type="hidden" name="longitude" value={coordinates?.lng || "0"} />
      <input type="hidden" name="imageUrl" value={imageUrl} />
      
      <div className="space-y-4">
        <Label>Imagen del Taller</Label>
        <div className="flex flex-col gap-4">
          {imageUrl ? (
            <div className="relative w-full h-48 rounded-lg overflow-hidden border">
              <Image 
                src={imageUrl} 
                alt="Workshop" 
                fill 
                className="object-cover"
              />
              <Button
                type="button"
                variant="destructive"
                size="sm"
                className="absolute top-2 right-2"
                onClick={() => setImageUrl("")}
              >
                Eliminar
              </Button>
            </div>
          ) : (
            <div className="flex items-center justify-center w-full h-48 border-2 border-dashed rounded-lg bg-muted/50">
              <div className="flex flex-col items-center gap-2 text-muted-foreground">
                <ImageIcon className="h-8 w-8" />
                <span>No hay imagen seleccionada</span>
              </div>
            </div>
          )}

          <div className="flex gap-2">
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/*"
              onChange={handleImageUpload}
            />
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading || isGenerating}
            >
              {isUploading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Upload className="mr-2 h-4 w-4" />}
              Subir Imagen
            </Button>
            <Button 
              type="button" 
              variant="secondary" 
              onClick={handleGenerateImage}
              disabled={isUploading || isGenerating}
            >
              {isGenerating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
              Generar con IA
            </Button>
          </div>
        </div>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="name">Nombre del Taller</Label>
        <Input 
          id="name" 
          name="name" 
          ref={nameInputRef}
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
