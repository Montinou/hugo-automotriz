"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Car, Wrench, Calendar, Home, Settings, BarChart3, History, LogOut, Bot } from "lucide-react";
import { useStackApp } from "@stackframe/stack";

interface SidebarProps {
  role: "driver" | "workshop_owner";
}

export function DashboardSidebar({ role }: SidebarProps) {
  const pathname = usePathname();
  const app = useStackApp();

  const driverLinks = [
    { href: "/dashboard/driver", label: "Inicio", icon: Home },
    { href: "/dashboard/request", label: "Pedir Asistencia", icon: Car },
    { href: "/dashboard/mechanic-ai", label: "Mecánico IA", icon: Bot },
    { href: "/dashboard/workshops", label: "Talleres", icon: Wrench },
    { href: "/dashboard/driver/history", label: "Historial", icon: History },
    { href: "/dashboard/driver/settings", label: "Configuración", icon: Settings },
  ];

  const workshopLinks = [
    { href: "/dashboard/workshop", label: "Resumen", icon: BarChart3 },
    { href: "/dashboard/workshop/calendar", label: "Calendario", icon: Calendar },
    { href: "/dashboard/workshop/services", label: "Servicios", icon: Wrench },
    { href: "/dashboard/workshop/settings", label: "Configuración", icon: Settings },
  ];

  const links = role === "workshop_owner" ? workshopLinks : driverLinks;

  const SidebarContent = () => (
    <div className="flex flex-col h-full py-4">
      <div className="px-6 py-2">
        <h2 className="text-2xl font-bold tracking-tight text-primary">Hugo</h2>
      </div>
      <ScrollArea className="flex-1 px-3 py-4">
        <div className="space-y-1">
          {links.map((link) => (
            <Button
              key={link.href}
              variant={pathname === link.href ? "secondary" : "ghost"}
              className={cn("w-full justify-start", pathname === link.href && "font-bold")}
              asChild
            >
              <Link href={link.href}>
                <link.icon className="mr-2 h-4 w-4" />
                {link.label}
              </Link>
            </Button>
          ))}
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
