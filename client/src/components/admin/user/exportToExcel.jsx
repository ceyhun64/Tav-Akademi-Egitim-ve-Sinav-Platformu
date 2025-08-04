import React from "react";
import { useDispatch } from "react-redux";
import { exportUsersToExcelThunk } from "../../../features/thunks/userThunk";

export default function ExportToExcel() {
  const dispatch = useDispatch();

  const handleExport = () => {
    dispatch(exportUsersToExcelThunk()).unwrap();
    window.alert("Kullanıcılar excel'e aktarılsın mı?");
  };

  return (
    <button
      style={{ width: "100px", fontSize: "12px", height: "40px" }}
      onClick={handleExport}
      className="btn btn-outline-success"
    >
      Excel'e Aktar
    </button>
  );
}
