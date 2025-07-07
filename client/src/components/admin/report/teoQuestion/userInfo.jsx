import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getGroupsThunk,
  getInstitutionsThunk,
} from "../../../../features/thunks/grpInstThunk";

export default function UserInfoCard({ user }) {
  const dispatch = useDispatch();
  const { groups, institutions } = useSelector((state) => state.grpInst);

  useEffect(() => {
    dispatch(getGroupsThunk());
    dispatch(getInstitutionsThunk());
  }, [dispatch]);

  if (!user) return null;

  // Grup ve lokasyon adlarını id'den bul
  const groupName =
    groups.find((g) => g.id === user.grupId)?.name || "Bilinmiyor";
  const institutionName =
    institutions.find((i) => i.id === user.lokasyonId)?.name || "Bilinmiyor";

  return (
    <div className="card mb-4 shadow border-0">
      <div
        className="card-header text-center text-white fw-bold"
        style={{ backgroundColor: "#001b66" }}
      >
        <i class="bi bi-person-fill me-2" style={{ color: "white" }}></i>
        Kullanıcı Bilgileri
      </div>

      <div className="card-body">
        {user.image && (
          <div className="d-flex justify-content-center mb-3">
            <img
              src={user.image}
              alt="Kullanıcı Fotoğrafı"
              className="img-fluid shadow-sm rounded"
              style={{
                maxHeight: "140px",
                width: "auto",
                objectFit: "cover",
                border: "3px solid #001b66",
              }}
            />
          </div>
        )}

        <ul className="list-group list-group-flush">
          <li className="list-group-item d-flex justify-content-between">
            <strong>Lokasyon:</strong>
            <span>{institutionName}</span>
          </li>
          <li className="list-group-item d-flex justify-content-between">
            <strong>Grup:</strong>
            <span>{groupName}</span>
          </li>
          <li className="list-group-item d-flex justify-content-between">
            <strong>Kullanıcı ID:</strong>
            <span>{user.id}</span>
          </li>
          <li className="list-group-item d-flex justify-content-between">
            <strong>Ad:</strong>
            <span>{user.ad}</span>
          </li>
          <li className="list-group-item d-flex justify-content-between">
            <strong>Soyad:</strong>
            <span>{user.soyad}</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
