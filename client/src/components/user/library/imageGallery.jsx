import React, { useEffect, useState } from "react";
import { getAllGalleriesThunk } from "../../../features/thunks/imageGalleryThunk";
import {
  getImageGalleryCategoryThunk,
  getImageGallerySubCategoryByCategoryThunk,
} from "../../../features/thunks/imageGalleryCatThunk"; // Kategori thunkları
import { useDispatch, useSelector } from "react-redux";

const navButtonStyle = {
  zIndex: 1051,
  opacity: 0.6,
  backgroundColor: "rgba(21, 95, 185, 0.65)",
  border: "none",
  borderRadius: "50%",
  width: "40px",
  height: "40px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  transition: "all 0.3s ease",
  cursor: "pointer",
};

const navButtonHoverStyle = {
  opacity: 1,
  backgroundColor: "rgba(21, 3, 223, 0.74)",
  boxShadow: "0 0 8px rgba(0,0,0,0.15)",
};

export default function ImageGallery() {
  const dispatch = useDispatch();
  const { galleries } = useSelector((state) => state.imageGallery);
  const { imageGalleryCategory, imageGallerySubCategory } = useSelector(
    (state) => state.imageGalleryCat
  );

  const [selectedGallery, setSelectedGallery] = useState(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [selectedSubCategoryId, setSelectedSubCategoryId] = useState("");

  useEffect(() => {
    dispatch(getAllGalleriesThunk());
    dispatch(getImageGalleryCategoryThunk());
  }, [dispatch]);

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

  // Filtrelenmiş galeriler
  const filteredGalleries = galleries.filter((gallery) => {
    if (selectedCategoryId && gallery.imageCatId !== selectedCategoryId)
      return false;
    if (
      selectedSubCategoryId &&
      gallery.imageSubCatId !== selectedSubCategoryId
    )
      return false;
    return true;
  });

  // Modalda geçerli galerinin indexi
  const currentIndex = selectedGallery
    ? filteredGalleries.findIndex((g) => g.id === selectedGallery.id)
    : -1;

  // Önceki resim
  const prevGallery =
    currentIndex > 0 ? filteredGalleries[currentIndex - 1] : null;
  // Sonraki resim
  const nextGallery =
    currentIndex >= 0 && currentIndex < filteredGalleries.length - 1
      ? filteredGalleries[currentIndex + 1]
      : null;

  const handleShowDetails = (gallery) => {
    setSelectedGallery(gallery);
  };

  const closeModal = () => setSelectedGallery(null);

  const handlePrev = () => {
    if (prevGallery) setSelectedGallery(prevGallery);
  };

  const handleNext = () => {
    if (nextGallery) setSelectedGallery(nextGallery);
  };

  return (
    <div className="container py-5">
      <div className="row gx-4">
        {/* Galeri Başlığı ve Filtre Alanı */}
        <div className="col-12 mb-4">
          <h2 className="fw-semibold">
            <i className="bi bi-image me-2" /> Görüntü Kütüphanesi
          </h2>
          <div className="d-flex flex-wrap gap-3 mt-3">
            <select
              className="form-select"
              style={{ width: "200px" }}
              value={selectedCategoryId || ""}
              onChange={handleCategoryChange}
            >
              <option value="">
                <i className="bi bi-bullseye" /> Ana Kategori Seçin
              </option>
              {imageGalleryCategory?.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>

            <select
              className="form-select "
              style={{ width: "200px" }}
              value={selectedSubCategoryId || ""}
              onChange={handleSubCategoryChange}
              disabled={!selectedCategoryId}
            >
              <option value="">
                <i className="bi bi-folder2-open" /> Alt Kategori Seçin
              </option>
              {imageGallerySubCategory?.map((sub) => (
                <option key={sub.id} value={sub.id}>
                  {sub.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Galeri Listesi */}
        <div className="col-12">
          {filteredGalleries.length === 0 ? (
            <div className="alert alert-warning" role="alert">
              <i className="bi bi-exclamation-triangle-fill me-2" />
              Filtreye uygun galeri bulunamadı.
            </div>
          ) : (
            <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
              {filteredGalleries.map((item) => (
                <div key={item.id} className="col">
                  <div className="card h-100 border-0 shadow-sm rounded-4">
                    {item.image && (
                      <img
                        src={item.image}
                        className="card-img-top rounded-top-4"
                        alt={item.name || `Galeri ${item.id}`}
                        style={{ objectFit: "cover", height: 180 }}
                      />
                    )}
                    <div className="card-body d-flex flex-column">
                      <h5 className="card-title text-primary fw-semibold">
                        {item.name}
                      </h5>

                      <div className="d-flex justify-content-between align-items-center mt-2">
                        <p className="card-text text-muted small mb-0">
                          <i className="bi bi-calendar3 me-1" />
                          {new Date(item.createdAt).toLocaleDateString()}
                        </p>
                        <button
                          className="btn btn-outline-primary btn-sm"
                          onClick={() => handleShowDetails(item)}
                          title="Detayları Gör"
                        >
                          Detay
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

      {/* Galeri Detay Modalı */}
      {selectedGallery && (
        <div
          className="modal fade show"
          style={{ display: "block", backgroundColor: "rgba(0,0,0,0.6)" }}
          tabIndex="-1"
          onClick={closeModal}
        >
          <div
            className="modal-dialog modal-lg modal-dialog-centered position-relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-content rounded-4 shadow">
              <div className="modal-header border-0">
                <h5 className="modal-title">
                  <i className="bi bi-image me-2" />
                  {selectedGallery.name}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={closeModal}
                  aria-label="Kapat"
                />
              </div>
              <div className="modal-body text-center position-relative">
                {/* Sol Ok */}
                {prevGallery && (
                  <button
                    onClick={handlePrev}
                    className="position-absolute top-50 start-0 translate-middle-y"
                    style={navButtonStyle}
                    aria-label="Önceki Resim"
                    onMouseEnter={(e) => {
                      e.currentTarget.style.opacity =
                        navButtonHoverStyle.opacity;
                      e.currentTarget.style.backgroundColor =
                        navButtonHoverStyle.backgroundColor;
                      e.currentTarget.style.boxShadow =
                        navButtonHoverStyle.boxShadow;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.opacity = navButtonStyle.opacity;
                      e.currentTarget.style.backgroundColor =
                        navButtonStyle.backgroundColor;
                      e.currentTarget.style.boxShadow = "none";
                    }}
                  >
                    <i className="bi bi-chevron-left fs-5 text-white"></i>
                  </button>
                )}

                {/* Resim */}
                {selectedGallery.image && (
                  <img
                    src={selectedGallery.image}
                    alt={selectedGallery.name}
                    className="img-fluid rounded mb-3"
                    style={{
                      objectFit: "contain",
                      maxHeight: "450px",
                      width: "100%",
                    }}
                  />
                )}

                {/* Sağ Ok */}
                {nextGallery && (
                  <button
                    onClick={handleNext}
                    className="position-absolute top-50 end-0 translate-middle-y"
                    style={navButtonStyle}
                    aria-label="Sonraki Resim"
                    onMouseEnter={(e) => {
                      e.currentTarget.style.opacity =
                        navButtonHoverStyle.opacity;
                      e.currentTarget.style.backgroundColor =
                        navButtonHoverStyle.backgroundColor;
                      e.currentTarget.style.boxShadow =
                        navButtonHoverStyle.boxShadow;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.opacity = navButtonStyle.opacity;
                      e.currentTarget.style.backgroundColor =
                        navButtonStyle.backgroundColor;
                      e.currentTarget.style.boxShadow = "none";
                    }}
                  >
                    <i className="bi bi-chevron-right fs-5 text-white"></i>
                  </button>
                )}

                <p className="text-muted small">
                  <i className="bi bi-clock-history me-1" />
                  Oluşturulma tarihi:{" "}
                  {new Date(selectedGallery.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
