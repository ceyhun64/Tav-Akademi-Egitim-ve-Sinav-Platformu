import React from "react";
import { useDispatch } from "react-redux";
import { exportPoolTeoToExcelThunk } from "../../../features/thunks/poolTeoThunk";

export default function ExportToExcel({ bookletId }) {
  const dispatch = useDispatch();

  const handleExport = () => {
    dispatch(exportPoolTeoToExcelThunk(bookletId));
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
