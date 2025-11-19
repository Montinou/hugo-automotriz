"use client";

import { useState } from "react";
import { WorkshopCard } from "@/components/workshops/WorkshopCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Filter } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Dummy data
const WORKSHOPS = [
  {
    id: "1",
    name: "Taller Mecánico 'El Rápido'",
    image: "https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?q=80&w=1000&auto=format&fit=crop",
    rating: 4.8,
    reviews: 124,
    address: "Av. Banzer 4to Anillo, Santa Cruz",
    isOpen: true,
    services: ["Mecánica General", "Cambio de Aceite", "Frenos"],
  },
  {
    id: "2",
    name: "AutoService Bolivia",
    image: "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?q=80&w=1000&auto=format&fit=crop",
    rating: 4.5,
    reviews: 89,
    address: "Calle 21 de Calacoto, La Paz",
    isOpen: true,
    services: ["Electricidad", "Baterías", "Diagnóstico"],
  },
  {
    id: "3",
    name: "Frenos y Embragues 'Don Pepe'",
    image: "https://images.unsplash.com/photo-1487754180451-c456f719a1fc?q=80&w=1000&auto=format&fit=crop",
    rating: 4.2,
    reviews: 45,
    address: "Av. Blanco Galindo km 5, Cochabamba",
    isOpen: false,
    services: ["Frenos", "Embragues", "Suspensión"],
  },
  {
    id: "4",
    name: "Taller Premium Motors",
    image: "https://images.unsplash.com/photo-1503376763036-066120622c74?q=80&w=1000&auto=format&fit=crop",
    rating: 4.9,
    reviews: 210,
    address: "Equipetrol Norte, Santa Cruz",
    isOpen: true,
    services: ["Mecánica General", "Importados", "Detailing"],
  },
];

export default function WorkshopsPage() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const filteredWorkshops = WORKSHOPS.filter((w) => 
    w.name.toLowerCase().includes(search.toLowerCase()) || 
    w.address.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="container mx-auto py-8 px-4 space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Talleres y Servicios</h1>
          <p className="text-muted-foreground">Encuentra los mejores talleres mecánicos cerca de ti.</p>
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Buscar taller..." 
              className="pl-8" 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-[140px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Filtrar" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="open">Abiertos</SelectItem>
              <SelectItem value="rating">Mejor Valorados</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredWorkshops.map((workshop) => (
          <WorkshopCard key={workshop.id} {...workshop} />
        ))}
      </div>
    </div>
  );
}
