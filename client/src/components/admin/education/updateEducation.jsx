import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  updateEducationThunk,
  getEducationByIdThunk,
} from "../../../features/thunks/educationThunk";

import { useParams } from "react-router-dom";

export default function UpdateEducation() {
  const dispatch = useDispatch();
  const { id } = useParams();

  const [singleFile, setSingleFile] = useState(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [duration, setDuration] = useState("");
  const [type, setType] = useState("");
  const [previewUrl, setPreviewUrl] = useState(null);

  useEffect(() => {
    const fetchEducation = async () => {
      try {
        const education = await dispatch(getEducationByIdThunk(id)).unwrap();
        setName(education.name || "");
        setDuration(education.duration || "");
        setType(education.type || "");

        // Eğer backend'den dosya URL'si geliyorsa
        if (education.file_url) {
          setPreviewUrl(education.file_url);
        }
      } catch (error) {
        console.error("Eğitim getirilemedi:", error);
      }
    };

    if (id) fetchEducation();
  }, [dispatch, id]);

  const handleSingleFileChange = (e) => {
    const file = e.target.files[0];
    setSingleFile(file);

    if (file && file.type.startsWith("image/")) {
      const preview = URL.createObjectURL(file);
      setPreviewUrl(preview);
    } else {
      setPreviewUrl(null);
    }
  };

  const handleSingleUpload = () => {
    const formData = new FormData();

    // Dosya seçildiyse ekle
    if (singleFile) {
      formData.append("file", singleFile);
    }

    // Diğer tüm alanları ekle (boş olsalar da backend default olarak görsün)

    formData.append("name", name || "");
    formData.append("duration", duration || "");
    formData.append("type", type || "");

    dispatch(updateEducationThunk({ id, formData }));
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Eğitim Güncelle</h2>

      <div>
        <label>Ad:</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      <div>
        <label>Süre:</label>
        <input
          type="text"
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
        />
      </div>

      <div>
        <label>Tür:</label>
        <select value={type} onChange={(e) => setType(e.target.value)}>
          <option value="" disabled>
            Tür Seçin
          </option>
          <option value="pdf">PDF</option>
          <option value="video">Video</option>
          <option value="ppt">PPT</option>
        </select>
      </div>

      <div style={{ marginTop: "20px" }}>
        <h3>Dosya Seç</h3>
        <input
          type="file"
          name="file"
          accept=".jpg,.jpeg,.png,.webp,.pdf,.ppt,.pptx,.mp4,.mov,.avi,.docx,.xlsx"
          onChange={handleSingleFileChange}
        />
        {previewUrl && (
          <div style={{ marginTop: "10px" }}>
            <h4>Önizleme:</h4>
            <img
              src={previewUrl}
              alt="Önizleme"
              style={{
                maxWidth: "300px",
                maxHeight: "200px",
                objectFit: "contain",
              }}
            />
          </div>
        )}

        <button onClick={handleSingleUpload}>Güncelle</button>
      </div>
    </div>
  );
}
