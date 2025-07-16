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

    // Aynı isim var mı kontrolü (id kontrolü eklenerek güncellemede hata engellenir)
    const duplicate = banSubs.find(
      (item) =>
        item.name.toLowerCase() === trimmedName && item.id !== formData.id // sadece güncellenmeyenler için kontrol
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
      const result = dispatch(deleteBanSubsThunk(id)).unwrap();
      console.log(result);
    }
  };

  const filteredItems = banSubs.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setSidebarOpen(true); // büyük ekranda sidebar açık kalsın
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    // ilk yüklemede sidebar büyük ekranda açık, küçükte kapalı
    setSidebarOpen(!isMobile);
  }, [isMobile]);
  const selectWidth = 300; // Hem mobil hem masaüstü için ortak genişlik

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
          boxShadow: "2px 0 8px rgba(0, 0, 0, 0.15)",
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
            maxWidth: "1200px", // genişliği artırdım
            width: "1100px", // genişliği tam ekran yapıyor
            margin: "0 auto", // ortaya hizalama
            borderRadius: "16px", // biraz daha yuvarlak köşeler
            padding: "2rem", // içerik için padding artırıldı
            boxShadow: "0 8px 20px rgba(0, 51, 153, 0.15)", // daha belirgin gölge
            backgroundColor: "#fff",
          }}
        >
          {" "}
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
                    className="list-group-item d-flex justify-content-between align-items-center"
                  >
                    {item.name}
                    <div>
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
