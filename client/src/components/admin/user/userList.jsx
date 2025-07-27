import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  getGroupsThunk,
  getInstitutionsThunk,
} from "../../../features/thunks/grpInstThunk";
import { getRolesThunk } from "../../../features/thunks/roleThunk";
import provinces from "../../../data/provinces.json";

export default function UserList({
  users,
  selectedUser,
  selectedUserIds,
  onUserClick,
  onCheckboxChange,
  onDeleteSelected,
  onToggleDurum,
  setSelectedUserIds,
  isMobile,
  isTablet,
}) {
  const dispatch = useDispatch();
  const { groups, institutions } = useSelector((state) => state.grpInst);
  const { roles } = useSelector((state) => state.role);

  const [itemsPerPage, setItemsPerPage] = useState(50);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    dispatch(getGroupsThunk());
    dispatch(getInstitutionsThunk());
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
      const currentUsersIds = currentUsers.map((u) => u.id);
      setSelectedUserIds(currentUsersIds);
    }
  };

  const totalPages = Math.ceil(users.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentUsers = users.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    setSelectedUserIds([]);
  };

  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  // Genel hücre padding ve font-size için ortak style objesi
  const cellStyle = {
    padding: isMobile || isTablet ? "4px 6px" : "6px 8px",
    fontSize: isMobile || isTablet ? "0.65rem" : "0.75rem",
    whiteSpace: "nowrap", // satır içi kaymayı engelle
  };

  return (
    <div>
      {/* Sayfa başına personel seçimi */}
      <div
        style={{
          marginBottom: "15px",
          textAlign: "right",
          fontSize: isMobile || isTablet ? "0.8rem" : "1rem",
        }}
      >
        <label htmlFor="itemsPerPageSelect" style={{ marginRight: "10px" }}>
          Sayfa Başına Personel:
        </label>
        <select
          id="itemsPerPageSelect"
          value={itemsPerPage}
          onChange={(e) => {
            setItemsPerPage(Number(e.target.value));
            setCurrentPage(1);
            setSelectedUserIds([]);
          }}
          style={{
            padding: "5px",
            borderRadius: "5px",
            border: "1px solid #ccc",
            fontSize: isMobile || isTablet ? "0.8rem" : "1rem",
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

      {/* Tablo container - yatay scroll için */}
      <div
        className="userlist-container position-relative"
        style={{
          overflowX: "auto",
          fontSize: isMobile ? "0.6rem" : isTablet ? "0.7rem" : "0.75rem",
                    maxWidth:"1100px"

        }}
      >
        <table
          className="table table-sm table-hover table-bordered userlist-table"
          style={{
            fontSize: isMobile ? "0.6rem" : isTablet ? "0.7rem" : "0.75rem",
            minWidth: isMobile ? "800px" : isTablet ? "950px" : "1000px",
            whiteSpace: "nowrap",
            marginBottom: "0",
          }}
        >
          <thead
            className="table-light"
            style={{
              position: "sticky",
              top: 0,
              zIndex: 1,
              fontSize: isMobile ? "0.6rem" : isTablet ? "0.7rem" : "0.75rem",
            }}
          >
            <tr>
              <th
                className="px-1 py-1 checkbox-col"
                style={{ ...cellStyle, width: "30px" }}
              >
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={handleSelectAll}
                  style={{ width: "14px", height: "14px" }}
                />
              </th>
              <th
                className="px-1 py-1 durum-col text-center"
                style={{ ...cellStyle, width: "40px", textAlign: "center" }}
              >
                Durum
              </th>
              <th className="px-1 py-1 rol-col" style={{ ...cellStyle }}>
                Rol
              </th>
              <th className="px-1 py-1 lokasyon-col" style={{ ...cellStyle }}>
                Lokasyon
              </th>
              <th className="px-1 py-1 grup-col" style={{ ...cellStyle }}>
                Grup
              </th>
              <th className="px-1 py-1 cinsiyet-col" style={{ ...cellStyle }}>
                Cinsiyet
              </th>
              <th className="px-1 py-1 sicil-col" style={{ ...cellStyle }}>
                Sicil No
              </th>
              <th className="px-1 py-1 tcno-col" style={{ ...cellStyle }}>
                T.C. Kimlik No
              </th>
              <th className="px-1 py-1 ad-col" style={{ ...cellStyle }}>
                Ad
              </th>
              <th className="px-1 py-1 soyad-col" style={{ ...cellStyle }}>
                Soyad
              </th>
              <th
                className="px-1 py-1 kullanici-adi-col"
                style={{ ...cellStyle }}
              >
                Kullanıcı Adı
              </th>
              <th className="px-1 py-1 phone-col" style={{ ...cellStyle }}>
                Telefon
              </th>
              <th className="px-1 py-1 email-col" style={{ ...cellStyle }}>
                Email
              </th>
              <th className="px-1 py-1 ise-giris-col" style={{ ...cellStyle }}>
                İşe Giriş
              </th>
              <th className="px-1 py-1 il-col" style={{ ...cellStyle }}>
                İl
              </th>
              <th className="px-1 py-1 ilce-col" style={{ ...cellStyle }}>
                İlçe
              </th>
              <th className="px-1 py-1 adres-col" style={{ ...cellStyle }}>
                Adres
              </th>
            </tr>
          </thead>

          <tbody>
            {currentUsers?.map((user) => {
              const isSelected = selectedUser && selectedUser.id === user.id;
              return (
                <tr
                  key={user.id}
                  className={isSelected ? "table-primary" : ""}
                  style={{
                    cursor: "pointer",
                    lineHeight: 1.2,
                    height: isMobile ? "30px" : "auto",
                  }}
                  onClick={() => onUserClick(user.id)}
                >
                  <td
                    onClick={(e) => e.stopPropagation()}
                    className="px-1 py-1 checkbox-col"
                    style={{ ...cellStyle, width: "30px" }}
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
                    style={{ ...cellStyle, textAlign: "center", width: "40px" }}
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
                    ></span>
                  </td>
                  <td className="px-1 py-1 rol-col" style={cellStyle}>
                    {getRoleName(user.roleId) || "-"}
                  </td>
                  <td className="px-1 py-1 lokasyon-col" style={cellStyle}>
                    {getInstitutionName(user.lokasyonId) || "-"}
                  </td>
                  <td className="px-1 py-1 grup-col" style={cellStyle}>
                    {getGroupName(user.grupId) || "-"}
                  </td>
                  <td className="px-1 py-1 cinsiyet-col" style={cellStyle}>
                    {user.cinsiyet || "-"}
                  </td>
                  <td className="px-1 py-1 sicil-col" style={cellStyle}>
                    {user.sicil || "-"}
                  </td>
                  <td className="px-1 py-1 tcno-col" style={cellStyle}>
                    {user.tcno || "-"}
                  </td>
                  <td className="px-1 py-1 ad-col" style={cellStyle}>
                    {user.ad || "-"}
                  </td>
                  <td className="px-1 py-1 soyad-col" style={cellStyle}>
                    {user.soyad || "-"}
                  </td>
                  <td className="px-1 py-1 kullanici-adi-col" style={cellStyle}>
                    {user.kullanici_adi || "-"}
                  </td>
                  <td className="px-1 py-1 phone-col" style={cellStyle}>
                    {user.telefon || "-"}
                  </td>
                  <td className="px-1 py-1 email-col" style={cellStyle}>
                    {user.email || "-"}
                  </td>
                  <td className="px-1 py-1 ise-giris-col" style={cellStyle}>
                    {user.ise_giris_tarihi || "-"}
                  </td>
                  <td className="px-1 py-1 il-col" style={cellStyle}>
                    {getProvinceNameById(user.il) || "-"}
                  </td>
                  <td className="px-1 py-1 ilce-col" style={cellStyle}>
                    {getDistrictNameById(user.ilce) || "-"}
                  </td>
                  <td className="px-1 py-1 adres-col" style={cellStyle}>
                    {user.adres || "-"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <nav
        aria-label="Page navigation"
        style={{ marginTop: "10px", textAlign: "center" }}
      >
        <ul
          className="pagination justify-content-center"
          style={{ marginBottom: 0 }}
        >
          <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
            <button
              className="page-link"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Önceki
            </button>
          </li>

          {pageNumbers.map((num) => (
            <li
              key={num}
              className={`page-item ${currentPage === num ? "active" : ""}`}
            >
              <button
                className="page-link"
                onClick={() => handlePageChange(num)}
              >
                {num}
              </button>
            </li>
          ))}

          <li
            className={`page-item ${
              currentPage === totalPages ? "disabled" : ""
            }`}
          >
            <button
              className="page-link"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Sonraki
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
}
