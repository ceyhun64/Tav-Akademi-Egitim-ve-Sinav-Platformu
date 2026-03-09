# 🎓 TavAkademi - Education & Exam Management Platform

<div align="center">

![TavAkademi](https://img.shields.io/badge/TavAkademi-v1.0.0-blue?style=for-the-badge)
![Node.js](https://img.shields.io/badge/Node.js-v16+-green?style=for-the-badge&logo=node.js)
![React](https://img.shields.io/badge/React-19.1.0-61DAFB?style=for-the-badge&logo=react)
![MySQL](https://img.shields.io/badge/MySQL-8.0-4479A1?style=for-the-badge&logo=mysql)
![License](https://img.shields.io/badge/License-ISC-yellow?style=for-the-badge)

**A comprehensive digital exam and education management platform for institutions and students**

[Features](#-features) • [Installation](#-installation) • [API](#-api-documentation) • [Database](#-database-schema) • [Contact](#-contact)

</div>

---

## 📋 About the Project

TavAkademi is a modern web application that brings together everything educational institutions need — education set management, multiple exam types, visual gallery, automatic certificate generation, and detailed reporting — all in a single platform.

The platform provides role-tailored interfaces for **Admin**, **Instructor**, and **Student** users, giving each the most relevant experience.

---

## ✨ Features

### 👤 User Management

- User registration, login, and profile management
- **Two-Factor Authentication (2FA)** support via Speakeasy (TOTP)
- Role-based authorization (Admin, Instructor, Student)
- Group and institution-based user organization
- Password reset and update flow
- Session management and active session tracking
- Bulk user registration via Excel import

### 📚 Education Management

- Create and edit education sets and sub-courses
- Page-based content (PDF, video, text)
- User assignment and progress tracking
- Page duration and reading time enforcement
- Exam assignment linked to education content

### 📝 Exam System

- **Theoretical (Teo)** exam type — multiple-choice text questions
- **Visual (Img)** exam type — annotatable image questions
- **Combined (Both)** exam type — Teo + Img hybrid
- **Practice Exams** — custom format support
- Automatic scoring and instant result display
- Question pool (Pool) management — separate Teo and Img pools
- Question difficulty and category classification
- Bulk question upload
- Exam security: fullscreen enforcement, illegal move detection
- Exam timer and countdown control
- Booklet creation and export

### 🖼️ X-Ray Image Tools

- Image annotation with polygon editor
- Filters: Black & White, Negative, Transparency, HI, O2, OS, SEN
- Image merging (Image Merger & Blender)
- Draggable overlay support
- White-to-transparent conversion tool

### 🖼️ Gallery Management

- Category and subcategory structure
- Image upload and management via Cloudinary
- Gallery search and filtering

### 📊 Reporting & Analytics

- Teo, Img, and Combined exam reports
- Question-level detailed analysis
- User-based education and exam reports
- Activity logs with GeoIP location support
- Excel report export
- Chart-based performance visualization (Recharts)

### 🏆 Certificate Management

- Template-based automatic certificate generation
- DOCX and PDF certificate creation
- QR code integration for certificate verification
- Certificate download and archiving

### 🔧 Admin Panel

- Centralized admin dashboard
- Announcement management
- Banned user (BanSubs) management
- Role, RoleLevel, and Permission management
- Illegal move monitoring
- File upload management
- System settings

---

## 🛠️ Technology Stack

### Frontend

| Technology                 | Version | Description             |
| -------------------------- | ------- | ----------------------- |
| React                      | 19.1.0  | UI framework            |
| Vite                       | 6.3.5   | Build tool              |
| Redux Toolkit              | 2.8.1   | State management        |
| React Router DOM           | 7.6.0   | Routing                 |
| Bootstrap                  | 5.3.6   | CSS framework           |
| CKEditor 5                 | 41.4.2  | Rich text editor        |
| React PDF Viewer           | 3.12.0  | PDF rendering           |
| Recharts                   | 3.0.0   | Charts and graphs       |
| Axios                      | 1.9.0   | HTTP client             |
| XLSX                       | 0.18.5  | Excel processing        |
| React RnD                  | 10.5.2  | Drag-and-drop component |
| DayJS                      | 1.11.13 | Date handling           |
| React Circular Progressbar | 2.2.0   | Progress indicator      |

### Backend

| Technology    | Version | Description          |
| ------------- | ------- | -------------------- |
| Node.js       | v16+    | Runtime environment  |
| Express.js    | 5.1.0   | Web framework        |
| MySQL         | 8.0     | Primary database     |
| Sequelize     | 6.37.7  | ORM                  |
| JWT           | 9.0.2   | Authentication       |
| Cloudinary    | 1.41.3  | Image storage        |
| Redis         | 5.0.1   | Caching              |
| Puppeteer     | 24.10.2 | Browser automation   |
| PDF-lib       | 1.17.1  | PDF manipulation     |
| Docxtemplater | 3.65.2  | DOCX template engine |
| Nodemailer    | 7.0.3   | Email delivery       |
| QRCode        | 1.5.4   | QR code generation   |
| Speakeasy     | 2.0.0   | 2FA support          |
| GeoIP-lite    | 1.4.10  | Location services    |
| Helmet        | 8.1.0   | Security headers     |
| Bcryptjs      | 3.0.2   | Password hashing     |
| Multer        | 1.4.5   | File uploads         |

### Infrastructure

| Technology | Description            |
| ---------- | ---------------------- |
| Docker     | Containerization       |
| Vercel     | Frontend deployment    |
| Railway    | Backend deployment     |
| Cloudinary | CDN & image management |

---

## 🚀 Installation

### Prerequisites

- Node.js **v16+**
- MySQL **8.0+**
- Redis _(optional, for caching)_
- Cloudinary account _(for image uploads)_

---

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/tavakademi.git
cd tavakademi
```

---

### 2. Backend Setup

```bash
cd server
npm install
```

Create a `.env` file:

```env
# Server
PORT=3000
FRONTEND_URL=http://localhost:5173

# Authentication
JWT_SECRET=your_jwt_secret_key

# Database
DB_HOST=your_db_host
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=your_db_name

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Redis
REDIS_URL=redis://localhost:6379

# Email
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_app_password
```

Start the backend server:

```bash
# Development mode
npm run dev

# Production mode
npm start
```

---

### 3. Frontend Setup

```bash
cd client
npm install
npm run dev
```

Open `http://localhost:5173` in your browser.

---

### 4. Run with Docker

Start all services with a single command:

```bash
docker-compose up -d
```

---

## 📁 Project Structure

```
TavAkademi/
├── client/                         # Frontend (React + Vite)
│   ├── public/                     # Static files (images, logos)
│   └── src/
│       ├── components/
│       │   ├── admin/              # Admin panel components
│       │   │   ├── auth/           # Admin login & 2FA
│       │   │   ├── education/      # Education management
│       │   │   ├── exam/           # Exam management
│       │   │   ├── pool/           # Question pool & image tools
│       │   │   ├── report/         # Reporting components
│       │   │   ├── library/        # Gallery management
│       │   │   ├── certificate/    # Certificate management
│       │   │   ├── booklet/        # Booklet management
│       │   │   ├── role/           # Role & permission management
│       │   │   ├── settings/       # System settings
│       │   │   └── user/           # User management
│       │   ├── user/               # Student panel components
│       │   │   ├── auth/           # Login, register, password flows
│       │   │   ├── education/      # Education viewer
│       │   │   ├── exam/           # Exam taking
│       │   │   ├── question/       # Question interface & X-Ray tools
│       │   │   └── report/         # Student reports
│       │   └── home/               # Homepage components
│       ├── features/
│       │   ├── services/           # API service layer (Axios)
│       │   ├── slices/             # Redux state slices
│       │   └── thunks/             # Async Redux thunks
│       ├── pages/
│       │   ├── admin/              # Admin page components
│       │   ├── user/               # User page components
│       │   └── home/               # Homepage, about, contact
│       ├── hooks/                  # Custom React hooks
│       ├── layout/                 # Navbar, footer, layout wrappers
│       └── store/                  # Redux store configuration
│
└── server/                         # Backend (Node.js + Express)
    ├── config/                     # Sequelize configuration
    ├── controllers/                # Business logic layer
    ├── models/                     # Sequelize database models
    ├── routes/                     # Express API routes
    ├── middlewares/                 # Auth, upload, authorization
    ├── helpers/                    # Helper functions (mail, log)
    ├── data/                       # DB connection
    ├── migrations/                 # Sequelize migration files
    └── server.js                   # Application entry point
```

---

## 🔌 API Documentation

### Base URL

```
http://localhost:3000/api
```

### 🔐 Authentication

| Method | Endpoint            | Description             |
| ------ | ------------------- | ----------------------- |
| POST   | `/auth/login`       | User login              |
| POST   | `/auth/register`    | User registration       |
| POST   | `/auth/verify-code` | Email verification code |
| POST   | `/auth/setup-2fa`   | Set up 2FA              |
| POST   | `/auth/verify-2fa`  | Verify 2FA code         |

### 👥 User Management

| Method | Endpoint      | Description            |
| ------ | ------------- | ---------------------- |
| GET    | `/users`      | List all users         |
| GET    | `/users/:id`  | Get user details       |
| PUT    | `/users/:id`  | Update user            |
| DELETE | `/users/:id`  | Delete user            |
| POST   | `/users/bulk` | Bulk user registration |

### 📚 Education

| Method | Endpoint                 | Description                  |
| ------ | ------------------------ | ---------------------------- |
| GET    | `/education`             | List educations              |
| POST   | `/education`             | Create education             |
| PUT    | `/education/:id`         | Update education             |
| DELETE | `/education/:id`         | Delete education             |
| GET    | `/education-sets`        | List education sets          |
| POST   | `/education-sets`        | Create education set         |
| POST   | `/education-sets/assign` | Assign education set to user |

### 📝 Exams

| Method | Endpoint               | Description         |
| ------ | ---------------------- | ------------------- |
| GET    | `/exams`               | List exams          |
| POST   | `/exams`               | Create exam         |
| GET    | `/exams/:id`           | Get exam details    |
| GET    | `/exams/:id/questions` | Get exam questions  |
| POST   | `/exams/:id/submit`    | Submit exam answers |

### 🗂️ Question Pool

| Method | Endpoint         | Description                      |
| ------ | ---------------- | -------------------------------- |
| GET    | `/pool-teo`      | Theoretical question pool        |
| POST   | `/pool-teo`      | Add theoretical question         |
| GET    | `/pool-img`      | Visual question pool             |
| POST   | `/pool-img`      | Add visual question              |
| POST   | `/pool-teo/bulk` | Bulk theoretical question upload |

### 🖼️ Gallery

| Method | Endpoint              | Description         |
| ------ | --------------------- | ------------------- |
| GET    | `/gallery`            | List gallery images |
| POST   | `/gallery`            | Upload image        |
| GET    | `/gallery/categories` | List categories     |
| POST   | `/gallery/categories` | Create category     |

### 📊 Reports

| Method | Endpoint                     | Description           |
| ------ | ---------------------------- | --------------------- |
| GET    | `/reports/exam/:id`          | Exam report           |
| GET    | `/reports/question/:id`      | Question-level report |
| GET    | `/reports/education-set/:id` | Education set report  |
| GET    | `/reports/user/:id`          | User report           |

### 🏆 Certificates

| Method | Endpoint                     | Description          |
| ------ | ---------------------------- | -------------------- |
| GET    | `/certificates`              | List certificates    |
| POST   | `/certificates/generate`     | Generate certificate |
| GET    | `/certificates/:id/download` | Download certificate |

---

## 📊 Database Schema

### Core Tables

```
users               → User records (name, email, password, role)
roles               → Role definitions
role_levels         → Role levels
role_level_perms    → Role level permissions
permissions         → Permission definitions
groups              → User groups
institutions        → Institutions

education_sets      → Education sets
education_set_users → Education set – user assignments
educations          → Educations
education_pages     → Education pages (content)
education_users     → Education – user assignment
edu_and_edu_sets    → Education – education set relationship
education_exams     → Exams linked to educations

exams               → Exam definitions
exam_questions      → Exam questions
exam_users          → Exam – user assignment
pool_teo            → Theoretical question pool
pool_img            → Visual question pool
question_categories → Question categories
dif_levels          → Difficulty levels
user_teo_answers    → User theoretical answers
user_img_answers    → User visual answers

practice_exams          → Practice exams
practice_exam_questions → Practice exam questions
practice_exam_users     → Practice exam – user assignment

galleries           → Gallery images
gallery_cats        → Gallery categories
gallery_sub_cats    → Gallery subcategories

certificates        → Certificate records
booklets            → Exam booklets
announcements       → Announcements
activity_logs       → Activity logs
sessions            → User sessions
illegal_moves       → Illegal move records
ban_subs            → Banned users
upload_files        → Uploaded files
upload_file_users   → File – user assignment
```

---

## 🔐 Security

- **JWT** based authentication (Access Token)
- **Two-Factor Authentication (2FA)** — Speakeasy (TOTP)
- **Role-based authorization** — middleware-protected routes
- **Helmet.js** security headers
- **CORS** configuration
- **Bcryptjs** password hashing
- **Exam security** — fullscreen enforcement, tab-switch detection
- **GeoIP** session location validation
- **Redis** session caching

---

## 🧪 Testing

```bash
# Backend tests
cd server
npm test

# Frontend tests
cd client
npm test
```

---

## 🚀 Deployment

### Frontend — Vercel

```bash
cd client
npm run build
vercel --prod
```

### Backend — Docker

```bash
cd server
docker build -t tavakademi-server .
docker run -p 3000:3000 --env-file .env tavakademi-server
```

### Backend — Railway

Create a new project in the Railway dashboard, connect your GitHub repository, and configure your environment variables.

---

## 🤝 Contributing

1. **Fork** this repository
2. Create a feature branch:
   ```bash
   git checkout -b feature/AmazingFeature
   ```
3. Commit your changes:
   ```bash
   git commit -m 'feat: add AmazingFeature'
   ```
4. Push your branch:
   ```bash
   git push origin feature/AmazingFeature
   ```
5. Open a **Pull Request**

---

## 👥 Developers

| Name           | Role                 | Contact                                         |
| -------------- | -------------------- | ----------------------------------------------- |
| Ceyhun Türkmen | Full Stack Developer | [ctrkmn64@gmail.com](mailto:ctrkmn64@gmail.com) |

---

## 📝 License

This project is licensed under the **ISC License**.

---

## 📞 Contact

For questions and feedback:

- 📧 Email: [ctrkmn64@gmail.com](mailto:ctrkmn64@gmail.com)
- 🐛 Bug reports: [GitHub Issues](https://github.com/your-username/tavakademi/issues)

---

<div align="center">

_TavAkademi — Digitalizing Education_ 🚀

</div>
