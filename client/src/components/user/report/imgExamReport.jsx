import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUserImgExamResultThunk } from "../../../features/thunks/reportThunk";

export default function ImgExamReport() {
  const dispatch = useDispatch();
  const { imgResultByUser } = useSelector((state) => state.report);

  const [filters, setFilters] = useState({
    name: "",
    entry_date: "",
    exit_date: "",
    true_count: "",
    false_count: "",
    score: "",
    status: "",
  });

  useEffect(() => {
    dispatch(getUserImgExamResultThunk());
  }, [dispatch]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const filteredResults = imgResultByUser?.filter((result) => {
    return (
      (filters.name === "" ||
        result.exam?.name
          ?.toLowerCase()
          .includes(filters.name.toLowerCase())) &&
      (filters.entry_date === "" ||
        result.entry_date?.includes(filters.entry_date)) &&
      (filters.exit_date === "" ||
        result.exit_date?.includes(filters.exit_date)) &&
      (filters.true_count === "" ||
        String(result.true_count)?.includes(filters.true_count)) &&
      (filters.false_count === "" ||
        String(result.false_count)?.includes(filters.false_count)) &&
      (filters.score === "" || String(result.score)?.includes(filters.score)) &&
      (filters.status === "" ||
        (filters.status === "passed" && result.pass) ||
        (filters.status === "failed" && !result.pass && result.completed) ||
        (filters.status === "incomplete" && !result.completed))
    );
  });

  return (
    <div className="container mt-4">
      {/* Kullanıcılar */}
      <div
        style={{
          backgroundColor: "#fff",
          borderRadius: "12px",
          padding: "20px",
          boxShadow: "0 6px 15px rgba(0, 27, 102, 0.1)",
          marginTop: "30px",
        }}
      >
        <h5
          style={{
            color: "#001b66",
            marginBottom: "20px",
            fontWeight: "700",
            fontSize: "18px",
          }}
        >
          <i
            className="bi bi-bar-chart-line-fill"
            style={{ marginRight: "8px" }}
          ></i>
          Uygulamalı Sınav Sonuçları
        </h5>
        <div
          className="table-responsive"
          style={{ borderRadius: "12px", overflow: "hidden" }}
        >
          <table
            className="table align-middle table-hover"
            style={{ borderCollapse: "separate", borderSpacing: "0 6px" }}
          >
            <thead style={{ backgroundColor: "#f5f7fa" }}>
              <tr>
                <th>
                  <input
                    type="text"
                    name="name"
                    placeholder="Sınav Adı"
                    className="form-control form-control-sm rounded"
                    value={filters.name}
                    onChange={handleFilterChange}
                  />
                </th>
                <th>
                  <input
                    type="text"
                    name="entry_date"
                    placeholder="Giriş Tarihi"
                    className="form-control form-control-sm rounded"
                    value={filters.entry_date}
                    onChange={handleFilterChange}
                  />
                </th>
                <th>
                  <input
                    type="text"
                    name="exit_date"
                    placeholder="Çıkış Tarihi"
                    className="form-control form-control-sm rounded"
                    value={filters.exit_date}
                    onChange={handleFilterChange}
                  />
                </th>
                <th>
                  <input
                    type="text"
                    name="true_count"
                    placeholder="Doğru"
                    className="form-control form-control-sm rounded"
                    value={filters.true_count}
                    onChange={handleFilterChange}
                  />
                </th>
                <th>
                  <input
                    type="text"
                    name="false_count"
                    placeholder="Yanlış"
                    className="form-control form-control-sm rounded"
                    value={filters.false_count}
                    onChange={handleFilterChange}
                  />
                </th>
                <th>
                  <input
                    type="text"
                    name="score"
                    placeholder="Puan"
                    className="form-control form-control-sm rounded"
                    value={filters.score}
                    onChange={handleFilterChange}
                  />
                </th>
                <th>
                  <select
                    name="status"
                    className="form-control form-control-sm rounded"
                    value={filters.status}
                    onChange={handleFilterChange}
                  >
                    <option value="">Tümü</option>
                    <option value="passed">Başarılı</option>
                    <option value="failed">Başarısız</option>
                    <option value="incomplete">Tamamlanmadı</option>
                  </select>
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredResults && filteredResults.length > 0 ? (
                filteredResults.map((result, index) => (
                  <tr
                    key={index}
                    style={{
                      backgroundColor: "#ffffff",
                      boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
                      borderRadius: "8px",
                    }}
                  >
                    <td>{result.exam?.name || "—"}</td>
                    <td>{result.entry_date || "—"}</td>
                    <td>{result.exit_date || "—"}</td>
                    <td>{result.true_count ?? "—"}</td>
                    <td>{result.false_count ?? "—"}</td>
                    <td>{result.score !== null ? result.score : "—"}</td>
                    <td>
                      {result.completed ? (
                        result.pass ? (
                          <span className="badge bg-success">Başarılı</span>
                        ) : (
                          <span className="badge bg-danger">Başarısız</span>
                        )
                      ) : (
                        <span className="badge bg-secondary">Tamamlanmadı</span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-center text-muted py-4">
                    Sonuç bulunamadı.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
