import React from "react";

export default function FilterButtons({
  filters,
  activeFilter,
  setActiveFilter,
}) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column", // Dikey hizalama
        gap: 16, // Butonlar arası boşluk
        alignItems: "center", // Ortala
        marginBottom: 16,
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
            width: 130,
            height: 100,
            padding: 8,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
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
