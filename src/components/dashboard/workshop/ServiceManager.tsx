'use client';

import { useState, useTransition } from "react";
import { addService, deleteService } from "@/app/actions/workshop";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Plus, MoreHorizontal, Clock } from "lucide-react";
import { toast } from "sonner";

interface Service {
  id: number;
  name: string;
  description: string | null;
  price: string;
  durationMinutes: number | null;
  type: "tow" | "battery" | "tire" | "fuel" | "mechanic" | "maintenance" | "other" | null;
}

interface ServiceManagerProps {
  services: Service[];
}

export function ServiceManager({ services }: ServiceManagerProps) {
  const [isPending, startTransition] = useTransition();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  async function handleAddService(formData: FormData) {
    startTransition(async () => {
      try {
        await addService(formData);
        toast.success("Servicio agregado correctamente");
        setIsDialogOpen(false);
      } catch (error) {
        console.error(error);
        toast.error("Error al agregar servicio");
      }
    });
  }

  async function handleDeleteService(serviceId: number) {
    if (!confirm("¿Estás seguro de eliminar este servicio?")) return;

    startTransition(async () => {
      try {
        await deleteService(serviceId);
        toast.success("Servicio eliminado");
      } catch (error) {
        console.error(error);
        toast.error("Error al eliminar servicio");
      }
    });
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Servicios</h1>
          <p className="text-muted-foreground">Gestiona el catálogo de servicios.</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Nuevo Servicio
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Agregar Servicio</DialogTitle>
              <DialogDescription>
                Detalla el servicio que ofreces en tu taller.
              </DialogDescription>
            </DialogHeader>
            <form action={handleAddService} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nombre del Servicio</Label>
                <Input id="name" name="name" placeholder="Cambio de Aceite" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Descripción</Label>
                <Textarea id="description" name="description" placeholder="Incluye filtro y aceite sintético..." />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">Precio (Bs.)</Label>
                  <Input id="price" name="price" type="number" step="0.01" placeholder="150.00" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="durationMinutes">Duración (min)</Label>
                  <Input id="durationMinutes" name="durationMinutes" type="number" placeholder="60" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="type">Tipo de Servicio</Label>
                <Select name="type" required>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona un tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="maintenance">Mantenimiento</SelectItem>
                    <SelectItem value="mechanic">Mecánica General</SelectItem>
                    <SelectItem value="tire">Llantas / Gomeria</SelectItem>
                    <SelectItem value="battery">Batería</SelectItem>
                    <SelectItem value="tow">Grúa</SelectItem>
                    <SelectItem value="fuel">Combustible</SelectItem>
                    <SelectItem value="other">Otro</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <DialogFooter>
                <Button type="submit" disabled={isPending}>
                  {isPending ? "Guardando..." : "Guardar Servicio"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {services.length === 0 ? (
          <div className="col-span-full text-center py-12 border-2 border-dashed rounded-lg">
            <p className="text-muted-foreground">No has agregado servicios aún.</p>
            <Button variant="link" className="mt-2" onClick={() => setIsDialogOpen(true)}>Agregar el primero</Button>
          </div>
        ) : (
          services.map((service) => (
            <Card key={service.id}>
              <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                <CardTitle className="text-base font-medium">
                  {service.name}
                </CardTitle>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <span className="sr-only">Abrir menú</span>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem className="text-destructive" onClick={() => handleDeleteService(service.id)}>
                      Eliminar
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold flex items-center">
                  <span className="text-sm font-normal text-muted-foreground mr-1">Bs.</span>
                  {service.price}
                </div>
                <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                  {service.description || "Sin descripción"}
                </p>
                <div className="flex items-center gap-4 mt-4 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {service.durationMinutes} min
                  </div>
                  <div className="capitalize bg-secondary px-2 py-0.5 rounded">
                    {service.type}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
