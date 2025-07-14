const {
  Exam,
  ExamQuestions,
  ExamUser,
  User,
  ImageGalery,
  ImageGaleryCat,
  ImageGalerySubCat,
  Education,
  EducationSet,
  EduAndEduSet,
  EducationSetUser,
  Booklet,
  PoolImg,
  PoolTeo,
  EducationPages,
  QuestionCategory,
  DifLevel,
  UserImgAnswers,
  UserTeoAnswers,
  BanSubs,
  Group,
  Institution,
  Announcement,
  Role,
  RoleLevel,
  RoleLevelPerm,
  Permission,
  UploadFileUser,
  UploadFile,
  Educator,
  Requester,
  CourseNo,
  CourseType,
} = require("../models/index");
const { v4: uuidv4 } = require("uuid"); // Eğer UUID üretmen gerekiyorsa
const bcrypt = require("bcryptjs");

const unifiedId1 = uuidv4();
const unifiedId2 = uuidv4();

async function populate() {
  await Group.bulkCreate([
    {
      name: "A",
    },
    {
      name: "B",
    },
    {
      name: "C",
    },
    {
      name: "D",
    },
  ]);
  await Institution.bulkCreate([
    {
      name: "TAV-ESB",
    },
    {
      name: "TAV-BJV",
    },
    {
      name: "TAV-ADB",
    },
    {
      name: "TAV-GZP",
    },
  ]);
  await Permission.bulkCreate([
    // Ana Ekran Yetkileri
    { name: "Kullanıcı Ekle" },
    { name: "Teorik Kitapçıklar" },
    { name: "Uygulama Kitapçıkları" },
    { name: "Görüntü Kütüphanesi" },
    { name: "Sınav Atama" },
    { name: "Eğitim Atama" },
    { name: "Sertifika İşlemleri" },
    { name: "Raporlar" },
    { name: "Ayarlar" },

    // Rapor Ekranı Yetkileri
    { name: "Sınav Atama Listesi" },
    { name: "Eğitim Atama Listesi" },
    { name: "Eğitim Sonuçları" },
    { name: "Kayıtlı Sınavlar" },

    // Ayarlar Ekranı Yetkileri
    { name: "Yasaklı Madde Listesi" },
    { name: "Görüntü Sorusu Kategori Listesi" },
    { name: "Pratik Sınav Ayarları" },
    { name: "Kurum ve Grup İşlemleri" },
    { name: "Aktif Kullanıcılar" },
    { name: "Duyuru İşlemleri" },
    { name: "Dosya Yükleme İşlemleri" },
    { name: "Yetki Ayarları" },

    // Kayıtlı Sınav Ekranı Yetkileri
    { name: "Teorik Sınav Sonuçları" },
    { name: "Görüntü Sınav Sonuçları" },
    { name: "Birleşik Teorik Sınav Sonuçları" },
    { name: "Birleşik Görüntü Sınav Sonuçları" },

    // Konum Yetkileri
    { name: "Tüm Konum Verilerini Göster" },
    { name: "Grubuna Göre Verileri Göster" },

    // Diğer Yetkiler
    { name: "Toplu Kullanıcı Ekleme" },
    { name: "Toplu Kullanıcı Silme" },
    { name: "Eğitim Düzenleme" },
    { name: "Eğitim Seti Düzenleme" },
    { name: "Teorik Sınav Sonuç Silme" },
    { name: "Görüntü Sınav Sonuç Silme" },
    { name: "Eğitim Sonuç Silme" },
    { name: "Kayıtlı Sınav Sonuç Silme" },
    { name: "Teorik Kitapçık Ekle" },
    { name: "Teorik Kitapçık Sil" },
    { name: "Görüntü Kitapçık Ekle" },
    { name: "Görüntü Kitapçık Sil" },
  ]);
  await RoleLevel.bulkCreate([
    {
      name: "Yüksek",
      level: 1,
    },
    {
      name: "Orta",
      level: 2,
    },
    {
      name: "Düşük",
      level: 3,
    },
    {
      name: "En Düşük",
      level: 10,
    },
  ]);
  await RoleLevelPerm.bulkCreate(
    [
      { roleLevelId: 1, permissionId: 1 },
      { roleLevelId: 1, permissionId: 2 },
      { roleLevelId: 1, permissionId: 3 },
      { roleLevelId: 1, permissionId: 4 },
      { roleLevelId: 1, permissionId: 5 },
      { roleLevelId: 1, permissionId: 6 },
      { roleLevelId: 1, permissionId: 7 },
      { roleLevelId: 1, permissionId: 8 },
      { roleLevelId: 1, permissionId: 9 },
      { roleLevelId: 1, permissionId: 10 },
      { roleLevelId: 1, permissionId: 11 },
      { roleLevelId: 1, permissionId: 12 },
      { roleLevelId: 1, permissionId: 13 },
      { roleLevelId: 1, permissionId: 14 },
      { roleLevelId: 1, permissionId: 15 },
      { roleLevelId: 1, permissionId: 16 },
      { roleLevelId: 1, permissionId: 17 },
      { roleLevelId: 1, permissionId: 18 },
      { roleLevelId: 1, permissionId: 19 },
      { roleLevelId: 1, permissionId: 20 },
      { roleLevelId: 1, permissionId: 21 },
      { roleLevelId: 1, permissionId: 22 },
      { roleLevelId: 1, permissionId: 23 },
      { roleLevelId: 1, permissionId: 24 },
      { roleLevelId: 1, permissionId: 25 },
      { roleLevelId: 1, permissionId: 26 },
      { roleLevelId: 1, permissionId: 27 },
      { roleLevelId: 1, permissionId: 28 },
      { roleLevelId: 1, permissionId: 29 },
      { roleLevelId: 1, permissionId: 30 },
      { roleLevelId: 1, permissionId: 31 },
      { roleLevelId: 1, permissionId: 32 },
      { roleLevelId: 1, permissionId: 33 },
      { roleLevelId: 1, permissionId: 34 },
      { roleLevelId: 1, permissionId: 35 },
      { roleLevelId: 1, permissionId: 36 },
      { roleLevelId: 1, permissionId: 37 },
      { roleLevelId: 1, permissionId: 38 },
      { roleLevelId: 1, permissionId: 39 },
    ],
    { ignoreDuplicates: true }
  );

  await Role.bulkCreate([
    {
      name: "Admin",
      roleLevelId: 1,
      level: 1,
    },
    {
      name: "GDIDE",
      roleLevelId: 2,
      level: 2,
    },
    {
      name: "Eğitim Büro Şefi",
      roleLevelId: 3,
      level: 3,
    },
    {
      name: "Personel",
      roleLevelId: 4,
      level: 10,
    },
  ]);
  await Requester.bulkCreate([
    { name: "Ceyhun Türkmen" },
    { name: "John Doe" },
    { name: "Jane Smith" },
    { name: "Michael Johnson" },
  ]);
  await Educator.bulkCreate([
    { name: "Ceyhun Türkmen" },
    { name: "John Doe" },
    { name: "Jane Smith" },
  ]);
  await CourseNo.bulkCreate([
    {
      name: "1",
    },
    {
      name: "2",
    },
    {
      name: "3",
    },
  ]);
  await CourseType.bulkCreate([
    {
      name: "Temel Eğitim",
    },
    {
      name: "Tazeleme Eğitimi",
    },
  ]);
  await User.bulkCreate([
    {
      tcno: "12345678901",
      sicil: "123456789",
      ad: "John",
      soyad: "Doe",
      kullanici_adi: "johndoe",
      sifre: await bcrypt.hash("Ceycey.123", 10),
      telefon: "+90 532 123 45 67",
      email: "ctrkmn64@gmail.com",
      il: "İstanbul",
      ilce: "Beşiktaş",
      adres: "Beşiktaş Mahallesi No:12 Daire:5",
      ise_giris_tarihi: "2023-01-01",
      cinsiyet: "Erkek",
      grupId: 1,
      lokasyonId: 1,
      image:
        "https://res.cloudinary.com/dlsh0jvcj/image/upload/v1749796056/uploads/1749796034038-ceyhun.jpg.jpg",
      durum: 1,
      roleId: 1,
      dogum_tarihi: "1990-05-15",
      pozisyon: "Yazılım Mühendisi",
      departman: "Ar-Ge",
      maas: 15000,
      aciklama: "Deneyimli full-stack geliştirici",
    },
    {
      tcno: "12345678902",
      sicil: "123456781",
      ad: "Jane",
      soyad: "Doe",
      kullanici_adi: "janedoe",
      sifre: await bcrypt.hash("123456", 10),
      telefon: "+90 532 765 43 21",
      email: "jane@example.com",
      il: "İstanbul",
      ilce: "Beşiktaş",
      adres: "Beşiktaş Mahallesi No:34 Daire:7",
      ise_giris_tarihi: "2023-01-01",
      cinsiyet: "Kadın",
      grupId: 1,
      lokasyonId: 1,
      image: "https://example.com/janedoe.jpg",
      durum: 1,
      roleId: 2,
      dogum_tarihi: "1992-08-20",
      pozisyon: "Pazarlama Uzmanı",
      departman: "Pazarlama",
      maas: 12000,
      aciklama: "Sosyal medya ve dijital pazarlama uzmanı",
    },
    {
      tcno: "12345678903",
      sicil: "123456782",
      ad: "Ali",
      soyad: "Yılmaz",
      kullanici_adi: "aliyilmaz",
      sifre: await bcrypt.hash("123456", 10),
      telefon: "+90 532 987 65 43",
      email: "ali.yilmaz@example.com",
      il: "Ankara",
      ilce: "Çankaya",
      adres: "Çankaya Mahallesi No:10",
      ise_giris_tarihi: "2022-06-15",
      cinsiyet: "Erkek",
      grupId: 4,
      lokasyonId: 4,
      image: "https://example.com/aliyilmaz.jpg",
      durum: 1,
      roleId: 2,
      dogum_tarihi: "1985-11-10",
      pozisyon: "Proje Müdürü",
      departman: "Yönetim",
      maas: 20000,
      aciklama: "Proje yönetimi ve ekip koordinasyonu",
    },
    {
      tcno: "12345678904",
      sicil: "123456783",
      ad: "Elif",
      soyad: "Kara",
      kullanici_adi: "elifkara",
      sifre: await bcrypt.hash("123456", 10),
      telefon: "+90 532 321 54 76",
      email: "elif.kara@example.com",
      il: "İzmir",
      ilce: "Karşıyaka",
      adres: "Karşıyaka Mahallesi No:25",
      ise_giris_tarihi: "2021-09-01",
      cinsiyet: "Kadın",
      grupId: 3,
      lokasyonId: 3,
      image: "https://example.com/elifkara.jpg",
      durum: 1,
      roleId: 3,
      dogum_tarihi: "1995-03-28",
      pozisyon: "Grafik Tasarımcı",
      departman: "Tasarım",
      maas: 11000,
      aciklama: "Yaratıcı grafik tasarımcı, marka kimliği uzmanı",
    },
    {
      tcno: "11111111111",
      sicil: "100000001",
      ad: "Mert",
      soyad: "Aydın",
      kullanici_adi: "mertaydin",
      sifre: await bcrypt.hash("123456", 10),
      telefon: "+90 532 100 10 01",
      email: "mert.aydin@example.com",
      il: "İstanbul",
      ilce: "Beşiktaş",
      adres: "Cihannüma Mah. No:10",
      ise_giris_tarihi: "2023-03-01",
      cinsiyet: "Erkek",
      grupId: 1,
      lokasyonId: 1,
      image: "https://example.com/mert.jpg",
      durum: 1,
      roleId: 2,
      dogum_tarihi: "1990-01-01",
      pozisyon: "Proje Yöneticisi",
      departman: "Yönetim",
      maas: 18000,
      aciklama: "Projeleri planlayan ve yöneten kişi",
    },
    {
      tcno: "22222222222",
      sicil: "100000002",
      ad: "Zeynep",
      soyad: "Koç",
      kullanici_adi: "zeynepkoc",
      sifre: await bcrypt.hash("123456", 10),
      telefon: "+90 532 100 10 02",
      email: "zeynep.koc@example.com",
      il: "İstanbul",
      ilce: "Beşiktaş",
      adres: "Levazım Mah. No:22",
      ise_giris_tarihi: "2022-06-15",
      cinsiyet: "Kadın",
      grupId: 1,
      lokasyonId: 1,
      image: "https://example.com/zeynep.jpg",
      durum: 1,
      roleId: 3,
      dogum_tarihi: "1993-04-10",
      pozisyon: "Grafik Tasarımcı",
      departman: "Tasarım",
      maas: 9500,
      aciklama: "Kurumsal tasarımlardan sorumlu",
    },
    {
      tcno: "33333333333",
      sicil: "100000003",
      ad: "Kerem",
      soyad: "Yılmaz",
      kullanici_adi: "keremyilmaz",
      sifre: await bcrypt.hash("123456", 10),
      telefon: "+90 532 100 10 03",
      email: "kerem.yilmaz@example.com",
      il: "İstanbul",
      ilce: "Beşiktaş",
      adres: "Dikilitaş Mah. No:8",
      ise_giris_tarihi: "2021-09-20",
      cinsiyet: "Erkek",
      grupId: 1,
      lokasyonId: 1,
      image: "https://example.com/kerem.jpg",
      durum: 1,
      roleId: 2,
      dogum_tarihi: "1987-11-23",
      pozisyon: "Veri Analisti",
      departman: "Veri Bilimi",
      maas: 16000,
      aciklama: "İstatistiksel analiz ve raporlamalardan sorumlu",
    },
    {
      tcno: "44444444444",
      sicil: "100000004",
      ad: "Melis",
      soyad: "Demir",
      kullanici_adi: "melisdemir",
      sifre: await bcrypt.hash("123456", 10),
      telefon: "+90 532 100 10 04",
      email: "melis.demir@example.com",
      il: "İstanbul",
      ilce: "Beşiktaş",
      adres: "Yıldız Mah. No:5",
      ise_giris_tarihi: "2020-11-30",
      cinsiyet: "Kadın",
      grupId: 1,
      lokasyonId: 1,
      image: "https://example.com/melis.jpg",
      durum: 1,
      roleId: 3,
      dogum_tarihi: "1995-09-17",
      pozisyon: "Satış Temsilcisi",
      departman: "Satış",
      maas: 10000,
      aciklama: "Müşteri ilişkilerinden sorumlu",
    },
    {
      tcno: "12345678999",
      sicil: "123456799",
      ad: "Ceyhun",
      soyad: "Turkmen",
      kullanici_adi: "ceyhun",
      sifre: await bcrypt.hash("123456", 10),
      telefon: "+90 532 123 45 67",
      email: "ceyhunturkmen@gmail.com",
      il: "İstanbul",
      ilce: "Beşiktaş",
      adres: "Beşiktaş Mahallesi No:12 Daire:5",
      ise_giris_tarihi: "2023-01-01",
      cinsiyet: "Erkek",
      grupId: 1,
      lokasyonId: 1,
      image:
        "https://res-console.cloudinary.com/dlsh0jvcj/thumbnails/v1/image/upload/v1749796056/dXBsb2Fkcy8xNzQ5Nzk2MDM0MDM4LWNleWh1bi5qcGc=/drilldown",
      durum: 1,
      dogum_tarihi: "1990-05-15",
      pozisyon: "Yazılım Mühendisi",
      departman: "Ar-Ge",
      maas: 15000,
      aciklama: "Deneyimli full-stack geliştirici",
    },
  ]);
  await Announcement.bulkCreate([
    {
      content: "Tav akademi personelleri dikkatine",
      groupId: 1,
      institutionId: 1,
    },
    {
      content: "Tav akademi personelleri dikkatine",
      groupId: 2,
      institutionId: 2,
    },
    {
      content: "Tav akademi personelleri dikkatine",
      groupId: 3,
      institutionId: 3,
    },
    {
      content: "Tav akademi personelleri dikkatine",
      groupId: 4,
      institutionId: 4,
    },
  ]);
  await ImageGaleryCat.bulkCreate([
    {
      name: "Kategori 1",
    },
    {
      name: "Kategori 2",
    },
  ]);
  await ImageGalerySubCat.bulkCreate([
    {
      name: "Alt Kategori 1",
      imageCatId: 1,
    },
    {
      name: "Alt Kategori 2",
      imageCatId: 1,
    },
    {
      name: "Alt Kategori 3",
      imageCatId: 2,
    },
    {
      name: "Alt Kategori 4",
      imageCatId: 2,
    },
  ]);
  await ImageGalery.bulkCreate([
    {
      image: "https://example.com/image1.jpg",
      imageCatId: 1,
      imageSubCatId: 1,
    },
    {
      image: "https://example.com/image2.jpg",
      imageCatId: 1,
      imageSubCatId: 2,
    },
    {
      image: "https://example.com/image3.jpg",
      imageCatId: 2,
      imageSubCatId: 3,
    },
    {
      image: "https://example.com/image4.jpg",
      imageCatId: 2,
      imageSubCatId: 4,
    },
  ]);
  await Education.bulkCreate([
    {
      name: "Eğitim Bilinci",
      duration: 60,
      file_url: "https://example.com/ders1.mp4",
      type: "video",
    },
    {
      name: "Ders 2",
      duration: 60,
      file_url: "https://example.com/ders2.pdf",
      type: "pdf",
    },
    {
      name: "Ders 3",
      duration: 60,
      file_url: "https://example.com/ders3.mp4",
      type: "video",
    },
    {
      name: "Ders 4",
      duration: 60,
      file_url: "https://example.com/ders4.ppt",
      type: "ppt",
    },
    {
      name: "Ders 5",
      duration: 5,
      file_url:
        "https://res.cloudinary.com/dlsh0jvcj/video/upload/v1749450662/uploads/1749450640989-Egitimorneks.mp4.mp4",
      type: "video",
    },
    {
      name: "Ders 6",
      duration: 60,
      file_url:
        "https://res.cloudinary.com/dlsh0jvcj/image/upload/v1749450782/uploads/1749450767194-Belge%201.pdf.pdf",
      type: "pdf",
    },
  ]);
  await BanSubs.bulkCreate([
    {
      name: "Tüfek",
    },
    {
      name: "Şarjör",
    },
    {
      name: "Fişek",
    },
    {
      name: "Kasatura",
    },
  ]);
  await Booklet.bulkCreate([
    {
      name: "Kitapçık 1",
      type: "img",
      question_count: 10,
    },
    {
      name: "Kitapçık 2",
      type: "teo",
      question_count: 10,
    },
    {
      name: "Kitapçık 3",
      type: "img",
      question_count: 2,
    },
  ]);
  await Exam.bulkCreate([
    // Tekil teorik sınav
    {
      name: "Sınav",
      exam_type: "teo",
      start_date: "2025-06-01",
      end_date: "2025-06-01",
      start_time: "09:00",
      end_time: "10:00",
      sure: 1,
      attemp_limit: 1,
      passing_score: 70,
      timed: true,
      sonucu_gizle: false,
      bookletId: 2,
      question_count: 7,
      unifiedId: null,
      educationExam: false,
    },
    // Tekil görsel sınav
    {
      name: "Sınav",
      exam_type: "img",
      start_date: "2025-06-02",
      end_date: "2025-06-02",
      start_time: "11:00",
      end_time: "11:45",
      sure: 45,
      attemp_limit: 2,
      passing_score: 75,
      timed: true,
      sonucu_gizle: false,
      bookletId: 1,
      question_count: 10,
      unifiedId: null,
      educationExam: false,
    },
    // Birleşik sınav - teorik kısmı
    {
      name: "Deneme Sınavı 2",
      exam_type: "teo",
      start_date: "2025-06-03",
      end_date: "2025-06-03",
      start_time: "10:00",
      end_time: "11:00",
      sure: 1,
      attemp_limit: 1,
      passing_score: 70,
      timed: true,
      sonucu_gizle: false,
      bookletId: 2,
      question_count: 7,
      unifiedId: unifiedId1,
      educationExam: false,
    },
    // Birleşik sınav - görsel kısmı
    {
      name: "Deneme Sınavı 2",
      exam_type: "img",
      start_date: "2025-06-03",
      end_date: "2025-06-03",
      start_time: "11:30",
      end_time: "12:15",
      sure: 45,
      attemp_limit: 1,
      passing_score: 70,
      timed: true,
      sonucu_gizle: false,
      bookletId: 1,
      question_count: 10,
      unifiedId: unifiedId1,
      educationExam: false,
    },
    // Birleşik sınav - başka bir set
    {
      name: "Karma Sınav",
      exam_type: "teo",
      start_date: "2025-06-05",
      end_date: "2025-06-05",
      start_time: "13:00",
      end_time: "14:00",
      sure: 60,
      attemp_limit: 1,
      passing_score: 80,
      timed: true,
      sonucu_gizle: false,
      bookletId: 2,
      question_count: 7,
      unifiedId: unifiedId2,
      educationExam: false,
    },
    {
      name: "Karma Sınav",
      exam_type: "img",
      start_date: "2025-06-05",
      end_date: "2025-06-05",
      start_time: "14:15",
      end_time: "15:00",
      sure: 45,
      attemp_limit: 1,
      passing_score: 80,
      timed: true,
      sonucu_gizle: false,
      bookletId: 1,
      question_count: 10,
      unifiedId: unifiedId2,
      educationExam: false,
    },
    {
      name: "Deneme Sınavı",
      exam_type: "img",
      start_date: "2025-06-17",
      end_date: "2025-06-19",
      start_time: "09:15",
      end_time: "15:00",
      sure: 1000,
      attemp_limit: 1,
      passing_score: 50,
      timed: true,
      sonucu_gizle: false,
      bookletId: 3,
      question_count: 2,
      unifiedId: null,
      educationExam: false,
    },
  ]);
  await QuestionCategory.bulkCreate([
    {
      name: "Patlayıcılar - El Bombaları ",
    },
    {
      name: "Ateşli Silahlar - Parçaları",
    },
    {
      name: "Kesici Aletler - El Aletleri",
    },
  ]);
  await DifLevel.bulkCreate([
    {
      name: "Kolay",
    },
    {
      name: "Orta",
    },
    {
      name: "Zor",
    },
  ]);
  await ExamQuestions.bulkCreate([
    // Teorik sınav için sorular
    {
      examId: 1, // Örnek teorik sınav ID'si
      questionId: 1, // PoolTeo'dan bir soru
      questionType: "teo",
      order: 1,
    },
    {
      examId: 1,
      questionId: 2,
      questionType: "teo",
      order: 2,
    },
    {
      examId: 1,
      questionId: 3,
      questionType: "teo",
      order: 3,
    },
    {
      examId: 1,
      questionId: 4,
      questionType: "teo",
      order: 4,
    },
    {
      examId: 1,
      questionId: 5,
      questionType: "teo",
      order: 5,
    },
    {
      examId: 1,
      questionId: 6,
      questionType: "teo",
      order: 6,
    },
    {
      examId: 1,
      questionId: 7,
      questionType: "teo",
      order: 7,
    },
    // Görsel sınav için sorular
    {
      examId: 2, // Örnek görsel sınav ID'si
      questionId: 1, // PoolImg'den bir soru
      questionType: "img",
      order: 1,
    },
    {
      examId: 2,
      questionId: 2,
      questionType: "img",
      order: 2,
    },

    // Birleşik sınavın teorik kısmı (örnek: examId 3)
    {
      examId: 3,
      questionId: 4,
      questionType: "teo",
      order: 1,
    },
    {
      examId: 3,
      questionId: 5,
      questionType: "teo",
      order: 2,
    },

    // Birleşik sınavın görsel kısmı (örnek: examId 4)
    {
      examId: 4,
      questionId: 3,
      questionType: "img",
      order: 1,
    },
    {
      examId: 4,
      questionId: 4,
      questionType: "img",
      order: 2,
    },
    {
      examId: 7,
      questionId: 6,
      questionType: "img",
      order: 3,
    },
    {
      examId: 7,
      questionId: 7,
      questionType: "img",
      order: 4,
    },
    {
      examId: 7,
      questionId: 8,
      questionType: "img",
      order: 5,
    },
    {
      examId: 7,
      questionId: 9,
      questionType: "img",
      order: 6,
    },
  ]);
  await ExamUser.bulkCreate([
    // Kullanıcı 1 - Teorik Sınav 1'e katıldı, başarılı oldu
    {
      examId: 1,
      userId: 1,
      true_count: 9,
      false_count: 1,
      completed: true,
      score: 90,
      pass: true,
      entry_date: "2025-06-10",
      entry_time: "09:00:00",
      exit_date: "2025-06-10",
      exit_time: "09:45:00",
    },

    // Kullanıcı 1 - Görsel Sınav 2'ye katıldı, başarılı oldu
    {
      examId: 2,
      userId: 1,
      true_count: 8,
      false_count: 2,
      completed: true,
      score: 88,
      pass: true,
      entry_date: "2025-06-11",
      entry_time: "10:30:00",
      exit_date: "2025-06-11",
      exit_time: "11:15:00",
    },

    // Kullanıcı 1 - Teorik Sınav 3'e atanmış ama girmemiş
    {
      examId: 3,
      userId: 1,
      true_count: null,
      false_count: null,
      completed: false,
      score: null,
      pass: false,
      entry_date: null,
      entry_time: null,
      exit_date: null,
      exit_time: null,
    },

    // Kullanıcı 1 - Teorik Sınav 4'e girdi ama geçemedi
    {
      examId: 4,
      userId: 1,
      true_count: 4,
      false_count: 6,
      completed: true,
      score: 40,
      pass: false,
      entry_date: "2025-06-15",
      entry_time: "11:00:00",
      exit_date: "2025-06-15",
      exit_time: "11:45:00",
    },

    // Kullanıcı 2 - Teorik Sınav 1'e girdi ve geçti
    {
      examId: 1,
      userId: 2,
      true_count: 8,
      false_count: 2,
      completed: true,
      score: 80,
      pass: true,
      entry_date: "2025-06-09",
      entry_time: "10:00:00",
      exit_date: "2025-06-09",
      exit_time: "10:45:00",
    },

    // Kullanıcı 2 - Görsel Sınav 2'ye atanmış ama girmemiş
    {
      examId: 2,
      userId: 2,
      true_count: null,
      false_count: null,
      completed: false,
      score: null,
      pass: false,
      entry_date: null,
      entry_time: null,
      exit_date: null,
      exit_time: null,
    },

    // Kullanıcı 3 - Teorik Sınav 1'e atanmış ama girmemiş
    {
      examId: 1,
      userId: 3,
      true_count: null,
      false_count: null,
      completed: false,
      score: null,
      pass: false,
      entry_date: null,
      entry_time: null,
      exit_date: null,
      exit_time: null,
    },

    // Kullanıcı 3 - Görsel Sınav 7'ye katıldı, geçti
    {
      examId: 7,
      userId: 3,
      true_count: 8,
      false_count: 2,
      completed: true,
      score: 80,
      pass: true,
      entry_date: "2025-06-17",
      entry_time: "09:30:00",
      exit_date: "2025-06-17",
      exit_time: "10:15:00",
    },
  ]);
  await PoolTeo.bulkCreate([
    {
      question: "Soru 1",
      a: "Şık a",
      b: "Şık b",
      c: "Şık c",
      d: "Şık d",
      e: "Şık e",
      answer: "a",
      bookletId: 2,
      difLevelId: 1,
      image:
        "https://res.cloudinary.com/dlsh0jvcj/image/upload/v1747481209/uploads/1747481200704-wallpaperflare.com_wallpaper.jpg.jpg",
    },
    {
      question: "Soru 2",
      a: "Şık a",
      b: "Şık b",
      c: "Şık c",
      d: "Şık d",
      e: "Şık e",
      answer: "b",
      bookletId: 2,
      difLevelId: 2,
      image: "",
    },
    {
      question: "X-ray cihazının çalışma prensibi nedir?",
      a: "Elektronların hızlandırılması",
      b: "Mikrodalga rezonansı",
      c: "Infrared ışınım",
      d: "Ultrasonik dalga üretimi",
      e: "Radyo frekansı",
      answer: "a",
      bookletId: 2,
      difLevelId: 3,
      image: "https://example.com/images/xray_device.jpg",
    },
    {
      question:
        "Tehlikeli maddeler tespiti için kullanılan sensör türü hangisidir?",
      a: "Termal sensör",
      b: "Kimyasal sensör",
      c: "Basınç sensör",
      d: "Hareket sensörü",
      e: "Optik sensör",
      answer: "b",
      bookletId: 2,
      difLevelId: 1,
      image: "",
    },
    {
      question: "Bagaj tarama sürecinde öncelikle hangi adım yapılır?",
      a: "X-ray tarama",
      b: "Manuel muayene",
      c: "Kimyasal analiz",
      d: "Ağırlık ölçümü",
      e: "UV ışık kontrolü",
      answer: "a",
      bookletId: 2,
      difLevelId: 2,
      image: "",
    },
    {
      question: "El bombası görüntüsünde hangi şekil karakteristiktir?",
      a: "Yuvarlak gövde ve kol",
      b: "Uzun çubuk",
      c: "Dikdörtgen blok",
      d: "Üçgen prizma",
      e: "Silindir gövde",
      answer: "a",
      bookletId: 2,
      difLevelId: 3,
      image: "https://example.com/images/hand_grenade.jpg",
    },
    {
      question:
        "Kesici aletlerin X-ray görüntüsünde hangi kontrast özelliği görülür?",
      a: "Yüksek kontrastlı metal gölgeler",
      b: "Düşük kontrastlı gölgeler",
      c: "Renkli konturlar",
      d: "Parlak renk patlaması",
      e: "Şeffaf alanlar",
      answer: "a",
      bookletId: 2,
      difLevelId: 1,
      image: "",
    },
  ]);
  await PoolImg.bulkCreate([
    {
      question:
        "Soru 1: Bu görseldeki tehlikeli maddeyi görsel üzerinde işaretleyin ve hangisi olduğunu şıklarda belirtiniz.",
      a: "Çakı",
      b: "Tornavida",
      c: "Tabanca",
      d: "Telefon",
      e: "Kitap",
      f: "El Bombası",
      coordinate: [
        [
          { x: 150, y: 120 },
          { x: 200, y: 120 },
          { x: 175, y: 170 },
        ],
        [],
      ],
      answer: "a",
      bookletId: 1,
      questionCategoryId: 1,
      difLevelId: 2,
      image:
        "https://res.cloudinary.com/dlsh0jvcj/image/upload/v1748174344/uploads/1748174322423-merged.png.png",
    },
    {
      question:
        "Soru 2: Bu görseldeki tehlikeli maddeyi görsel üzerinde işaretleyin ve hangisi olduğunu şıklarda belirtiniz.",
      a: "Çakı",
      b: "Tornavida",
      c: "Tabanca",
      d: "Telefon",
      e: "Kitap",
      f: "El Bombası",
      coordinate: [
        [
          { x: 150, y: 120 },
          { x: 200, y: 120 },
          { x: 175, y: 170 },
        ],
        [],
      ],
      answer: "a",
      bookletId: 1,
      questionCategoryId: 1,
      difLevelId: 2,
      image:
        "https://res.cloudinary.com/dlsh0jvcj/image/upload/v1748174344/uploads/1748174322423-merged.png.png",
    },
    {
      question: "Soru 3: Hangi bölgede patlayıcı madde olabilir?",
      a: "A bölgesi",
      b: "B bölgesi",
      c: "C bölgesi",
      d: "D bölgesi",
      e: "E bölgesi",
      f: "F bölgesi",
      coordinate: [
        [
          { x: 100, y: 100 },
          { x: 200, y: 100 },
          { x: 150, y: 200 },
        ],
        [],
      ],
      answer: "c",
      bookletId: 1,
      questionCategoryId: 1,
      difLevelId: 3,
      image:
        "https://res.cloudinary.com/dlsh0jvcj/image/upload/v1748174344/uploads/1748174322423-merged.png.png",
    },
    {
      question: "Soru 4: Şüpheli sıvı nerede görülüyor?",
      a: "Sol üst",
      b: "Sağ alt",
      c: "Orta",
      d: "Sol alt",
      e: "Sağ üst",
      f: "Alt orta",
      coordinate: [
        [
          { x: 250, y: 250 },
          { x: 300, y: 250 },
          { x: 275, y: 300 },
        ],
        [],
      ],
      answer: "b",
      bookletId: 1,
      questionCategoryId: 2,
      difLevelId: 1,
      image:
        "https://res.cloudinary.com/dlsh0jvcj/image/upload/v1748174344/uploads/1748174322423-merged.png.png",
    },
    {
      question:
        "Soru 5: Görseldeki nesne güvenlik açısından sorun teşkil eder mi?",
      a: "Evet",
      b: "Hayır",
      c: "Belirsiz",
      d: "Duruma göre değişir",
      e: "Sadece el bagajında",
      f: "Sadece kargo bölümünde",
      coordinate: [
        [
          { x: 120, y: 180 },
          { x: 160, y: 180 },
          { x: 140, y: 230 },
        ],
        [],
      ],
      answer: "a",
      bookletId: 1,
      questionCategoryId: 1,
      difLevelId: 2,
      image: "https://example.com/images/dangerous_object.jpg",
    },
    {
      question:
        "Soru 5: Görseldeki nesne güvenlik açısından sorun teşkil eder mi?",
      a: "Evet",
      b: "Hayır",
      c: "Belirsiz",
      d: "Duruma göre değişir",
      e: "Sadece el bagajında",
      f: "Sadece kargo bölümünde",
      coordinate: [
        [
          { x: 160, y: 201 },
          { x: 227, y: 198 },
          { x: 233, y: 275 },
          { x: 166, y: 278 },
        ],
        [],
      ],
      answer: "a",
      bookletId: 3,
      questionCategoryId: 1,
      difLevelId: 2,
      image:
        "https://res.cloudinary.com/dlsh0jvcj/image/upload/v1750142165/uploads/1750142134933-merged-image.png.png",
    },
    {
      question:
        "Soru 7: Görseldeki nesne güvenlik açısından sorun teşkil eder mi?",
      a: "Evet",
      b: "Hayır",
      c: "Belirsiz",
      d: "Duruma göre değişir",
      e: "Sadece el bagajında",
      f: "Sadece kargo bölümünde",
      coordinate: [
        [
          { x: 398, y: 124 },
          { x: 484, y: 123 },
          { x: 487, y: 200 },
          { x: 390, y: 200 },
        ],
        [],
      ],
      answer: "a",
      bookletId: 3,
      questionCategoryId: 1,
      difLevelId: 2,
      image:
        "https://res.cloudinary.com/dlsh0jvcj/image/upload/v1750142529/uploads/1750142499669-merged-image.png.png",
    },
    {
      question:
        "Soru 8: Görseldeki nesne güvenlik açısından sorun teşkil eder mi?",
      a: "Evet",
      b: "Hayır",
      c: "Belirsiz",
      d: "Duruma göre değişir",
      e: "Sadece el bagajında",
      f: "Sadece kargo bölümünde",
      coordinate: [
        [
          { x: 421, y: 167 },
          { x: 527, y: 164 },
          { x: 540, y: 270 },
          { x: 418, y: 270 },
        ],
        [],
      ],
      answer: "a",
      bookletId: 3,
      questionCategoryId: 1,
      difLevelId: 2,
      image:
        "https://res.cloudinary.com/dlsh0jvcj/image/upload/v1750149237/uploads/1750149207433-merged-image.png.png",
    },
    {
      question:
        "Soru 9: Görseldeki nesne güvenlik açısından sorun teşkil eder mi?",
      a: "Evet",
      b: "Hayır",
      c: "Belirsiz",
      d: "Duruma göre değişir",
      e: "Sadece el bagajında",
      f: "Sadece kargo bölümünde",
      coordinate: [
        [
          { x: 240, y: 291 },
          { x: 369, y: 289 },
          { x: 365, y: 235 },
          { x: 239, y: 240 },
        ],
        [],
      ],
      answer: "b",
      bookletId: 3,
      questionCategoryId: 1,
      difLevelId: 2,
      image:
        "https://res.cloudinary.com/dlsh0jvcj/image/upload/v1750149619/uploads/1750149589525-merged-image.png.png",
    },
  ]);
  await UserImgAnswers.bulkCreate([
    {
      user_id: 1,
      exam_id: 2,
      question_id: 1, // poolimgs tablosunda bu id mevcut
      answer: "A",
      coordinate: { x: 45, y: 60 },
      is_correct: true,
    },
    {
      user_id: 1,
      exam_id: 2,
      question_id: 2,
      answer: "B",
      coordinate: { x: 30, y: 75 },
      is_correct: false,
    },
    {
      user_id: 2,
      exam_id: 2,
      question_id: 3,
      answer: "B",
      coordinate: { x: 50, y: 40 },
      is_correct: true,
    },
    {
      user_id: 2,
      exam_id: 2,
      question_id: 4,
      answer: "D",
      coordinate: { x: 70, y: 20 },
      is_correct: false,
    },
    {
      user_id: 3,
      exam_id: 2,
      question_id: 5,
      answer: "A",
      coordinate: { x: 60, y: 90 },
      is_correct: true,
    },
    {
      user_id: 3,
      exam_id: 2,
      question_id: 1,
      answer: "B",
      coordinate: { x: 25, y: 50 },
      is_correct: true,
    },
    {
      user_id: 4,
      exam_id: 2,
      question_id: 2,
      answer: "C",
      coordinate: { x: 40, y: 65 },
      is_correct: false,
    },
    {
      user_id: 4,
      exam_id: 2,
      question_id: 3,
      answer: "D",
      coordinate: { x: 55, y: 85 },
      is_correct: true,
    },
    {
      user_id: 1,
      exam_id: 2,
      question_id: 4,
      answer: "B",
      coordinate: { x: 35, y: 70 },
      is_correct: false,
    },
    {
      user_id: 1,
      exam_id: 2,
      question_id: 5,
      answer: "B",
      coordinate: { x: 60, y: 40 },
      is_correct: true,
    },

    // {
    //   user_id: 1,
    //   exam_id: 7,
    //   question_id: 6,
    //   answer: "a",
    //   coordinate: {
    //     x: 147.90461529649474,
    //     y: 232.65966855895735,
    //   },
    //   is_correct: true,
    // },

    // {
    //   user_id: 1,
    //   exam_id: 7,
    //   question_id: 7,
    //   answer: "b",
    //   coordinate: {

    //     x: 449.5098444693501,
    //     y: 158.6391908666591,
    //   },
    //   is_correct: true,
    // },
  ]);
  await UserTeoAnswers.bulkCreate([
    {
      user_id: 2,
      exam_id: 1,
      question_id: 1,
      answer: "A",
      is_correct: true,
    },
    {
      user_id: 2,
      exam_id: 1,
      question_id: 2,
      answer: "B",
      is_correct: false,
    },
    {
      user_id: 2,
      exam_id: 1,
      question_id: 3,
      answer: "B",
      is_correct: true,
    },
    {
      user_id: 2,
      exam_id: 1,
      question_id: 4,
      answer: "D",
      is_correct: false,
    },
    {
      user_id: 2,
      exam_id: 1,
      question_id: 5,
      answer: "A",
      is_correct: true,
    },
    {
      user_id: 2,
      exam_id: 1,
      question_id: 6,
      answer: "A",
      is_correct: true,
    },
    {
      user_id: 2,
      exam_id: 1,
      question_id: 7,
      answer: "B",
      is_correct: true,
    },
  ]);
  await EducationSet.bulkCreate([
    {
      name: "Frontend Geliştirme Eğitimi",

      teoExamId: 1,
      imgExamId: 2,
    },
    {
      name: "Backend Geliştirme Eğitimi",

      teoExamId: 3,
      imgExamId: null,
    },
    {
      name: "Veri Tabanı Eğitimi",

      teoExamId: null,
      imgExamId: 4,
    },
  ]);
  await EduAndEduSet.bulkCreate([
    {
      educationId: 1,
      educationSetId: 1,
    },
    {
      educationId: 2,
      educationSetId: 1,
    },
    {
      educationId: 3,
      educationSetId: 2,
    },
    {
      educationId: 5,
      educationSetId: 3,
    },
    {
      educationId: 6,
      educationSetId: 3,
    },
  ]);
  await EducationSetUser.bulkCreate([
    {
      educationSetId: 1,
      userId: 1,
      completed: true,
      start_date: "2025-08-01",
      end_date: "2025-08-10",
      start_time: "14:00:00",
      end_time: "17:00:00",
      entry_date: "2025-06-01",
      entry_time: "09:00:00",
      exit_date: "2025-06-01",
      exit_time: "11:00:00",
      educator: "Ahmet Yılmaz",
    },
    {
      educationSetId: 1,
      userId: 2,
      completed: true,
      start_date: "2025-08-01",
      end_date: "2025-08-10",
      start_time: "14:00:00",
      end_time: "17:00:00",
      entry_date: "2025-06-02",
      entry_time: "10:00:00",
      exit_date: null,
      exit_time: null,
      educator: "Mehmet Demir",
    },
    {
      educationSetId: 2,
      userId: 2,
      completed: true,
      start_date: "2025-08-01",
      end_date: "2025-08-10",
      start_time: "14:00:00",
      end_time: "17:00:00",
      entry_date: "2025-06-03",
      entry_time: "13:00:00",
      exit_date: "2025-06-03",
      exit_time: "14:30:00",
      educator: "Ayşe Kaya",
    },
    {
      educationSetId: 3,
      userId: 1,
      start_date: "2025-08-01",
      end_date: "2025-08-10",
      start_time: "14:00:00",
      end_time: "17:00:00",
      completed: false,
      entry_date: null,
      entry_time: null,
      exit_date: null,
      exit_time: null,
      educator: "Ali Yılmaz",
    },
  ]);
  await EducationPages.bulkCreate([
    {
      educationId: 1,
      page: 1,
      duration: 20,
    },
    {
      educationId: 1,
      page: 2,
      duration: 15,
    },
    {
      educationId: 2,
      page: 1,
      duration: 30,
    },
    {
      educationId: 3,
      page: 1,
      duration: 45,
    },
    {
      educationId: 4,
      page: 1,
      duration: 60,
    },
    {
      educationId: 5,
      page: 1,
      duration: 45,
    },
    {
      educationId: 6,
      page: 1,
      duration: 10,
    },
    {
      educationId: 6,
      page: 2,
      duration: 10,
    },
    {
      educationId: 6,
      page: 3,
      duration: 10,
    },
  ]);
  await UploadFile.bulkCreate([
    {
      name: "File 1",
      file_url: "/uploads/file1.jpg", // burada file_url olmalı
    },
    {
      name: "File 2",
      file_url: "/uploads/file2.jpg",
    },
    {
      name: "File 3",
      file_url: "/uploads/file3.jpg",
    },
  ]);

  await UploadFileUser.bulkCreate([
    {
      user_id: 1,
      file_id: 1,
      is_downloaded: true,
    },
    {
      user_id: 2,
      file_id: 2,
      is_downloaded: true,
    },
    {
      user_id: 1,
      file_id: 3,
      is_downloaded: true,
    },
  ]);
}
module.exports = populate;
