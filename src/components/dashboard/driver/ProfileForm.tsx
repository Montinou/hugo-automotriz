'use client';

import { useState, useTransition } from "react";
import { updateDriverProfile } from "@/app/actions/driver";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface ProfileFormProps {
  initialData: {
    email: string;
    fullName: string | null;
    phone: string | null;
  };
}

export function ProfileForm({ initialData }: ProfileFormProps) {
  const [isPending, startTransition] = useTransition();

  async function handleSubmit(formData: FormData) {
    startTransition(async () => {
      try {
        await updateDriverProfile(formData);
        toast.success("Perfil actualizado correctamente");
      } catch (error) {
        console.error(error);
        toast.error("Error al actualizar el perfil");
      }
    });
  }

  return (
    <form action={handleSubmit} className="space-y-4">
      <div className="grid gap-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" value={initialData.email} disabled />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="fullName">Nombre Completo</Label>
        <Input 
          id="fullName" 
          name="fullName" 
          defaultValue={initialData.fullName || ""} 
          placeholder="Tu nombre" 
          required
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="phone">Teléfono</Label>
        <Input 
          id="phone" 
          name="phone" 
          defaultValue={initialData.phone || ""} 
          placeholder="+591 ..." 
        />
      </div>
      <Button type="submit" disabled={isPending}>
        {isPending ? "Guardando..." : "Guardar Cambios"}
      </Button>
    </form>
  );
}
