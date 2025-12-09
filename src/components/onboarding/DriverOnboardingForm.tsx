"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Car } from "lucide-react";

interface DriverOnboardingFormProps {
  formData: {
    fullName: string;
    phone: string;
    vehicleMake: string;
    vehicleModel: string;
    vehicleYear: string;
    vehiclePlate: string;
    vehicleColor: string;
  };
  onChange: (field: string, value: string) => void;
}

export function DriverOnboardingForm({ formData, onChange }: DriverOnboardingFormProps) {
  return (
    <div className="space-y-6 w-full max-w-2xl">
      {/* Información Personal */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
              <User className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg">Información Personal</CardTitle>
              <CardDescription>Completa tus datos de contacto</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="fullName">Nombre Completo *</Label>
              <Input
                id="fullName"
                placeholder="Juan Pérez"
                value={formData.fullName}
                onChange={(e) => onChange("fullName", e.target.value)}
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
        </CardContent>
      </Card>

      {/* Información del Vehículo */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
              <Car className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg">Tu Primer Vehículo</CardTitle>
              <CardDescription>Registra tu vehículo para solicitar asistencia</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="vehicleMake">Marca *</Label>
              <Input
                id="vehicleMake"
                placeholder="Toyota"
                value={formData.vehicleMake}
                onChange={(e) => onChange("vehicleMake", e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="vehicleModel">Modelo *</Label>
              <Input
                id="vehicleModel"
                placeholder="Corolla"
                value={formData.vehicleModel}
                onChange={(e) => onChange("vehicleModel", e.target.value)}
                required
              />
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="vehicleYear">Año *</Label>
              <Input
                id="vehicleYear"
                type="number"
                placeholder="2020"
                min="1990"
                max={new Date().getFullYear() + 1}
                value={formData.vehicleYear}
                onChange={(e) => onChange("vehicleYear", e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="vehiclePlate">Placa *</Label>
              <Input
                id="vehiclePlate"
                placeholder="ABC-1234"
                value={formData.vehiclePlate}
                onChange={(e) => onChange("vehiclePlate", e.target.value.toUpperCase())}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="vehicleColor">Color</Label>
              <Input
                id="vehicleColor"
                placeholder="Blanco"
                value={formData.vehicleColor}
                onChange={(e) => onChange("vehicleColor", e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
