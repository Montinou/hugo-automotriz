import { Battery, Fuel, Wrench, Truck, MapPin, Calendar } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const services = [
  {
    title: "Grúa 24/7",
    icon: Truck,
    description: "Remolque seguro para tu vehículo en cualquier punto de la ciudad o carretera.",
  },
  {
    title: "Batería y Arranque",
    icon: Battery,
    description: "Si tu auto no enciende, te llevamos energía o una batería nueva al instante.",
  },
  {
    title: "Mecánica Ligera",
    icon: Wrench,
    description: "Soluciones rápidas para problemas comunes sin necesidad de ir al taller.",
  },
  {
    title: "Combustible",
    icon: Fuel,
    description: "¿Te quedaste sin gasolina? Te llevamos lo necesario para llegar a la estación más cercana.",
  },
  {
    title: "Talleres Certificados",
    icon: MapPin,
    description: "Encuentra los mejores talleres mecánicos cerca de ti, calificados por la comunidad.",
  },
  {
    title: "Citas Online",
    icon: Calendar,
    description: "Agenda tu mantenimiento preventivo sin llamadas ni esperas.",
  },
];

export function Services() {
  return (
    <section className="py-12 bg-muted/50">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
            Servicios Integrales
          </h2>
          <p className="max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
            Todo lo que tu vehículo necesita, desde emergencias hasta mantenimiento preventivo.
          </p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service, index) => (
            <Card key={index} className="border-border/50 bg-card/50 backdrop-blur-sm hover:bg-card hover:shadow-lg transition-all duration-300">
              <CardHeader>
                <div className="p-2 w-fit rounded-lg bg-primary/10 mb-4">
                  <service.icon className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-xl">{service.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  {service.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
