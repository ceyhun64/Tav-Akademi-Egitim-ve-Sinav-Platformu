import React from "react";
import { useDispatch } from "react-redux";
import { exportAssignImgToExcelThunk } from "../../../features/thunks/reportThunk";

export default function ExportToExcel() {
  const dispatch = useDispatch();

  const handleExport = () => {
    dispatch(exportAssignImgToExcelThunk()).unwrap();
    window.alert("Sonuçlar excel'e aktarılsın mı?");
  };

  return (
    <button
      style={{ width: "100px", fontSize: "12px", height: "40px" }}
      onClick={handleExport}
      className="btn btn-outline-primary"
    >
      Excel'e Aktar
    </button>
  );
}
