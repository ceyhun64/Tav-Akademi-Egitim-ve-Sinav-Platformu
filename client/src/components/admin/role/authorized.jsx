import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getAllUsersThunk } from "../../../features/thunks/userThunk";
import {
  getRolesThunk,
  assignRoleToUserThunk,
} from "../../../features/thunks/roleThunk";
import {
  getInstitutionsThunk,
  getGroupsThunk,
} from "../../../features/thunks/grpInstThunk";
import Sidebar from "../adminPanel/sidebar";

export default function Authorized() {
  const dispatch = useDispatch();
  const { users, isLoading } = useSelector((state) => state.user);
  const { roles } = useSelector((state) => state.role);
  const { institutions, groups } = useSelector((state) => state.grpInst);

  const [selectedRoles, setSelectedRoles] = useState({});
  const [filterUsername, setFilterUsername] = useState("");
  const [filterCity, setFilterCity] = useState("");
  const [filterGroup, setFilterGroup] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  useEffect(() => {
    dispatch(getAllUsersThunk());
    dispatch(getRolesThunk());
    dispatch(getInstitutionsThunk());
    dispatch(getGroupsThunk());
  }, [dispatch]);

  const handleSelectChange = (userId, roleId) => {
    setSelectedRoles((prev) => ({
      ...prev,
      [userId]: roleId,
    }));
  };

  const handleRoleAssign = async (userId) => {
    const roleId = selectedRoles[userId];
    if (roleId) {
      await dispatch(assignRoleToUserThunk({ userId, roleId }));
      dispatch(getAllUsersThunk());
      dispatch(getRolesThunk());
      dispatch(getInstitutionsThunk());
      dispatch(getGroupsThunk());
    } else {
      alert("Lütfen bir rol seçiniz.");
    }
  };

  if (isLoading)
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div
          className="spinner-border text-primary"
          style={{ width: "4rem", height: "4rem" }}
          role="status"
        >
          <span className="visually-hidden">Yükleniyor...</span>
        </div>
      </div>
    );

  // Filtreleme işlemi (birden fazla kriter ile)
  const filteredUsers = users.filter((user) => {
    const matchesUsername = user.kullanici_adi
      .toLowerCase()
      .includes(filterUsername.toLowerCase());
    const matchesCity = filterCity ? user.il === filterCity : true;
    const matchesGroup = filterGroup
      ? user.grupId === Number(filterGroup)
      : true;
    const matchesStatus =
      filterStatus === ""
        ? true
        : filterStatus === "active"
        ? user.durum === true
        : user.durum === false;

    return matchesUsername && matchesCity && matchesGroup && matchesStatus;
  });

  // İller ve gruplar filtre için benzersiz olarak hazırlanıyor
  const uniqueCities = [
    ...new Set(users.map((u) => u.il).filter(Boolean)),
  ].sort();
  const groupOptions = groups;

  return (
    <div
      className="poolteo-container"
      style={{
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        overflowX: "hidden", // yatay kaymayı engeller
      }}
    >
      {/* Sidebar */}
      <div
        style={{
          width: "260px",
          minHeight: "100vh",
          padding: "1.5rem 1.2rem",
          position: "fixed",
          left: 0,
          top: 0,
          backgroundColor: "#003399", // biraz daha canlı mavi
          color: "#fff",
          boxShadow: "2px 0 12px rgba(0, 0, 0, 0.25)",
          overflowY: "auto",
          zIndex: 10,
          borderRadius: "0 12px 12px 0",
        }}
      >
        <Sidebar />
      </div>

      {/* Main Content */}
      <div
        style={{
          marginLeft: "260px",
          padding: "2.5rem 3rem",
          backgroundColor: "#f4f6fc",
          minHeight: "100vh",
          transition: "margin-left 0.3s ease",
          color: "#222",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "2.5rem",
          }}
        >
          <h1
            style={{
              color: "#003399",
              fontSize: "28px",
              fontWeight: "700",
              display: "flex",
              alignItems: "center",
              gap: "0.6rem",
              userSelect: "none",
            }}
          >
            <i
              className="bi bi-shield-lock-fill"
              style={{ fontSize: "1.6rem" }}
            ></i>
            Yetkili İşlemleri
          </h1>
        </div>

        {/* Filters */}
        <div className="row mb-4 gx-3 gy-3">
          {/* Kullanıcı Adı */}
          <div className="col-12 col-md-3">
            <input
              id="filterUser"
              type="text"
              className="form-control"
              placeholder="Kullanıcı adı girin..."
              value={filterUsername}
              onChange={(e) => setFilterUsername(e.target.value)}
              style={{
                boxShadow: "0 2px 8px rgb(0 51 153 / 0.15)",
                borderRadius: "8px",
                border: "1px solid #cbd5e0",
                fontSize: "0.85rem",
                transition: "border-color 0.25s ease",
              }}
              onFocus={(e) => (e.target.style.borderColor = "#003399")}
              onBlur={(e) => (e.target.style.borderColor = "#cbd5e0")}
            />
          </div>

          {/* Lokasyon */}
          <div className="col-12 col-md-3">
            <select
              id="filterCity"
              className="form-select"
              value={filterCity}
              onChange={(e) => setFilterCity(e.target.value)}
              style={{
                boxShadow: "0 2px 8px rgb(0 51 153 / 0.15)",
                borderRadius: "8px",
                border: "1px solid #cbd5e0",
                fontSize: "0.85rem",
                transition: "border-color 0.25s ease",
              }}
              onFocus={(e) => (e.target.style.borderColor = "#003399")}
              onBlur={(e) => (e.target.style.borderColor = "#cbd5e0")}
            >
              <option value="">Bir lokasyon seçin</option>
              {uniqueCities.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </div>

          {/* Grup */}
          <div className="col-12 col-md-3">
            <select
              id="filterGroup"
              className="form-select"
              value={filterGroup}
              onChange={(e) => setFilterGroup(e.target.value)}
              style={{
                boxShadow: "0 2px 8px rgb(0 51 153 / 0.15)",
                borderRadius: "8px",
                border: "1px solid #cbd5e0",
                fontSize: "0.85rem",
                transition: "border-color 0.25s ease",
              }}
              onFocus={(e) => (e.target.style.borderColor = "#003399")}
              onBlur={(e) => (e.target.style.borderColor = "#cbd5e0")}
            >
              <option value="">Bir grup seçin</option>
              {groupOptions.map((grp) => (
                <option key={grp.id} value={grp.id}>
                  {grp.name}
                </option>
              ))}
            </select>
          </div>

          {/* Durum */}
          <div className="col-12 col-md-3">
            <select
              id="filterStatus"
              className="form-select"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              style={{
                boxShadow: "0 2px 8px rgb(0 51 153 / 0.15)",
                borderRadius: "8px",
                border: "1px solid #cbd5e0",
                fontSize: "0.85rem",
                transition: "border-color 0.25s ease",
              }}
              onFocus={(e) => (e.target.style.borderColor = "#003399")}
              onBlur={(e) => (e.target.style.borderColor = "#cbd5e0")}
            >
              <option value="">Bir durum seçin</option>
              <option value="active">Aktif</option>
              <option value="inactive">Pasif</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div
          className="table-responsive shadow-sm rounded"
          style={{
            backgroundColor: "#fff",
            boxShadow: "0 2px 8px rgb(0 0 0 / 0.08)",
            maxHeight: "600px",
            overflowY: "auto",
            fontSize: "0.75rem",
          }}
        >
          <table
            className="table align-middle"
            style={{ borderSpacing: "0 10px", borderCollapse: "separate" }}
          >
            <thead>
              <tr
                style={{
                  backgroundColor: "#ffffff",
                  color: "#3f51b5",
                  fontSize: "0.85rem",
                  fontWeight: "500",
                  borderBottom: "2px solid #e0e0e0",
                }}
              >
                {[
                  "Mevcut Rol",
                  "Yeni Rol Seç",
                  "Rol Ata",
                  "Ad",
                  "Soyad",
                  "Kullanıcı Adı",
                  "Adres",
                  "İl",
                  "İlçe",
                  "Cinsiyet",
                  "Durum",
                  "Email",
                  "Telefon",
                  "İşe Giriş Tarihi",
                  "Sicil",
                  "TC No",
                  "Lokasyon",
                  "Grup",

                  "Oluşturulma Tarihi",
                  "Güncellenme Tarihi",
                ].map((header) => (
                  <th
                    key={header}
                    style={{
                      padding: "12px 14px",
                      fontWeight: "500",
                      userSelect: "none",
                      textAlign: "left",
                      borderBottom: "1px solid #e0e0e0",
                    }}
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length === 0 ? (
                <tr>
                  <td
                    colSpan={20}
                    className="text-center p-3 text-muted"
                    style={{ fontSize: "0.85rem" }}
                  >
                    Kriterlere uygun kullanıcı bulunamadı.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => {
                  const institution = institutions.find(
                    (inst) => inst.id === user.lokasyonId
                  );
                  const group = groups.find((grp) => grp.id === user.grupId);
                  const role = roles.find((r) => r.id === user.roleId);

                  return (
                    <tr
                      key={user.id}
                      style={{
                        backgroundColor: "#fefefe",
                        boxShadow: "0 1px 3px rgb(0 0 0 / 0.05)",
                        borderRadius: "6px",
                        transition: "background-color 0.25s ease",
                        fontSize: "0.75rem",
                      }}
                      className="align-middle"
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.backgroundColor = "#f3f6ff")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.backgroundColor = "#fefefe")
                      }
                    >
                      <td>{role ? role.name : "Bilinmiyor"}</td>
                      <td>
                        <select
                          value={selectedRoles[user.id] || ""}
                          onChange={(e) =>
                            handleSelectChange(user.id, Number(e.target.value))
                          }
                          className="form-select form-select-sm"
                          style={{
                            maxWidth: "220px", // veya istediğin genişlik
                            width: "75px", // kapsayıcısının genişliğini kullanması için
                            borderColor: "#5c6bc0",
                            borderRadius: "5px",
                            fontSize: "0.7rem",
                            padding: "3px 6px",
                          }}
                        >
                          <option value="">Seçiniz</option>
                          {roles.map((r) => (
                            <option key={r.id} value={r.id}>
                              {r.name}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td>
                        <button
                          className="btn btn-sm btn-primary"
                          style={{ fontSize: "0.7rem", padding: "4px 10px" }}
                          onClick={() => handleRoleAssign(user.id)}
                        >
                          Ata
                        </button>
                      </td>
                      <td>{user.ad}</td>
                      <td>{user.soyad}</td>
                      <td>{user.kullanici_adi}</td>
                      <td>{user.adres}</td>
                      <td>{user.il}</td>
                      <td>{user.ilce}</td>
                      <td style={{ textAlign: "center" }}>{user.cinsiyet}</td>
                      <td>
                        {user.durum ? (
                          <span style={{ color: "#43a047", fontWeight: "600" }}>
                            Aktif
                          </span>
                        ) : (
                          <span style={{ color: "#e53935", fontWeight: "600" }}>
                            Pasif
                          </span>
                        )}
                      </td>
                      <td>{user.email}</td>
                      <td>{user.telefon}</td>
                      <td>
                        {new Date(user.ise_giris_tarihi).toLocaleDateString()}
                      </td>
                      <td>{user.sicil}</td>
                      <td>{user.tcno}</td>
                      <td>{institution ? institution.name : "Bilinmiyor"}</td>
                      <td>{group ? group.name : "Bilinmiyor"}</td>

                      <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                      <td>{new Date(user.updatedAt).toLocaleDateString()}</td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
