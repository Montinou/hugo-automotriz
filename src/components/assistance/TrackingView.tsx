"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Phone, ShieldCheck, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { getRequestStatus } from "@/app/actions/request";
import { toast } from "sonner";
import { RatingModal } from "./RatingModal";

interface TrackingViewProps {
  requestId: number;
  startTime?: Date;
  estimatedDurationMinutes?: number;
}

export function TrackingView({ 
  requestId,
  startTime = new Date(), 
  estimatedDurationMinutes = 15 
}: TrackingViewProps) {
  const [progress, setProgress] = useState(0);
  const [minutesRemaining, setMinutesRemaining] = useState(estimatedDurationMinutes);
  const [status, setStatus] = useState<string>("pending");
  const [provider, setProvider] = useState<any>(null);

  useEffect(() => {
    const pollStatus = async () => {
      try {
        const request = await getRequestStatus(requestId);
        if (request) {
          setStatus(request.status);
          if (request.provider) {
            setProvider(request.provider);
          }
        }
      } catch (error) {
        console.error("Error polling status:", error);
      }
    };

    // Poll every 5 seconds
    const interval = setInterval(pollStatus, 5000);
    pollStatus(); // Initial check

    return () => clearInterval(interval);
  }, [requestId]);

  useEffect(() => {
    if (status !== "accepted" && status !== "in_progress") return;

    const totalDurationMs = estimatedDurationMinutes * 60 * 1000;
    
    const updateTimer = () => {
      const now = new Date();
      const elapsed = now.getTime() - startTime.getTime();
      const remaining = Math.max(0, totalDurationMs - elapsed);
      
      const newProgress = Math.min(100, (elapsed / totalDurationMs) * 100);
      const newMinutes = Math.ceil(remaining / 60000);

      setProgress(newProgress);
      setMinutesRemaining(newMinutes);
    };

    updateTimer();
    const timer = setInterval(updateTimer, 1000);
    return () => clearInterval(timer);
  }, [startTime, estimatedDurationMinutes, status]);

  if (status === "pending") {
    return (
      <Card>
        <CardContent className="py-10 flex flex-col items-center text-center space-y-4">
          <div className="relative">
            <div className="absolute inset-0 animate-ping rounded-full bg-primary/20"></div>
            <div className="bg-primary/10 p-4 rounded-full relative">
              <Loader2 className="h-8 w-8 text-primary animate-spin" />
            </div>
          </div>
          <div>
            <h3 className="text-xl font-bold">Buscando taller cercano...</h3>
            <p className="text-muted-foreground">Estamos notificando a los mecánicos en tu zona.</p>
          </div>
          <Button variant="outline" className="mt-4 text-destructive">Cancelar Solicitud</Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-center text-xl text-primary">
            {status === "completed" ? "¡Servicio Completado!" : "Tu ayuda está en camino"}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col items-center justify-center space-y-2">
            <div className="text-4xl font-bold tabular-nums">
              {status === "completed" ? "0" : minutesRemaining} min
            </div>
            <Progress value={progress} className="w-full h-2" />
          </div>

          {provider && (
            <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-4">
                <Avatar className="h-12 w-12 border-2 border-background">
                  <AvatarImage src={provider.avatarUrl || ""} />
                  <AvatarFallback>{provider.fullName?.[0] || "M"}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-bold flex items-center gap-1">
                    {provider.fullName}
                    <ShieldCheck className="h-4 w-4 text-primary" />
                  </div>
                  <div className="text-sm text-muted-foreground">Mecánico Certificado • 4.9 ★</div>
                </div>
              </div>
              <Button size="icon" variant="outline" className="rounded-full">
                <Phone className="h-4 w-4" />
              </Button>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <Button variant="outline" className="w-full text-destructive hover:text-destructive">
              Cancelar
            </Button>
            <Button className="w-full">
              Contactar
            </Button>
          </div>
        </CardContent>
      </Card>
      
      <RatingModal 
        isOpen={status === "completed"} 
        requestId={requestId} 
        providerName={provider?.fullName}
        onClose={() => {
          // Optional: redirect or show summary
          window.location.href = "/dashboard/driver/history";
        }}
      />
    </div>
  );
}
