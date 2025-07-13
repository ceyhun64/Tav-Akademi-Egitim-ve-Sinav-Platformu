import React, { useEffect, useState } from "react";
import {
  getAllGalleriesThunk,
  deleteGalleryThunk,
} from "../../../features/thunks/imageGalleryThunk";
import {
  getImageGalleryCategoryThunk,
  getImageGallerySubCategoryByCategoryThunk,
} from "../../../features/thunks/imageGalleryCatThunk"; // Kategori thunkları
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import CreateGallery from "./createGallery";
import Sidebar from "../adminPanel/sidebar";
import "./imageGalery.css";

export default function ImageGallery() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { galleries } = useSelector((state) => state.imageGallery);

  // Kategoriler ve alt kategoriler redux’tan
  const { imageGalleryCategory, imageGallerySubCategory } = useSelector(
    (state) => state.imageGalleryCat
  );

  const [selectedGallery, setSelectedGallery] = useState(null);

  // Filtreleme için seçilen kategori ve alt kategori
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [selectedSubCategoryId, setSelectedSubCategoryId] = useState("");

  useEffect(() => {
    dispatch(getAllGalleriesThunk());
    dispatch(getImageGalleryCategoryThunk());
  }, [dispatch]);

  // Ana kategori değiştiğinde alt kategori listesini güncelle ve alt kategori seçimini temizle
  const handleCategoryChange = (e) => {
    const categoryId = e.target.value;
    setSelectedCategoryId(categoryId ? Number(categoryId) : "");
    setSelectedSubCategoryId("");
    if (categoryId) {
      dispatch(getImageGallerySubCategoryByCategoryThunk(Number(categoryId)));
    }
  };

  const handleSubCategoryChange = (e) => {
    const subCategoryId = e.target.value;
    setSelectedSubCategoryId(subCategoryId ? Number(subCategoryId) : "");
  };

  const handleDelete = async (id) => {
    if (selectedGallery?.id === id) {
      setSelectedGallery(null);
    }
    await dispatch(deleteGalleryThunk(id));
    dispatch(getAllGalleriesThunk());
  };

  const handleShowDetails = (gallery) => {
    setSelectedGallery(gallery);
  };

  const closeModal = () => setSelectedGallery(null);

  // Filtreleme: kategori ve alt kategori seçilmişse ona göre filtrele
  const filteredGalleries = galleries.filter((gallery) => {
    if (
      selectedCategoryId &&
      gallery.imageCatId !== Number(selectedCategoryId)
    ) {
      return false;
    }
    if (
      selectedSubCategoryId &&
      gallery.imageSubCatId !== Number(selectedSubCategoryId)
    ) {
      return false;
    }
    return true;
  });
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
            Görüntü Kütüphanesi
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

        {/* CreateGallery + Kategori düzenleme */}
        <section>
          <CreateGallery />
        </section>

        {/* Galeri filtreleme ve listeleme */}
        <div
          style={{
            backgroundColor: "#fff",
            borderRadius: "12px",
            padding: "20px",
            boxShadow: "0 6px 15px rgba(0, 27, 102, 0.1)",
            marginTop: "30px",
          }}
        >
          <h5
            style={{
              color: "#001b66",
              marginBottom: "15px",
              fontWeight: "600",
            }}
          >
            <i className="bi bi-images" style={{ marginRight: "8px" }}></i>
            Görüntü Kütüphanesi
          </h5>

          {/* Sınav Bilgileri */}
          <div className="card-body">
            {/* Kategori Seçimi Alanı */}
            <div className="mb-4 d-flex flex-wrap gap-3">
              <div style={{ flex: 1, minWidth: "220px" }}>
                <select
                  className="form-select"
                  value={selectedCategoryId || ""}
                  onChange={handleCategoryChange}
                >
                  <option value="">Ana Kategori Seçin</option>
                  {imageGalleryCategory?.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ flex: 1, minWidth: "220px" }}>
                <select
                  className="form-select"
                  value={selectedSubCategoryId || ""}
                  onChange={handleSubCategoryChange}
                  disabled={!selectedCategoryId}
                >
                  <option value="">Alt Kategori Seçin</option>
                  {imageGallerySubCategory?.map((sub) => (
                    <option key={sub.id} value={sub.id}>
                      {sub.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Galeri Listesi */}
            {filteredGalleries.length === 0 ? (
              <p>Filtreye uygun galeri bulunamadı.</p>
            ) : (
              <div className="row row-cols-1 row-cols-md-2 g-4">
                {filteredGalleries.map((item) => (
                  <div key={item.id} className="col">
                    <div className="card h-100 shadow-sm">
                      {item.image && (
                        <img
                          src={item.image}
                          alt={item.name || `Galeri ${item.id}`}
                          className="card-img-top"
                        />
                      )}
                      <div className="card-body d-flex flex-column">
                        <h5 className="card-title">{item.name}</h5>
                        <p className="card-text text-muted mb-2">
                          Oluşturulma tarihi:{" "}
                          {new Date(item.createdAt).toLocaleDateString()}
                        </p>
                        <div className="mt-auto d-flex justify-content-between">
                          <button
                            className="btn btn-outline-danger btn-sm"
                            onClick={() => handleDelete(item.id)}
                          >
                            🗑️ Sil
                          </button>
                          <button
                            className="btn btn-outline-primary btn-sm"
                            onClick={() => handleShowDetails(item)}
                          >
                            📋 Detay
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Modal */}
        {selectedGallery && (
          <div
            className="modal fade show"
            tabIndex="-1"
            onClick={closeModal}
            style={{ display: "flex" }}
          >
            <div
              className="modal-dialog modal-lg modal-dialog-centered"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">{selectedGallery.name}</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={closeModal}
                    aria-label="Close"
                  />
                </div>
                <div className="modal-body">
                  {selectedGallery.image && (
                    <img
                      src={selectedGallery.image}
                      alt={selectedGallery.name}
                      className="img-fluid rounded mb-3"
                      style={{
                        objectFit: "contain",
                        maxHeight: "500px",
                        width: "100%",
                      }}
                    />
                  )}
                  <p>
                    <strong>Oluşturulma tarihi:</strong>{" "}
                    {new Date(selectedGallery.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={closeModal}
                  >
                    Kapat
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
