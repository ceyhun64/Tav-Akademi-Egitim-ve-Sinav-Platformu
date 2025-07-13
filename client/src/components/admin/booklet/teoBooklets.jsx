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
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setSidebarOpen(true); // büyük ekranda sidebar açık kalsın
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    // ilk yüklemede sidebar büyük ekranda açık, küçükte kapalı
    setSidebarOpen(!isMobile);
  }, [isMobile]);
  const selectWidth = 300; // Hem mobil hem masaüstü için ortak genişlik
  return (
    <div
      className="poolImg-container"
      style={{ overflowX: "hidden", padding: "1rem" }}
    >
      {/* Sidebar */}
      <div
        style={{
          padding: "1rem",
          position: "fixed",
          left: 0,
          top: 0,
          backgroundColor: "white",
          color: "#fff",
          boxShadow: "2px 0 8px rgba(0, 0, 0, 0.15)",
          overflowY: "auto",
          zIndex: 99999,
        }}
      >
        <Sidebar />
      </div>

      {/* Ana İçerik */}
      <div
        className="poolImg-content"
        style={{ marginLeft: isMobile ? "0px" : "260px" }}
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
            className="mb-4 mt-2 ms-5"
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
            {!isMobile && (
              <i
                className="bi bi-journal-bookmark-fill"
                style={{ fontSize: "1.6rem" }}
              ></i>
            )}
            Teorik Kitapçıklar
            <button
              onClick={() => window.history.back()}
              style={{
                marginLeft: isMobile ? "auto" : "30px",
                backgroundColor: "#001b66",
                color: "white",
                border: "none",
                borderRadius: "4px",
                padding: "6px 16px", // padding yatay biraz artırıldı
                cursor: "pointer",
                fontSize: "1rem",
                whiteSpace: "nowrap", // metnin tek satırda kalmasını sağlar
              }}
            >
              Geri Dön
            </button>
          </h1>
        </div>

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
                className="mb-4 fw-bold"
                style={{
                  color: "#003399",
                  letterSpacing: "0.05em",
                  fontWeight: "700",
                }}
              >
                {editingBookletId
                  ? "Kitapçığı Güncelle"
                  : "Teorik Kitapçık Oluştur"}
              </h4>

              <div className="mb-4">
                <label
                  htmlFor="bookletName"
                  className="form-label fw-semibold"
                  style={{ color: "#003399", fontWeight: "600" }}
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
                    borderColor: "#003399",
                    boxShadow: "inset 0 1px 3px rgba(0,51,153,0.1)",
                    borderRadius: "8px",
                    fontSize: "1.1rem",
                    transition: "border-color 0.3s ease",
                  }}
                  onFocus={(e) =>
                    (e.currentTarget.style.borderColor = "#001b66")
                  }
                  onBlur={(e) =>
                    (e.currentTarget.style.borderColor = "#003399")
                  }
                />
              </div>

              <div>
                <button
                  onClick={handleSubmit}
                  className="btn btn-lg me-3"
                  style={{
                    backgroundColor: "#003399",
                    color: "#fff",
                    fontWeight: "600",
                    minWidth: "130px",
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
                    className="btn btn-lg"
                    style={{
                      backgroundColor: "#e0e6ed",
                      color: "#003399",
                      fontWeight: "600",
                      minWidth: "130px",
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
                Teorik Kitapçıklar
              </h4>
              {teoBooklets?.length === 0 ? (
                <p
                  className="fst-italic"
                  style={{ color: "#4a5568", fontSize: "1rem" }}
                >
                  Henüz kitapçık eklenmemiş.
                </p>
              ) : (
                <ul className="list-group" style={{ border: "none" }}>
                  {teoBooklets.map((item) => (
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
                        cursor: "pointer",
                        transition: "background-color 0.25s ease",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.backgroundColor = "#e0e6ed")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.backgroundColor = "#f9fafb")
                      }
                    >
                      <div className="me-3" style={{ color: "#003399" }}>
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
