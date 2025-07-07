import React from "react";
import about1 from "../../../public/about/about1.jpg";
import about2 from "../../../public/about/about2.jpg";
import about5 from "../../../public/about/about5.jpg";
import about6 from "../../../public/about/about6.jpg";

const COLORS = {
  primary: "#001b66",
  primaryLight: "#003399",
  background: "#f4f6fb",
  text: "#1e2a46",
  accent: "#3a5dd0",
};

const sectionStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
  alignItems: "center",
  gap: "2.5rem",
  marginBottom: "4rem",
  padding: "3rem 2rem",
  backgroundColor: "#fff",
  borderRadius: "20px",
  boxShadow: "0 10px 30px rgba(0, 0, 0, 0.07)",
};

const textStyle = {
  fontSize: "1.125rem",
  lineHeight: 1.8,
  color: COLORS.text,
};

const imageStyle = {
  width: "100%",
  height: "auto",
  borderRadius: "18px",
  objectFit: "cover",
  boxShadow: "0 6px 24px rgba(0, 0, 0, 0.1)",
};

const headingStyle = {
  fontSize: "2.25rem",
  fontWeight: "700",
  color: COLORS.primary,
  marginBottom: "1rem",
};

export default function About() {
  return (
    <div
      style={{
        maxWidth: "1500px",
        margin: "0 auto",
        padding: "4rem 1.5rem",
        fontFamily: "'Segoe UI', sans-serif",
        backgroundColor: COLORS.background,
      }}
    >
      <header style={{ textAlign: "center", marginBottom: "4rem" }}>
        <h1
          style={{
            fontSize: "3rem",
            fontWeight: "800",
            color: COLORS.primary,
            marginBottom: "0.75rem",
          }}
        >
          Tav Güvenlik Hizmetleri
        </h1>
      </header>

      {/* Section 1 */}
      <section style={sectionStyle}>
        <div style={textStyle}>
          <p>
            Tav Güvenlik Hizmetleri olarak, güvenlik eğitiminde öncü bir
            platform sunuyoruz. Uzman kadromuz ve sektörel deneyimimizle,
            kursiyerlerimize sadece teorik bilgi değil, aynı zamanda gerçek
            hayata hazırlayan pratik eğitimler sağlıyoruz.
            <br />
            <br />
            Eğitimlerimiz, interaktif içeriklerle zenginleştirilmiş, sektör
            ihtiyaçlarına göre sürekli güncellenen bir yapıya sahiptir. Böylece
            mezunlarımız, güvenlik alanında güçlü ve donanımlı profesyoneller
            olarak kariyerlerine sağlam adımlarla başlarlar.
          </p>
        </div>
        <img src={about1} alt="Giriş" style={imageStyle} />
      </section>

      {/* Section 2 */}
      <section style={{ ...sectionStyle }}>
        <img src={about2} alt="Neden Biz" style={imageStyle} />
        <div style={textStyle}>
          <h2 style={headingStyle}>Neden Biz?</h2>
          <ul style={{ paddingLeft: "1.2rem", lineHeight: 1.8 }}>
            <li>
              🔹 <strong>Uzman Kadro:</strong> Deneyimli eğitmenlerle birebir
              çalışma.
            </li>
            <li>
              🔹 <strong>Özelleştirilmiş Eğitim:</strong> Her öğrencinin
              ihtiyacına uygun planlama.
            </li>
            <li>
              🔹 <strong>Tam Erişim:</strong> Mobil ve web uyumlu eğitim
              sistemleri.
            </li>
            <li>
              🔹 <strong>Canlı Mentorluk:</strong> Eğitim sürecinde rehberlik ve
              destek.
            </li>
            <li>
              🔹 <strong>Sertifikalı Eğitim:</strong> Ulusal & uluslararası
              geçerli belgeler.
            </li>
          </ul>
        </div>
      </section>

      {/* Section 3 */}
      <section style={sectionStyle}>
        <div style={textStyle}>
          <h2 style={headingStyle}>Misyonumuz</h2>
          <p>
            Misyonumuz, güvenlik alanında görev alacak bireyleri etik değerler,
            teknik beceriler ve iletişim yetkinlikleriyle donatarak sektöre
            kazandırmaktır.
            <br />
            <br />
            Eğitim sürecimiz boyunca kriz yönetimi, insan ilişkileri, liderlik
            gibi beceriler kazandırılır. Mezunlarımız sadece görev almaz; fark
            yaratır.
          </p>
        </div>
        <img src={about5} alt="Misyon" style={imageStyle} />
      </section>

      {/* Section 4 */}
      <section style={{ ...sectionStyle }}>
        <img src={about6} alt="Vizyon" style={imageStyle} />
        <div style={textStyle}>
          <h2 style={headingStyle}>Vizyonumuz</h2>
          <p>
            Teknolojiyi kullanarak eğitim kalitesini sürekli geliştirmek ve
            Türkiye’nin en güvenilir güvenlik eğitim platformu olmak
            vizyonumuzdur.
            <br />
            <br />
            Yapay zeka, VR simülasyonları ve adaptif öğrenme sistemleriyle
            geleceğin güvenlik profesyonellerini yetiştiriyoruz.
          </p>
        </div>
      </section>
    </div>
  );
}
