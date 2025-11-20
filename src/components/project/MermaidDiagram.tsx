"use client";

import { useEffect, useRef, useState } from "react";
import mermaid from "mermaid";

mermaid.initialize({
  startOnLoad: false,
  theme: "default",
  securityLevel: "loose",
  fontFamily: "inherit",
});

export function MermaidDiagram({ chart }: { chart: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [svg, setSvg] = useState<string>("");

  useEffect(() => {
    const renderChart = async () => {
      if (ref.current) {
        try {
          const id = `mermaid-${Math.random().toString(36).substr(2, 9)}`;
          const { svg } = await mermaid.render(id, chart);
          setSvg(svg);
        } catch (error) {
          console.error("Mermaid render error:", error);
          setSvg(`<div class="text-red-500 p-4">Error rendering chart</div>`);
        }
      }
    };

    renderChart();
  }, [chart]);

  return (
    <div 
      className="overflow-x-auto p-4 bg-white dark:bg-slate-950 rounded-lg border flex justify-center" 
      ref={ref}
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}
