import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getQuestionCatThunk,
  createQuestionCatThunk,
  deleteQuestionCatThunk,
  getDifLevelsThunk,
  createDifLevelThunk,
  deleteDifLevelThunk,
} from "../../../features/thunks/queDifThunk";
import Sidebar from "../adminPanel/sidebar";

export default function QueDif() {
  const dispatch = useDispatch();
  const { questionCats, difLevels, isLoading, isError, error } = useSelector(
    (state) => state.queDif
  );

  useEffect(() => {
    dispatch(getQuestionCatThunk());
    dispatch(getDifLevelsThunk());
  }, [dispatch]);

  const handleCreate = (e, createThunk) => {
    e.preventDefault();
    const form = e.currentTarget;
    const name = form.elements.name?.value.trim();
    if (!name) return;

    dispatch(createThunk({ name }));
    form.reset();
  };

  const handleDelete = async (id, deleteThunk, refreshThunk) => {
    try {
      await dispatch(deleteThunk(id)).unwrap();
      dispatch(refreshThunk());
    } catch (err) {
      console.error("Silme işlemi başarısız:", err);
    }
  };

  return (
    <div
      className="poolteo-container"
      style={{
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
            <i className="bi bi-images" style={{ fontSize: "1.6rem" }}></i>
            Uygulamalı Soru Kategorileri
          </h1>
        </div>

        <div
          className="row"
          style={{
            maxWidth: "1200px",
            width: "1100px",
            margin: "0 auto",
            borderRadius: "16px",
            padding: "2rem",
            boxShadow: "0 8px 20px rgba(0, 51, 153, 0.15)",
            backgroundColor: "#fff",
          }}
        >
          {/* Soru Kategorileri */}
          <div className="col-md-6 mb-4">
            <div className="card shadow-sm">
              <div className="card-body">
                <h4 className="card-title mb-3">Soru Kategorileri</h4>

                <form
                  onSubmit={(e) => handleCreate(e, createQuestionCatThunk)}
                  className="mb-3"
                >
                  <div className="input-group">
                    <input
                      type="text"
                      name="name"
                      className="form-control"
                      placeholder="Kategori adı"
                    />
                    <button className="btn btn-primary" type="submit">
                      Ekle
                    </button>
                  </div>
                </form>

                {isLoading && <p>Yükleniyor...</p>}
                {isError && <div className="alert alert-danger">{error}</div>}

                {questionCats.length === 0 ? (
                  <p>Kategori bulunamadı</p>
                ) : (
                  <ul className="list-group">
                    {questionCats.map((item) => (
                      <li
                        key={item.id}
                        className="list-group-item d-flex justify-content-between align-items-center"
                      >
                        {item.name}
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() =>
                            handleDelete(
                              item.id,
                              deleteQuestionCatThunk,
                              getQuestionCatThunk
                            )
                          }
                        >
                          Sil
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>

          {/* Zorluk Seviyeleri */}
          <div className="col-md-6 mb-4">
            <div className="card shadow-sm">
              <div className="card-body">
                <h4 className="card-title mb-3">Zorluk Seviyeleri</h4>

                <form
                  onSubmit={(e) => handleCreate(e, createDifLevelThunk)}
                  className="mb-3"
                >
                  <div className="input-group">
                    <input
                      type="text"
                      name="name"
                      className="form-control"
                      placeholder="Seviye adı"
                    />
                    <button className="btn btn-primary" type="submit">
                      Ekle
                    </button>
                  </div>
                </form>

                {isLoading && <p>Yükleniyor...</p>}
                {isError && <div className="alert alert-danger">{error}</div>}

                {difLevels.length === 0 ? (
                  <p>Seviye bulunamadı</p>
                ) : (
                  <ul className="list-group">
                    {difLevels.map((item) => (
                      <li
                        key={item.id}
                        className="list-group-item d-flex justify-content-between align-items-center"
                      >
                        {item.name}
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() =>
                            handleDelete(
                              item.id,
                              deleteDifLevelThunk,
                              getDifLevelsThunk
                            )
                          }
                        >
                          Sil
                        </button>
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
