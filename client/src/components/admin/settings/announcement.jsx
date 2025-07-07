import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAnnouncements,
  addAnnouncement,
  editAnnouncement,
  removeAnnouncement,
} from "../../../features/thunks/announcementThunk";
import {
  getGroupsThunk,
  getInstitutionsThunk,
} from "../../../features/thunks/grpInstThunk";
import Sidebar from "../adminPanel/sidebar";

export default function AnnouncementForm() {
  const dispatch = useDispatch();
  const { announcements, loading, error } = useSelector(
    (state) => state.announcement
  );
  const { groups, institutions } = useSelector((state) => state.grpInst);
  const [formData, setFormData] = useState({
    institutionId: "",
    groupId: "",
    content: "",
  });

  const [editId, setEditId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    dispatch(getGroupsThunk());
    dispatch(getInstitutionsThunk());
    dispatch(fetchAnnouncements());
  }, [dispatch]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editId) {
      await dispatch(editAnnouncement({ id: editId, ...formData }));
      setEditId(null);
    } else {
      await dispatch(addAnnouncement(formData));
    }
    setFormData({ institutionId: "", groupId: "", content: "" });

    // İşlem sonrası duyuruları tekrar çek
    dispatch(fetchAnnouncements());
  };

  const handleEdit = (announcement) => {
    setFormData({
      institutionId: announcement.institutionId || "",
      groupId: announcement.groupId || "",
      content: announcement.content || "",
    });
    setEditId(announcement.id);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Duyuruyu silmek istediğine emin misin?")) {
      await dispatch(removeAnnouncement(id));
    }
  };

  const filteredAnnouncements = announcements.filter(
    (a) =>
      a.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (a.institutionId && a.institutionId.toString().includes(searchTerm)) ||
      (a.groupId && a.groupId.toString().includes(searchTerm))
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
              className="bi bi-megaphone-fill"
              style={{ fontSize: "1.6rem" }}
            ></i>
            Duyuru İşlemleri
          </h1>
        </div>
        <div>
          <div
            className="card shadow-sm"
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
            <div className="card-body">
              <h2 className="card-title mb-4">
                {editId ? "Duyuru Güncelle" : "Yeni Duyuru Oluştur"}
              </h2>

              {/* Form */}
              <form onSubmit={handleSubmit} className="mb-4">
                <div className="mb-3">
                  <label htmlFor="institutionId" className="form-label">
                    Lokasyon
                  </label>
                  <select
                    id="institutionId"
                    name="institutionId"
                    className="form-select"
                    value={formData.institutionId}
                    onChange={handleChange}
                  >
                    <option value="">-- Lokasyon Seçiniz --</option>
                    {institutions.map((inst) => (
                      <option key={inst.id} value={inst.id}>
                        {inst.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mb-3">
                  <label htmlFor="groupId" className="form-label">
                    Grup
                  </label>
                  <select
                    id="groupId"
                    name="groupId"
                    className="form-select"
                    value={formData.groupId}
                    onChange={handleChange}
                  >
                    <option value="">-- Grup Seçiniz --</option>
                    {groups.map((grp) => (
                      <option key={grp.id} value={grp.id}>
                        {grp.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="input-group mb-3">
                  <textarea
                    name="content"
                    className="form-control"
                    placeholder="Duyuru içeriği"
                    value={formData.content}
                    onChange={handleChange}
                    required
                    rows={3}
                  />
                </div>

                <button
                  type="submit"
                  className={`btn ${editId ? "btn-warning" : "btn-primary"}`}
                  disabled={loading}
                >
                  {editId ? "Güncelle" : "Oluştur"}
                </button>
              </form>

              {/* Search */}
              <input
                type="text"
                className="form-control mb-3"
                placeholder="Ara..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />

              {/* Loading, error, empty */}
              {loading ? (
                <div className="text-center my-4">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Yükleniyor...</span>
                  </div>
                </div>
              ) : error ? (
                <div className="alert alert-danger" role="alert">
                  Hata: {error}
                </div>
              ) : filteredAnnouncements.length === 0 ? (
                <p className="text-center">Gösterilecek duyuru yok.</p>
              ) : (
                <div className="table-responsive">
                  <table className="table table-striped table-hover align-middle">
                    <thead>
                      <tr>
                        <th scope="col">Duyuru İçeriği</th>
                        <th scope="col">Lokasyon</th>
                        <th scope="col">Grup</th>
                        <th scope="col" style={{ width: "150px" }}>
                          İşlemler
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredAnnouncements.map((a) => {
                        const institutionName =
                          institutions.find(
                            (inst) => inst.id === a.institutionId
                          )?.name || "-";
                        const groupName =
                          groups.find((grp) => grp.id === a.groupId)?.name ||
                          "-";

                        return (
                          <tr key={a.id}>
                            <td>{a.content}</td>
                            <td>{institutionName}</td>
                            <td>{groupName}</td>
                            <td>
                              <button
                                className="btn btn-sm btn-outline-primary me-2"
                                onClick={() => handleEdit(a)}
                              >
                                Düzenle
                              </button>
                              <button
                                className="btn btn-sm btn-outline-danger"
                                onClick={() => handleDelete(a.id)}
                              >
                                Sil
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
