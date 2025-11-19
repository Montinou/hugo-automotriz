import { BookingModal } from "@/components/booking/BookingModal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Star, Phone, Clock, ShieldCheck } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

// Mock data fetcher
async function getWorkshop(id: string) {
  // Simulate DB delay
  await new Promise((resolve) => setTimeout(resolve, 500));
  
  return {
    id,
    name: "Taller Mecánico 'El Rápido'",
    image: "https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?q=80&w=1000&auto=format&fit=crop",
    rating: 4.8,
    reviews: 124,
    address: "Av. Banzer 4to Anillo, Santa Cruz",
    phone: "+591 70012345",
    description: "Especialistas en mecánica general y mantenimiento preventivo. Contamos con equipos de última generación y personal certificado.",
    services: [
      { id: "1", name: "Cambio de Aceite", price: 250 },
      { id: "2", name: "Afinado de Motor", price: 450 },
      { id: "3", name: "Diagnóstico Computarizado", price: 150 },
      { id: "4", name: "Revisión de Frenos", price: 180 },
    ],
    schedule: "Lunes a Sábado: 8:00 - 18:00",
  };
}

export default async function WorkshopProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const workshop = await getWorkshop(id);

  return (
    <div className="container mx-auto py-8 px-4 space-y-8">
      {/* Header */}
      <div className="relative h-[300px] w-full rounded-xl overflow-hidden">
        <Image
          src={workshop.image}
          alt={workshop.name}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
        <div className="absolute bottom-0 left-0 p-6 text-white">
          <h1 className="text-4xl font-bold mb-2">{workshop.name}</h1>
          <div className="flex items-center gap-4 text-sm md:text-base">
            <div className="flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              {workshop.address}
            </div>
            <div className="flex items-center gap-1 text-yellow-400">
              <Star className="h-4 w-4 fill-yellow-400" />
              {workshop.rating} ({workshop.reviews} reseñas)
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          <section>
            <h2 className="text-2xl font-bold mb-4">Sobre Nosotros</h2>
            <p className="text-muted-foreground leading-relaxed">
              {workshop.description}
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">Servicios y Precios</h2>
            <div className="grid gap-4">
              {workshop.services.map((service) => (
                <Card key={service.id}>
                  <CardContent className="flex justify-between items-center p-4">
                    <div className="font-medium">{service.name}</div>
                    <div className="font-bold text-primary">Bs. {service.price}</div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">Reseñas</h2>
            <div className="space-y-4">
              {[1, 2].map((i) => (
                <Card key={i}>
                  <CardHeader className="flex flex-row items-center gap-4 p-4 pb-2">
                    <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center font-bold">
                      JP
                    </div>
                    <div>
                      <div className="font-bold">Juan Pérez</div>
                      <div className="text-xs text-muted-foreground">Hace 2 días</div>
                    </div>
                    <div className="ml-auto flex text-yellow-500">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-3 w-3 fill-current" />
                      ))}
                    </div>
                  </CardHeader>
                  <CardContent className="p-4 pt-2 text-sm text-muted-foreground">
                    Excelente servicio, muy rápidos y profesionales. Recomendado.
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card className="sticky top-24">
            <CardHeader>
              <CardTitle>Horarios y Contacto</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-muted-foreground" />
                <div>
                  <div className="font-medium">Horario de Atención</div>
                  <div className="text-sm text-muted-foreground">{workshop.schedule}</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-muted-foreground" />
                <div>
                  <div className="font-medium">Teléfono</div>
                  <div className="text-sm text-muted-foreground">{workshop.phone}</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <ShieldCheck className="h-5 w-5 text-green-500" />
                <div className="text-sm text-green-600 font-medium">
                  Taller Verificado por Hugo
                </div>
              </div>
              
              <div className="pt-4">
                <BookingModal workshopName={workshop.name} services={workshop.services} />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
