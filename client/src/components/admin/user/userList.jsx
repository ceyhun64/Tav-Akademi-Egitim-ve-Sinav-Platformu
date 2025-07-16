import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  getGroupsThunk,
  getInstitutionsThunk,
} from "../../../features/thunks/grpInstThunk";
import { getRolesThunk } from "../../../features/thunks/roleThunk";
import provinces from "../../../data/provinces.json";
import "./UserList.css"; // CSS dosyamızı ekliyoruz

export default function UserList({
  users, // Bu prop artık tüm kullanıcı listesini temsil edecek
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

  // Sayfalama state'leri
  const [itemsPerPage, setItemsPerPage] = useState(50); // Varsayılan olarak 50
  const [currentPage, setCurrentPage] = useState(1);

  // Grup, Kurum ve Rol verilerini çekmek için useEffect'ler
  useEffect(() => {
    dispatch(getGroupsThunk());
    dispatch(getInstitutionsThunk());
    dispatch(getRolesThunk()); // Rolleri de burada çekebiliriz, ayrı bir useEffect yerine
  }, [dispatch]);

  // Yardımcı fonksiyonlar (mevcut halleriyle bırakıldı)
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

  // Tümünü seçme/kaldırma mantığı (mevcut)
  const allSelected =
    users.length > 0 && selectedUserIds.length === users.length;

  const handleSelectAll = () => {
    if (allSelected) {
      setSelectedUserIds([]);
    } else {
      // Sadece o sayfadaki değil, tüm kullanıcıları seçmek isterseniz:
      // const allIds = users.map((u) => u.id);
      //setSelectedUserIds(allIds);

      // Sadece görüntülenen sayfadaki kullanıcıları seçmek isterseniz:
      const currentUsersIds = currentUsers.map((u) => u.id);
      setSelectedUserIds(currentUsersIds);
    }
  };

  // --- YENİ EKLENEN VEYA GÜNCELLENEN KISIMLAR ---

  // Toplam sayfa sayısı
  const totalPages = Math.ceil(users.length / itemsPerPage);

  // Mevcut sayfada gösterilecek kullanıcılar
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentUsers = users.slice(indexOfFirstItem, indexOfLastItem);

  // Sayfa numarası değiştirme fonksiyonu
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    // Yeni sayfaya geçildiğinde seçili kullanıcıları sıfırlayabiliriz
    setSelectedUserIds([]);
  };

  // Sayfalama düğmeleri için dinamik dizi oluşturma
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  return (
    <div>
      {/* Sayfa başına personel seçimi */}
      <div style={{ marginBottom: "15px", textAlign: "right" }}>
        <label htmlFor="itemsPerPageSelect" style={{ marginRight: "10px" }}>
          Sayfa Başına Personel:
        </label>
        <select
          id="itemsPerPageSelect"
          value={itemsPerPage}
          onChange={(e) => {
            setItemsPerPage(Number(e.target.value));
            setCurrentPage(1); // Yeni sayfa başına öğe sayısı seçildiğinde ilk sayfaya dön
            setSelectedUserIds([]); // Seçili öğeleri de sıfırla
          }}
          style={{
            padding: "5px",
            borderRadius: "5px",
            border: "1px solid #ccc",
          }}
        >
          <option value={10}>10</option>
          <option value={20}>20</option>
          <option value={30}>30</option>
          <option value={40}>40</option>
          <option value={50}>50</option>
          <option value={100}>100</option>
          <option value={150}>150</option>
        </select>
      </div>

      {/* Tablo */}
      <div className="userlist-container position-relative">
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
                  checked={allSelected} // allSelected, tüm 'users' için mi, yoksa 'currentUsers' için mi kontrol edilecek? Aşağıdaki 'Notlar' bölümüne bakın.
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
            {/* currentUsers'ı map ediyoruz, users'ı değil */}
            {currentUsers?.map((user) => {
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

      {/* Sayfalama Kontrolleri */}
      {totalPages > 1 && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: "20px",
            gap: "8px", // Düğmeler arası boşluk
            flexWrap: "wrap", // Küçük ekranlarda taşmayı önler
          }}
        >
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="btn btn-outline-secondary btn-sm"
            style={{
              borderRadius: "6px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              transition: "background-color 0.3s, box-shadow 0.3s",
              marginRight: "0",
            }}
          >
            Önceki
          </button>
          {pageNumbers.map((number) => (
            <button
              key={number}
              onClick={() => handlePageChange(number)}
              className={`btn btn-sm ${
                currentPage === number ? "btn-primary" : "btn-outline-primary"
              }`}
              style={{
                borderRadius: "6px",
                boxShadow:
                  currentPage === number
                    ? "0 2px 8px rgba(0,123,255,0.4)"
                    : "0 1px 3px rgba(0,0,0,0.1)",
                transition: "background-color 0.3s, box-shadow 0.3s",
                margin: "0",
                minWidth: "36px",
                padding: "0 12px",
                fontWeight: currentPage === number ? "600" : "400",
              }}
            >
              {number}
            </button>
          ))}
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="btn btn-outline-secondary btn-sm"
            style={{
              borderRadius: "6px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              transition: "background-color 0.3s, box-shadow 0.3s",
              marginLeft: "0",
            }}
          >
            Sonraki
          </button>
        </div>
      )}
    </div>
  );
}
