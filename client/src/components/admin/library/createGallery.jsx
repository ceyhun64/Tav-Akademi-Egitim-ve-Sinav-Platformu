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

export default function CreateGallery() {
  const dispatch = useDispatch();

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
      className="container rounded shadow-sm"
    >
      <h2 className="mb-4 text-center">Dosya Ekle</h2>

      <form onSubmit={handleSingleUpload}>
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

        <div className="mb-3">
          <label htmlFor="single-file" className="form-label">
            Tekli Dosya Yükle
          </label>
          <input
            id="single-file"
            type="file"
            className="form-control"
            accept=".jpg,.jpeg,.png,.webp,.pdf,.ppt,.pptx,.mp4,.mov,.avi,.docx,.xlsx"
            onChange={handleSingleFileChange}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary w-100">
          Yükle
        </button>
      </form>

      <hr className="my-4" />

      <form onSubmit={handleMultipleUpload}>
        <h3 className="mb-3">Çoklu Dosya Yükle</h3>
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
        <button type="submit" className="btn btn-success w-100">
          Yükle
        </button>
      </form>
    </div>
  );
}
