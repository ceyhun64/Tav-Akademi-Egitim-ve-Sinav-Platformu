import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getEducationSetsUserThunk } from "../../../features/thunks/educationSetThunk";
import { getExamByUserIdThunk } from "../../../features/thunks/examThunk";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

const COLORS = ["#2E86AB", "#F26419", "#76B041", "#F7B32B", "#6A0572"];

export default function Graphic() {
  const dispatch = useDispatch();
  const { educationSetUsers } = useSelector((state) => state.educationSet);
  const { exams } = useSelector((state) => state.exam);

  useEffect(() => {
    dispatch(getEducationSetsUserThunk());
    dispatch(getExamByUserIdThunk());
  }, [dispatch]);

  const educationSetUser = educationSetUsers?.educationSetUser || [];

  if (!educationSetUser.length || !exams) {
    return (
      <div
        className="text-center py-5"
        style={{ color: "#555", fontSize: "1.2rem" }}
      >
        Veri yükleniyor, lütfen bekleyiniz...
      </div>
    );
  }

  // Eğitim setleri tamamlanma durumu
  const completedCount = educationSetUser.filter((e) => e.completed).length;
  const notCompletedCount = educationSetUser.length - completedCount;
  const totalSets = educationSetUser.length;

  // Eğitim setlerinin not ortalaması (tamamlananlar için)
  const completedSets = educationSetUser.filter(
    (e) => e.completed && e.score != null
  );
  const averageScore =
    completedSets.length > 0
      ? completedSets.reduce((acc, cur) => acc + cur.score, 0) /
        completedSets.length
      : 0;

  // Sınav tiplerine göre sayılar
  const examTypeCounts = exams.reduce((acc, exam) => {
    acc[exam.exam_type] = (acc[exam.exam_type] || 0) + 1;
    return acc;
  }, {});

  // Teorik ve Görsel sınavların ortalamaları
  const theoreticalExams = exams.filter(
    (e) =>
      e.exam_type === "teo" &&
      e.examUsers?.length > 0 &&
      e.examUsers[0].score != null
  );
  const visualExams = exams.filter(
    (e) =>
      e.exam_type === "img" &&
      e.examUsers?.length > 0 &&
      e.examUsers[0].score != null
  );

  const theoreticalAvg =
    theoreticalExams.length > 0
      ? theoreticalExams.reduce((acc, cur) => acc + cur.examUsers[0].score, 0) /
        theoreticalExams.length
      : 0;

  const visualAvg =
    visualExams.length > 0
      ? visualExams.reduce((acc, cur) => acc + cur.examUsers[0].score, 0) /
        visualExams.length
      : 0;

  // Grafik verileri
  const pieData = [
    { name: "Tamamlandı", value: completedCount },
    { name: "Tamamlanmadı", value: notCompletedCount },
  ];

  const barData = Object.entries(examTypeCounts).map(([type, count], i) => ({
    type,
    count,
    color: COLORS[i % COLORS.length],
  }));

  const averageScoresData = [
  
    { name: "Teorik Sınav Ortalaması", avg: Number(theoreticalAvg.toFixed(2)) },
    { name: "Uygulama Sınav Ortalaması", avg: Number(visualAvg.toFixed(2)) },
  ];

  return (
    <div className="container py-4">
      <h1 className="mb-5" style={{ color: "#001b66", fontWeight: "700" }}>
        Eğitim ve Sınav Performans Raporu
      </h1>
      {/* Yan yana grafiklar */}
      <div
        style={{
          display: "flex",
          gap: 40,
          flexWrap: "wrap",
          justifyContent: "space-between",
          marginBottom: 50,
        }}
      >
        {/* Pie Chart */}
        <section
          style={{
            flex: "1 1 45%",
            minWidth: 300,
            boxSizing: "border-box",
          }}
        >
          <h2 style={{ color: "#2E86AB", marginBottom: 15 }}>
            Eğitim Setleri Tamamlanma Durumu
          </h2>
          <p style={{ color: "#555", marginBottom: 30 }}>
            Kullanıcının eğitim setlerini tamamlama durumu. Toplam{" "}
            <b>{totalSets}</b> eğitim seti bulunuyor.
          </p>

          <div style={{ width: "100%", height: 320 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={110}
                  label={({ name, percent }) =>
                    `${name}: ${(percent * 100).toFixed(1)}%`
                  }
                  labelLine={false}
                >
                  {pieData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                      stroke="#fff"
                      strokeWidth={2}
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value) => [value, "Adet"]}
                  contentStyle={{ fontSize: "14px" }}
                />
                <Legend
                  verticalAlign="bottom"
                  height={36}
                  iconType="circle"
                  wrapperStyle={{ fontSize: "14px" }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </section>

        {/* Bar Chart */}
        <section
          style={{
            flex: "1 1 45%",
            minWidth: 300,
            boxSizing: "border-box",
          }}
        >
          <h2 style={{ color: "#2E86AB", marginBottom: 15 }}>
            Sınav Tiplerine Göre Dağılım
          </h2>
          <p style={{ color: "#555", marginBottom: 30 }}>
            Farklı sınav türlerine göre yapılan sınav sayıları.
          </p>

          <div style={{ width: "100%", height: 320 }}>
            <ResponsiveContainer>
              <BarChart
                data={barData}
                margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="type"
                  tick={{ fill: "#001b66", fontWeight: "600" }}
                  interval={0}
                  angle={-15}
                  textAnchor="end"
                  height={60}
                />
                <YAxis
                  allowDecimals={false}
                  tick={{ fill: "#001b66", fontWeight: "600" }}
                />
                <Tooltip
                  cursor={{ fill: "rgba(0, 0, 0, 0.1)" }}
                  contentStyle={{ fontSize: "14px" }}
                />
                <Bar
                  dataKey="count"
                  fill="#2E86AB"
                  radius={[8, 8, 0, 0]}
                  barSize={40}
                >
                  {barData.map((entry, index) => (
                    <Cell key={`cell-bar-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>
      </div>
      {/* Not Ortalamaları */}-{" "}
      <section style={{ maxWidth: 600, margin: "0 auto" }}>
        <h2 style={{ color: "#2E86AB", marginBottom: 15, textAlign: "center" }}>
          Not Ortalamaları
        </h2>
        <p style={{ color: "#555", marginBottom: 30, textAlign: "center" }}>
          Eğitim setleri ve sınavlardaki genel not ortalamaları.
        </p>

        <div style={{ width: "100%", height: 300 }}>
          <ResponsiveContainer>
            <BarChart
              data={averageScoresData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              barSize={50}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="name"
                tick={{ fill: "#001b66", fontWeight: "600" }}
                interval={0}
                angle={-20}
                textAnchor="end"
                height={70}
              />
              <YAxis
                domain={[0, 100]}
                tick={{ fill: "#001b66", fontWeight: "600" }}
                allowDecimals={false}
                label={{
                  value: "Ortalama",
                  angle: -90,
                  position: "insideLeft",
                }}
              />
              <Tooltip
                cursor={{ fill: "rgba(0, 0, 0, 0.1)" }}
                contentStyle={{ fontSize: "14px" }}
              />
              <Bar dataKey="avg" fill="#76B041" radius={[8, 8, 0, 0]}>
                {averageScoresData.map((entry, index) => (
                  <Cell
                    key={`avg-cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>
    </div>
  );
}
