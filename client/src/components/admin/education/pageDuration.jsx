import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { addPageDurationThunk } from "../../../features/thunks/educationThunk";

export default function EducationPageDurations({ education, pages }) {
  const dispatch = useDispatch();
  const [durations, setDurations] = useState([]);
  const [selectedPageIndex, setSelectedPageIndex] = useState(0);
  const [saved, setSaved] = useState(false); // Kayıt sonrası form gizleme state'i

  useEffect(() => {
    if (pages && pages.length > 0) {
      const initialDurations = pages.map((_, index) => ({
        page: index + 1,
        duration: "",
      }));
      setDurations(initialDurations);
      setSelectedPageIndex(0);
      setSaved(false); // Yeni pages geldiğinde formu tekrar aç
    }
  }, [pages]);

  const handleChange = (index, value) => {
    const updated = [...durations];
    const numericValue = value === "" ? "" : parseInt(value, 10);
    updated[index].duration = isNaN(numericValue) ? "" : numericValue;
    setDurations(updated);
  };

  const handleSubmit = () => {
    const durationsToSend = durations.map((item) => ({
      ...item,
      duration: item.duration === "" ? 0 : Number(item.duration),
    }));

    dispatch(addPageDurationThunk({ id: education.id, pages: durationsToSend }))
      .unwrap()
      .then(() => {
        window.alert("Sayfa süreleri başarıyla güncellendi!");
        setSaved(true); // Kaydettikten sonra formu gizle
      })
      .catch((error) => {
        window.alert("Süre güncellenirken bir hata oluştu: " + error.message);
      });
  };

  if (saved) {
    return (
      <div className="alert alert-success mt-4" role="alert">
        Sayfa süreleri başarıyla kaydedildi!
      </div>
    );
  }

  return (
    <div className="container ">
      <div className="row">
        {/* Sol taraf */}
        <div className="col-md-4">
          <div className="card shadow-sm p-4">
            <h5 className="mb-3" style={{ color: "#001b66", fontWeight: 600 }}>
              Sayfa Listesi
            </h5>

            <ul className="list-group list-group-flush mb-4">
              {durations.map((item, index) => (
                <li
                  key={index}
                  onClick={() => setSelectedPageIndex(index)}
                  className={`list-group-item list-group-item-action ${
                    selectedPageIndex === index ? "active" : ""
                  }`}
                  style={{
                    cursor: "pointer",
                    borderRadius: "4px",
                    fontWeight: selectedPageIndex === index ? 600 : 400,
                    backgroundColor:
                      selectedPageIndex === index ? "#001b66" : "transparent",
                    color: selectedPageIndex === index ? "#fff" : "#001b66",
                  }}
                >
                  Sayfa {item.page}
                </li>
              ))}
            </ul>

            <div className="mb-3">
              <label
                htmlFor="durationInput"
                className="form-label"
                style={{ color: "#001b66", fontWeight: 500 }}
              >
                ⏱ Süre (saniye):
              </label>
              <input
                type="number"
                id="durationInput"
                className="form-control"
                value={durations[selectedPageIndex]?.duration || ""}
                onChange={(e) =>
                  handleChange(selectedPageIndex, e.target.value)
                }
                placeholder="Örn: 15"
                style={{
                  border: "1px solid #ccd6ec",
                  borderRadius: "6px",
                  padding: "10px",
                }}
              />
            </div>

            <button
              onClick={handleSubmit}
              className="btn w-100"
              style={{
                backgroundColor: "#001b66",
                color: "#fff",
                fontWeight: 600,
                padding: "10px",
                borderRadius: "6px",
                border: "none",
                transition: "background-color 0.3s ease",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = "#003399")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = "#001b66")
              }
            >
              Kaydet
            </button>
          </div>
        </div>

        {/* Sağ taraf */}
        <div className="col-md-8">
          <div
            className="card shadow-sm d-flex justify-content-center align-items-center"
            style={{
              height: "100%",
              backgroundColor: "#f9f9fb",
              border: "1px solid #e0e7f5",
              borderRadius: "8px",
            }}
          >
            {pages && pages[selectedPageIndex] ? (
              <img
                src={pages[selectedPageIndex]}
                alt={`Sayfa ${durations[selectedPageIndex]?.page}`}
                className="img-fluid rounded shadow-sm"
                style={{
                  maxHeight: "600px",
                  objectFit: "contain",
                  width: "100%",
                  border: "1px solid #ccd6ec",
                }}
              />
            ) : (
              <p className="text-muted text-center">
                Sayfa önizlemesi bulunamadı.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
