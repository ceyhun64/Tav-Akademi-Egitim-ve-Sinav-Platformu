import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { combineCertificatesThunk } from "../../../features/thunks/certificateThunk";

export default function CombineCertificate({ certificateIds }) {
  const dispatch = useDispatch();

  const handleCombine = () => {
    const action = dispatch(combineCertificatesThunk(certificateIds)).unwrap();
  };

  return (
    <div>
      <h2>Sertifikaları Birleştir</h2>
      <button onClick={handleCombine}>Birleştir ve İndir</button>
    </div>
  );
}
