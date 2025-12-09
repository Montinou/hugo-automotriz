import { redirect } from "next/navigation";
import { stackServerApp } from "@/stack";
import { getCurrentUserPlan } from "@/app/actions/subscription";
import { PaymentForm } from "@/components/payment/PaymentForm";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default async function PaymentPage() {
  const user = await stackServerApp.getUser();

  if (!user) {
    redirect("/handler/sign-in");
  }

  const { plan } = await getCurrentUserPlan();

  // Si ya es PRO o Enterprise, redirigir al dashboard
  if (plan === "pro" || plan === "enterprise") {
    redirect("/dashboard/driver");
  }

  return (
    <div className="container max-w-2xl py-8">
      <Link
        href="/dashboard/driver"
        className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Volver al dashboard
      </Link>

      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold mb-2">Actualiza a PRO</h1>
        <p className="text-muted-foreground">
          Desbloquea todas las funciones de Hugo AI
        </p>
      </div>

      <PaymentForm />

      <div className="mt-8 text-center text-xs text-muted-foreground">
        <p>Tus datos de pago se guardan de forma segura.</p>
        <p className="mt-1">Puedes cancelar tu suscripcion en cualquier momento.</p>
      </div>
    </div>
  );
}
