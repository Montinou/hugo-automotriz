"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Phone, ShieldCheck } from "lucide-react";
import { useEffect, useState } from "react";

export function TrackingView() {
  const [progress, setProgress] = useState(10);
  const [status, setStatus] = useState("En camino");

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          setStatus("Ha llegado");
          return 100;
        }
        return prev + 10;
      });
    }, 2000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-center text-xl text-primary">
            {status === "Ha llegado" ? "¡Tu ayuda está aquí!" : "Tu ayuda está en camino"}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col items-center justify-center space-y-2">
            <div className="text-4xl font-bold tabular-nums">
              {status === "Ha llegado" ? "0" : Math.max(1, Math.ceil((100 - progress) / 10))} min
            </div>
            <Progress value={progress} className="w-full h-2" />
          </div>

          <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-4">
              <Avatar className="h-12 w-12 border-2 border-background">
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <div>
                <div className="font-bold flex items-center gap-1">
                  Juan Pérez
                  <ShieldCheck className="h-4 w-4 text-primary" />
                </div>
                <div className="text-sm text-muted-foreground">Toyota Hilux • 4.9 ★</div>
              </div>
            </div>
            <Button size="icon" variant="outline" className="rounded-full">
              <Phone className="h-4 w-4" />
            </Button>
          </div>

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
    </div>
  );
}
