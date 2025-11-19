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
    <section className="py-20 bg-background">
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
                <div className="rounded-[2rem] overflow-hidden w-[272px] h-[572px] bg-white dark:bg-gray-800 flex items-center justify-center">
                    <span className="text-gray-500">App Screenshot</span>
                </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
