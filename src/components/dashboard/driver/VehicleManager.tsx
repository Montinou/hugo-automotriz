'use client';

import { useState, useTransition } from "react";
import { addVehicle, deleteVehicle } from "@/app/actions/driver";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, Trash2, Car, Gauge } from "lucide-react";
import { toast } from "sonner";
import { usePricingModal } from "@/contexts/PricingModalContext";

interface Vehicle {
  id: number;
  make: string;
  model: string;
  year: number;
  plate: string;
  color: string | null;
  mileage: number | null;
}

interface VehicleManagerProps {
  vehicles: Vehicle[];
}

export function VehicleManager({ vehicles }: VehicleManagerProps) {
  const [isPending, startTransition] = useTransition();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { openPricingModal } = usePricingModal();

  async function handleAddVehicle(formData: FormData) {
    startTransition(async () => {
      try {
        await addVehicle(formData);
        toast.success("Vehiculo agregado correctamente");
        setIsDialogOpen(false);
      } catch (error) {
        if (error instanceof Error && error.message.includes("VEHICLE_LIMIT_REACHED")) {
          setIsDialogOpen(false);
          openPricingModal("Has alcanzado el limite de vehiculos de tu plan. Actualiza a Pro para registrar hasta 5 vehiculos.");
          return;
        }
        console.error(error);
        toast.error("Error al agregar vehiculo");
      }
    });
  }

  async function handleDeleteVehicle(vehicleId: number) {
    if (!confirm("¿Estás seguro de eliminar este vehículo?")) return;
    
    startTransition(async () => {
      try {
        await deleteVehicle(vehicleId);
        toast.success("Vehículo eliminado");
      } catch (error) {
        console.error(error);
        toast.error("Error al eliminar vehículo");
      }
    });
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-medium">Mis Vehículos</h3>
          <p className="text-sm text-muted-foreground">Gestiona los vehículos registrados en tu cuenta.</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm" variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              Agregar
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Agregar Vehículo</DialogTitle>
              <DialogDescription>
                Ingresa los datos de tu vehículo para registrarlo.
              </DialogDescription>
            </DialogHeader>
            <form action={handleAddVehicle} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="make">Marca</Label>
                  <Input id="make" name="make" placeholder="Toyota" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="model">Modelo</Label>
                  <Input id="model" name="model" placeholder="Corolla" required />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="year">Ano</Label>
                  <Input id="year" name="year" type="number" placeholder="2020" required min="1900" max={new Date().getFullYear() + 1} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="color">Color</Label>
                  <Input id="color" name="color" placeholder="Blanco" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="plate">Placa</Label>
                  <Input id="plate" name="plate" placeholder="1234ABC" required className="uppercase" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="mileage">Kilometraje</Label>
                  <Input id="mileage" name="mileage" type="number" placeholder="50000" min="0" />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" disabled={isPending}>
                  {isPending ? "Guardando..." : "Guardar Vehículo"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-4">
        {vehicles.length === 0 ? (
          <div className="text-center py-8 border-2 border-dashed rounded-lg">
            <Car className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground">No tienes vehículos registrados.</p>
          </div>
        ) : (
          vehicles.map((vehicle) => (
            <div key={vehicle.id} className="flex items-center justify-between p-4 border rounded-lg bg-card">
              <div className="flex items-center gap-4">
                <div className="bg-primary/10 p-2 rounded-full">
                  <Car className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <div className="font-medium">{vehicle.make} {vehicle.model} {vehicle.year}</div>
                  <div className="text-xs text-muted-foreground flex gap-2 flex-wrap">
                    <span>Placa: {vehicle.plate}</span>
                    {vehicle.color && <span>• {vehicle.color}</span>}
                    {vehicle.mileage && (
                      <span className="flex items-center gap-1">
                        • <Gauge className="h-3 w-3" /> {vehicle.mileage.toLocaleString()} km
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="text-destructive hover:text-destructive hover:bg-destructive/10"
                onClick={() => handleDeleteVehicle(vehicle.id)}
                disabled={isPending}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
