import React from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  getGroupsThunk,
  getInstitutionsThunk,
} from "../../../features/thunks/grpInstThunk";
import { useEffect } from "react";
import "./UserFilter.css"

export default function UserFilter({ filters, onChange, uniqueValues }) {
  const dispatch = useDispatch();
  const { groups, institutions } = useSelector((state) => state.grpInst);

  useEffect(() => {
    dispatch(getGroupsThunk());
    dispatch(getInstitutionsThunk());
  }, [dispatch]);

  const ilcelerForSelectedIl = filters.il
    ? uniqueValues.ilceler?.filter((ilce) => ilce.il_adi === filters.il)
    : [];

  return (
    <div className="card p-3 mb-3 shadow-sm">
      <h5>Filtrele</h5>
      {/* user-filter-row classı eklendi */}
      <div className="row user-filter-row">
        <div className="col-md-4 col-6 mb-2">
          <input
            type="text"
            name="sicil"
            className="form-control"
            placeholder="Sicil No"
            value={filters.sicil}
            onChange={onChange}
          />
        </div>

        <div className="col-md-4 col-6 mb-2">
          <input
            type="text"
            name="ad"
            className="form-control"
            placeholder="Ad"
            value={filters.ad}
            onChange={onChange}
          />
        </div>

        <div className="col-md-4 col-6 mb-2">
          <input
            type="text"
            name="soyad"
            className="form-control"
            placeholder="Soyad"
            value={filters.soyad}
            onChange={onChange}
          />
        </div>

        <div className="col-md-4 col-6 mb-2">
          <select
            name="il"
            className="form-select"
            value={filters.il}
            onChange={onChange}
          >
            <option value="">Tüm İller</option>
            {uniqueValues.il?.map((il) => (
              <option key={il} value={il}>
                {il}
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
            {ilcelerForSelectedIl?.map((ilce) => (
              <option key={ilce.ilce_adi} value={ilce.ilce_adi}>
                {ilce.ilce_adi}
              </option>
            ))}
          </select>
        </div>

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
