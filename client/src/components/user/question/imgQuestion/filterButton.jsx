import React, { useEffect, useState } from "react";

export default function FilterButtons({
  filters,
  activeFilter,
  setActiveFilter,
}) {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 600);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 600);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div
      style={{
        display: isMobile ? "block" : "flex",
        flexDirection: isMobile ? "initial" : "column",
        overflowX: isMobile ? "auto" : "visible",
        whiteSpace: isMobile ? "nowrap" : "normal",
        gap: 12,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {Object.keys(filters).map((key) => (
        <button
          key={key}
          onClick={() =>
            setActiveFilter((prev) => (prev === key ? "none" : key))
          }
          className={`rounded border ${
            activeFilter === key
              ? "border-primary bg-light"
              : "border-secondary bg-white"
          }`}
          style={{
            width: isMobile ? 36 : 100,
            height: isMobile ? 24 : 80,
            display: "inline-flex",
            justifyContent: "center",
            alignItems: "center",
            marginRight: isMobile ? 6 : 0,
            transition: "all 0.2s ease-in-out",
          }}
          title={key.charAt(0).toUpperCase() + key.slice(1)}
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
      ))}
    </div>
  );
}
