import React, { useState } from "react";

export default function Contact() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const validate = () => {
    let tempErrors = {};

    if (!form.name.trim()) tempErrors.name = "Adınız gerekli.";
    if (!form.email.trim()) tempErrors.email = "Email adresi gerekli.";
    else if (
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(form.email.trim())
    )
      tempErrors.email = "Geçerli bir email giriniz.";

    if (!form.subject.trim())
      tempErrors.subject = "Konu alanı boş bırakılamaz.";
    if (!form.message.trim()) tempErrors.message = "Mesajınızı yazmalısınız.";

    return tempErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      setIsSubmitting(true);

      setTimeout(() => {
        setIsSubmitting(false);
        setSubmitted(true);
        setForm({ name: "", email: "", subject: "", message: "" });
      }, 1500);
    }
  };

  return (
    <div className="poolteo-container">
      {/* Main Content */}
      <div
        style={{
          padding: "2rem",
          backgroundColor: "#f8f9fc",
          minHeight: "100vh",
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
        
        </div>
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
                class="bi bi-telephone-fill"
                style={{ marginRight: "6px" }}
              ></i>
              Bize Ulaşın
            </h5>
            {submitted && (
              <p
                style={{
                  backgroundColor: "#d4edda",
                  color: "#155724",
                  padding: "1rem",
                  borderRadius: "8px",
                  marginBottom: "1.5rem",
                  fontWeight: "600",
                  textAlign: "center",
                }}
              >
                Mesajınız başarıyla gönderildi! En kısa sürede size dönüş
                yapacağız.
              </p>
            )}

            <form
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "15px",
              }}
              onSubmit={handleSubmit}
              noValidate
            >
              <label
                style={{
                  fontWeight: 500,
                  color: "#001b66",
                  userSelect: "none",
                }}
                htmlFor="name"
              >
                Adınız
              </label>
              <input
                type="text"
                name="name"
                id="name"
                style={{
                  width: "100%",
                  padding: "10px",
                  borderRadius: "8px",
                  border: errors.name
                    ? "1px solid #e63946"
                    : "1px solid #cbd5e1",
                  marginTop: "5px",
                  backgroundColor: "#fff",
                  transition: "border-color 0.2s ease-in-out, box-shadow 0.2s",
                  fontSize: "1rem",
                }}
                value={form.name}
                onChange={handleChange}
                placeholder="Adınızı giriniz"
                disabled={isSubmitting}
                autoComplete="off"
              />
              {errors.name && (
                <span
                  style={{
                    color: "#e63946",
                    fontSize: "0.875rem",
                    marginTop: "4px",
                  }}
                >
                  {errors.name}
                </span>
              )}

              <label
                style={{
                  fontWeight: 500,
                  color: "#001b66",
                  userSelect: "none",
                }}
                htmlFor="email"
              >
                Email Adresiniz
              </label>
              <input
                type="email"
                name="email"
                id="email"
                style={{
                  width: "100%",
                  padding: "10px",
                  borderRadius: "8px",
                  border: errors.email
                    ? "1px solid #e63946"
                    : "1px solid #cbd5e1",
                  marginTop: "5px",
                  backgroundColor: "#fff",
                  transition: "border-color 0.2s ease-in-out, box-shadow 0.2s",
                  fontSize: "1rem",
                }}
                value={form.email}
                onChange={handleChange}
                placeholder="Email adresinizi giriniz"
                disabled={isSubmitting}
                autoComplete="off"
              />
              {errors.email && (
                <span
                  style={{
                    color: "#e63946",
                    fontSize: "0.875rem",
                    marginTop: "4px",
                  }}
                >
                  {errors.email}
                </span>
              )}

              <label
                style={{
                  fontWeight: 500,
                  color: "#001b66",
                  userSelect: "none",
                }}
                htmlFor="subject"
              >
                Konu
              </label>
              <input
                type="text"
                name="subject"
                id="subject"
                style={{
                  width: "100%",
                  padding: "10px",
                  borderRadius: "8px",
                  border: errors.subject
                    ? "1px solid #e63946"
                    : "1px solid #cbd5e1",
                  marginTop: "5px",
                  backgroundColor: "#fff",
                  transition: "border-color 0.2s ease-in-out, box-shadow 0.2s",
                  fontSize: "1rem",
                }}
                value={form.subject}
                onChange={handleChange}
                placeholder="Konu başlığı"
                disabled={isSubmitting}
                autoComplete="off"
              />
              {errors.subject && (
                <span
                  style={{
                    color: "#e63946",
                    fontSize: "0.875rem",
                    marginTop: "4px",
                  }}
                >
                  {errors.subject}
                </span>
              )}

              <label
                style={{
                  fontWeight: 500,
                  color: "#001b66",
                  userSelect: "none",
                }}
                htmlFor="message"
              >
                Mesajınız
              </label>
              <textarea
                name="message"
                id="message"
                style={{
                  width: "100%",
                  padding: "10px",
                  borderRadius: "8px",
                  border: errors.message
                    ? "1px solid #e63946"
                    : "1px solid #cbd5e1",
                  marginTop: "5px",
                  backgroundColor: "#fff",
                  transition: "border-color 0.2s ease-in-out, box-shadow 0.2s",
                  fontSize: "1rem",
                  minHeight: "120px",
                  resize: "vertical",
                }}
                value={form.message}
                onChange={handleChange}
                placeholder="Mesajınızı buraya yazınız"
                disabled={isSubmitting}
              />
              {errors.message && (
                <span
                  style={{
                    color: "#e63946",
                    fontSize: "0.875rem",
                    marginTop: "4px",
                  }}
                >
                  {errors.message}
                </span>
              )}

              <button
                type="submit"
                style={{
                  padding: "12px",
                  backgroundColor: "#001b66",
                  color: "#fff",
                  fontWeight: "700",
                  fontSize: "1.1rem",
                  border: "none",
                  borderRadius: "12px",
                  cursor: isSubmitting ? "not-allowed" : "pointer",
                  boxShadow: "0 6px 20px rgba(0, 27, 102, 0.3)",
                  transition: "background-color 0.3s ease",
                }}
                disabled={isSubmitting}
                onMouseEnter={(e) => {
                  if (!isSubmitting)
                    e.currentTarget.style.backgroundColor = "#003399";
                }}
                onMouseLeave={(e) => {
                  if (!isSubmitting)
                    e.currentTarget.style.backgroundColor = "#001b66";
                }}
              >
                {isSubmitting ? "Gönderiliyor..." : "Gönder"}
              </button>
            </form>
          </div>

          {/* right Column */}
          <div
            style={{
              flex: 1,
              maxWidth:"500px",
              backgroundColor: "#ffffff",
              borderRadius: "16px",
              padding: "30px 28px",
              boxShadow: "0 12px 32px rgba(0, 27, 102, 0.12)",
              border: "none",
              fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
              color: "#001b66",
              display: "flex",
              flexDirection: "column",
              gap: "20px",
            }}
          >
            <h5
              style={{
                fontWeight: "700",
                fontSize: "22px",
                marginBottom: "12px",
                position: "relative",
                paddingBottom: "8px",
                borderBottom: "3px solid #001b66",
                display: "inline-block",
                letterSpacing: "0.03em",
              }}
            >
              <i
                className="bi bi-info-circle-fill"
                style={{
                  marginRight: "10px",
                  color: "#001b66",
                  fontSize: "26px",
                  verticalAlign: "middle",
                }}
              ></i>
              İletişim Bilgileri
            </h5>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "18px",
                fontSize: "16px",
                lineHeight: "1.5",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "14px",
                }}
              >
                <i
                  className="bi bi-geo-alt-fill"
                  style={{
                    color: "#0056b3",
                    fontSize: "20px",
                    marginTop: "3px",
                  }}
                ></i>
                <div>
                  <strong
                    style={{
                      display: "block",
                      marginBottom: "4px",
                      fontWeight: "600",
                    }}
                  >
                    Adres:
                  </strong>
                  Örnek Mah. Güvenlik Sok. No:12
                  <br />
                  İstanbul, Türkiye
                </div>
              </div>

              <div
                style={{ display: "flex", alignItems: "center", gap: "14px" }}
              >
                <i
                  className="bi bi-telephone-fill"
                  style={{ color: "#0056b3", fontSize: "20px" }}
                ></i>
                <div>
                  <strong style={{ fontWeight: "600" }}>Telefon:</strong>
                  <br />
                  +90 212 123 45 67
                </div>
              </div>

              <div
                style={{ display: "flex", alignItems: "center", gap: "14px" }}
              >
                <i
                  className="bi bi-envelope-fill"
                  style={{ color: "#0056b3", fontSize: "20px" }}
                ></i>
                <div>
                  <strong style={{ fontWeight: "600" }}>Email:</strong>
                  <br />
                  info@tavgüvenlik.com
                </div>
              </div>

              <div
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "14px",
                }}
              >
                <i
                  className="bi bi-clock-fill"
                  style={{
                    color: "#0056b3",
                    fontSize: "20px",
                    marginTop: "3px",
                  }}
                ></i>
                <div>
                  <strong
                    style={{
                      display: "block",
                      marginBottom: "4px",
                      fontWeight: "600",
                    }}
                  >
                    Çalışma Saatleri:
                  </strong>
                  Pazartesi - Cuma: 09:00 - 18:00
                  <br />
                  Cumartesi: 10:00 - 14:00
                  <br />
                  Pazar: Kapalı
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
