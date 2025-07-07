import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  updateGalleryThunk,
  getGalleryByIdThunk,
} from "../../../features/thunks/imageGalleryThunk";
import {
  getImageGalleryCategoryThunk,
  getImageGallerySubCategoryByCategoryThunk,
} from "../../../features/thunks/imageGalleryCatThunk";
import { useParams } from "react-router-dom";

export default function UpdateGallery() {
  const dispatch = useDispatch();
  const { id } = useParams();

  const imageGalleryCategory = useSelector(
    (state) => state.imageGalleryCat.imageGalleryCategory
  );
  const imageGallerySubCategory = useSelector(
    (state) => state.imageGalleryCat.imageGallerySubCategory
  );

  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [selectedSubCategoryId, setSelectedSubCategoryId] = useState(null);
  const [singleFile, setSingleFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  useEffect(() => {
    dispatch(getImageGalleryCategoryThunk());

    const fetchGallery = async () => {
      try {
        const data = await dispatch(getGalleryByIdThunk(id)).unwrap();
        console.log("Görsel verisi:", data);
        setSelectedCategoryId(data.imageCatId || null);
        setSelectedSubCategoryId(data.imageSubCatId || null);

        if (data.imageCatId) {
          dispatch(getImageGallerySubCategoryByCategoryThunk(data.imageCatId));
        }

        if (data.image) {
          setPreviewUrl(data.image);
        }
      } catch (err) {
        console.error("Görsel verisi alınamadı:", err);
      }
    };

    if (id) fetchGallery();
  }, [dispatch, id]);

  const handleCategoryChange = (e) => {
    const categoryId = e.target.value;
    setSelectedCategoryId(categoryId);
    setSelectedSubCategoryId(null);
    dispatch(getImageGallerySubCategoryByCategoryThunk(categoryId));
  };

  const handleSubCategoryChange = (e) => {
    setSelectedSubCategoryId(e.target.value);
  };

  const handleSingleFileChange = (e) => {
    const file = e.target.files[0];
    setSingleFile(file);

    if (file && file.type.startsWith("image/")) {
      const fileURL = URL.createObjectURL(file);
      setPreviewUrl(fileURL);
    } else {
      setPreviewUrl(null);
    }
  };

  const handleSingleUpload = () => {
    if (singleFile && selectedCategoryId && selectedSubCategoryId) {
      const formData = new FormData();
      formData.append("file", singleFile);
      formData.append("imageCatId", selectedCategoryId);
      formData.append("imageSubCatId", selectedSubCategoryId);
      dispatch(updateGalleryThunk({ id, formData }));
    } else {
      alert("Tüm alanları doldurun ve bir resim seçin.");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Resim Güncelle</h2>

      <div>
        <label>Kategori:</label>
        <select
          onChange={handleCategoryChange}
          value={selectedCategoryId || ""}
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

      <div>
        <label>Alt Kategori:</label>
        <select
          onChange={handleSubCategoryChange}
          value={selectedSubCategoryId || ""}
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

      <div style={{ marginTop: "20px" }}>
        <h3>Resim Seç</h3>
        <input
          type="file"
          accept=".jpg,.jpeg,.png,.webp"
          onChange={handleSingleFileChange}
        />

        {previewUrl && (
          <div style={{ marginTop: "10px" }}>
            <p>Önizleme:</p>
            <img
              src={previewUrl}
              alt="Önizleme"
              style={{
                maxWidth: "300px",
                maxHeight: "300px",
                border: "1px solid #ccc",
              }}
            />
          </div>
        )}

        <button style={{ marginTop: "10px" }} onClick={handleSingleUpload}>
          Güncelle
        </button>
      </div>
    </div>
  );
}
