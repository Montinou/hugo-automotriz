"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { CreditCard, Loader2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { savePaymentMethodAction } from "@/app/actions/payment";

const MONTHS = [
  { value: "1", label: "01 - Enero" },
  { value: "2", label: "02 - Febrero" },
  { value: "3", label: "03 - Marzo" },
  { value: "4", label: "04 - Abril" },
  { value: "5", label: "05 - Mayo" },
  { value: "6", label: "06 - Junio" },
  { value: "7", label: "07 - Julio" },
  { value: "8", label: "08 - Agosto" },
  { value: "9", label: "09 - Septiembre" },
  { value: "10", label: "10 - Octubre" },
  { value: "11", label: "11 - Noviembre" },
  { value: "12", label: "12 - Diciembre" },
];

const currentYear = new Date().getFullYear();
const YEARS = Array.from({ length: 11 }, (_, i) => ({
  value: String(currentYear + i),
  label: String(currentYear + i),
}));

const CARD_TYPES = [
  { value: "visa", label: "Visa" },
  { value: "mastercard", label: "Mastercard" },
  { value: "amex", label: "American Express" },
  { value: "other", label: "Otra" },
];

export function PaymentForm() {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  async function handleSubmit(formData: FormData) {
    startTransition(async () => {
      try {
        const result = await savePaymentMethodAction(formData);

        if (result.success) {
          toast.success("Suscripcion PRO activada", {
            description: "Tu metodo de pago ha sido guardado correctamente",
          });
          router.push("/dashboard/driver");
          router.refresh();
        }
      } catch (error) {
        toast.error("Error al procesar el pago", {
          description: error instanceof Error ? error.message : "Intenta de nuevo",
        });
      }
    });
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <div className="flex justify-center mb-4">
          <div className="bg-primary/10 p-3 rounded-full">
            <CreditCard className="h-8 w-8 text-primary" />
          </div>
        </div>
        <CardTitle>Metodo de Pago</CardTitle>
        <CardDescription>
          Ingresa los datos de tu tarjeta para activar el plan PRO
        </CardDescription>
      </CardHeader>

      <form action={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="cardholderName">Nombre del titular</Label>
            <Input
              id="cardholderName"
              name="cardholderName"
              placeholder="Como aparece en la tarjeta"
              required
              disabled={isPending}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="cardNumber">Numero de tarjeta</Label>
            <Input
              id="cardNumber"
              name="cardNumber"
              placeholder="1234 5678 9012 3456"
              maxLength={19}
              required
              disabled={isPending}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="expiryMonth">Mes</Label>
              <Select name="expiryMonth" required disabled={isPending}>
                <SelectTrigger id="expiryMonth">
                  <SelectValue placeholder="Mes" />
                </SelectTrigger>
                <SelectContent>
                  {MONTHS.map((month) => (
                    <SelectItem key={month.value} value={month.value}>
                      {month.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="expiryYear">Ano</Label>
              <Select name="expiryYear" required disabled={isPending}>
                <SelectTrigger id="expiryYear">
                  <SelectValue placeholder="Ano" />
                </SelectTrigger>
                <SelectContent>
                  {YEARS.map((year) => (
                    <SelectItem key={year.value} value={year.value}>
                      {year.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="cardType">Tipo de tarjeta</Label>
            <Select name="cardType" required disabled={isPending}>
              <SelectTrigger id="cardType">
                <SelectValue placeholder="Selecciona el tipo" />
              </SelectTrigger>
              <SelectContent>
                {CARD_TYPES.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="bg-muted/50 rounded-lg p-4 mt-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Plan PRO</span>
              <span className="font-semibold">Bs. 99/mes</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Se renovara automaticamente cada 30 dias
            </p>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col gap-3">
          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Procesando...
              </>
            ) : (
              "Activar Plan PRO"
            )}
          </Button>
          <Button
            type="button"
            variant="ghost"
            className="w-full"
            onClick={() => router.back()}
            disabled={isPending}
          >
            Cancelar
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
