"use client";

import { Bell, BellOff, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePushNotifications } from "@/hooks/usePushNotifications";

export function NotificationToggle() {
  const { permission, isSubscribed, isLoading, subscribe, unsubscribe, isSupported } =
    usePushNotifications();

  if (!isSupported) {
    return (
      <p className="text-sm text-muted-foreground">
        Tu navegador no soporta notificaciones push.
      </p>
    );
  }

  if (permission === "denied") {
    return (
      <p className="text-sm text-muted-foreground">
        Las notificaciones están bloqueadas. Habilítalas en la configuración de tu navegador.
      </p>
    );
  }

  return (
    <Button
      variant={isSubscribed ? "outline" : "default"}
      onClick={isSubscribed ? unsubscribe : subscribe}
      disabled={isLoading}
    >
      {isLoading ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : isSubscribed ? (
        <BellOff className="mr-2 h-4 w-4" />
      ) : (
        <Bell className="mr-2 h-4 w-4" />
      )}
      {isSubscribed ? "Desactivar notificaciones" : "Activar notificaciones"}
    </Button>
  );
}
