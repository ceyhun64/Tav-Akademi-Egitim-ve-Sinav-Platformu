import React, { useState, useEffect } from "react";
import {
  createBookletThunk,
  getImgBookletsThunk,
  deleteBookletThunk,
  updateBookletThunk,
} from "../../../features/thunks/bookletThunk";
import { useDispatch, useSelector } from "react-redux";
import "bootstrap/dist/css/bootstrap.min.css";
import Sidebar from "../adminPanel/sidebar";

export default function ImgBooklets() {
  const dispatch = useDispatch();
  const [name, setName] = useState("");
  const [editingBookletId, setEditingBookletId] = useState(null);
  const { imgBooklets } = useSelector((state) => state.booklet);

  useEffect(() => {
    dispatch(getImgBookletsThunk());
  }, [dispatch]);

  const handleSubmit = async () => {
    if (!name) {
      return alert("Lütfen tüm alanları doldurun.");
    }

    if (editingBookletId) {
      try {
        console.log("Editing booklet with ID:", editingBookletId);
        console.log("New name:", name);

        await dispatch(
          updateBookletThunk({ id: editingBookletId, name, type: "img" })
        ).unwrap();
        setEditingBookletId(null);
        setName("");
        dispatch(getImgBookletsThunk());
      } catch (err) {
        console.error(err);
      }
    } else {
      try {
        await dispatch(createBookletThunk({ name, type: "img" })).unwrap();
        setName("");
        dispatch(getImgBookletsThunk());
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Bu kitapçığın içinde bulunan sorular da silinecek. Devam etmek istiyor musunuz?"
    );
    if (!confirmDelete) return;

    await dispatch(deleteBookletThunk(id)).unwrap();
    dispatch(getImgBookletsThunk());
  };

  const handleEdit = (booklet) => {
    setEditingBookletId(booklet.id);
    setName(booklet.name);
  };

  return (
    <div
      className="poolteo-container d-flex"
      style={{
        minHeight: "100vh",
        backgroundColor: "#f4f6fc",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        overflowX: "hidden",
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
          backgroundColor: "#003399",
          color: "#fff",
          boxShadow: "2px 0 12px rgba(0, 0, 0, 0.25)",
          overflowY: "auto",
          zIndex: 10,
          borderRadius: "0 12px 12px 0",
        }}
      >
        <Sidebar />
      </div>

      {/* İçerik */}
      <div
        style={{
          marginLeft: "260px",
          padding: "2.5rem 3rem",
          width: "100%",
          minHeight: "100vh",
          backgroundColor: "#f4f6fc",
          color: "#222",
          transition: "margin-left 0.3s ease",
        }}
      >
        <div className="row gx-4">
          {/* Sol taraf: Kitapçık oluşturma/güncelleme formu */}
          <div className="col-md-5">
            <div
              style={{
                backgroundColor: "#fff",
                borderRadius: "16px",
                padding: "2rem",
                boxShadow: "0 8px 20px rgba(0, 51, 153, 0.15)",
                border: "1px solid #e0e6ed",
              }}
            >
              <h4
                className="mb-4"
                style={{
                  color: "#003399",
                  fontWeight: "700",
                  letterSpacing: "0.05em",
                }}
              >
                {editingBookletId
                  ? "Kitapçığı Güncelle"
                  : "Görsel Kitapçık Oluştur"}
              </h4>

              <div className="mb-4">
                <label
                  htmlFor="bookletName"
                  className="form-label"
                  style={{ color: "#003399", fontWeight: "600" }}
                >
                  Adı:
                </label>
                <input
                  id="bookletName"
                  type="text"
                  className="form-control"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  style={{
                    borderColor: "#003399",
                    boxShadow: "inset 0 1px 3px rgba(0, 51, 153, 0.1)",
                    borderRadius: "8px",
                    fontSize: "1rem",
                  }}
                  placeholder="Kitapçık adını girin"
                />
              </div>

              <button
                onClick={handleSubmit}
                className="btn"
                style={{
                  backgroundColor: "#003399",
                  color: "#fff",
                  fontWeight: "600",
                  padding: "0.6rem 1.8rem",
                  borderRadius: "8px",
                  transition: "background-color 0.3s ease",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor = "#001b66")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = "#003399")
                }
              >
                {editingBookletId ? "Güncelle" : "Oluştur"}
              </button>

              {editingBookletId && (
                <button
                  onClick={() => {
                    setEditingBookletId(null);
                    setName("");
                  }}
                  className="btn ms-3"
                  style={{
                    backgroundColor: "#e0e6ed",
                    color: "#003399",
                    fontWeight: "600",
                    padding: "0.6rem 1.8rem",
                    borderRadius: "8px",
                    border: "1px solid #003399",
                    transition: "background-color 0.3s ease",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor = "#c5d1ff")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor = "#e0e6ed")
                  }
                >
                  İptal
                </button>
              )}
            </div>
          </div>

          {/* Sağ taraf: Kitapçık listesi */}
          <div className="col-md-7 mt-4 mt-md-0">
            <div
              style={{
                backgroundColor: "#fff",
                borderRadius: "16px",
                padding: "2rem",
                boxShadow: "0 8px 20px rgba(0, 51, 153, 0.15)",
                border: "1px solid #e0e6ed",
              }}
            >
              <h4
                className="mb-4"
                style={{
                  color: "#003399",
                  fontWeight: "700",
                  letterSpacing: "0.05em",
                }}
              >
                Görsel Kitapçıklar
              </h4>
              {imgBooklets?.length === 0 ? (
                <p style={{ color: "#4a5568", fontStyle: "italic" }}>
                  Henüz kitapçık eklenmemiş.
                </p>
              ) : (
                <ul className="list-group" style={{ border: "none" }}>
                  {imgBooklets.map((item) => (
                    <li
                      key={item.id}
                      className="list-group-item d-flex justify-content-between align-items-start flex-column flex-md-row"
                      style={{
                        border: "none",
                        padding: "1rem 1.5rem",
                        borderBottom: "1px solid #e0e6ed",
                        backgroundColor: "#f9fafb",
                        borderRadius: "8px",
                        marginBottom: "0.75rem",
                      }}
                    >
                      <div className="me-3" style={{ color: "#001b66" }}>
                        <h6 className="mb-1" style={{ fontWeight: "600" }}>
                          {item.name}
                        </h6>
                        <p className="mb-0" style={{ fontSize: "0.9rem" }}>
                          Türü: {item.type}
                        </p>
                      </div>
                      <div className="mt-3 mt-md-0">
                        <button
                          onClick={() => handleEdit(item)}
                          className="btn btn-sm me-2"
                          style={{
                            backgroundColor: "#0041a3",
                            color: "#fff",
                            fontWeight: "600",
                            padding: "0.35rem 0.9rem",
                            borderRadius: "6px",
                            border: "none",
                            transition: "background-color 0.3s ease",
                          }}
                          onMouseEnter={(e) =>
                            (e.currentTarget.style.backgroundColor = "#001b66")
                          }
                          onMouseLeave={(e) =>
                            (e.currentTarget.style.backgroundColor = "#0041a3")
                          }
                        >
                          Düzenle
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="btn btn-sm"
                          style={{
                            backgroundColor: "#c53030",
                            color: "#fff",
                            fontWeight: "600",
                            padding: "0.35rem 0.9rem",
                            borderRadius: "6px",
                            border: "none",
                            transition: "background-color 0.3s ease",
                          }}
                          onMouseEnter={(e) =>
                            (e.currentTarget.style.backgroundColor = "#9b2c2c")
                          }
                          onMouseLeave={(e) =>
                            (e.currentTarget.style.backgroundColor = "#c53030")
                          }
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
  );
}
