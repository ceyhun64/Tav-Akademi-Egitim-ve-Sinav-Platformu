import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  getGroupsThunk,
  getInstitutionsThunk,
} from "../../../features/thunks/grpInstThunk";
import provinces from "../../../data/provinces.json";
import "./UserFilter.css";

export default function UserFilter({ filters, onChange, uniqueValues }) {
  const dispatch = useDispatch();
  const { groups, institutions } = useSelector((state) => state.grpInst);

  useEffect(() => {
    dispatch(getGroupsThunk());
    dispatch(getInstitutionsThunk());
  }, [dispatch]);

  // Seçilen ilin objesini bul
  const selectedProvince = provinces.find(
    (p) => p.value === Number(filters.il)
  );

  // İlçeler (districts) sadece seçilen ilin districts'i olacak
  const districtsForSelectedProvince = selectedProvince
    ? selectedProvince.districts
    : [];

  return (
    <div className="card p-3 mb-3 shadow-sm">
      <h5>Filtrele</h5>
      <div className="row user-filter-row">
        {/* Diğer inputlar aynı */}

        <div className="col-md-4 col-6 mb-2">
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

        <div className="col-md-4 col-6 mb-2">
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

        {/* Lokasyon ve grup seçimleri aynı */}

        <div className="col-md-4 col-6 mb-2">
          <select
            name="lokasyonId"
            className="form-select"
            value={filters.lokasyonId}
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

        <div className="col-md-4 col-6 mb-2">
          <select
            name="grupId"
            className="form-select"
            value={filters.grupId}
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
