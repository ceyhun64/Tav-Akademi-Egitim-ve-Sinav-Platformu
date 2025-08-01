import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  getIllegalMovesThunk,
  deleteIllegalMovesThunk,
  addIllegalMovesThunk,
} from "../../../features/thunks/illegalMovesThunk";
import { getInstitutionsThunk } from "../../../features/thunks/grpInstThunk";

import Sidebar from "../adminPanel/sidebar";

export default function IllegalMoves() {
  const dispatch = useDispatch();
  const { illegalMoves } = useSelector((state) => state.illegalMoves);
  const { institutions } = useSelector((state) => state.grpInst);

  useEffect(() => {
    dispatch(getIllegalMovesThunk());
  }, [dispatch]);

  useEffect(() => {
    dispatch(getInstitutionsThunk());
  }, [dispatch]);

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isTablet, setIsTablet] = useState(
    window.innerWidth >= 768 && window.innerWidth < 1350
  );

  // Yeni filtre state'leri
  const [filterAd, setFilterAd] = useState("");
  const [filterSoyad, setFilterSoyad] = useState("");

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setIsMobile(width < 768);
      setIsTablet(width >= 768 && width < 1350);
      if (width >= 768) {
        setSidebarOpen(true);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    setSidebarOpen(!isMobile);
  }, [isMobile]);

  // Filtrelenmiş illegalMoves
  const filteredIllegalMoves = illegalMoves
    ? illegalMoves.filter((item) => {
        const ad = item.user?.ad?.toLowerCase() || "";
        const soyad = item.user?.soyad?.toLowerCase() || "";
        return (
          ad.includes(filterAd.toLowerCase()) &&
          soyad.includes(filterSoyad.toLowerCase())
        );
      })
    : [];

  const selectWidth = 300;
  return (
    <div
      className="poolImg-container"
      style={{ overflowX: "hidden", padding: "1rem" }}
    >
      {/* Sidebar */}
      <div
        style={{
          padding: "1rem",
          position: "fixed",
          left: 0,
          top: 0,
          backgroundColor: "white",
          color: "#fff",
          overflowY: "auto",
          zIndex: 99999,
        }}
      >
        <Sidebar />
      </div>

      {/* Ana İçerik */}
      <div
        className="poolImg-content"
        style={{ marginLeft: isMobile ? "0px" : "260px" }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "2.5rem",
            flexWrap: "wrap",
          }}
        >
          <h1
            className=" mt-2 ms-5"
            style={{
              color: "#003399",
              fontSize: "28px",
              fontWeight: "700",
              display: "flex",
              alignItems: "center",
              gap: "0.6rem",
              userSelect: "none",
            }}
          >
            {!isMobile && (
              <i
                className="bi bi-journal-bookmark-fill"
                style={{ fontSize: "1.6rem" }}
              ></i>
            )}
            İllegal Hareketler
          </h1>

          {/* Filtre inputları */}
        </div>
        <div style={{ display: "flex", gap: "1rem", marginTop: "1rem"   ,marginBottom:"1rem" }}>
          <input
            type="text"
            placeholder="Ad'a göre filtrele"
            value={filterAd}
            onChange={(e) => setFilterAd(e.target.value)}
            style={{
              padding: "0.5rem",
              borderRadius: "8px",
              border: "1px solid #ccc",
            }}
          />
          <input
            type="text"
            placeholder="Soyad'a göre filtrele"
            value={filterSoyad}
            onChange={(e) => setFilterSoyad(e.target.value)}
            style={{
              padding: "0.5rem",
              borderRadius: "8px",
              border: "1px solid #ccc",
            }}
          />
        </div>
        <div
          className="table-responsive"
          style={{
            borderRadius: "16px",
            overflowY: "auto",
            overflowX: isTablet ? "hidden" : "auto",
            maxWidth: isMobile ? "700px" : isTablet ? "100%" : "1200px",
            maxHeight: isMobile ? "800px" : "800px",
            boxShadow: "0 4px 20px rgb(0 0 0 / 0.07)",
            backgroundColor: "#fff",
            border: "1px solid #e2e8f0",
            padding: "12px",
          }}
        >
          <table
            className="table align-middle table-hover"
            style={{
              borderCollapse: "separate",
              borderSpacing: "0 8px",
              minWidth: isMobile ? "350px" : isTablet ? "500px" : "1100px",
              userSelect: "none",
            }}
          >
            <thead
              style={{
                backgroundColor: "#e9f1ff",
                borderRadius: "12px",
              }}
            >
              <tr
                className="text-center align-middle"
                style={{ fontWeight: "600", color: "#334155" }}
              >
                <th style={{ width: "40px" }}>#</th>

                {isMobile && (
                  <>
                    <th>Ad</th>
                    <th>Soyad</th>
                    <th>İllegal Hareket</th>
                  </>
                )}

                {isTablet && (
                  <>
                    <th>Ad</th>
                    <th>Soyad</th>
                    <th>İllegal Hareket</th>
                  </>
                )}

                {!isMobile && !isTablet && (
                  <>
                    <th>Ad</th>
                    <th>Soyad</th>
                    <th>İllegal Hareket</th>
                    <th>Kullanıcı ID</th>
                    <th>Kullanıcı Adı</th>
                    <th>Email</th>
                    <th>Lokasyon</th>
                    <th>Tarihi</th>
                  </>
                )}
              </tr>
            </thead>
            <tbody>
              {filteredIllegalMoves && filteredIllegalMoves.length > 0 ? (
                filteredIllegalMoves.map((illegal, index) => (
                  <tr
                    key={illegal.id}
                    style={{
                      backgroundColor: "#fff",
                      boxShadow: "0 2px 6px rgb(0 0 0 / 0.05)",
                      borderRadius: "10px",
                      cursor: "default",
                      transition: "background-color 0.2s ease",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.backgroundColor = "#f0f4ff")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.backgroundColor = "#fff")
                    }
                  >
                    <td
                      className="text-center"
                      style={{ verticalAlign: "middle" }}
                    >
                      {index + 1}
                    </td>

                    {isMobile && (
                      <>
                        <td
                          className="text-center"
                          style={{ verticalAlign: "middle" }}
                        >
                          {illegal.user?.ad || "-"}
                        </td>
                        <td
                          className="text-center"
                          style={{ verticalAlign: "middle" }}
                        >
                          {illegal.user?.soyad || "-"}
                        </td>
                        <td
                          className="text-center"
                          style={{ verticalAlign: "middle" }}
                        >
                          {illegal.move || "-"}
                        </td>
                      </>
                    )}

                    {isTablet && (
                      <>
                        <td
                          className="text-center"
                          style={{ verticalAlign: "middle" }}
                        >
                          {illegal.user?.ad || "-"}
                        </td>
                        <td
                          className="text-center"
                          style={{ verticalAlign: "middle" }}
                        >
                          {illegal.user?.soyad || "-"}
                        </td>
                        <td
                          className="text-center"
                          style={{ verticalAlign: "middle" }}
                        >
                          {illegal.move || "-"}
                        </td>
                      </>
                    )}

                    {!isMobile && !isTablet && (
                      <>
                        <td
                          className="text-center"
                          style={{ verticalAlign: "middle" }}
                        >
                          {illegal.user?.ad}
                        </td>
                        <td
                          className="text-center"
                          style={{ verticalAlign: "middle" }}
                        >
                          {illegal.user?.soyad}
                        </td>
                        <td
                          className="text-center"
                          style={{ verticalAlign: "middle" }}
                        >
                          {illegal.move || "-"}
                        </td>
                        <td
                          className="text-center"
                          style={{ verticalAlign: "middle" }}
                        >
                          {illegal.userId}
                        </td>
                        <td
                          className="text-center"
                          style={{ verticalAlign: "middle" }}
                        >
                          {illegal.user?.kullanici_adi || "-"}
                        </td>
                        <td
                          className="text-center"
                          style={{ verticalAlign: "middle" }}
                        >
                          {illegal.user?.email || "-"}
                        </td>
                        <td
                          className="text-center"
                          style={{ verticalAlign: "middle" }}
                        >
                          {(() => {
                            const locId = illegal.user?.lokasyonId;
                            const institution = institutions.find(
                              (inst) => inst.id === locId
                            );
                            return institution ? institution.name : "-";
                          })()}
                        </td>

                        <td
                          className="text-center"
                          style={{ verticalAlign: "middle" }}
                        >
                          {new Date(illegal.createdAt).toLocaleString()}
                        </td>
                      </>
                    )}
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={isMobile ? 4 : isTablet ? 3 : 11}
                    className="text-center"
                  >
                    İllegal hareket bulunamadı.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
