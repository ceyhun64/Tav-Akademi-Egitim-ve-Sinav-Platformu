import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import logo from "../../../../public/logo/logo.png";

export default function Navbar() {
  const dropdownRef = useRef();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav
      className="navbar shadow-sm"
      style={{
        backgroundColor: "#ffffff",
        position: "sticky",
        top: 0,
        zIndex: 1030,
      }}
    >
      <div className="container">
        <Link className="navbar-brand d-flex align-items-center" to="">
          <img
            src={logo}
            alt="Tav Güvenlik Hizmetleri"
            style={{ height: "80px", marginRight: "20px" }}
          />
          <span
            className="fw-bold text-primary text-uppercase"
            style={{ letterSpacing: "0.1em" }}
          ></span>
        </Link>
      </div>
    </nav>
  );
}
