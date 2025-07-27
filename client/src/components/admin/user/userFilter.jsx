import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  getGroupsThunk,
  getInstitutionsThunk,
} from "../../../features/thunks/grpInstThunk";
import provinces from "../../../data/provinces.json";
import "./UserFilter.css";

export default function UserFilter({
  filters,
  onChange,
  uniqueValues,
  isMobile,
  isTablet,
}) {
  const dispatch = useDispatch();
  const { groups, institutions } = useSelector((state) => state.grpInst);

  useEffect(() => {
    dispatch(getGroupsThunk());
    dispatch(getInstitutionsThunk());
  }, [dispatch]);

  const selectedProvince = provinces.find(
    (p) => p.value === Number(filters.il)
  );

  const districtsForSelectedProvince = selectedProvince
    ? selectedProvince.districts
    : [];

  return (
    <div
      className="card p-3 mb-3 shadow-sm"
      style={{ width: isTablet ? "100%" : "auto" }}
    >
      <h5>Filtrele</h5>
      <div className="row user-filter-row">
        {/* Ad */}
        <div
          className={
            isMobile
              ? "col-12 mb-2"
              : isTablet
              ? "col-6 mb-2"
              : "col-6 col-md-4 mb-2"
          }
        >
          <input
            type="text"
            className="form-control"
            name="ad"
            placeholder="Ad"
            value={filters.ad || ""}
            onChange={onChange}
          />
        </div>

        {/* Soyad */}
        <div
          className={
            isMobile
              ? "col-12 mb-2"
              : isTablet
              ? "col-6 mb-2"
              : "col-6 col-md-4 mb-2"
          }
        >
          <input
            type="text"
            className="form-control"
            name="soyad"
            placeholder="Soyad"
            value={filters.soyad || ""}
            onChange={onChange}
          />
        </div>

        {/* Sicil */}
        <div
          className={
            isMobile
              ? "col-12 mb-2"
              : isTablet
              ? "col-6 mb-2"
              : "col-6 col-md-4 mb-2"
          }
        >
          <input
            type="text"
            className="form-control"
            name="sicil"
            placeholder="Sicil No"
            value={filters.sicil || ""}
            onChange={onChange}
          />
        </div>

        {/* Kullanıcı Adı */}
        <div
          className={
            isMobile
              ? "col-12 mb-2"
              : isTablet
              ? "col-6 mb-2"
              : "col-6 col-md-4 mb-2"
          }
        >
          <input
            type="text"
            className="form-control"
            name="kullanici_adi"
            placeholder="Kullanıcı Adı"
            value={filters.kullanici_adi || ""}
            onChange={onChange}
          />
        </div>

        {/* İl */}
        <div
          className={
            isMobile
              ? "col-12 mb-2"
              : isTablet
              ? "col-6 mb-2"
              : "col-6 col-md-4 mb-2"
          }
        >
          <select
            name="il"
            className="form-select"
            value={filters.il}
            onChange={onChange}
          >
            <option value="">Tüm İller</option>
            {provinces.map((province) => (
              <option key={province.value} value={province.value}>
                {province.text}
              </option>
            ))}
          </select>
        </div>

        {/* İlçe */}
        <div
          className={
            isMobile
              ? "col-12 mb-2"
              : isTablet
              ? "col-6 mb-2"
              : "col-6 col-md-4 mb-2"
          }
        >
          <select
            name="ilce"
            className="form-select"
            value={filters.ilce}
            onChange={onChange}
            disabled={!filters.il}
          >
            <option value="">Tüm İlçeler</option>
            {districtsForSelectedProvince.map((district) => (
              <option key={district.value} value={district.value}>
                {district.text}
              </option>
            ))}
          </select>
        </div>

        {/* Lokasyon */}
        <div
          className={
            isMobile
              ? "col-12 mb-2"
              : isTablet
              ? "col-6 mb-2"
              : "col-6 col-md-4 mb-2"
          }
        >
          <select
            name="lokasyonId"
            className="form-select"
            value={Number(filters.lokasyonId)}
            onChange={onChange}
          >
            <option value="">Tüm Lokasyonlar</option>
            {institutions?.map((inst) => (
              <option key={inst.id} value={inst.id}>
                {inst.name ||
                  inst.lokasyon_adi ||
                  inst.title ||
                  inst.ad ||
                  "İsim Yok"}
              </option>
            ))}
          </select>
        </div>

        {/* Grup */}
        <div
          className={
            isMobile
              ? "col-12 mb-2"
              : isTablet
              ? "col-6 mb-2"
              : "col-6 col-md-4 mb-2"
          }
        >
          <select
            name="grupId"
            className="form-select"
            value={Number(filters.grupId)}
            onChange={onChange}
          >
            <option value="">Tüm Gruplar</option>
            {groups?.map((grp) => (
              <option key={grp.id} value={grp.id}>
                {grp.name || grp.grup_adi || grp.title || grp.ad || "İsim Yok"}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
