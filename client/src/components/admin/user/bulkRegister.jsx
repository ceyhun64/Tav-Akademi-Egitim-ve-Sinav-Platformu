import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  bulkRegisterThunk,
  uploadUserImagesThunk,
} from "../../../features/thunks/authThunk";

export default function BulkRegister() {
  const dispatch = useDispatch();
  const [excelFile, setExcelFile] = useState(null);
  const [imageFiles, setImageFiles] = useState([]);
  const [loadingExcel, setLoadingExcel] = useState(false);
  const [loadingImages, setLoadingImages] = useState(false);

  const result = useSelector((state) => state.auth.bulkRegisterResult);
  const imageUploadResult = useSelector(
    (state) => state.auth.imageUploadResult
  );

  const handleExcelChange = (e) => {
    setExcelFile(e.target.files[0]);
  };

  const handleImageChange = (e) => {
    setImageFiles(e.target.files);
  };

  const handleExcelSubmit = async (e) => {
    e.preventDefault();
    if (!excelFile) return;
    const formData = new FormData();
    formData.append("file", excelFile);

    setLoadingExcel(true);
    try {
      await dispatch(bulkRegisterThunk(formData)).unwrap();
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingExcel(false);
    }
  };

  const handleImageSubmit = async (e) => {
    e.preventDefault();
    if (!imageFiles.length) return;

    const formData = new FormData();
    for (let i = 0; i < imageFiles.length; i++) {
      formData.append("files", imageFiles[i]);
    }

    setLoadingImages(true);
    try {
      await dispatch(uploadUserImagesThunk(formData)).unwrap();
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingImages(false);
    }
  };

  return (
    <div className="d-flex gap-4 p-2 fs-3">
      {/* Excel Yükleme */}
      <form onSubmit={handleExcelSubmit}>
        <label
          htmlFor="excelUpload"
          className="text-success"
          title="Excel Yükle"
          style={{ cursor: "pointer" }}
        >
          <i className="bi bi-file-earmark-excel-fill"></i>
        </label>
        <input
          id="excelUpload"
          type="file"
          accept=".xlsx, .xls"
          onChange={handleExcelChange}
          disabled={loadingExcel}
          hidden
        />
      </form>

      {/* Resim Yükleme */}
      <form onSubmit={handleImageSubmit}>
        <label
          htmlFor="imageUpload"
          className="text-primary"
          title="Resim Yükle"
          style={{ cursor: "pointer" }}
        >
          <i className="bi bi-file-earmark-image-fill"></i>
        </label>
        <input
          id="imageUpload"
          type="file"
          multiple
          accept=".jpg,.jpeg,.png"
          onChange={handleImageChange}
          disabled={loadingImages}
          hidden
        />
      </form>
    </div>
  );
}
