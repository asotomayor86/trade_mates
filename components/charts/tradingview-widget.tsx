"use client";

import { memo, useEffect, useRef, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";

// Constante a nivel de módulo: un array literal como valor por defecto de un
// parámetro se recrea (nueva referencia) en cada render. Al usarse en las
// dependencias del useEffect, eso provocaba un bucle infinito de
// remontaje cada vez que `loaded` cambiaba de estado.
const DEFAULT_STUDIES = ["STD;SMA", "STD;RSI"];

interface TradingViewWidgetProps {
  /** Símbolo en formato TradingView, p. ej. "SP:SPX" (índice) o "FOREXCOM:SPXUSD" (CFD 24h). */
  symbol?: string;
  /** Intervalo por defecto: "D" (diario), "60" (1h), "15" (15m), etc. */
  interval?: string;
  theme?: "light" | "dark";
  /** Alto del contenedor. Acepta cualquier valor CSS válido. */
  height?: number | string;
  /** Indicadores precargados, en formato de estudio de TradingView. */
  studies?: string[];
}

/**
 * Envuelve el widget "Advanced Real-Time Chart" embebido de TradingView.
 * Es un script de terceros que manipula el DOM directamente, por lo que
 * vive en un Client Component y reconstruye el <script> cada vez que
 * cambian sus props relevantes.
 *
 * Doc: https://www.tradingview.com/widget/advanced-chart/
 */
function TradingViewWidget({
  symbol = "FOREXCOM:SPXUSD",
  interval = "D",
  theme = "dark",
  height = "100%",
  studies = DEFAULT_STUDIES,
}: TradingViewWidgetProps) {
  const container = useRef<HTMLDivElement>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const el = container.current;
    if (!el) return;

    setLoaded(false);

    // Limpia cualquier instancia previa antes de reinyectar el script.
    el.innerHTML = "";

    const widgetDiv = document.createElement("div");
    widgetDiv.className = "tradingview-widget-container__widget";
    widgetDiv.style.height = "100%";
    widgetDiv.style.width = "100%";
    el.appendChild(widgetDiv);

    const script = document.createElement("script");
    script.type = "text/javascript";
    script.async = true;
    script.src =
      "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
    script.innerHTML = JSON.stringify({
      autosize: true,
      symbol,
      interval,
      timezone: "Etc/UTC",
      theme,
      style: "1",
      locale: "es",
      withdateranges: true,
      allow_symbol_change: true,
      hide_side_toolbar: false,
      studies,
      support_host: "https://www.tradingview.com",
    });
    el.appendChild(script);

    // El script no expone un callback "onReady": detectamos que terminó de
    // montar su iframe observando el DOM, para poder ocultar el skeleton.
    const observer = new MutationObserver(() => {
      if (el.querySelector("iframe")) {
        setLoaded(true);
        observer.disconnect();
      }
    });
    observer.observe(el, { childList: true, subtree: true });

    return () => observer.disconnect();
  }, [symbol, interval, theme, studies]);

  return (
    <div className="relative" style={{ height, width: "100%" }}>
      {!loaded && (
        <div className="absolute inset-0 flex flex-col gap-3 p-4">
          <div className="flex items-center justify-between">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-5 w-20" />
          </div>
          <Skeleton className="min-h-0 flex-1" />
        </div>
      )}
      <div className="tradingview-widget-container h-full w-full" ref={container} />
    </div>
  );
}

export default memo(TradingViewWidget);
