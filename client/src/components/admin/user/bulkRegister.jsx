import React, { useState, useRef } from "react";
import { useDispatch } from "react-redux";
import {
  bulkRegisterThunk,
  uploadUserImagesThunk,
} from "../../../features/thunks/authThunk";

export default function BulkRegister({ isMobile }) {
  const dispatch = useDispatch();
  const [excelFile, setExcelFile] = useState(null);
  const [imageFiles, setImageFiles] = useState([]);
  const [loadingExcel, setLoadingExcel] = useState(false);
  const [loadingImages, setLoadingImages] = useState(false);

  const excelInputRef = useRef();
  const imageInputRef = useRef();

  const handleExcelChange = (e) => {
    setExcelFile(e.target.files[0]);
  };

  const handleImageChange = (e) => {
    setImageFiles(e.target.files);
  };

  const handleExcelSubmit = async () => {
    if (!excelFile) {
      window.alert("Lütfen önce bir Excel dosyası seçin.");
      return;
    }
    const formData = new FormData();
    formData.append("file", excelFile);

    setLoadingExcel(true);
    try {
      const response = await dispatch(bulkRegisterThunk(formData)).unwrap();
      window.alert(
        `Excel Yükleme Sonucu:\n${JSON.stringify(response, null, 2)}`
      );
    } catch (err) {
      window.alert(`Excel yükleme hatası: ${err.message || err}`);
      console.error(err);
    } finally {
      setLoadingExcel(false);
    }
  };

  const handleImageSubmit = async () => {
    if (!imageFiles.length) {
      window.alert("Lütfen önce resim dosyaları seçin.");
      return;
    }

    const formData = new FormData();
    for (let i = 0; i < imageFiles.length; i++) {
      formData.append("files", imageFiles[i]);
    }

    setLoadingImages(true);
    try {
      const response = await dispatch(uploadUserImagesThunk(formData)).unwrap();
      window.alert(
        `Resim Yükleme Sonucu:\n${JSON.stringify(response, null, 2)}`
      );
    } catch (err) {
      window.alert(`Resim yükleme hatası: ${err.message || err}`);
      console.error(err);
    } finally {
      setLoadingImages(false);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexWrap: isMobile ? "wrap" : "nowrap",
        gap: "12px",
        alignItems: "center",
        overflowX: isMobile ? "visible" : "auto",
      }}
    >
      {/* Gizli Excel input */}
      <input
        ref={excelInputRef}
        type="file"
        accept=".xlsx, .xls"
        onChange={handleExcelChange}
        disabled={loadingExcel}
        style={{ display: "none" }}
      />
      <button
        style={{
          width: "100px",
          fontSize: "12px",
          height: "40px",
          flexShrink: 0,
        }}
        className="btn btn-outline-success"
        onClick={() => excelInputRef.current.click()}
        disabled={loadingExcel}
      >
        Excel Seç
      </button>
      <button
        style={{
          width: "100px",
          fontSize: "12px",
          height: "40px",
          flexShrink: 0,
        }}
        className="btn btn-success"
        onClick={handleExcelSubmit}
        disabled={loadingExcel}
      >
        {loadingExcel ? "Yükleniyor..." : "Yükle"}
      </button>

      {/* Gizli Resim input */}
      <input
        ref={imageInputRef}
        type="file"
        multiple
        accept=".jpg,.jpeg,.png"
        onChange={handleImageChange}
        disabled={loadingImages}
        style={{ display: "none" }}
      />
      <button
        style={{
          width: "100px",
          fontSize: "12px",
          height: "40px",
          flexShrink: 0,
        }}
        className="btn btn-outline-success"
        onClick={() => imageInputRef.current.click()}
        disabled={loadingImages}
      >
        Resim Seç
      </button>
      <button
        style={{
          width: "100px",
          fontSize: "12px",
          height: "40px",
          flexShrink: 0,
        }}
        className="btn btn-success"
        onClick={handleImageSubmit}
        disabled={loadingImages}
      >
        {loadingImages ? "Yükleniyor..." : "Yükle"}
      </button>
    </div>
  );
}
