import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  createBanSubsThunk,
  deleteBanSubsThunk,
  getBanSubsThunk,
  updateBanSubsThunk,
} from "../../../features/thunks/banSubsThunk";
import Sidebar from "../adminPanel/sidebar";

export default function BanSubs() {
  const dispatch = useDispatch();
  const { banSubs, isLoading, error } = useSelector((state) => state.banSubs);

  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState({ id: null, name: "" });

  useEffect(() => {
    dispatch(getBanSubsThunk());
  }, [dispatch]);

  const handleChange = (e) => {
    setFormData({ ...formData, name: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmedName = formData.name.trim().toLowerCase();
    if (!trimmedName) return;

    // Check for duplicate names, excluding the current item if updating
    const duplicate = banSubs.find(
      (item) =>
        item.name.toLowerCase() === trimmedName && item.id !== formData.id
    );

    if (duplicate) {
      alert("Bu madde zaten listede mevcut!");
      return;
    }

    if (formData.id) {
      await dispatch(updateBanSubsThunk(formData)).unwrap();
      await dispatch(getBanSubsThunk()).unwrap();
    } else {
      await dispatch(createBanSubsThunk({ name: formData.name })).unwrap();
      await dispatch(getBanSubsThunk()).unwrap();
    }

    setFormData({ id: null, name: "" });
  };

  const handleEdit = (item) => {
    setFormData({ id: item.id, name: item.name });
  };

  const handleDelete = (id) => {
    if (window.confirm("Silmek istediğine emin misin?")) {
      dispatch(deleteBanSubsThunk(id)).unwrap();
    }
  };

  const filteredItems = banSubs.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isTablet, setIsTablet] = useState(
    window.innerWidth >= 768 && window.innerWidth < 1350
  );

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setIsMobile(width < 768);
      setIsTablet(width >= 768 && width < 1350);
      if (width >= 768) {
        setSidebarOpen(true); // Sidebar is open on larger screens
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    // On initial load, sidebar is open on large screens, closed on small
    setSidebarOpen(!isMobile);
  }, [isMobile]);

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
           }}
         >
           <h1
             className="mb-4 mt-2 ms-5"
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
             Yasaklı Maddeler 
             <button
               onClick={() => window.history.back()}
               style={{
                 marginLeft: isMobile ? "auto" : "30px",
                 backgroundColor: "#001b66",
                 color: "white",
                 border: "none",
                 borderRadius: "4px",
                 padding: "6px 16px", // padding yatay biraz artırıldı
                 cursor: "pointer",
                 fontSize: "1rem",
                 whiteSpace: "nowrap", // metnin tek satırda kalmasını sağlar
               }}
             >
               Geri Dön
             </button>
           </h1>
         </div>
        <div
          className="card shadow-sm"
          style={{
            maxWidth: isMobile ? "95%" : "1200px", // Max width for card
            width: "auto", // Let content determine width for mobile,
            margin: isMobile ? "0 auto 1rem auto" : "0 auto", // Center and add bottom margin on mobile
            borderRadius: "16px",
            padding: isMobile ? "1rem" : "2rem", // Adjust padding for mobile
            boxShadow: "0 8px 20px rgba(0, 51, 153, 0.15)",
            backgroundColor: "#fff",
          }}
        >
          <div className="card-body">
            <h2 className="card-title mb-4">Yasaklı Maddeler</h2>

            {/* Form */}
            <form onSubmit={handleSubmit} className="mb-4">
              <div className="input-group">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Madde adı"
                  value={formData.name}
                  onChange={handleChange}
                />
                <button
                  className={`btn ${
                    formData.id ? "btn-warning" : "btn-primary"
                  }`}
                  type="submit"
                >
                  {formData.id ? "Güncelle" : "Ekle"}
                </button>
              </div>
            </form>

            {/* Search */}
            <input
              type="text"
              className="form-control mb-3"
              placeholder="Ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />

            {/* Loading, error, empty */}
            {isLoading ? (
              <div className="text-center my-4">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Yükleniyor...</span>
                </div>
              </div>
            ) : error ? (
              <div className="alert alert-danger" role="alert">
                Hata: {error}
              </div>
            ) : filteredItems.length === 0 ? (
              <p className="text-center">Gösterilecek madde yok.</p>
            ) : (
              // Liste
              <ul className="list-group">
                {filteredItems.map((item) => (
                  <li
                    key={item.id}
                    className="list-group-item d-flex justify-content-between align-items-center flex-wrap" // Added flex-wrap for small screens
                  >
                    <span style={{ marginBottom: isMobile ? "0.5rem" : "0" }}>
                      {item.name}
                    </span>{" "}
                    {/* Add margin for better spacing on mobile */}
                    <div
                      style={{
                        width: isMobile ? "100%" : "auto",
                        textAlign: isMobile ? "right" : "left",
                      }}
                    >
                      {" "}
                      {/* Adjust button alignment on mobile */}
                      <button
                        className="btn btn-sm btn-outline-warning me-2"
                        onClick={() => handleEdit(item)}
                      >
                        Düzenle
                      </button>
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => handleDelete(item.id)}
                      >
                        Sil
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
