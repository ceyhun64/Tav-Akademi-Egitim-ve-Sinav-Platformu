import React, { useState, useEffect } from "react";
import {
  createBookletThunk,
  getTeoBookletsThunk,
  deleteBookletThunk,
  updateBookletThunk,
} from "../../../features/thunks/bookletThunk";
import { useDispatch, useSelector } from "react-redux";
import "bootstrap/dist/css/bootstrap.min.css";
import Sidebar from "../adminPanel/sidebar";

export default function TeoBooklets() {
  const dispatch = useDispatch();
  const [name, setName] = useState("");
  const [editingBookletId, setEditingBookletId] = useState(null);
  const { teoBooklets } = useSelector((state) => state.booklet);

  useEffect(() => {
    dispatch(getTeoBookletsThunk());
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
          updateBookletThunk({ id: editingBookletId, name, type: "teo" })
        ).unwrap();
        setEditingBookletId(null);
        setName("");
        dispatch(getTeoBookletsThunk());
      } catch (err) {
        console.error(err);
      }
    } else {
      try {
        await dispatch(createBookletThunk({ name, type: "teo" })).unwrap();
        setName("");
        dispatch(getTeoBookletsThunk());
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
    dispatch(getTeoBookletsThunk());
  };

  const handleEdit = (booklet) => {
    setEditingBookletId(booklet.id);
    setName(booklet.name);
  };

  return (
    <div
      className="d-flex"
      style={{ minHeight: "100vh", backgroundColor: "#f0f4fa" }}
    >
      {/* Sidebar */}
      <div
        style={{
          width: "260px",
          minHeight: "100vh",
          padding: "1.5rem",
          position: "fixed",
          left: 0,
          top: 0,
          backgroundColor: "#001b66",
          boxShadow: "2px 0 8px rgba(0,0,0,0.15)",
          borderRadius: "0 12px 12px 0",
          color: "#fff",
          fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        }}
      >
        <Sidebar />
      </div>

      {/* İçerik */}
      <div
        style={{
          marginLeft: "260px",
          backgroundColor: "#f0f4fa",
          minHeight: "100vh",
          padding: "2rem 3rem",
          width: "100%",
          fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        }}
      >
        <div className="row gy-4">
          {/* Sol taraf: Kitapçık oluşturma/güncelleme formu */}
          <div className="col-md-5">
            <div
              className="card p-4"
              style={{
                borderRadius: "12px",
                boxShadow: "0 6px 20px rgba(0, 27, 102, 0.15)",
                border: "none",
                backgroundColor: "#fff",
              }}
            >
              <h4
                className="mb-4 fw-bold"
                style={{ color: "#001b66", letterSpacing: "0.05em" }}
              >
                {editingBookletId
                  ? "Kitapçığı Güncelle"
                  : "Teorik Kitapçık Oluştur"}
              </h4>

              <div className="mb-4">
                <label
                  htmlFor="bookletName"
                  className="form-label fw-semibold"
                  style={{ color: "#001b66" }}
                >
                  Adı:
                </label>
                <input
                  id="bookletName"
                  type="text"
                  className="form-control form-control-lg"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Kitapçık adını girin"
                  style={{
                    borderColor: "#001b66",
                    boxShadow: "inset 0 1px 3px rgba(0,27,102,0.2)",
                    borderRadius: "8px",
                    fontSize: "1.1rem",
                    transition: "border-color 0.3s ease",
                  }}
                  onFocus={(e) =>
                    (e.currentTarget.style.borderColor = "#003399")
                  }
                  onBlur={(e) =>
                    (e.currentTarget.style.borderColor = "#001b66")
                  }
                />
              </div>

              <div>
                <button
                  onClick={handleSubmit}
                  className="btn btn-lg me-3"
                  style={{
                    backgroundColor: "#001b66",
                    color: "#fff",
                    fontWeight: "600",
                    minWidth: "130px",
                    borderRadius: "8px",
                    transition: "background-color 0.3s ease",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor = "#003399")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor = "#001b66")
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
                    className="btn btn-lg"
                    style={{
                      backgroundColor: "#e0e7ff",
                      color: "#001b66",
                      fontWeight: "600",
                      minWidth: "130px",
                      borderRadius: "8px",
                      border: "1.5px solid #001b66",
                      transition: "background-color 0.3s ease",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.backgroundColor = "#c7d2fe")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.backgroundColor = "#e0e7ff")
                    }
                  >
                    İptal
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Sağ taraf: Kitapçık listesi */}
          <div className="col-md-7">
            <div
              className="card p-4"
              style={{
                borderRadius: "12px",
                boxShadow: "0 6px 20px rgba(0, 27, 102, 0.15)",
                border: "none",
                backgroundColor: "#fff",
              }}
            >
              <h4
                className="mb-4 fw-bold"
                style={{ color: "#001b66", letterSpacing: "0.05em" }}
              >
                Teorik Kitapçıklar
              </h4>
              {teoBooklets?.length === 0 ? (
                <p
                  className="fst-italic"
                  style={{ color: "#64748b", fontSize: "1rem" }}
                >
                  Henüz kitapçık eklenmemiş.
                </p>
              ) : (
                <ul className="list-group" style={{ border: "none" }}>
                  {teoBooklets.map((item) => (
                    <li
                      key={item.id}
                      className="list-group-item d-flex justify-content-between align-items-center"
                      style={{
                        borderRadius: "10px",
                        marginBottom: "0.75rem",
                        cursor: "pointer",
                        transition: "background-color 0.25s ease",
                        padding: "1rem 1.5rem",
                        backgroundColor: "#f9fafb",
                        border: "1px solid #dbeafe",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.backgroundColor = "#e0e7ff")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.backgroundColor = "#f9fafb")
                      }
                    >
                      <div>
                        <h6
                          className="mb-1 fw-semibold"
                          style={{ color: "#001b66" }}
                        >
                          {item.name}
                        </h6>
                        <small
                          className="text-secondary"
                          style={{ fontSize: "0.9rem" }}
                        >
                          Türü: {item.type}
                        </small>
                      </div>
                      <div>
                        <button
                          onClick={() => handleEdit(item)}
                          className="btn btn-sm me-2"
                          style={{
                            backgroundColor: "#003399",
                            color: "#fff",
                            fontWeight: "600",
                            minWidth: "85px",
                            borderRadius: "6px",
                            border: "none",
                            transition: "background-color 0.3s ease",
                          }}
                          onMouseEnter={(e) =>
                            (e.currentTarget.style.backgroundColor = "#001b66")
                          }
                          onMouseLeave={(e) =>
                            (e.currentTarget.style.backgroundColor = "#003399")
                          }
                        >
                          Düzenle
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="btn btn-sm"
                          style={{
                            backgroundColor: "#b91c1c",
                            color: "#fff",
                            fontWeight: "600",
                            minWidth: "85px",
                            borderRadius: "6px",
                            border: "none",
                            transition: "background-color 0.3s ease",
                          }}
                          onMouseEnter={(e) =>
                            (e.currentTarget.style.backgroundColor = "#7f1d1d")
                          }
                          onMouseLeave={(e) =>
                            (e.currentTarget.style.backgroundColor = "#b91c1c")
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
