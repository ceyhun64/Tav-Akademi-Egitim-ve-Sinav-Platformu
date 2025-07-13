import React, { use, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  getGroupsThunk,
  getInstitutionsThunk,
} from "../../../features/thunks/grpInstThunk";
import { getRolesThunk } from "../../../features/thunks/roleThunk";
import provinces from "../../../data/provinces.json";
import "./UserList.css"; // CSS dosyamızı ekliyoruz

export default function UserList({
  users,
  selectedUser,
  selectedUserIds,
  onUserClick,
  onCheckboxChange,
  onDeleteSelected,
  onToggleDurum,
  setSelectedUserIds,
}) {
  const dispatch = useDispatch();
  const { groups, institutions } = useSelector((state) => state.grpInst);
  const { roles } = useSelector((state) => state.role);

  useEffect(() => {
    dispatch(getGroupsThunk());
    dispatch(getInstitutionsThunk());
  }, [dispatch]);

  useEffect(() => {
    dispatch(getRolesThunk());
  }, [dispatch]);

  const getGroupName = (id) => {
    const group = groups.find((g) => g.id === id || g.id === Number(id));
    return group ? group.name : "-";
  };

  const getInstitutionName = (id) => {
    const inst = institutions.find((i) => i.id === id || i.id === Number(id));
    return inst ? inst.name : "-";
  };
  const getRoleName = (id) => {
    const role = roles.find((r) => r.id === id || r.id === Number(id));
    return role ? role.name : "-";
  };
  const getProvinceNameById = (provinceId) => {
    const province = provinces.find((p) => p.value === Number(provinceId));
    return province ? province.text : "-";
  };

  const getDistrictNameById = (districtId) => {
    for (const province of provinces) {
      const district = province.districts.find(
        (d) => d.value === Number(districtId)
      );
      if (district) {
        return district.text;
      }
    }
    return "-";
  };

  const allSelected =
    users.length > 0 && selectedUserIds.length === users.length;

  const handleSelectAll = () => {
    if (allSelected) {
      setSelectedUserIds([]);
    } else {
      const allIds = users.map((u) => u.id);
      setSelectedUserIds(allIds);
    }
  };

  return (
    <div>
      <div className="userlist-container">
        <table
          className="table table-sm table-hover table-bordered userlist-table"
          style={{ fontSize: "0.75rem" }}
        >
          <thead
            className="table-light"
            style={{ position: "sticky", top: 0, zIndex: 1 }}
          >
            <tr>
              <th className="px-1 py-1 checkbox-col">
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={handleSelectAll}
                  style={{ width: "14px", height: "14px" }}
                />
              </th>
              <th className="px-1 py-1 durum-col text-center">Durum</th>
              <th className="px-1 py-1 rol-col">Rol</th>
              <th className="px-1 py-1 lokasyon-col">Lokasyon</th>
              <th className="px-1 py-1 grup-col">Grup</th>
              <th className="px-1 py-1 cinsiyet-col">Cinsiyet</th>
              <th className="px-1 py-1 sicil-col">Sicil No</th>
              <th className="px-1 py-1 tcno-col">T.C. Kimlik No</th>
              <th className="px-1 py-1 ad-col">Ad</th>
              <th className="px-1 py-1 soyad-col">Soyad</th>
              <th className="px-1 py-1 kullanici-adi-col">Kullanıcı Adı</th>
              <th className="px-1 py-1 phone-col">Telefon</th>
              <th className="px-1 py-1 email-col">Email</th>
              <th className="px-1 py-1 ise-giris-col">İşe Giriş</th>
              <th className="px-1 py-1 il-col">İl</th>
              <th className="px-1 py-1 ilce-col">İlçe</th>
              <th className="px-1 py-1 adres-col">Adres</th>
            </tr>
          </thead>

          <tbody>
            {users?.map((user) => {
              const isSelected = selectedUser && selectedUser.id === user.id;
              return (
                <tr
                  key={user.id}
                  className={isSelected ? "table-primary" : ""}
                  style={{ cursor: "pointer", lineHeight: 1.1 }}
                  onClick={() => onUserClick(user.id)}
                >
                  <td
                    onClick={(e) => e.stopPropagation()}
                    className="px-1 py-1 checkbox-col"
                  >
                    <input
                      type="checkbox"
                      checked={selectedUserIds.includes(user.id)}
                      onChange={() => onCheckboxChange(user.id)}
                      style={{ width: "14px", height: "14px" }}
                    />
                  </td>
                  <td
                    onClick={(e) => e.stopPropagation()}
                    className="text-center px-1 py-1 durum-col"
                  >
                    <span
                      style={{
                        display: "inline-block",
                        width: "12px",
                        height: "12px",
                        borderRadius: "50%",
                        backgroundColor:
                          user.durum == 1 ? "#28a745" : "#dc3545",
                        cursor: "pointer",
                      }}
                      onClick={() =>
                        onToggleDurum(user.id, user.durum === 1 ? 0 : 1)
                      }
                      title={user.durum === 1 ? "Aktif" : "Pasif"}
                    />
                  </td>
                  <td className="px-1 py-1 role-col">
                    {user.roleId ? getRoleName(user.roleId) : "-"}
                  </td>
                  <td className="px-1 py-1 lokasyon-col">
                    {user.lokasyonId
                      ? getInstitutionName(user.lokasyonId)
                      : "-"}
                  </td>
                  <td className="px-1 py-1 grup-col">
                    {user.grupId ? getGroupName(user.grupId) : "-"}
                  </td>
                  <td className="px-1 py-1 cinsiyet-col">
                    {user.cinsiyet || "-"}
                  </td>
                  <td className="px-1 py-1 sicil-col">{user.sicil || "-"}</td>
                  <td className="px-1 py-1 tcno-col">{user.tcno || "-"}</td>
                  <td className="px-1 py-1 ad-col">{user.ad || "-"}</td>
                  <td className="px-1 py-1 soyad-col">{user.soyad || "-"}</td>
                  <td className="px-1 py-1 kullanici-adi-col">
                    {user.kullanici_adi || "-"}
                  </td>

                  <td className="px-1 py-1 phone-col">{user.telefon || "-"}</td>
                  <td className="px-1 py-1 email-col">{user.email || "-"}</td>
                  <td className="px-1 py-1 ise-giris-col">
                    {user.ise_giris_tarihi
                      ? new Date(user.ise_giris_tarihi).toLocaleDateString()
                      : "-"}
                  </td>
                  <td className="px-1 py-1 il-col">
                    {getProvinceNameById(user.il)}
                  </td>
                  <td className="px-1 py-1 ilce-col">
                    {getDistrictNameById(user.ilce)}
                  </td>

                  <td className="px-1 py-1 adres-col">{user.adres || "-"}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
