"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Car, Wrench, Calendar, Home, Settings, BarChart3, History, LogOut, Bot, Crown, Sparkles, LucideIcon } from "lucide-react";
import { useStackApp } from "@stackframe/stack";

interface SidebarLink {
  href: string;
  label: string;
  icon: LucideIcon;
  highlight?: boolean;
}

interface SidebarProps {
  role: "driver" | "workshop_owner";
  userPlan?: "free" | "pro" | "enterprise";
}

export function DashboardSidebar({ role, userPlan = "free" }: SidebarProps) {
  const pathname = usePathname();
  const app = useStackApp();

  const driverLinks: SidebarLink[] = [
    { href: "/dashboard/driver", label: "Dashboard", icon: Bot, highlight: true },
    { href: "/dashboard/mechanic-ai", label: "Hugo AI (Full)", icon: Sparkles },
    { href: "/dashboard/request", label: "Pedir Asistencia", icon: Car },
    { href: "/dashboard/workshops", label: "Talleres", icon: Wrench },
    { href: "/dashboard/driver/history", label: "Historial", icon: History },
    { href: "/dashboard/driver/settings", label: "Configuracion", icon: Settings },
  ];

  const workshopLinks: SidebarLink[] = [
    { href: "/dashboard/workshop", label: "Resumen", icon: BarChart3 },
    { href: "/dashboard/workshop/tickets", label: "Tickets", icon: Car },
    { href: "/dashboard/workshop/calendar", label: "Calendario", icon: Calendar },
    { href: "/dashboard/workshop/services", label: "Servicios", icon: Wrench },
    { href: "/dashboard/workshop/settings", label: "Configuracion", icon: Settings },
  ];

  const links: SidebarLink[] = role === "workshop_owner" ? workshopLinks : driverLinks;

  const SidebarContent = () => (
    <div className="flex flex-col h-full py-4">
      <div className="px-6 py-2">
        <h2 className="text-xl font-bold tracking-tight text-primary">AutoSmart AI</h2>
      </div>

      {/* Upgrade Banner for Free Users */}
      {userPlan === "free" && (
        <div className="mx-3 mb-4 p-3 rounded-lg bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-sm font-semibold text-primary">Desbloquea Pro</span>
          </div>
          <p className="text-xs text-muted-foreground mb-3">
            Chat IA ilimitado y funciones avanzadas
          </p>
          <Button size="sm" className="w-full" asChild>
            <Link href="/pricing">
              <Crown className="mr-2 h-3 w-3" />
              Actualizar - Bs 99/mes
            </Link>
          </Button>
        </div>
      )}

      {/* Pro Badge for subscribed users */}
      {userPlan !== "free" && (
        <div className="mx-3 mb-4 px-3 py-2 rounded-lg bg-primary/10 border border-primary/20 flex items-center gap-2">
          <Crown className="h-4 w-4 text-primary" />
          <span className="text-sm font-medium text-primary capitalize">{userPlan}</span>
        </div>
      )}

      <ScrollArea className="flex-1 px-3 py-4">
        <div className="space-y-1">
          {links.map((link) => {
            const isHighlight = link.highlight === true;
            const isActive = pathname === link.href;
            const IconComponent = link.icon;

            return (
              <Button
                key={link.href}
                variant={isActive ? "secondary" : isHighlight ? "default" : "ghost"}
                className={cn(
                  "w-full justify-start",
                  isActive && "font-bold",
                  isHighlight && !isActive && "bg-primary/10 text-primary hover:bg-primary/20 border border-primary/20"
                )}
                asChild
              >
                <Link href={link.href}>
                  <IconComponent className="mr-2 h-4 w-4" />
                  {link.label}
                  {isHighlight && (
                    <Sparkles className="ml-auto h-3 w-3" />
                  )}
                </Link>
              </Button>
            );
          })}
        </div>
      </ScrollArea>
      <div className="px-3 py-4 mt-auto border-t">
        <Button
          variant="ghost"
          className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
          onClick={() => app.signOut()}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Cerrar Sesión
        </Button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Trigger */}
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="md:hidden fixed top-4 left-4 z-50">
            <Menu className="h-4 w-4" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0 w-64">
          <SidebarContent />
        </SheetContent>
      </Sheet>

      {/* Desktop Sidebar */}
      <div className="hidden md:flex w-64 flex-col border-r bg-card h-screen sticky top-0">
        <SidebarContent />
      </div>
    </>
  );
}
