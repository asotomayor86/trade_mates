/**
 * Logotipo de trademates (barras + wordmark + eslogan), sin el disco de
 * fondo. Mismas coordenadas que el SVG original — solo recoloreado para nuestro
 * tema oscuro (el asset original usaba var(--text-primary)/var(--text-secondary),
 * pensadas para fondo claro) y con la fuente enrutada a nuestra variable de
 * Barlow Semi Condensed.
 *
 * Se incrusta como SVG en línea (no <img src="...svg">): así el <text>
 * hereda la fuente ya cargada por la app. Referenciado como imagen externa,
 * el navegador no puede aplicarle esa fuente (queda aislada de nuestras
 * hojas de estilo) y cae a una serif genérica — que es justo lo que se veía
 * en la vista previa que nos pasaron.
 */
export function Logo({
  className,
  withTagline = true,
}: {
  className?: string;
  withTagline?: boolean;
}) {
  return (
    <svg
      viewBox="0 10 680 180"
      className={className}
      role="img"
      aria-label="trademates — trading en equipo"
    >
      <g transform="translate(202,100) scale(0.6) translate(-340,-180)">
        <rect x="233" y="132" width="24" height="84" rx="12" fill="var(--texto)" />
        <rect x="271" y="108" width="24" height="112" rx="12" fill="#8A97AD" />
        <rect x="309" y="80" width="24" height="112" rx="12" fill="var(--texto)" />
        <rect x="347" y="56" width="24" height="96" rx="12" fill="#2E9E68" />
        <rect x="385" y="86" width="24" height="134" rx="12" fill="#8A97AD" />
        <rect x="423" y="122" width="24" height="94" rx="12" fill="var(--texto)" />
      </g>
      <text
        x="322"
        y="96"
        fontFamily="var(--font-barlow), 'Barlow Semi Condensed', sans-serif"
        fontSize="54"
        fontWeight="500"
        letterSpacing="-0.8"
        fill="var(--texto)"
      >
        trademates
      </text>
      {withTagline && (
        <text
          x="323"
          y="130"
          fontFamily="var(--font-barlow), 'Barlow Semi Condensed', sans-serif"
          fontSize="26"
          fontWeight="500"
          letterSpacing="-0.38"
          fill="var(--texto-suave)"
        >
          trading en equipo
        </text>
      )}
    </svg>
  );
}
