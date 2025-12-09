"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Menu, Car, Wrench, Calendar, Settings, BarChart3, History, LogOut, Bot, Crown, Sparkles, LucideIcon, ChevronRight } from "lucide-react";
import { useStackApp, useUser } from "@stackframe/stack";

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
  const user = useUser();

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

      {/* Upgrade Banner for Free Drivers only (workshops have free unlimited access) */}
      {userPlan === "free" && role !== "workshop_owner" && (
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

      {/* Pro Badge for subscribed drivers only */}
      {userPlan !== "free" && role !== "workshop_owner" && (
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
      <div className="mt-auto border-t">
        {/* User Profile Section */}
        <Link
          href={role === "workshop_owner" ? "/dashboard/workshop/settings" : "/dashboard/driver/settings"}
          className="flex items-center gap-3 px-3 py-3 hover:bg-muted/50 transition-colors cursor-pointer group"
        >
          <Avatar className="h-9 w-9 border-2 border-primary/20">
            <AvatarImage src={user?.profileImageUrl || undefined} alt={user?.displayName || "Usuario"} />
            <AvatarFallback className="bg-primary/10 text-primary text-sm font-medium">
              {user?.displayName?.charAt(0)?.toUpperCase() || user?.primaryEmail?.charAt(0)?.toUpperCase() || "U"}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <p className="text-sm font-medium truncate">
                {user?.displayName || "Usuario"}
              </p>
              {/* Badge only for drivers, workshops have free unlimited access */}
              {role !== "workshop_owner" && (
                <Badge
                  variant={userPlan === "free" ? "secondary" : "default"}
                  className={cn(
                    "text-[10px] px-1.5 py-0",
                    userPlan !== "free" && "bg-primary"
                  )}
                >
                  {userPlan === "free" ? "FREE" : userPlan.toUpperCase()}
                </Badge>
              )}
            </div>
            <p className="text-xs text-muted-foreground truncate">
              {user?.primaryEmail || ""}
            </p>
          </div>
          <ChevronRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
        </Link>

        {/* Sign Out Button */}
        <div className="px-3 py-2">
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
