"use client";

import { useState } from "react";
import { analyzeMaintenance } from "@/app/actions/maintenance";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles, AlertTriangle, CheckCircle, Clock } from "lucide-react";
import { toast } from "sonner";

interface MaintenanceCardProps {
  vehicleName: string;
  details: string;
}

export function MaintenanceCard({ vehicleName, details }: MaintenanceCardProps) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    summary: string;
    services: { service: string; urgency: "low" | "medium" | "high"; reason: string; estimatedCost: string }[];
  } | null>(null);

  const handleAnalyze = async () => {
    setLoading(true);
    try {
      const data = await analyzeMaintenance(details);
      setResult(data as any);
    } catch (error) {
      toast.error("Error al analizar el vehículo");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="border-blue-200 dark:border-blue-900 bg-blue-50/50 dark:bg-blue-950/10">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-blue-700 dark:text-blue-400">
          <Sparkles className="h-5 w-5" />
          Análisis Predictivo IA
        </CardTitle>
        <CardDescription>
          Basado en el estado de tu {vehicleName}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!result ? (
          <div className="text-center py-4">
            <p className="text-sm text-muted-foreground mb-4">
              Nuestra IA puede analizar el desgaste probable y sugerir mantenimiento preventivo.
            </p>
            <Button onClick={handleAnalyze} disabled={loading}>
              {loading ? "Analizando..." : "Generar Reporte"}
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-sm font-medium">{result.summary}</p>
            <div className="space-y-2">
              {result.services.map((item, idx) => (
                <div key={idx} className="bg-background p-3 rounded-lg border flex justify-between items-start gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold">{item.service}</span>
                      <Badge variant={item.urgency === "high" ? "destructive" : item.urgency === "medium" ? "default" : "secondary"}>
                        {item.urgency === "high" ? "Urgente" : item.urgency === "medium" ? "Atención" : "Preventivo"}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{item.reason}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold">{item.estimatedCost}</div>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="outline" size="sm" onClick={() => setResult(null)} className="w-full">
              Nuevo Análisis
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
