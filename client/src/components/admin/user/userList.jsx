import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  getGroupsThunk,
  getInstitutionsThunk,
} from "../../../features/thunks/grpInstThunk";

export default function UserList({
  users,
  selectedUser,
  selectedUserIds,
  onUserClick,
  onCheckboxChange,
  onDeleteSelected,
  onToggleDurum,
  setSelectedUserIds, // <-- bunu ekle
}) {
  const dispatch = useDispatch();
  const { groups, institutions } = useSelector((state) => state.grpInst);

  useEffect(() => {
    dispatch(getGroupsThunk());
    dispatch(getInstitutionsThunk());
  }, [dispatch]);

  // ID'den isim döndüren yardımcı fonksiyonlar
  const getGroupName = (id) => {
    const group = groups.find((g) => g.id === id || g.id === Number(id));
    return group ? group.name : "-";
  };

  const getInstitutionName = (id) => {
    const inst = institutions.find((i) => i.id === id || i.id === Number(id));
    return inst ? inst.name : "-";
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
          className="table table-sm table-hover table-bordered"
          style={{ fontSize: "0.75rem" }}
        >
          <thead
            className="table-light"
            style={{ position: "sticky", top: 0, zIndex: 1 }}
          >
            <tr>
              <th className="px-1 py-1" style={{ width: "24px" }}>
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={handleSelectAll}
                  style={{ width: "14px", height: "14px" }}
                />
              </th>
              <th className="px-1 py-1">Ad Soyad (Kullanıcı Adı)</th>
              <th className="px-1 py-1">Sicil No</th>
              <th className="px-1 py-1">T.C. Kimlik No</th>
              <th className="px-1 py-1">Telefon</th>
              <th className="px-1 py-1">Email</th>
              <th className="px-1 py-1">İl</th>
              <th className="px-1 py-1">İlçe</th>
              <th className="px-1 py-1">Adres</th>
              <th className="px-1 py-1">İşe Giriş</th>
              <th className="px-1 py-1">Cinsiyet</th>
              <th className="px-1 py-1">Grup</th>
              <th className="px-1 py-1">Lokasyon</th>
              <th className="px-1 py-1 text-center">Durum</th>
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
                    className="px-1 py-1"
                  >
                    <input
                      type="checkbox"
                      checked={selectedUserIds.includes(user.id)}
                      onChange={() => onCheckboxChange(user.id)}
                      style={{ width: "14px", height: "14px" }}
                    />
                  </td>
                  <td className="px-1 py-1">
                    {user.ad} {user.soyad}{" "}
                    <small className="text-muted">({user.kullanici_adi})</small>
                  </td>
                  <td className="px-1 py-1">{user.sicil || "-"}</td>
                  <td className="px-1 py-1">{user.tcno || "-"}</td>
                  <td className="px-1 py-1">{user.telefon || "-"}</td>
                  <td className="px-1 py-1">{user.email || "-"}</td>
                  <td className="px-1 py-1">{user.il || "-"}</td>
                  <td className="px-1 py-1">{user.ilce || "-"}</td>
                  <td className="px-1 py-1">{user.adres || "-"}</td>
                  <td className="px-1 py-1">
                    {user.ise_giris_tarihi
                      ? new Date(user.ise_giris_tarihi).toLocaleDateString()
                      : "-"}
                  </td>
                  <td className="px-1 py-1">{user.cinsiyet || "-"}</td>

                  {/* Grup ve Lokasyon ID’lerden isim olarak gösteriliyor */}
                  <td className="px-1 py-1">
                    {user.grupId ? getGroupName(user.grupId) : "-"}
                  </td>
                  <td className="px-1 py-1">
                    {user.lokasyonId
                      ? getInstitutionName(user.lokasyonId)
                      : "-"}
                  </td>

                  <td
                    onClick={(e) => e.stopPropagation()}
                    className="text-center px-1 py-1"
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
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
