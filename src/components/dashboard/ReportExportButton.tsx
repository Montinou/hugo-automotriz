"use client";

import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

export function ReportExportButton() {
  const handleDownload = () => {
    // Trigger the download by navigating to the API route
    window.location.href = "/api/reports/workshop";
  };

  return (
    <Button variant="outline" size="sm" onClick={handleDownload} className="gap-2">
      <Download className="h-4 w-4" />
      Exportar Reporte
    </Button>
  );
}
