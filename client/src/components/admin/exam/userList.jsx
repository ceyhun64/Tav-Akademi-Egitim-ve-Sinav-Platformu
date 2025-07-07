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

  // ID'den isim bulmak için yardımcı fonksiyonlar
  const getInstitutionName = (id) => {
    const inst = institutions.find((i) => i.id === Number(id));
    return inst ? inst.name : "";
  };

  const getGroupName = (id) => {
    const group = groups.find((g) => g.id === Number(id));
    return group ? group.name : "";
  };

  // Filtreleme
  const filteredUsers = users.filter((u) =>
    Object.entries(filters).every(([key, val]) => {
      if (val === "") return true;

      if (key === "grupId") {
        // filtre select'ten isim geliyor, grupId ile isim eşleşmesi için grubu bul
        return getGroupName(u.grupId) === val;
      }
      if (key === "lokasyonId") {
        return getInstitutionName(u.lokasyonId) === val;
      }
      if (key === "durum") {
        return u.durum.toString() === val;
      }

      return (u[key] ?? "")
        .toString()
        .toLowerCase()
        .includes(val.toLowerCase());
    })
  );

  return (
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

            {[
              "ad",
              "soyad",
              "lokasyonId",
              "grupId",
              "sicil",
              "cinsiyet",
              "durum",
            ].map((key) => (
              <th key={key}>
                {["lokasyonId", "grupId", "cinsiyet", "durum"].includes(key) ? (
                  <select
                    name={key}
                    className="form-control form-control-sm rounded"
                    value={filters[key]}
                    onChange={handleFilterChange}
                  >
                    <option value="">Tümü</option>

                    {key === "grupId" &&
                      groups.map((group) => (
                        <option key={group.id} value={group.name}>
                          {group.name}
                        </option>
                      ))}

                    {key === "lokasyonId" &&
                      institutions.map((inst) => (
                        <option key={inst.id} value={inst.name}>
                          {inst.name}
                        </option>
                      ))}

                    {key === "cinsiyet" &&
                      getUniqueOptions("cinsiyet").map((val) => (
                        <option key={val} value={val}>
                          {val}
                        </option>
                      ))}

                    {key === "durum" && (
                      <>
                        <option value="1">Aktif</option>
                        <option value="0">Pasif</option>
                      </>
                    )}
                  </select>
                ) : (
                  <input
                    type="text"
                    name={key}
                    placeholder={key.charAt(0).toUpperCase() + key.slice(1)}
                    className="form-control form-control-sm rounded"
                    value={filters[key]}
                    onChange={handleFilterChange}
                  />
                )}
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
              <td>{u.ad}</td>
              <td>{u.soyad}</td>
              <td>{getInstitutionName(u.lokasyonId)}</td>
              <td>{getGroupName(u.grupId)}</td>
              <td>{u.sicil}</td>
              <td>{u.cinsiyet}</td>
              <td>
                <span
                  style={{
                    display: "inline-block",
                    width: "10px",
                    height: "10px",
                    borderRadius: "50%",
                    backgroundColor: u.durum === 1 ? "#4CAF50" : "#F44336",
                    marginRight: "6px",
                  }}
                />
                {u.durum === 1 ? "Aktif" : "Pasif"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
