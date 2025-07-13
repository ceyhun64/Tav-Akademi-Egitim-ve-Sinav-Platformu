import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUserTeoExamResultThunk } from "../../../features/thunks/reportThunk";

export default function TeoExamReport() {
  const dispatch = useDispatch();
  const { teoResultByUser } = useSelector((state) => state.report);

  const [filters, setFilters] = useState({
    name: "",
    entry_date: "",
    exit_date: "",
    true_count: "",
    false_count: "",
    score: "",
    status: "",
  });

  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [showHiddenColumns, setShowHiddenColumns] = useState(false);

  const columns = [
    { key: "name", label: "Sınav Adı", priority: 1 },
    { key: "entry_date", label: "Giriş Tarihi", priority: 3 },
    { key: "exit_date", label: "Çıkış Tarihi", priority: 3 },
    { key: "true_count", label: "Doğru", priority: 1 },
    { key: "false_count", label: "Yanlış", priority: 1 },
    { key: "score", label: "Puan", priority: 1 },
    { key: "status", label: "Başarı Durumu", priority: 1 },
  ];

  useEffect(() => {
    dispatch(getUserTeoExamResultThunk());
  }, [dispatch]);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  let visiblePriority = 1;
  if (windowWidth > 900) visiblePriority = 3;
  else if (windowWidth > 600) visiblePriority = 2;

  const visibleColumns = columns.filter(
    (col) => col.priority <= visiblePriority
  );
  const hiddenColumns = columns.filter((col) => col.priority > visiblePriority);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const filteredResults = teoResultByUser
    ?.filter((result) => {
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
        (filters.score === "" ||
          String(result.score)?.includes(filters.score)) &&
        (filters.status === "" ||
          (filters.status === "passed" && result.pass) ||
          (filters.status === "failed" && !result.pass && result.completed) ||
          (filters.status === "incomplete" && !result.completed))
      );
    })
    ?.sort((a, b) => new Date(b.entry_date) - new Date(a.entry_date));

  const renderCell = (col, result) => {
    if (col.key === "status") {
      if (!result.completed)
        return <span className="badge bg-secondary">Tamamlanmadı</span>;
      return result.pass ? (
        <span className="badge bg-success">Başarılı</span>
      ) : (
        <span className="badge bg-danger">Başarısız</span>
      );
    }
    if (col.key === "name") return result.exam?.name ?? "—";
    return result[col.key] ?? "—";
  };

  return (
    <div className="container-fluid px-2 px-md-4 mt-4">
      <div className="bg-white rounded p-4 shadow-sm position-relative mt-4">
        <h5 className="text-primary fw-bold mb-3">
          <i className="bi bi-bar-chart-line-fill me-2"></i>
          Teorik Sınav Sonuçları
        </h5>

        {hiddenColumns.length > 0 && (
          <button
            onClick={() => setShowHiddenColumns(!showHiddenColumns)}
            className="btn btn-sm"
            style={{
              position: "absolute",
              top: 20,
              right: 20,
              backgroundColor: "#001b66",
              color: "white",
              border: "none",
              borderRadius: "50%",
              width: "30px",
              height: "30px",
              cursor: "pointer",
              fontWeight: "bold",
            }}
            title="Gizlenen kolonları göster"
          >
            ...
          </button>
        )}

        {showHiddenColumns && (
          <div
            className="position-absolute bg-white border rounded shadow p-2"
            style={{
              top: 60,
              right: 20,
              zIndex: 10,
              minWidth: 150,
              maxHeight: 400,
              overflowY: "auto",
            }}
          >
            <strong>Gizlenen Kolonlar</strong>
            <table className="table table-sm mt-2">
              <thead style={{ backgroundColor: "#f5f7fa" }}>
                <tr>
                  {hiddenColumns.map((col) => (
                    <th key={col.key}>{col.label}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredResults.map((result, index) => (
                  <tr key={index}>
                    {hiddenColumns.map((col) => (
                      <td key={col.key}>{renderCell(col, result)}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="table-responsive">
          <table
            className="table align-middle table-hover"
            style={{ borderCollapse: "separate", borderSpacing: "0 6px" }}
          >
            <thead style={{ backgroundColor: "#f5f7fa" }}>
              <tr>
                {visibleColumns.map((col) => (
                  <th key={col.key}>
                    {windowWidth <= 600 ? (
                      col.label
                    ) : col.key === "status" ? (
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
                    ) : (
                      <input
                        type="text"
                        name={col.key}
                        placeholder={col.label}
                        className="form-control form-control-sm rounded"
                        value={filters[col.key]}
                        onChange={handleFilterChange}
                      />
                    )}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {filteredResults && filteredResults.length > 0 ? (
                filteredResults.map((result, index) => (
                  <tr key={index} className="bg-white shadow-sm rounded">
                    {visibleColumns.map((col) => (
                      <td key={col.key}>{renderCell(col, result)}</td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={visibleColumns.length}
                    className="text-center text-muted py-4"
                  >
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
