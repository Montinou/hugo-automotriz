import { CheckCircle2 } from "lucide-react";

const steps = [
  {
    number: "01",
    title: "Solicita o Agenda",
    description: "Usa la app para pedir ayuda inmediata o reservar una cita en el taller de tu preferencia.",
  },
  {
    number: "02",
    title: "Seguimiento en Vivo",
    description: "Mira en el mapa cómo llega tu grúa o recibe notificaciones sobre el estado de tu reparación.",
  },
  {
    number: "03",
    title: "Paga y Califica",
    description: "Realiza el pago de forma segura y califica el servicio para mantener la calidad de la comunidad.",
  },
];

export function HowItWorks() {
  return (
    <section className="py-12 bg-background">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid gap-12 lg:grid-cols-2 items-center">
          <div className="space-y-8">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              Cómo Funciona Hugo
            </h2>
            <p className="text-muted-foreground md:text-xl">
              Simplificamos la experiencia de tener un auto. Sin llamadas interminables, sin sorpresas en los precios.
            </p>
            <div className="space-y-6">
              {steps.map((step, index) => (
                <div key={index} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full border border-primary bg-primary/10 text-primary font-bold">
                      {step.number}
                    </div>
                    {index < steps.length - 1 && (
                      <div className="h-full w-px bg-border my-2" />
                    )}
                  </div>
                  <div className="space-y-2 pb-8">
                    <h3 className="text-xl font-bold">{step.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="relative lg:ml-auto">
             {/* Placeholder for app screenshot */}
            <div className="relative mx-auto border-gray-800 dark:border-gray-800 bg-gray-800 border-[14px] rounded-[2.5rem] h-[600px] w-[300px] shadow-xl">
                <div className="w-[148px] h-[18px] bg-gray-800 top-0 rounded-b-[1rem] left-1/2 -translate-x-1/2 absolute"></div>
                <div className="h-[32px] w-[3px] bg-gray-800 absolute -left-[17px] top-[72px] rounded-l-lg"></div>
                <div className="h-[46px] w-[3px] bg-gray-800 absolute -left-[17px] top-[124px] rounded-l-lg"></div>
                <div className="h-[46px] w-[3px] bg-gray-800 absolute -left-[17px] top-[178px] rounded-l-lg"></div>
                <div className="h-[64px] w-[3px] bg-gray-800 absolute -right-[17px] top-[142px] rounded-r-lg"></div>
                <div className="rounded-[2rem] overflow-hidden w-[272px] h-[572px] bg-white dark:bg-gray-800 flex items-center justify-center relative">
                    <img 
                      src="https://images.unsplash.com/photo-1569383746724-6f1b882b8f46?q=80&w=800&auto=format&fit=crop" 
                      alt="Asistencia Vehicular AI" 
                      className="object-cover w-full h-full"
                    />
                    <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent text-white">
                      <div className="bg-card/90 backdrop-blur-sm p-3 rounded-lg border border-white/10 shadow-lg">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">JP</div>
                          <div>
                            <p className="font-bold text-sm text-foreground">Juan Pérez</p>
                            <p className="text-xs text-muted-foreground">Grúa en camino</p>
                          </div>
                          <span className="ml-auto text-xs font-bold text-green-500">5 min</span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div className="h-full w-3/4 bg-primary rounded-full" />
                        </div>
                      </div>
                    </div>
                </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
