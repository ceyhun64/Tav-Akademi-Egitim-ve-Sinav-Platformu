import React from "react";
import Navbar from "../../layout/navbar";
import Banner from "../../components/home/banner";
import Graphic from "../../components/home/graphic";
import Brands from "../../components/home/brands";
import ServiceInfo from "../../components/home/serviceInfo";
import Footer from "../../layout/footer";

export default function HomePage() {
  return (
    <div
      className="d-flex flex-column min-vh-100"
      style={{ overflowX: "hidden" }}
    >
      <div>
        <Navbar />
        <Banner />
        <Graphic />
      </div>
      <div
        style={{
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          padding: "0", // login kutusunu biraz ortalar
        }}
      >
        <ServiceInfo />
        <Brands />

        <Footer />
      </div>
    </div>
  );
}
