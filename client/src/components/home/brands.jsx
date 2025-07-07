import React from "react";
import brand1 from "../../../public/brand/brand1.png";
import brand2 from "../../../public/brand/brand2.png";
import brand3 from "../../../public/brand/brand3.png";
import brand4 from "../../../public/brand/brand4.png";
import brand5 from "../../../public/brand/brand5.png";
import "./brands.css"; // Assuming you have a CSS file for styling

export default function Brands() {
  return (
    <div className="brands-container mt-4 mb-4">
      {[brand1, brand2, brand3, brand4, brand5].map((brand, index) => (
        <img
          key={index}
          src={brand}
          alt={`Brand ${index + 1}`}
          className="brand-logo"
        />
      ))}
    </div>
  );
}
