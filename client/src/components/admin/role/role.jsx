import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getRolesThunk,
  createRoleThunk,
  deleteRoleThunk,
  updateRoleThunk,
  getRoleLevelsThunk,
} from "../../../features/thunks/roleThunk";
import RoleLevel from "./roleLevel";
import Sidebar from "../adminPanel/sidebar";

export default function Role() {
  const dispatch = useDispatch();
  const { roles, roleLevels, isLoading } = useSelector((state) => state.role);

  const [id, setId] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    roleLevelId: "",
  });

  useEffect(() => {
    dispatch(getRolesThunk());
    dispatch(getRoleLevelsThunk());
  }, [dispatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (id) {
      await dispatch(updateRoleThunk({ id, formData }));
    } else {
      await dispatch(createRoleThunk(formData));
    }

    dispatch(getRolesThunk());
    setFormData({ name: "", roleLevelId: "" });
    setId(null);
  };

  const handleEdit = (role) => {
    setFormData({
      name: role.name,
      roleLevelId: role.roleLevelId,
    });
    setId(role.id);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Bu rolü silmek istediğinizden emin misiniz?")) {
      await dispatch(deleteRoleThunk(id));
      dispatch(getRolesThunk());
    }
  };

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
              className="bi bi-person-check-fill"
              style={{ fontSize: "1.6rem" }}
            ></i>
            Yetki İşlemleri
          </h1>
        </div>
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
          {/* Form */}
          <div className="col-md-6 mb-4">
            <div className="card shadow-sm">
              <div className="card-body">
                <h4 className="card-title mb-3">Rol Oluştur</h4>
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label
                      htmlFor="roleName"
                      className="form-label text-dark fw-semibold"
                    >
                      Rol Adı:
                    </label>
                    <input
                      type="text"
                      id="roleName"
                      name="name"
                      className="form-control rounded-3"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      placeholder="Rol adını girin"
                    />
                  </div>

                  <div className="mb-3">
                    <label
                      htmlFor="roleLevelSelect"
                      className="form-label text-dark fw-semibold"
                    >
                      Rol Seviyesi:
                    </label>
                    <select
                      id="roleLevelSelect"
                      name="roleLevelId"
                      className="form-select rounded-3"
                      value={formData.roleLevelId}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Seçiniz</option>
                      {roleLevels?.map((level) => (
                        <option key={level.id} value={level.id}>
                          {level.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="d-flex gap-2">
                    <button type="submit" className="btn btn-primary shadow-sm">
                      <i
                        className={`bi ${
                          id ? "bi-pencil" : "bi-plus-circle"
                        } me-2`}  style={{color: "white"}}
                      ></i>
                      {id ? "Güncelle" : "Oluştur"}
                    </button>
                    {id && (
                      <button
                        type="button"
                        className="btn btn-outline-secondary"
                        onClick={() => {
                          setFormData({ name: "", roleLevelId: "" });
                          setId(null);
                        }}
                      >
                        <i className="bi bi-x-circle me-1"></i> İptal
                      </button>
                    )}
                  </div>
                </form>
              </div>
            </div>
          </div>

          {/* Roller Tablosu */}
          <div className="col-md-6 mb-4">
            <div className="card shadow-sm">
              <div className="card-body">
                <h4 className="card-title mb-3">Roller</h4>

                {isLoading ? (
                  <div className="text-center py-3">
                    <div
                      className="spinner-border text-primary"
                      role="status"
                    ></div>
                  </div>
                ) : roles.length === 0 ? (
                  <p>Rol bulunamadı</p>
                ) : (
                  <ul className="list-group">
                    {roles.map((role) => (
                      <li
                        key={role.id}
                        className="list-group-item d-flex justify-content-between align-items-center"
                      >
                        <div>
                          <strong>{role.name}</strong>{" "}
                          <small className="text-muted">
                            (
                            {roleLevels.find(
                              (level) => level.id === role.roleLevelId
                            )?.name || "Bilinmiyor"}
                            )
                          </small>
                        </div>
                        <div>
                          <button
                            className="btn btn-sm btn-outline-primary me-2"
                            onClick={() => handleEdit(role)}
                          >
                            Düzenle
                          </button>
                          <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => handleDelete(role.id)}
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

        {/* Role Level bileşeni */}
        <div
          className="mt-4"
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
          {" "}
          <RoleLevel />
        </div>
      </div>
    </div>
  );
}
