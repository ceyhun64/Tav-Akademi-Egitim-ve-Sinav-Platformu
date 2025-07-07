import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getEducationSetsUserThunk } from "../../../features/thunks/educationSetThunk";
import { Link } from "react-router-dom";

export default function EducationSet() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getEducationSetsUserThunk());
  }, [dispatch]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const { educationSetUsers } = useSelector((state) => state.educationSet);
  const educationSetUserList = educationSetUsers.educationSetUser || [];
  const educationSetsList = educationSetUsers.educationSets || [];

  const combinedData = educationSetUserList.map((userSet) => {
    const matchedSet = educationSetsList.find(
      (set) => set.id === userSet.educationSetId
    );
    return {
      ...userSet,
      ...matchedSet,
    };
  });

  const formatDateTime = (date, time) => {
    if (!date || !time) return "Belirtilmemiş";
    return `${new Date(date).toLocaleDateString("tr-TR")} - ${time}`;
  };
  const filteredData = combinedData.filter((item) => {
    const nameMatch = item.name
      ?.toLowerCase()
      .includes(searchTerm.toLowerCase());

    const statusMatch =
      statusFilter === ""
        ? true
        : statusFilter === "completed"
        ? item.completed
        : !item.completed;

    return nameMatch && statusMatch;
  });

  return (
    <div className="container py-5">
      <h2 className="mb-4 text-center fw-bold" style={{ color: "#001b66" }}>
        <i className="bi bi-journal-bookmark-fill me-2"></i>
        Eğitim Setlerim
      </h2>
      <form
        className="row mb-4"
        onSubmit={(e) => e.preventDefault()} // sayfa yenilemeyi engelle
      >
        <div className="col-md-6 mb-2">
          <input
            type="text"
            className="form-control"
            placeholder="Eğitim adıyla ara..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="col-md-4 mb-2">
          <select
            className="form-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">Tüm Durumlar</option>
            <option value="completed">Tamamlandı</option>
            <option value="ongoing">Devam Ediyor</option>
          </select>
        </div>
      </form>
      <div className="row g-4">
        {filteredData.length > 0 ? (
          filteredData.map((item, index) => (
            <div className="col-md-6 col-lg-4" key={index}>
              <div className="card shadow h-100 border-0">
                <div className="card-body d-flex flex-column">
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <h5 className="card-title text-dark fw-semibold">
                      {item.name}
                    </h5>
                    <span
                      className={`badge ${
                        item.completed ? "bg-success" : "bg-warning text-dark"
                      }`}
                    >
                      {item.completed ? "Tamamlandı" : "Devam Ediyor"}
                    </span>
                  </div>
                  <p className="mb-2">
                    <i className="bi bi-person-fill me-2"></i>
                    <strong>Eğitmen:</strong> {item.educator}
                  </p>
                  <p className="mb-2">
                    <i className="bi bi-calendar-event me-2"></i>
                    <strong>Başlangıç:</strong>{" "}
                    {formatDateTime(item.start_date, item.start_time)}
                  </p>
                  <p className="mb-2">
                    <i className="bi bi-calendar-check me-2"></i>
                    <strong>Bitiş:</strong>{" "}
                    {formatDateTime(item.end_date, item.end_time)}
                  </p>
                  {item.entry_date && (
                    <p className="mb-2 text-muted small">
                      <i className="bi bi-door-open me-2"></i>
                      Giriş: {formatDateTime(item.entry_date, item.entry_time)}
                    </p>
                  )}
                  {item.exit_date && (
                    <p className="mb-2 text-muted small">
                      <i className="bi bi-door-closed me-2"></i>
                      Çıkış: {formatDateTime(item.exit_date, item.exit_time)}
                    </p>
                  )}
                  <div className="mt-auto text-end">
                    <Link
                      to={`/education-set-detail/${item.educationSetId}`}
                      className="btn btn-outline-primary btn-sm"
                    >
                      Eğitimi Detayları
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-12">
            <div className="alert alert-info text-center">
              Arama kriterlerine uygun eğitim seti bulunamadı.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
