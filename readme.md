# TavAkademi - Eğitim ve Sınav Platformu

## 📋 Proje Açıklaması

TavAkademi, eğitim kurumları ve öğrencileri için kapsamlı bir eğitim ve sınav yönetim platformudur. Platform, eğitim setleri oluşturma, çeşitli türde sınavlar düzenleme, galeri yönetimi, sertifika üretimi ve detaylı raporlama gibi özellikler sunar.

## ✨ Özellikler

### 👤 Kullanıcı Yönetimi
- Kullanıcı kayıt ve giriş sistemi
- Rol tabanlı yetkilendirme (Admin, Eğitmen, Öğrenci)
- Profil yönetimi ve şifre güncelleme

### 📚 Eğitim Yönetimi
- Eğitim setleri oluşturma ve düzenleme
- Eğitim sayfaları ve içerikleri
- Eğitim kullanıcı atamaları

### 📝 Sınav Sistemi
- Teorik (Teo) ve görsel (Img) sorular
- Karma (Both) sınav türleri
- Pratik sınavlar
- Otomatik puanlama ve raporlama

### 🖼️ Galeri Yönetimi
- Resim galerisi kategorileri ve alt kategorileri
- Galeri görüntü yükleme ve yönetimi

### 📊 Raporlama ve Analiz
- Sınav raporları (Teo, Img, Karma)
- Soru bazlı raporlar
- Aktivite logları

### 🏆 Sertifika Yönetimi
- Otomatik sertifika üretimi
- PDF formatında indirme

### 🔧 Yönetim Paneli
- Kullanıcı yönetimi
- Eğitim ve sınav oluşturma
- Galeri yönetimi
- Sistem ayarları

## 🛠️ Teknoloji Stack

### Frontend
- **React 19.1.0** - UI framework
- **Vite** - Build tool
- **Redux Toolkit** - State management
- **React Router DOM** - Routing
- **Bootstrap 5** - CSS framework
- **CKEditor** - Rich text editor
- **React PDF Viewer** - PDF görüntüleme
- **Recharts** - Charts and graphs

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MySQL** - Database
- **Sequelize** - ORM
- **JWT** - Authentication
- **Cloudinary** - Image storage
- **Redis** - Caching
- **PDF-lib** - PDF manipulation
- **Puppeteer** - Browser automation

### Diğer Araçlar
- **Docker** - Containerization
- **Nodemailer** - Email sending
- **QRCode** - QR code generation
- **GeoIP** - Location services

## 🚀 Kurulum ve Çalıştırma

### Ön Gereksinimler
- Node.js (v16+)
- MySQL Database
- Redis (opsiyonel, caching için)

### Backend Kurulumu

1. Server dizinine gidin:
   ```bash
   cd server
   ```

2. Bağımlılıkları yükleyin:
   ```bash
   npm install
   ```

3. Environment variables'ları ayarlayın (.env dosyası oluşturun):
   ```env
   PORT=3000
   FRONTEND_URL=http://localhost:5173
   JWT_SECRET=your_jwt_secret
   DB_HOST=your_db_host
   DB_USER=your_db_user
   DB_PASSWORD=your_db_password
   DB_NAME=your_db_name
   CLOUDINARY_CLOUD_NAME=your_cloudinary_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   REDIS_URL=redis://localhost:6379
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_email_password
   ```

4. Veritabanını başlatın:
   ```bash
   npm run dev
   ```

### Frontend Kurulumu

1. Client dizinine gidin:
   ```bash
   cd client
   ```

2. Bağımlılıkları yükleyin:
   ```bash
   npm install
   ```

3. Development server'ı başlatın:
   ```bash
   npm run dev
   ```

4. Tarayıcıda `http://localhost:5173` adresine gidin.

### Docker ile Çalıştırma

1. Docker Compose ile tüm servisleri başlatın:
   ```bash
   docker-compose up -d
   ```

## 📁 Proje Yapısı

```
TavAkademi/
├── client/                 # Frontend uygulaması
│   ├── public/            # Statik dosyalar
│   ├── src/
│   │   ├── components/    # React bileşenleri
│   │   ├── pages/         # Sayfa bileşenleri
│   │   ├── features/      # Özellik modülleri
│   │   ├── store/         # Redux store
│   │   ├── hooks/         # Custom hooks
│   │   └── assets/        # Statik varlıklar
│   └── package.json
├── server/                 # Backend uygulaması
│   ├── config/            # Yapılandırma dosyaları
│   ├── controllers/       # İş mantığı kontrolcüleri
│   ├── models/            # Veritabanı modelleri
│   ├── routes/            # API rotaları
│   ├── middlewares/       # Express middlewares
│   ├── helpers/           # Yardımcı fonksiyonlar
│   ├── data/              # Veritabanı bağlantısı
│   └── package.json
└── README.md
```

## 🔌 API Dokümantasyonu

### Ana API Endpoints

#### Authentication
- `POST /api/auth/login` - Kullanıcı girişi
- `POST /api/auth/register` - Kullanıcı kaydı
- `POST /api/auth/verify-code` - Kod doğrulama

#### User Management
- `GET /api/users` - Kullanıcıları listele
- `PUT /api/users/:id` - Kullanıcı güncelle

#### Education
- `GET /api/education` - Eğitimleri listele
- `POST /api/education` - Eğitim oluştur
- `PUT /api/education/:id` - Eğitim güncelle

#### Exams
- `GET /api/exams` - Sınavları listele
- `POST /api/exams` - Sınav oluştur
- `GET /api/exams/:id/questions` - Sınav sorularını getir

#### Gallery
- `GET /api/gallery` - Galeri görüntülerini listele
- `POST /api/gallery` - Galeri görüntüsü yükle

#### Reports
- `GET /api/reports/exam/:id` - Sınav raporu
- `GET /api/reports/question/:id` - Soru raporu

## 🔐 Güvenlik

- JWT tabanlı kimlik doğrulama
- Rol tabanlı yetkilendirme
- Helmet.js ile güvenlik başlıkları
- CORS yapılandırması
- Şifre hashleme (bcryptjs)

## 📊 Veritabanı Şeması

Ana tablolar:
- `users` - Kullanıcı bilgileri
- `exams` - Sınav bilgileri
- `questions` - Sorular
- `education_sets` - Eğitim setleri
- `galleries` - Galeri görüntüleri
- `certificates` - Sertifikalar
- `activity_logs` - Aktivite logları

## 🧪 Test

```bash
# Backend testleri
cd server
npm test

# Frontend testleri
cd client
npm test
```

## 🚀 Dağıtım

### Vercel (Frontend)
```bash
cd client
vercel --prod
```

### Railway/Docker (Backend)
```bash
cd server
docker build -t tavakademi-server .
docker run -p 3000:3000 tavakademi-server
```

## 🤝 Katkıda Bulunma

1. Fork edin
2. Feature branch oluşturun (`git checkout -b feature/AmazingFeature`)
3. Commit edin (`git commit -m 'Add some AmazingFeature'`)
4. Push edin (`git push origin feature/AmazingFeature`)
5. Pull Request açın

## 📝 Lisans

Bu proje ISC lisansı altında lisanslanmıştır.

## 👥 Geliştiriciler

- **Ceyhun Türkmen:** 

## 📞 İletişim

Sorularınız için: [ctrkmn64@gmail.com]

---

*Bu README dosyası projenin tüm detaylarını kapsamaktadır. Daha fazla bilgi için kod tabanını inceleyebilirsiniz.*