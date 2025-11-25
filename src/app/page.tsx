import { Hero } from "@/components/landing/Hero";
import { Services } from "@/components/landing/Services";
import { HowItWorks } from "@/components/landing/HowItWorks";
import Link from "next/link";
import { stackServerApp } from "@/stack";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";

export default async function Home() {
  const user = await stackServerApp.getUser();

  if (user) {
    const dbUser = await db.query.users.findFirst({
      where: eq(users.stackId, user.id),
    });

    if (dbUser) {
      if (dbUser.role === "driver") {
        redirect("/dashboard/driver");
      } else if (dbUser.role === "workshop_owner") {
        redirect("/dashboard/workshop");
      } else {
        redirect("/onboarding");
      }
    } else {
      redirect("/onboarding");
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-xl">
            <span className="text-primary">Asistencia</span>
            <span>Vehicular AI</span>
          </div>
          <nav className="hidden md:flex gap-6 text-sm font-medium">
            <Link href="#servicios" className="hover:text-primary transition-colors">Servicios</Link>
            <Link href="#talleres" className="hover:text-primary transition-colors">Talleres</Link>
            <Link href="#como-funciona" className="hover:text-primary transition-colors">Cómo Funciona</Link>
          </nav>
          <div className="flex items-center gap-4">
            <Link href="/sign-in" className="text-sm font-medium hover:text-primary transition-colors">
              Iniciar Sesión
            </Link>
            <Link href="/sign-up" className="hidden sm:inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50">
              Registrarse
            </Link>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <Hero />
        <Services />
        <HowItWorks />
      </main>
      <footer className="border-t bg-muted/30">
        <div className="container mx-auto px-4 py-8 md:py-12">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            <div>
              <h3 className="text-lg font-bold mb-4">Asistencia Vehicular AI</h3>
              <p className="text-sm text-muted-foreground">
                La plataforma líder en Bolivia para asistencia vehicular y gestión de talleres.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Servicios</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>Asistencia en Ruta</li>
                <li>Mecánica General</li>
                <li>Mantenimiento</li>
                <li>Inspección Vehicular</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Empresa</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>Sobre Nosotros</li>
                <li>Talleres Aliados</li>
                <li>Trabaja con Nosotros</li>
                <li>Contacto</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>Términos y Condiciones</li>
                <li>Política de Privacidad</li>
              </ul>
            </div>
          </div>
          <div className="mt-10 pt-6 border-t text-center text-sm text-muted-foreground">
            © 2025 Asistencia Vehicular AI Bolivia. Todos los derechos reservados.
          </div>
        </div>
      </footer>
    </div>
  );
}
