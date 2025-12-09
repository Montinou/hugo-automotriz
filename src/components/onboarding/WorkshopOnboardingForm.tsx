"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Wrench, MapPin, Sparkles, Loader2 } from "lucide-react";
import { AddressAutocomplete } from "@/components/dashboard/AddressAutocomplete";
import { improveDescription } from "@/app/actions/improve-description";
import { toast } from "sonner";

interface WorkshopOnboardingFormProps {
  formData: {
    workshopName: string;
    description: string;
    phone: string;
    address: string;
    latitude: string;
    longitude: string;
  };
  onChange: (field: string, value: string) => void;
}

export function WorkshopOnboardingForm({ formData, onChange }: WorkshopOnboardingFormProps) {
  const [isImproving, setIsImproving] = useState(false);

  const handleImproveDescription = async () => {
    if (!formData.description || formData.description.trim().length < 10) {
      toast.error("Escribe al menos 10 caracteres para mejorar la descripción");
      return;
    }

    setIsImproving(true);
    try {
      const improved = await improveDescription(formData.description);
      onChange("description", improved);
      toast.success("Descripción mejorada con IA");
    } catch (error) {
      toast.error("No se pudo mejorar la descripción");
    } finally {
      setIsImproving(false);
    }
  };

  const handleAddressSelect = (address: string, lat: string, lng: string) => {
    onChange("address", address);
    onChange("latitude", lat);
    onChange("longitude", lng);
  };

  return (
    <div className="space-y-6 w-full max-w-2xl">
      {/* Información del Taller */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/10">
              <Wrench className="h-5 w-5 text-accent" />
            </div>
            <div>
              <CardTitle className="text-lg">Información del Taller</CardTitle>
              <CardDescription>Datos básicos de tu negocio</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="workshopName">Nombre del Taller *</Label>
              <Input
                id="workshopName"
                placeholder="Taller Mecánico Hugo"
                value={formData.workshopName}
                onChange={(e) => onChange("workshopName", e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Teléfono *</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+591 70000000"
                value={formData.phone}
                onChange={(e) => onChange("phone", e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="description">Descripción de Servicios *</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleImproveDescription}
                disabled={isImproving || !formData.description}
                className="gap-1"
              >
                {isImproving ? (
                  <Loader2 className="h-3 w-3 animate-spin" />
                ) : (
                  <Sparkles className="h-3 w-3" />
                )}
                Mejorar con IA
              </Button>
            </div>
            <Textarea
              id="description"
              placeholder="Ej: Hacemos cambio de aceite, reparación de frenos, servicio eléctrico y gomería..."
              value={formData.description}
              onChange={(e) => onChange("description", e.target.value)}
              className="min-h-[100px]"
              required
            />
            <p className="text-xs text-muted-foreground">
              Describe los servicios que ofreces. La IA clasificará tu taller automáticamente.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Ubicación */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/10">
              <MapPin className="h-5 w-5 text-accent" />
            </div>
            <div>
              <CardTitle className="text-lg">Ubicación</CardTitle>
              <CardDescription>¿Dónde se encuentra tu taller?</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Dirección *</Label>
            <AddressAutocomplete
              onAddressSelect={handleAddressSelect}
              defaultValue={formData.address}
            />
            {formData.address && (
              <p className="text-sm text-muted-foreground">
                Seleccionado: {formData.address}
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
