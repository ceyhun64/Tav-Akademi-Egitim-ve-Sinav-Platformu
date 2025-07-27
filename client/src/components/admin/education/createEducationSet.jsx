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
  const [showExamSettings, setShowExamSettings] = useState(false);

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
  const selectWidth = 300;
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
            className=" mt-2 ms-5"
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
            Eğitim Seti Oluştur
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
        <form onSubmit={handleSubmit} style={{ display: "grid", gap: "20px" }}>
          {/* top Column */}
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
                fontWeight: "600",
              }}
            >
              <i
                className="bi bi-people-fill"
                style={{ marginRight: "8px" }}
              ></i>
              Eğitim Ayarları
            </h5>

            <div
              style={{
                display: "flex",
                flexDirection: isMobile ? "column" : "row",
                gap: "2rem",
              }}
            >
              {/* SOL SÜTUN */}
              <div style={{ flex: 1 }}>
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
                    style={{ maxHeight: "220px", overflowY: "auto" }}
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
              </div>

              {/* SAĞ SÜTUN */}
              <div style={{ flex: 1 }}>
                <div className="p-3 border rounded bg-light h-100">
                  <h5 style={{ marginBottom: "1rem" }}>Seçilen Eğitimler</h5>
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
          </div>

          <div
            className="form-check form-switch mt-3 ms-3"
            style={{ color: "#001b66", fontWeight: "600" }}
          >
            <input
              type="checkbox"
              className="form-check-input"
              id="examSettingsToggle"
              checked={showExamSettings}
              onChange={() => setShowExamSettings(!showExamSettings)}
            />
            <label className="form-check-label" htmlFor="examSettingsToggle">
              Sınav Ekle
            </label>
          </div>
          <div>
            {showExamSettings && (
              <EducationExam formData={formData} handleChange={handleChange} />
            )}
          </div>

          {/* Submit butonu */}
          <div className="row mb-3">
            <div className="col text-center">
              <button type="submit" className="btn btn-primary ">
                Kaydet
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
