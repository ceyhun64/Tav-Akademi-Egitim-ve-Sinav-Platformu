import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { uploadQuestionsFromExcelThunk } from "../../../features/thunks/poolTeoThunk";

export default function BulkPoolTeo({ selectedBookletId }) {
  const dispatch = useDispatch();
  const [excelFile, setExcelFile] = useState(null);
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  const result = useSelector((state) => state.poolTeo.uploadResult);

  const handleFileChange = (e) => {
    setExcelFile(e.target.files[0]);
    setMessage(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!excelFile) {
      setMessage("Lütfen bir Excel dosyası seçin.");
      return;
    }

    if (!selectedBookletId) {
      setMessage("Lütfen önce bir kitapçık seçin.");
      return;
    }

    const formData = new FormData();
    formData.append("file", excelFile);
    formData.append("bookletId", selectedBookletId);

    setLoading(true);
    setMessage(null);

    try {
      await dispatch(uploadQuestionsFromExcelThunk(formData)).unwrap();
      setMessage("Soru dosyası başarıyla yüklendi.");
    } catch (error) {
      setMessage("Yükleme sırasında hata oluştu: " + error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="d-flex align-items-center gap-2">
        <input
          type="file"
          accept=".xlsx, .xls"
          onChange={handleFileChange}
          disabled={loading}
          className="form-control"
        />
        <button
          type="submit"
          disabled={loading}
          className="btn d-flex align-items-center gap-2"
          style={{ backgroundColor: "green", color: "#fff" }}
        >
          <i
            style={{ color: "white" }}
            className="bi bi-file-earmark-excel"
          ></i>
        </button>
      </form>

      {result && (
        <div
          className="mt-3 p-2 border bg-light rounded"
          style={{ maxHeight: 200, overflowY: "auto" }}
        >
          <strong>İşlem Sonucu:</strong>
          <pre className="mb-0">{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}

      {message && <p className="mt-2 text-danger text-sm">{message}</p>}
    </div>
  );
}
