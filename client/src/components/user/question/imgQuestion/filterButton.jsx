import React, { useEffect, useState } from "react";

export default function FilterButtons({
  filters,
  activeFilter,
  setActiveFilter,
}) {
  const [isMobile, setIsMobile] = useState(false); // < 768px
  const [isTablet, setIsTablet] = useState(false); // 768px - 1400
  const TABLET_BREAKPOINT = 768;
  const DESKTOP_BREAKPOINT = 997; // Güncellendi

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setIsMobile(width < TABLET_BREAKPOINT);
      setIsTablet(width >= TABLET_BREAKPOINT && width < DESKTOP_BREAKPOINT);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize); // Düzeltildi
  }, []);

  const keys = Object.keys(filters);
  const isCompact = isMobile || isTablet; // True for mobile and tablet

  return (
    <div
      style={{
        display: "flex",
        flexDirection: isCompact ? "row" : "column",
        overflowX: isCompact ? "auto" : "visible",
        whiteSpace: isCompact ? "nowrap" : "normal",
        gap: 12,
        alignItems: "center",
        justifyContent: "flex-start",
      }}
    >
      {keys.map((key, index) => {
        const isLast = index === keys.length - 1;

        const sharedStyle = {
          width: isMobile ? 36 : isTablet ? 87 : 100,
          height: isMobile ? 24 : isTablet ? 48 : 80,
          display: "inline-flex",
          justifyContent: "center",
          alignItems: "center",
          marginRight: isCompact ? 6 : 0,
          transition: "all 0.2s ease-in-out",
        };

        let buttonHandlers;

        if (isLast) {
          // Son buton: tıklama ile toggle
          buttonHandlers = {
            onClick: () =>
              setActiveFilter((prev) => (prev === key ? "none" : key)),
          };
        } else if (isCompact) {
          // Mobil ve tablet: tıklama ile toggle
          buttonHandlers = {
            onClick: () =>
              setActiveFilter((prev) => (prev === key ? "none" : key)),
          };
        } else {
          // Desktop: basılı tutma ile aktif
          buttonHandlers = {
            onMouseDown: () => setActiveFilter(key),
            onMouseUp: () => setActiveFilter("none"),
            onMouseLeave: () => setActiveFilter("none"),
          };
        }

        return (
          <button
            key={key}
            {...buttonHandlers}
            className={`rounded border ${
              activeFilter === key
                ? "border-primary bg-light"
                : "border-secondary bg-white"
            }`}
            style={sharedStyle}
            title={key.charAt(0).toUpperCase() + key.slice(1)}
            type="button"
          >
            <img
              src={filters[key]}
              alt={key}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "contain",
              }}
            />
          </button>
        );
      })}
    </div>
  );
}
