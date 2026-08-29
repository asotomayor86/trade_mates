import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      // Por defecto 1MB — insuficiente para subir capturas de gráficos
      // (Alertas). Límite real de la app (5MB) se valida aparte en la
      // propia server action; este solo evita que Next corte antes de
      // llegar a esa validación.
      bodySizeLimit: "8mb",
    },
  },
};

export default nextConfig;
