"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Check, Clock, Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface BookingModalProps {
  workshopName: string;
  services: { id: string; name: string; price: number }[];
}

export function BookingModal({ workshopName, services }: BookingModalProps) {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [serviceId, setServiceId] = useState<string>("");
  const [timeSlot, setTimeSlot] = useState<string>("");
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState(1);

  const timeSlots = [
    "09:00", "10:00", "11:00", "14:00", "15:00", "16:00", "17:00"
  ];

  const handleBook = async () => {
    // Simulate booking
    toast.promise(
      new Promise((resolve) => setTimeout(resolve, 1500)),
      {
        loading: "Agendando cita...",
        success: () => {
          setIsOpen(false);
          setStep(1);
          return "¡Cita agendada con éxito!";
        },
        error: "Error al agendar",
      }
    );
  };

  const selectedService = services.find(s => s.id === serviceId);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button size="lg" className="w-full">Agendar Cita</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Agendar en {workshopName}</DialogTitle>
          <DialogDescription>
            Paso {step} de 3: {step === 1 ? "Selecciona servicio" : step === 2 ? "Elige fecha y hora" : "Confirmación"}
          </DialogDescription>
        </DialogHeader>

        {step === 1 && (
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Servicio Requerido</label>
              <Select value={serviceId} onValueChange={setServiceId}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona un servicio" />
                </SelectTrigger>
                <SelectContent>
                  {services.map((s) => (
                    <SelectItem key={s.id} value={s.id}>
                      {s.name} - Bs. {s.price}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="grid gap-4 py-4">
            <div className="flex justify-center">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                className="rounded-md border"
                locale={es}
                disabled={(date) => date < new Date() || date.getDay() === 0} // Disable past dates and Sundays
              />
            </div>
            <div className="grid grid-cols-4 gap-2">
              {timeSlots.map((time) => (
                <Button
                  key={time}
                  variant={timeSlot === time ? "default" : "outline"}
                  size="sm"
                  onClick={() => setTimeSlot(time)}
                  className={cn("text-xs", timeSlot === time && "ring-2 ring-offset-2 ring-primary")}
                >
                  {time}
                </Button>
              ))}
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="grid gap-4 py-4">
            <div className="bg-muted/50 p-4 rounded-lg space-y-3">
              <div className="flex items-center gap-2">
                <Check className="h-5 w-5 text-green-500" />
                <span className="font-medium">{selectedService?.name}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <CalendarIcon className="h-4 w-4" />
                <span>{date ? format(date, "PPP", { locale: es }) : ""}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>{timeSlot}</span>
              </div>
              <div className="border-t pt-2 mt-2 flex justify-between items-center font-bold">
                <span>Total Estimado:</span>
                <span>Bs. {selectedService?.price}</span>
              </div>
            </div>
          </div>
        )}

        <DialogFooter>
          {step > 1 && (
            <Button variant="outline" onClick={() => setStep(step - 1)}>
              Atrás
            </Button>
          )}
          {step < 3 ? (
            <Button 
              onClick={() => setStep(step + 1)} 
              disabled={(step === 1 && !serviceId) || (step === 2 && (!date || !timeSlot))}
            >
              Siguiente
            </Button>
          ) : (
            <Button onClick={handleBook}>Confirmar Cita</Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
