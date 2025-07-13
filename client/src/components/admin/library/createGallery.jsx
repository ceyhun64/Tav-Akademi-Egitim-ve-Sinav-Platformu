import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  uploadSingleImageThunk,
  uploadMultipleImagesThunk,
} from "../../../features/thunks/imageGalleryThunk";
import {
  getImageGalleryCategoryThunk,
  getImageGallerySubCategoryByCategoryThunk,
} from "../../../features/thunks/imageGalleryCatThunk";
import { useNavigate } from "react-router-dom";

export default function CreateGallery() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const imageGalleryCategory = useSelector(
    (state) => state.imageGalleryCat.imageGalleryCategory
  );
  const imageGallerySubCategory = useSelector(
    (state) => state.imageGalleryCat.imageGallerySubCategory
  );

  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [selectedSubCategoryId, setSelectedSubCategoryId] = useState("");
  const [singleFile, setSingleFile] = useState(null);
  const [multipleFiles, setMultipleFiles] = useState([]);

  useEffect(() => {
    dispatch(getImageGalleryCategoryThunk());
  }, [dispatch]);

  const handleCategoryChange = (e) => {
    const categoryId = e.target.value;
    setSelectedCategoryId(categoryId);
    setSelectedSubCategoryId("");
    dispatch(getImageGallerySubCategoryByCategoryThunk(categoryId));
  };

  const handleSubCategoryChange = (e) => {
    setSelectedSubCategoryId(e.target.value);
  };

  const handleSingleFileChange = (e) => {
    setSingleFile(e.target.files[0] || null);
  };

  const handleMultipleFileChange = (e) => {
    setMultipleFiles(Array.from(e.target.files));
  };

  const handleSingleUpload = (e) => {
    e.preventDefault();
    if (!singleFile || !selectedCategoryId || !selectedSubCategoryId) {
      alert("Tüm alanları doldurun ve bir dosya seçin.");
      return;
    }
    const formData = new FormData();
    formData.append("file", singleFile);
    formData.append("imageCatId", selectedCategoryId);
    formData.append("imageSubCatId", selectedSubCategoryId);
    dispatch(uploadSingleImageThunk(formData));
  };

  const handleMultipleUpload = (e) => {
    e.preventDefault();
    if (
      multipleFiles.length === 0 ||
      !selectedCategoryId ||
      !selectedSubCategoryId
    ) {
      alert("Tüm alanları doldurun ve en az bir dosya seçin.");
      return;
    }
    const formData = new FormData();
    multipleFiles.forEach((file) => formData.append("files", file));
    formData.append("imageCatId", selectedCategoryId);
    formData.append("imageSubCatId", selectedSubCategoryId);
    dispatch(uploadMultipleImagesThunk(formData));
  };

  return (
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
        <i className="bi bi-cloud-upload" style={{ marginRight: "8px" }}></i>
        Dosya Yükle
      </h5>

      {/* Sınav Bilgileri */}
      <div className="card-body">
        <div className="row">
          {/* Sol Sütun: Kategori Seçimi */}
          <div className="col-12 col-md-6 mb-4">
            <div className="mb-3">
              <label htmlFor="category-select" className="form-label">
                Kategori
              </label>
              <select
                id="category-select"
                className="form-select"
                onChange={handleCategoryChange}
                value={selectedCategoryId}
                required
              >
                <option value="" disabled>
                  Kategori Seçin
                </option>
                {imageGalleryCategory.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-3">
              <label htmlFor="subcategory-select" className="form-label">
                Alt Kategori
              </label>
              <select
                id="subcategory-select"
                className="form-select"
                onChange={handleSubCategoryChange}
                value={selectedSubCategoryId}
                required
                disabled={!selectedCategoryId}
              >
                <option value="" disabled>
                  Alt Kategori Seçin
                </option>
                {imageGallerySubCategory.map((sub) => (
                  <option key={sub.id} value={sub.id}>
                    {sub.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="mt-4">
              <button
                className="btn btn-primary"
                type="button"
                onClick={() => navigate("/admin/gallery-cat")}
              >
                Kategorileri Düzenle
              </button>
            </div>
          </div>

          {/* Sağ Sütun: Tekli ve Çoklu Dosya Yükleme */}
          <div className="col-12 col-md-6 mb-4">
            <form onSubmit={handleSingleUpload} className="mb-4">
              <h5
                className="mb-3"
                style={{ color: "#001b66", fontWeight: "600" }}
              >
                Tekli Dosya Yükle
              </h5>
              <div className="mb-3">
                <input
                  id="single-file"
                  type="file"
                  className="form-control"
                  accept=".jpg,.jpeg,.png,.webp,.pdf,.ppt,.pptx,.mp4,.mov,.avi,.docx,.xlsx"
                  onChange={handleSingleFileChange}
                  required
                  disabled={!selectedCategoryId || !selectedSubCategoryId}
                />
              </div>
              <button type="submit" className="btn btn-primary ">
                Yükle
              </button>
            </form>

            <form onSubmit={handleMultipleUpload}>
              <h5
                className="mb-3"
                style={{ color: "#001b66", fontWeight: "600" }}
              >
                Çoklu Dosya Yükle
              </h5>
              <div className="mb-3">
                <input
                  type="file"
                  multiple
                  className="form-control"
                  accept=".jpg,.jpeg,.png,.webp,.pdf,.ppt,.pptx,.mp4,.mov,.avi,.docx,.xlsx"
                  onChange={handleMultipleFileChange}
                  required
                  disabled={!selectedCategoryId || !selectedSubCategoryId}
                />
              </div>
              <button type="submit" className="btn btn-primary ">
                Yükle
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
