import React from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import "./graphic.css"; // 👈 CSS dosyasını import ediyoruz

const lineData = [
  { name: "Ocak", puan: 58 },
  { name: "Şubat", puan: 66 },
  { name: "Mart", puan: 74 },
  { name: "Nisan", puan: 82 },
  { name: "Mayıs", puan: 89 },
];

const barData = [
  { name: "2023 Q1", kullanıcı: 120 },
  { name: "Q2", kullanıcı: 300 },
  { name: "Q3", kullanıcı: 500 },
  { name: "Q4", kullanıcı: 800 },
];

const pieData = [
  { name: "Güvenlik", value: 55 },
  { name: "Havalimanı Operasyonu", value: 30 },
  { name: "Yönetim / Ofis", value: 10 },
  { name: "Diğer", value: 5 },
];

const COLORS = ["#1d4ed8", "#3b82f6", "#60a5fa", "#93c5fd"];

export default function Graphic() {
  return (
    <section className="container py-5">
      <div className="text-center mb-5">
        <h2 className="fw-bold display-5 responsive-header">
          Eğitim Başarılarımızla <span className="text-primary">Gurur</span>{" "}
          Duyuyoruz
        </h2>
        <p className="text-muted fs-5 mt-3 responsive-paragraph">
          Katılımcılarımız yalnızca <strong>sınavlardan</strong> değil,{" "}
          <strong>kariyerlerinden</strong> de tam puan aldı.
        </p>
      </div>

      <div className="row gy-4">
        {/* Line Chart - Başarı Artışı */}
        <div className="col-lg-6">
          <div className="card border-0 shadow-lg p-4 h-100 rounded-4 hover-scale">
            <div className="d-flex align-items-center mb-3">
              <i className="bi bi-graph-up-arrow fs-4 text-primary me-2"></i>
              <h5 className="mb-0">Ortalama Sınav Başarısı</h5>
            </div>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={lineData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis domain={[50, 100]} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="puan"
                  stroke="#1d4ed8"
                  strokeWidth={3}
                />
              </LineChart>
            </ResponsiveContainer>
            <small className="text-muted d-block mt-3">
              5 ay içinde %58'den %89'a çıkan sınav başarısı.
            </small>
          </div>
        </div>

        {/* Bar Chart - Kullanıcı Artışı */}
        <div className="col-lg-6">
          <div className="card border-0 shadow-lg p-4 h-100 rounded-4 hover-scale">
            <div className="d-flex align-items-center mb-3">
              <i className="bi bi-people-fill fs-4 text-success me-2"></i>
              <h5 className="mb-0">Eğitim Katılımcı Sayısı</h5>
            </div>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="kullanıcı" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
            <small className="text-muted d-block mt-3">
              Her çeyrekte artan kullanıcı sayımızla büyümeye devam ediyoruz.
            </small>
          </div>
        </div>

        {/* Pie Chart - İşe Yerleşme */}
        <div className="col-lg-8 mx-auto">
          <div className="card border-0 shadow-lg p-4 h-100 rounded-4 hover-scale">
            <div className="d-flex justify-content-center align-items-center mb-3">
              <i className="bi bi-briefcase-fill fs-4 text-warning me-2"></i>
              <h5 className="mb-0">Mezunlarımız Nerelerde?</h5>
            </div>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={90}
                  dataKey="value"
                  label={({ name, percent }) =>
                    `${name} (${(percent * 100).toFixed(0)}%)`
                  }
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <small className="text-muted d-block mt-3 text-center">
              Mezunlarımızın %85’i aktif olarak sektörlerde görev alıyor.
            </small>
          </div>
        </div>
      </div>
    </section>
  );
}
