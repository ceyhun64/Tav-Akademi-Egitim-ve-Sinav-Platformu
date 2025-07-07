import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { createEducationSetThunk } from "../../../features/thunks/educationSetThunk";
import { getAllEducationsThunk } from "../../../features/thunks/educationThunk";
import EducationExam from "./educationExam";
import Sidebar from "../adminPanel/sidebar";

export default function CreateEducationSet() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { educations } = useSelector((state) => state.education);

  const [searchTerm, setSearchTerm] = useState(""); // 🔍
  const [formData, setFormData] = useState({
    name: "",
    educationIds: [],
    mail: false,
    exam_name: "",
    toplam_soru: "",
    sure_teo: "",
    sure_img: "",
    passing_score_teo: "",
    passing_score_img: "",
    bookletId_teo: "",
    bookletId_img: "",
    method: "",
    start_date: "",
    end_date: "",
    start_time: "",
    end_time: "",
    teoExamId: "",
    imgExamId: "",
  });

  useEffect(() => {
    dispatch(getAllEducationsThunk());
  }, [dispatch]);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    let val = value;
    if (type === "number" && value === "") val = null;

    setFormData((prev) => ({
      ...prev,
      [name]: val,
    }));
  };

  const toggleEducation = (id) => {
    setFormData((prev) => {
      const exists = prev.educationIds.includes(id);
      return {
        ...prev,
        educationIds: exists
          ? prev.educationIds.filter((eduId) => eduId !== id)
          : [...prev.educationIds, id],
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(createEducationSetThunk(formData)).unwrap();
      alert("Eğitim seti başarıyla oluşturuldu!");
    } catch (error) {
      alert("Eğitim seti oluşturulurken hata oluştu!");
    }
  };

  // 🔍 Eğitimleri filtrele
  const filteredEducations = educations?.filter((edu) =>
    edu.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="poolteo-container" style={{ display: "flex" }}>
      {/* Sidebar */}
      <div
        style={{
          width: "260px",
          minHeight: "100vh",
          padding: "1rem",
          position: "fixed",
          left: 0,
          top: 0,
          backgroundColor: "#001b66",
          color: "#fff",
          boxShadow: "2px 0 8px rgba(0, 0, 0, 0.15)",
          overflowY: "auto",
          zIndex: 10,
        }}
      >
        <Sidebar />
      </div>{" "}
      {/* Main Content */}
      <div
        style={{
          marginLeft: "260px",
          padding: "2rem",
          backgroundColor: "#f8f9fc",
          minHeight: "100vh",
          flex: 1,
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "2rem",
          }}
        >
          <h2
            style={{
              color: "#001b66",
              fontSize: "24px",
              fontWeight: "600",
            }}
          >
            <i
              className="bi bi-clipboard-check-fill"
              style={{ marginRight: "8px" }}
            ></i>
            Eğitim Seti Oluştur
          </h2>
        </div>{" "}
        <form onSubmit={handleSubmit} style={{ display: "grid", gap: "20px" }}>
          {/* 2 Column Layout */}
          <div
            className="form-sections"
            style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}
          >
            {/* Left Column */}
            <div
              style={{
                flex: 1,
                backgroundColor: "#fff",
                borderRadius: "12px",
                padding: "20px",
                boxShadow: "0 8px 24px rgba(0,27,102,0.08)",
                border: "1px solid #e0e6ed",
              }}
            >
              <h5
                style={{
                  color: "#001b66",
                  marginBottom: "15px",
                  fontWeight: "600",
                }}
              >
                <i
                  className="bi bi-info-circle-fill"
                  style={{ marginRight: "6px" }}
                ></i>
                Eğitim Ayarları
              </h5>
              <div className="p-4 mb-4">
                <div className="mb-3">
                  <label className="form-label">Eğitim Seti Adı *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="form-control"
                    required
                  />
                </div>

                {/* 🔍 Arama kutusu */}
                <div className="mb-3">
                  <label className="form-label">Eğitimlerde Ara</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Eğitim adı girin..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Eğitimler *</label>
                  <div
                    className="list-group"
                    style={{ maxHeight: "200px", overflowY: "auto" }}
                  >
                    {filteredEducations?.map((edu) => {
                      const selected = formData.educationIds.includes(edu.id);
                      return (
                        <button
                          type="button"
                          key={edu.id}
                          className={
                            "list-group-item list-group-item-action " +
                            (selected ? "active" : "")
                          }
                          onClick={() => toggleEducation(edu.id)}
                        >
                          {edu.name}
                        </button>
                      );
                    })}
                    {filteredEducations.length === 0 && (
                      <div className="text-muted p-2">Sonuç bulunamadı.</div>
                    )}
                  </div>
                </div>

                <div className="mb-3 p-3 border rounded bg-light">
                  <h5>Seçilen Eğitimler</h5>
                  {formData.educationIds.length > 0 ? (
                    <ul className="list-group">
                      {formData.educationIds.map((id) => {
                        const edu = educations.find((e) => e.id === id);
                        return (
                          <li
                            key={id}
                            className="list-group-item d-flex justify-content-between align-items-center"
                          >
                            {edu ? edu.name : "Eğitim bulunamadı"}
                            <button
                              type="button"
                              className="btn btn-sm btn-danger"
                              onClick={() => toggleEducation(id)}
                            >
                              Kaldır
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  ) : (
                    <p>Henüz eğitim seçilmedi</p>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div
              style={{
                flex: 1,
                backgroundColor: "#fff",
                borderRadius: "12px",
                padding: "20px",
                boxShadow: "0 8px 24px rgba(0,27,102,0.08)",
                border: "1px solid #e0e6ed",
              }}
            >
              <h5
                style={{
                  color: "#001b66",
                  marginBottom: "15px",
                  fontWeight: "600",
                }}
              >
                <i
                  className="bi bi-gear-fill"
                  style={{ marginRight: "6px" }}
                ></i>
                Sınav Ayarları
              </h5>{" "}
              <EducationExam formData={formData} handleChange={handleChange} />
            </div>
          </div>

          {/* Submit butonu */}
          <div className="row mb-3">
            <div className="col text-center">
              <button type="submit" className="btn btn-primary w-50">
                Kaydet
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
