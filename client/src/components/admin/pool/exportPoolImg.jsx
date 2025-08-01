import React from "react";
import { useDispatch } from "react-redux";
import { exportPoolImgToExcelThunk } from "../../../features/thunks/poolImgThunk";

export default function ExportToExcel() {
  const dispatch = useDispatch();

  const handleExport = () => {
    dispatch(exportPoolImgToExcelThunk()).unwrap();
    window.alert("Sorular excel'e aktarılsın mı?");
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
