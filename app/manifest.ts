import type { MetadataRoute } from "next";

// Web App Manifest — necesario para que el navegador considere la app
// instalable ("Instalar aplicación" en el menú, ver components/app-header.tsx
// e install-app-button.tsx). Iconos reales en public/icons/ (no basta con el
// SVG de app/icon.svg: no todos los navegadores lo aceptan como icono de
// manifest), generados a partir de ese mismo SVG de marca.
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "trademates",
    short_name: "trademates",
    description: "Trading en equipo: snapshots, alertas y playbook de estrategias para el grupo.",
    start_url: "/",
    display: "standalone",
    background_color: "#0e0a1c",
    theme_color: "#0e0a1c",
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
  };
}
