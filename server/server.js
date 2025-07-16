require("dotenv").config(); //.env dosyasını dahil ettik
const express = require("express"); //expressi dahil ettik
const cors = require("cors"); //cors dahil ettik
const app = express(); //app adlı uygulamayı oluşturduk

// app.use((req, res, next) => {
//   //middleware'leri kullanarak istekleri yönetiyoruz(req:istek, res:yeniden yönlendirme, next:bir sonraki middleware'e geçiş)
//   res.header("Access-Control-Allow-Origin", process.env.FRONTEND_URL); // İzin verilen kaynaklar
//   res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE"); // İzin verilen HTTP metotları
//   res.header("Access-Control-Allow-Headers", "Content-Type, Authorization"); // İzin verilen başlıklar
//   next(); // Bir sonraki middleware'e geçiş
// });

const sequelize = require("./data/db"); //sequelize dahil ettik
const dummyData = require("./data/dummy-data"); //dummyData dahil ettik

//routes
const authRoutes = require("./routes/auth.routes");
const userRoutes = require("./routes/user.routes");
const galleryRoutes = require("./routes/gallery.routes");
const galleryCatRoutes = require("./routes/galleryCat.routes");
const educationRoutes = require("./routes/education.routes");
const educationSetRoutes = require("./routes/educationSet.routes");
const bookletRoutes = require("./routes/booklet.routes");
const poolTeoRoutes = require("./routes/poolTeo.routes");
const poolImgRoutes = require("./routes/poolImg.routes");
const examRoutes = require("./routes/exam.routes");
const questionRoutes = require("./routes/question.routes");
const reportRoutes = require("./routes/report.routes");
const queDifRoutes = require("./routes/queDif.routes");
const banSubsRoutes = require("./routes/banSubs.routes");
const groupInstRoutes = require("./routes/grpInst.routes");
const sessionRoutes = require("./routes/session.routes");
const announcementRoutes = require("./routes/announcement.routes");
const roleRoutes = require("./routes/role.routes");
const logActivityRoutes = require("./routes/logActivity.routes");
const uploadFileRoutes = require("./routes/uploadFile.routes");
const certificateRoutes = require("./routes/certificate.routes");
const practiceExamRoutes = require("./routes/practiceExam.routes");

const corsOptions = {
  origin: "https://tav-akademi-egitim-ve-sinav-platfor-henna.vercel.app", // frontendin çalıştığı adres https://tav-akademi-egitim-ve-sinav-platfor-henna.vercel.app
  methods: ["GET", "POST", "PUT", "DELETE"], // Sadece GET, POST, PUT, DELETE izin verilir
};
app.use(cors(corsOptions));

//apiler
app.use(express.json()); //json verileri okumak için
app.use(express.urlencoded({ extended: true })); // URL kodlamalı veri için

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/gallery", galleryRoutes);
app.use("/api/galleryCat", galleryCatRoutes);
app.use("/api/education", educationRoutes);
app.use("/api/educationset", educationSetRoutes);
app.use("/api/booklet", bookletRoutes);
app.use("/api/poolTeo", poolTeoRoutes);
app.use("/api/poolImg", poolImgRoutes);
app.use("/api/exam", examRoutes);
app.use("/api/question", questionRoutes);
app.use("/api/report", reportRoutes);
app.use("/api/quedif", queDifRoutes);
app.use("/api/bansubs", banSubsRoutes);
app.use("/api/grpinst", groupInstRoutes);
app.use("/api/session", sessionRoutes);
app.use("/api/announcement", announcementRoutes);
app.use("/api/role", roleRoutes);
app.use("/api/logactivity", logActivityRoutes);
app.use("/api/uploadfile", uploadFileRoutes);
app.use("/api/certificate", certificateRoutes);
app.use("/api/practiceexam", practiceExamRoutes);

(async () => {
  await sequelize.sync({ force: true });
  await dummyData(); //dummy data eklemek için
})();

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
