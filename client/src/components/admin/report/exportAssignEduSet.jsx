import React from "react";
import { useDispatch } from "react-redux";
import { exportAssignEduSetsToExcelThunk } from "../../../features/thunks/reportThunk";

export default function ExportToExcel() {
  const dispatch = useDispatch();

  const handleExport = () => {
    dispatch(exportAssignEduSetsToExcelThunk()).unwrap();
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
