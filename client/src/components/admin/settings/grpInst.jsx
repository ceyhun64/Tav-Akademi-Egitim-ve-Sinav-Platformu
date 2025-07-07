import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  createGroupThunk,
  deleteGroupThunk,
  getGroupsThunk,
  updateGroupThunk,
  createInstitutionThunk,
  deleteInstitutionThunk,
  getInstitutionsThunk,
  updateInstitutionThunk,
} from "../../../features/thunks/grpInstThunk";
import Sidebar from "../adminPanel/sidebar";

export default function GrpInst() {
  const dispatch = useDispatch();
  const { groups, institutions, loading, error } = useSelector(
    (state) => state.grpInst
  );

  const [groupForm, setGroupForm] = useState({ id: null, name: "" });
  const [institutionForm, setInstitutionForm] = useState({
    id: null,
    name: "",
  });

  const [groupSearch, setGroupSearch] = useState("");
  const [institutionSearch, setInstitutionSearch] = useState("");

  useEffect(() => {
    dispatch(getGroupsThunk());
    dispatch(getInstitutionsThunk());
  }, [dispatch]);

  // === GROUP handlers ===
  const handleGroupChange = (e) => {
    setGroupForm({ ...groupForm, name: e.target.value });
  };

  const handleGroupSubmit = (e) => {
    e.preventDefault();
    const name = groupForm.name.trim();
    if (!name) return;

    const duplicate = groups.find(
      (g) =>
        g.name.toLowerCase() === name.toLowerCase() && g.id !== groupForm.id
    );
    if (duplicate) return alert("Bu grup zaten mevcut!");

    if (groupForm.id) {
      dispatch(updateGroupThunk(groupForm));
    } else {
      dispatch(createGroupThunk({ name }));
    }
    setGroupForm({ id: null, name: "" });
  };

  const handleGroupEdit = (item) => {
    setGroupForm(item);
  };

  const handleGroupDelete = (id) => {
    if (window.confirm("Grubu silmek istiyor musun?")) {
      dispatch(deleteGroupThunk(id));
    }
  };

  const filteredGroups = groups.filter((g) =>
    g.name.toLowerCase().includes(groupSearch.toLowerCase())
  );

  // === INSTITUTION handlers ===
  const handleInstitutionChange = (e) => {
    setInstitutionForm({ ...institutionForm, name: e.target.value });
  };

  const handleInstitutionSubmit = (e) => {
    e.preventDefault();
    const name = institutionForm.name.trim();
    if (!name) return;

    const duplicate = institutions.find(
      (i) =>
        i.name.toLowerCase() === name.toLowerCase() &&
        i.id !== institutionForm.id
    );
    if (duplicate) return alert("Bu kurum zaten mevcut!");

    if (institutionForm.id) {
      dispatch(updateInstitutionThunk(institutionForm));
    } else {
      dispatch(createInstitutionThunk({ name }));
    }
    setInstitutionForm({ id: null, name: "" });
  };

  const handleInstitutionEdit = (item) => {
    setInstitutionForm(item);
  };

  const handleInstitutionDelete = (id) => {
    if (window.confirm("Kurumu silmek istiyor musun?")) {
      dispatch(deleteInstitutionThunk(id));
    }
  };

  const filteredInstitutions = institutions.filter((i) =>
    i.name.toLowerCase().includes(institutionSearch.toLowerCase())
  );

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
              className="bi bi-diagram-3-fill"
              style={{ fontSize: "1.6rem" }}
            ></i>
            Kurum ve Grup İşlemleri
          </h1>
        </div>{" "}
        <div
          className="row"
          style={{
            maxWidth: "1200px", // genişliği artırdım
            width: "1100px", // genişliği tam ekran yapıyor
            margin: "0 auto", // ortaya hizalama
            borderRadius: "16px", // biraz daha yuvarlak köşeler
            padding: "2rem", // içerik için padding artırıldı
            boxShadow: "0 8px 20px rgba(0, 51, 153, 0.15)", // daha belirgin gölge
            backgroundColor: "#fff",
          }}
        >
          {/* === INSTITUTIONS === */}
          <div className="col-md-6 mb-4">
            <div className="card shadow-sm">
              <div className="card-body">
                <h4 className="card-title mb-3">Kurumlar</h4>

                <form onSubmit={handleInstitutionSubmit} className="mb-3">
                  <div className="input-group">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Kurum adı"
                      value={institutionForm.name}
                      onChange={handleInstitutionChange}
                    />
                    <button
                      className={`btn ${
                        institutionForm.id ? "btn-warning" : "btn-primary"
                      }`}
                      type="submit"
                    >
                      {institutionForm.id ? "Güncelle" : "Ekle"}
                    </button>
                  </div>
                </form>

                <input
                  type="text"
                  className="form-control mb-3"
                  placeholder="Ara..."
                  value={institutionSearch}
                  onChange={(e) => setInstitutionSearch(e.target.value)}
                />

                {loading ? (
                  <p>Yükleniyor...</p>
                ) : error ? (
                  <div className="alert alert-danger">{error}</div>
                ) : filteredInstitutions.length === 0 ? (
                  <p>Kurum bulunamadı</p>
                ) : (
                  <ul className="list-group">
                    {filteredInstitutions.map((inst) => (
                      <li
                        key={inst.id}
                        className="list-group-item d-flex justify-content-between align-items-center"
                      >
                        {inst.name}
                        <div>
                          <button
                            className="btn btn-sm btn-outline-warning me-2"
                            onClick={() => handleInstitutionEdit(inst)}
                          >
                            Düzenle
                          </button>
                          <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => handleInstitutionDelete(inst.id)}
                          >
                            Sil
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>

          {/* === GROUPS === */}
          <div className="col-md-6 mb-4">
            <div className="card shadow-sm">
              <div className="card-body">
                <h4 className="card-title mb-3">Gruplar</h4>

                <form onSubmit={handleGroupSubmit} className="mb-3">
                  <div className="input-group">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Grup adı"
                      value={groupForm.name}
                      onChange={handleGroupChange}
                    />
                    <button
                      className={`btn ${
                        groupForm.id ? "btn-warning" : "btn-primary"
                      }`}
                      type="submit"
                    >
                      {groupForm.id ? "Güncelle" : "Ekle"}
                    </button>
                  </div>
                </form>

                <input
                  type="text"
                  className="form-control mb-3"
                  placeholder="Ara..."
                  value={groupSearch}
                  onChange={(e) => setGroupSearch(e.target.value)}
                />

                {loading ? (
                  <p>Yükleniyor...</p>
                ) : error ? (
                  <div className="alert alert-danger">{error}</div>
                ) : filteredGroups.length === 0 ? (
                  <p>Grup bulunamadı</p>
                ) : (
                  <ul className="list-group">
                    {filteredGroups.map((group) => (
                      <li
                        key={group.id}
                        className="list-group-item d-flex justify-content-between align-items-center"
                      >
                        {group.name}
                        <div>
                          <button
                            className="btn btn-sm btn-outline-warning me-2"
                            onClick={() => handleGroupEdit(group)}
                          >
                            Düzenle
                          </button>
                          <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => handleGroupDelete(group.id)}
                          >
                            Sil
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
