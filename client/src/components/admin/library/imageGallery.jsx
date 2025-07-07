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

  return (
    <div className="imggal-container">
      {/* Sidebar */}
      <aside className="imggal-sidebar">
        <Sidebar />
      </aside>

      {/* İçerik */}
      <main className="imggal-content">
        <div className="content-columns">
          {/* Sol sütun */}
          <section className="left-column">
            <CreateGallery />
            <div
              style={{
                marginTop: "1.5rem",
                display: "flex",
                flexDirection: "column",
                gap: "1rem",
              }}
            >
              <button
                className="btn-primary"
                type="button"
                onClick={() => navigate("/admin/gallery-cat")}
              >
                Kategorileri Düzenle{" "}
              </button>
            </div>
          </section>

          {/* Sağ sütun */}
          <aside className="right-column">
            <h2 className="mb-4">Resim Galerileri</h2>
            <div className="mb-4 d-flex gap-3 flex-wrap">
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
                            title="Galeriyi Sil"
                          >
                            🗑️ Sil
                          </button>
                          <button
                            className="btn btn-outline-primary btn-sm"
                            onClick={() => handleShowDetails(item)}
                            title="Galeri Detaylarını Görüntüle"
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
          </aside>
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
      </main>
    </div>
  );
}
