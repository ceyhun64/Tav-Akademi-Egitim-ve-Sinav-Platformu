import React, { useEffect, useState } from "react";
import {
  getGroupsThunk,
  getInstitutionsThunk,
} from "../../../features/thunks/grpInstThunk";
import { useDispatch, useSelector } from "react-redux";

export default function UserList({
  users,
  selectedUserIds,
  onUserToggle,
  onToggleAll,
  isMobile,
}) {
  const dispatch = useDispatch();
  const { groups, institutions } = useSelector((state) => state.grpInst);

  const [filters, setFilters] = useState({
    ad: "",
    soyad: "",
    lokasyonId: "",
    grupId: "",
    sicil: "",
    cinsiyet: "",
    durum: "",
  });

  useEffect(() => {
    dispatch(getGroupsThunk());
    dispatch(getInstitutionsThunk());
  }, [dispatch]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const getUniqueOptions = (field) => {
    return [...new Set(users.map((u) => u[field]).filter(Boolean))];
  };

  const getInstitutionName = (id) => {
    const inst = institutions.find((i) => i.id === Number(id));
    return inst ? inst.name : "";
  };

  const getGroupName = (id) => {
    const group = groups.find((g) => g.id === Number(id));
    return group ? group.name : "";
  };

  const filteredUsers = users.filter((u) =>
    Object.entries(filters).every(([key, val]) => {
      if (val === "") return true;
      if (key === "grupId") return getGroupName(u.grupId) === val;
      if (key === "lokasyonId") return getInstitutionName(u.lokasyonId) === val;
      return (u[key] ?? "")
        .toString()
        .toLowerCase()
        .includes(val.toLowerCase());
    })
  );

  const visibleFields = isMobile
    ? ["ad", "soyad", "lokasyonId", "grupId"]
    : ["ad", "soyad", "lokasyonId", "grupId", "sicil", "cinsiyet", "durum"];

  return (
    <div className="user-list">
      {/* 🔍 FİLTRE ALANI */}
      <div
        className="filter-bar mb-3 d-flex flex-wrap gap-2"
        style={{ gap: 12 }}
      >
        <input
          type="text"
          name="ad"
          className="form-control form-control-sm"
          placeholder="Ad"
          value={filters.ad}
          onChange={handleFilterChange}
          style={{ maxWidth: 150 }}
        />
        <input
          type="text"
          name="soyad"
          className="form-control form-control-sm"
          placeholder="Soyad"
          value={filters.soyad}
          onChange={handleFilterChange}
          style={{ maxWidth: 150 }}
        />
        <select
          name="lokasyonId"
          className="form-control form-control-sm"
          value={filters.lokasyonId}
          onChange={handleFilterChange}
          style={{ maxWidth: 180 }}
        >
          <option value="">Tüm Lokasyonlar</option>
          {institutions.map((inst) => (
            <option key={inst.id} value={inst.name}>
              {inst.name}
            </option>
          ))}
        </select>
        <select
          name="grupId"
          className="form-control form-control-sm"
          value={filters.grupId}
          onChange={handleFilterChange}
          style={{ maxWidth: 180 }}
        >
          <option value="">Tüm Gruplar</option>
          {groups.map((group) => (
            <option key={group.id} value={group.name}>
              {group.name}
            </option>
          ))}
        </select>
        {!isMobile && (
          <>
            <input
              type="text"
              name="sicil"
              className="form-control form-control-sm"
              placeholder="Sicil"
              value={filters.sicil}
              onChange={handleFilterChange}
              style={{ maxWidth: 120 }}
            />
            <select
              name="cinsiyet"
              className="form-control form-control-sm"
              value={filters.cinsiyet}
              onChange={handleFilterChange}
              style={{ maxWidth: 130 }}
            >
              <option value="">Cinsiyet</option>
              {getUniqueOptions("cinsiyet").map((val) => (
                <option key={val} value={val}>
                  {val}
                </option>
              ))}
            </select>
            <select
              name="durum"
              className="form-control form-control-sm"
              value={filters.durum}
              onChange={handleFilterChange}
              style={{ maxWidth: 130 }}
            >
              <option value="">Durum</option>
              <option value="1">Aktif</option>
              <option value="0">Pasif</option>
            </select>
          </>
        )}
      </div>

      {/* 📋 TABLO */}
      <div
        className="table-responsive"
        style={{ borderRadius: "12px", overflow: "hidden" }}
      >
        <table
          className="table align-middle table-hover"
          style={{ borderCollapse: "separate", borderSpacing: "0 6px" }}
        >
          <thead style={{ backgroundColor: "#f5f7fa" }}>
            <tr>
              <th>
                <input
                  type="checkbox"
                  title="Tümünü Seç"
                  checked={
                    filteredUsers.length > 0 &&
                    selectedUserIds.length === filteredUsers.length
                  }
                  onChange={(e) => onToggleAll(e.target.checked)}
                />
              </th>
              {visibleFields.map((key) => (
                <th key={key}>
                  {key === "ad" && "Ad"}
                  {key === "soyad" && "Soyad"}
                  {key === "lokasyonId" && "Lokasyon"}
                  {key === "grupId" && "Grup"}
                  {key === "sicil" && "Sicil"}
                  {key === "cinsiyet" && "Cinsiyet"}
                  {key === "durum" && "Durum"}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {filteredUsers.map((u) => (
              <tr
                key={u.id}
                style={{
                  backgroundColor: "#ffffff",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
                  borderRadius: "8px",
                }}
              >
                <td>
                  <input
                    type="checkbox"
                    checked={selectedUserIds.includes(u.id)}
                    onChange={() => onUserToggle(u.id)}
                  />
                </td>
                {visibleFields.map((key) => {
                  let value = u[key];
                  if (key === "lokasyonId")
                    value = getInstitutionName(u.lokasyonId);
                  if (key === "grupId") value = getGroupName(u.grupId);
                  if (key === "durum") {
                    return (
                      <td key={key}>
                        <span
                          style={{
                            display: "inline-block",
                            width: "10px",
                            height: "10px",
                            marginLeft: "20px",
                            borderRadius: "50%",
                            backgroundColor:
                              u.durum == 1 ? "#4CAF50" : "#F44336",
                          }}
                        />
                      </td>
                    );
                  }
                  return <td key={key}>{value}</td>;
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
