"use client";

import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Battery, Car, Fuel, Wrench, Truck } from "lucide-react";

export type ServiceType = "tow" | "battery" | "tire" | "fuel" | "mechanic";

interface ServiceSelectorProps {
  selected: ServiceType | null;
  onSelect: (service: ServiceType) => void;
}

const services: { id: ServiceType; label: string; icon: any }[] = [
  { id: "tow", label: "Grúa", icon: Truck },
  { id: "battery", label: "Batería", icon: Battery },
  { id: "tire", label: "Llanta Baja", icon: Car }, // Using Car as placeholder for Tire
  { id: "fuel", label: "Gasolina", icon: Fuel },
  { id: "mechanic", label: "Mecánico", icon: Wrench },
];

export function ServiceSelector({ selected, onSelect }: ServiceSelectorProps) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
      {services.map((service) => (
        <Card
          key={service.id}
          className={cn(
            "cursor-pointer flex flex-col items-center justify-center p-6 transition-all hover:shadow-md hover:border-primary/50",
            selected === service.id ? "border-primary bg-primary/5 ring-1 ring-primary" : "bg-card"
          )}
          onClick={() => onSelect(service.id)}
        >
          <service.icon className={cn("h-10 w-10 mb-3", selected === service.id ? "text-primary" : "text-muted-foreground")} />
          <span className={cn("font-medium", selected === service.id ? "text-primary" : "text-foreground")}>
            {service.label}
          </span>
        </Card>
      ))}
    </div>
  );
}
