import React, { useEffect, useMemo, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  getUserImgResultsThunk,
  getUserTeoResultsThunk,
} from "../../../features/thunks/reportThunk";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

import Sidebar from "./sidebar";

const COLORS = ["#001b66", "#004080"]; // #001b66 ve daha açık mavi tonu

export default function AdminPanel() {
  const dispatch = useDispatch();
  const { userImgResults, userTeoResults } = useSelector(
    (state) => state.report
  );
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  useEffect(() => {
    dispatch(getUserImgResultsThunk());
    dispatch(getUserTeoResultsThunk());
  }, [dispatch]);

  const processedStats = useMemo(() => {
    const data = userImgResults?.data || [];
    const userMap = new Map();

    data.forEach((item) => {
      if (!item.user) return;
      const key = item.userId;
      if (!userMap.has(key)) {
        userMap.set(key, {
          user: item.user,
          exams: [],
        });
      }
      userMap.get(key).exams.push(item);
    });

    const userStats = Array.from(userMap.values()).map(({ user, exams }) => {
      const validExams = exams.filter((e) => e.score !== null);
      const avg =
        validExams.reduce((sum, e) => sum + (e.score || 0), 0) /
        (validExams.length || 1);
      const completedTrainings = exams.filter((e) => e.completed).length;
      return {
        user,
        examCount: exams.length,
        avgScore: avg,
        completedRate: Math.round((completedTrainings / exams.length) * 100),
      };
    });

    const totalAvg =
      userStats.reduce((sum, u) => sum + u.avgScore, 0) /
      (userStats.length || 1);

    const above70Users = userStats.filter((u) => u.avgScore >= 70);
    const below70Users = userStats.filter((u) => u.avgScore < 70);
    const total = userStats.length;
    const above70Percent = ((above70Users.length / total) * 100).toFixed(1);
    const below70Percent = ((below70Users.length / total) * 100).toFixed(1);

    const above70Avg =
      above70Users.reduce((sum, u) => sum + u.avgScore, 0) /
      (above70Users.length || 1);
    const below70Avg =
      below70Users.reduce((sum, u) => sum + u.avgScore, 0) /
      (below70Users.length || 1);

    const top3 = [...userStats]
      .sort((a, b) => b.avgScore - a.avgScore)
      .slice(0, 3);
    const bottom3 = [...userStats]
      .sort((a, b) => a.avgScore - b.avgScore)
      .slice(0, 3);
    const mostExams = [...userStats]
      .sort((a, b) => b.examCount - a.examCount)
      .slice(0, 3);

    const recentImg = [...data]
      .filter((e) => e.entry_date)
      .sort((a, b) => new Date(b.entry_date) - new Date(a.entry_date));
    const recentTeo = [...(userTeoResults?.data || [])]
      .filter((e) => e.entry_date)
      .sort((a, b) => new Date(b.entry_date) - new Date(a.entry_date));

    const lastImgDate = recentImg[0]?.entry_date;
    const lastTeoDate = recentTeo[0]?.entry_date;

    const lastImgExams = recentImg.filter((e) => e.entry_date === lastImgDate);
    const lastTeoExams = recentTeo.filter((e) => e.entry_date === lastTeoDate);

    const bestImgLast = [...lastImgExams]
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);
    const worstImgLast = [...lastImgExams]
      .sort((a, b) => a.score - b.score)
      .slice(0, 3);

    const bestTeoLast = [...lastTeoExams]
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);
    const worstTeoLast = [...lastTeoExams]
      .sort((a, b) => a.score - b.score)
      .slice(0, 3);

    return {
      totalAvg: Math.round(totalAvg),
      above70Avg: Math.round(above70Avg),
      below70Avg: Math.round(below70Avg),
      top3,
      bottom3,
      mostExams,
      bestImgLast,
      worstImgLast,
      bestTeoLast,
      worstTeoLast,
      above70Percent,
      below70Percent,
    };
  }, [userImgResults, userTeoResults]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      setSidebarOpen(window.innerWidth >= 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    setSidebarOpen(!isMobile);
  }, [isMobile]);

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
          boxShadow: "2px 0 8px rgba(0, 0, 0, 0.15)",
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
            className="mb-4 mt-2 ms-5"
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
            Genel Sınav İstatistikleri
          </h1>
        </div>

        {/* Üst Kartlar */}
        <div className="row mb-5 gx-4 gy-4">
          {/* Genel Başarı Ortalaması */}
          <div className="col-md-5">
            <div
              className="card shadow-lg h-100 border-0 rounded-4"
              style={{
                background: "linear-gradient(135deg, #001b66, #004080)",
              }}
            >
              <div className="card-body text-center text-white d-flex flex-column justify-content-center align-items-center">
                <i
                  className="bi bi-bar-chart-line-fill mb-3"
                  style={{ fontSize: "3rem", opacity: 0.8 }}
                ></i>
                <p className="text-light fs-5 mb-2" style={{ fontWeight: 600 }}>
                  Genel Başarı Ortalaması
                </p>
                <h2 className="fw-bold display-5">
                  {processedStats.totalAvg} puan
                </h2>
              </div>
            </div>
          </div>

          {/* Yüzdelik Oranlar */}
          <div className="col-md-7 d-flex flex-column gap-4">
            <div
              className="card shadow-sm rounded-4 border-0 d-flex flex-row align-items-center px-4 py-3"
              style={{ backgroundColor: "#e6f4ff" }}
            >
              <i
                className="bi bi-emoji-smile-fill text-success fs-2 me-3"
                style={{ flexShrink: 0 }}
              ></i>
              <div>
                <p className="mb-0 fw-semibold" style={{ fontSize: "1.1rem" }}>
                  70 ve Üzeri Alanların Oranı
                </p>
                <h3 className="text-success fw-bold mb-0">
                  {processedStats.above70Percent}%
                </h3>
              </div>
            </div>

            <div
              className="card shadow-sm rounded-4 border-0 d-flex flex-row align-items-center px-4 py-3"
              style={{ backgroundColor: "#ffe6e6" }}
            >
              <i
                className="bi bi-emoji-frown-fill text-danger fs-2 me-3"
                style={{ flexShrink: 0 }}
              ></i>
              <div>
                <p className="mb-0 fw-semibold" style={{ fontSize: "1.1rem" }}>
                  70 Altı Alanların Oranı
                </p>
                <h3 className="text-danger fw-bold mb-0">
                  {processedStats.below70Percent}%
                </h3>
              </div>
            </div>
          </div>
        </div>

        {/* En Başarılı / En Başarısız */}
        <div className="row mb-4">
          {[
            {
              title: "En Başarılı 3 Personel",
              data: processedStats.top3,
              icon: (
                <i
                  className="bi bi-trophy"
                  style={{ color: "#001b66", fontSize: 22 }}
                ></i>
              ),
            },
            {
              title: "En Başarısız 3 Personel",
              data: processedStats.bottom3,
              icon: (
                <i
                  className="bi bi-graph-down"
                  style={{ color: "#001b66", fontSize: 22 }}
                ></i>
              ),
            },
          ].map(({ title, data, icon }) => (
            <div className="col-md-6 mb-3" key={title}>
              <div className="card shadow-sm h-100 border-0">
                <div className="card-body">
                  <h5
                    className="card-title d-flex align-items-center"
                    style={{ color: "#001b66" }}
                  >
                    {icon} <span className="ms-2">{title}</span>
                  </h5>
                  <ul className="list-group list-group-flush mt-3">
                    {data.map(({ user, avgScore }) => (
                      <li
                        className="list-group-item d-flex justify-content-between align-items-center"
                        key={user.id}
                        style={{ cursor: "pointer" }}
                      >
                        <span>
                          {user.ad} {user.soyad}
                        </span>
                        <span className="badge bg-primary rounded-pill">
                          {Math.round(avgScore)}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Grafik Kartı */}
        {/* Grafik Kartı */}
        <div
          className="card mb-4 border-0"
          style={{
            borderRadius: "12px",
            boxShadow: "0 4px 12px rgba(0, 27, 102, 0.1)",
          }}
        >
          <div className="card-body">
            <h5
              className="card-title mb-4 d-flex align-items-center"
              style={{ color: "#001b66", fontWeight: "600" }}
            >
              <i
                className="bi bi-graph-up"
                style={{ marginRight: 10, fontSize: 22, color: "#003366" }}
              ></i>
              En Fazla Sınava Katılan 3 Kişi
            </h5>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={processedStats.mostExams} margin={{ bottom: 40 }}>
                <XAxis
                  dataKey={(d) => `${d.user.ad} ${d.user.soyad}`}
                  tick={{ fontSize: 13, fill: "#003366", fontWeight: "500" }}
                  angle={-20}
                  textAnchor="end"
                  interval={0}
                  tickLine={false}
                />
                <YAxis
                  yAxisId="left"
                  tick={{ fontSize: 13, fill: "#003366", fontWeight: "500" }}
                  axisLine={false}
                  tickLine={false}
                  label={{
                    value: "Sınav Sayısı",
                    angle: -90,
                    position: "insideLeft",
                    fill: "#003366",
                  }}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  tick={{ fontSize: 13, fill: "#3a5998", fontWeight: "500" }}
                  axisLine={false}
                  tickLine={false}
                  label={{
                    value: "Tamamlanma %",
                    angle: 90,
                    position: "insideRight",
                    fill: "#3a5998",
                  }}
                  domain={[0, 100]}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: "8px",
                    backgroundColor: "#f9faff",
                    borderColor: "#cbd6f2",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                  }}
                  itemStyle={{ color: "#001b66", fontWeight: "600" }}
                />
                {/* Legend ekliyoruz */}
                <Legend
                  verticalAlign="top"
                  align="right"
                  iconType="circle"
                  wrapperStyle={{
                    paddingBottom: 10,
                    fontSize: "0.9rem",
                    color: "#001b66",
                  }}
                />
                <Bar
                  yAxisId="left"
                  dataKey="examCount"
                  fill="#729fcf"
                  name="Sınav Sayısı"
                  barSize={24}
                  radius={[6, 6, 0, 0]}
                />
                <Bar
                  yAxisId="right"
                  dataKey="completedRate"
                  fill="#3a5998"
                  name="Tamamlanma %"
                  barSize={12}
                  radius={[6, 6, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Son Sınav Kartları */}
        <div className="row">
          {[
            {
              title1: "Son Uygulama Sınavında En İyi 3",
              data1: processedStats.bestImgLast,
              title2: "Son Uygulama Sınavında En Düşük 3",
              data2: processedStats.worstImgLast,
              icon1: (
                <i
                  className="bi bi-person-check"
                  style={{ fontSize: 20, color: "#001b66" }}
                ></i>
              ),
              icon2: (
                <i
                  className="bi bi-person-x"
                  style={{ fontSize: 20, color: "#e53e3e" }}
                ></i>
              ),
            },
            {
              title1: "Son Teorik Sınavda En İyi 3",
              data1: processedStats.bestTeoLast,
              title2: "Son Teorik Sınavda En Düşük 3",
              data2: processedStats.worstTeoLast,
              icon1: (
                <i
                  className="bi bi-person-check"
                  style={{ fontSize: 20, color: "#001b66" }}
                ></i>
              ),
              icon2: (
                <i
                  className="bi bi-person-x"
                  style={{ fontSize: 20, color: "#e53e3e" }}
                ></i>
              ),
            },
          ].map(({ title1, data1, title2, data2, icon1, icon2 }) => (
            <div className="col-md-6 mb-3" key={title1}>
              <div className="card shadow-sm h-100 border-0">
                <div className="card-body">
                  <h5
                    className="card-title d-flex align-items-center"
                    style={{ color: "#001b66" }}
                  >
                    {icon1} <span className="ms-2">{title1}</span>
                  </h5>
                  <ul className="list-group list-group-flush mb-3">
                    {data1.map((e) => (
                      <li
                        className="list-group-item d-flex justify-content-between"
                        key={e.userId}
                        style={{ cursor: "pointer" }}
                      >
                        <span>
                          {e.user?.ad} {e.user?.soyad}
                        </span>
                        <span className="badge bg-primary rounded-pill">
                          {Math.round(e.score)}
                        </span>
                      </li>
                    ))}
                  </ul>
                  <h5
                    className="card-title d-flex align-items-center"
                    style={{ color: "#e53e3e" }}
                  >
                    {icon2} <span className="ms-2">{title2}</span>
                  </h5>
                  <ul className="list-group list-group-flush">
                    {data2.map((e) => (
                      <li
                        className="list-group-item d-flex justify-content-between"
                        key={e.userId}
                        style={{ cursor: "pointer" }}
                      >
                        <span>
                          {e.user?.ad} {e.user?.soyad}
                        </span>
                        <span className="badge bg-danger rounded-pill">
                          {Math.round(e.score)}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
