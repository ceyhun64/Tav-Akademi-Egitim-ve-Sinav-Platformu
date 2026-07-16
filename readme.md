# TavAkademi

A monorepo containing a React (Vite) client and an Express/Sequelize (MySQL) server for an exam and education-management platform. The server exposes a REST API under `/api/*`; the client is a single-page application that consumes it via Axios.

This document was rewritten from a direct audit of the source code on 2026-07-16. Every claim below was verified against the files in this repository. Where something could not be verified (or was found to be inconsistent with the code), it is stated explicitly instead of guessed.

---

## Overview

TavAkademi combines:

- **Education content delivery** — education "sets" made of pages (PDF/video/PowerPoint), assigned to users, with progress tracking.
- **Exams** — theoretical (`teo`), image/visual (`img`) exam types, question pools, booklets, and practice exams.
- **Reporting** — Excel exports and per-user/per-exam result breakdowns.
- **Certificate generation** — DOCX certificates generated server-side from a template and zipped for download.
- **Admin tooling** — role/permission management, user/group/institution management, gallery/image library, session and activity-log administration.

The client has two route trees mounted in a single React Router `<Routes>` tree: `/…` (student/user-facing pages) and `/admin/…` (admin pages). The server is a single Express 5 app with ~22 route modules mounted under `/api`.

---

### Client

React 19 + Vite SPA. Role-based UI split into `user` and `admin` component/page trees, Redux Toolkit for state, Axios for API calls, Bootstrap 5 for styling.

### Server

Node.js + Express 5 API. Sequelize ORM against MySQL (via `mysql2`). JWT + a server-side `sessions` table for authentication. Cloudinary for file storage. A document-generation pipeline (see below) built from `docxtemplater`/`pizzip`/`jszip` (certificates) and the Adobe PDF Services SDK (PDF → image conversion for education content).

---

## Features

Verified from route files, controllers, and the client route table. Nothing below is inferred beyond what the code implements.

### User management & auth
- Registration (admin-initiated, `authorize(1)`), login, logout, password-reset-by-email flow.
- Mandatory two-factor authentication: `speakeasy` (TOTP) + `qrcode` (QR provisioning) — see [Authentication](#authentication).
- Server-side session tracking (`sessions` table), with admin session activate/deactivate endpoints.
- Bulk user registration from an uploaded Excel file (`auth.controller.js: uploadUsersFromExcel`), plus a bulk profile-photo matcher keyed by employee number (`sicil`).
- Role / RoleLevel / Permission model with a numeric-ID permission check on individual routes (`authorize(<permissionId>)`).

### Education
- Upload PDF, video, or PowerPoint content (`education.controller.js: uploadSingleFile`). PDFs are converted page-by-page into images via the Adobe PDF Services SDK; videos/PowerPoints are uploaded to Cloudinary unmodified.
- Education sets that group multiple educations, with user assignment and per-page duration/reading-time tracking (`education_pages`, `addPageDuration`/`getPageDuration`).
- Education completion tracking per user (`education_users`, `education_set_users`).

### Exams & questions
- Three exam creation endpoints: theoretical (`/api/exam/teo`), image (`/api/exam/img`), and a combined/unified exam (`/api/exam/both`).
- Separate question pools for theoretical (`pool_teo`) and image (`pool_img`) questions, each with difficulty level and category classification, and bulk Excel upload (`poolTeo.controller.js: uploadQuestionsFromExcel`).
- Booklets that group pool questions (`booklets`, with `teo`/`img` type filters).
- Practice exams (separate model tree: `practice_exams`, `practice_exam_questions`, `practice_exam_users`).
- Illegal-move logging endpoints (`illegal_moves` table) — the client has an `examSecurity.jsx`/`fullScreenWrapper.jsx` component pair under `components/user/question/`, consistent with fullscreen/tab-switch enforcement, though the exact browser-side detection logic was not individually re-verified line by line.
- X-Ray image tooling on the client: `components/admin/pool/polygonEditor.jsx`, `imageMerger.jsx`, `imageBlender.jsx`, `makeWhiteTransparent.jsx`, and per-filter components under `components/user/question/x-ray/` (`blackWhite.jsx`, `negative.jsx`, `transparency.jsx`, `hi.jsx`, `o2.jsx`, `os.jsx`, `sen.jsx`, `multiFilter.jsx`). These files exist and are wired into the pool/question editors; their internal image-processing logic was not audited in detail.

### Reporting
- Excel export endpoints for education-set assignments, exam assignments, and exam results (`report.controller.js`, using the `xlsx` package).
- Result-detail endpoints by user/exam and by user/education-set, plus per-question-category breakdowns.

### Certificates
- `POST /api/certificate` renders a DOCX certificate per input row from `server/controllers/template.docx` using `docxtemplater` + `pizzip`, bundles the individual files plus one merged `combined.docx` into a ZIP with `jszip`, and streams the ZIP back as the response. **This endpoint does not persist rows to the `certificates` table** — no `Certificate.create` call exists anywhere in the codebase, so `GET /api/certificate` (which reads the `certificates` table) will not return certificates generated this way. This looks like an incomplete/in-progress feature, not a documentation gap.
- Supporting lookup tables: requesters, educators, course numbers, course types (each with its own CRUD endpoints).

### Gallery
- Category → subcategory → image hierarchy, image upload via Cloudinary (`multer-storage-cloudinary`).

### Admin panel
- Announcements, banned-user list (`BanSubs`), groups/institutions, role & permission management, activity log viewer, file-upload manager.

---

## Screenshots

No screenshot or image-preview files documenting the running application were found anywhere in the repository (only decorative marketing/background images under `client/public/*`, which are UI assets, not product screenshots). This section is intentionally omitted.

---

## Technology Stack

Each row is marked **Used** only if a real `import`/`require` of that package was found in application source (excluding `package.json`/lockfiles). Packages that are declared as dependencies but were not found in use are listed under "Declared but not found in use" below each table — this is a direct, verifiable finding, not a guess.

### Client

| Technology | Version (declared) | Used for |
|---|---|---|
| React | 19.1.0 | UI framework |
| Vite | 6.3.5 | Dev server / build tool |
| React Router DOM | 7.6.0 | Client-side routing (`App.jsx`) |
| Redux Toolkit / React-Redux | 2.8.1 / 9.2.0 | Global state (`src/store`, `src/features/slices`) |
| Axios | 1.9.0 | HTTP client (`src/features/services/axiosInstance.js`) |
| Bootstrap / Bootstrap Icons | 5.3.6 / 1.13.1 | CSS styling |
| `@tinymce/tinymce-react` | 6.1.0 | Rich-text editor, used in `components/admin/pool/questionEditor.jsx` |
| `@react-pdf-viewer/core` + `default-layout` | 3.12.0 | PDF rendering, used in `components/user/education/pdfViewer.jsx` |
| Recharts | 3.0.0 | (declared; not found imported in `src` at time of audit — see note below) |
| DayJS | 1.11.13 | Date handling |
| XLSX | 0.18.5 | Client-side Excel export components (`exportPoolTeo.jsx`, `exportPoolImg.jsx`, etc.) |
| `react-rnd` | 10.5.2 | Draggable/resizable UI (draggable overlay tooling) |
| `react-circular-progressbar` | 2.2.0 | Progress indicator |
| `file-saver` | 2.0.5 | Client-side file download helper |
| `mitt` | 3.0.1 | Event emitter (`features/services/eventEmitter.js`) |

**Declared but not found in use in `client/src`:** `@ckeditor/ckeditor5-build-classic`, `@ckeditor/ckeditor5-react`, `@ckeditor/ckeditor5-font`, `@lexical/react`, `lexical`, `react-quill`, `docx`, `react-pdf`, `pdfjs-dist` (only referenced in `vite.config.js` as an `optimizeDeps` entry, not imported in `src`), `exif-js`, `exifr`, `onnxruntime-web`. **Only `@tinymce/tinymce-react` is actually used as a rich-text editor** — CKEditor5, Lexical, and react-quill are all present as dependencies but none appear in any component import. If this project description assumed CKEditor5/Lexical are the active editors, that is not what the current code does.

### Server

| Technology | Version (declared) | Used for |
|---|---|---|
| Express | 5.1.0 | HTTP server / routing (`server.js`) |
| Sequelize + `mysql2` | 6.37.7 / 3.14.1 | ORM against MySQL (`data/db.js`, `models/`) |
| `jsonwebtoken` | 9.0.2 | Auth tokens (`middlewares/verifyToken.js`, `models/user.js`) |
| `bcryptjs` | 3.0.2 | Password hashing (`models/user.js` hooks) |
| `cloudinary` + `multer-storage-cloudinary` | 1.41.3 / 4.0.0 | File/image upload storage (`middlewares/upload.js`) |
| `@adobe/pdfservices-node-sdk` | 4.1.0 | PDF → JPEG page export (`controllers/education.controller.js`) |
| `docxtemplater` + `pizzip` | 3.65.2 / 3.2.0 | DOCX certificate templating (`controllers/certificate.controller.js`) |
| `jszip` | 3.10.1 | Zipping generated certificate files |
| `xlsx` | 0.18.5 | Excel import/export (bulk user/question upload, report export) |
| `speakeasy` + `qrcode` | 2.0.0 / 1.5.4 | TOTP 2FA and its QR provisioning code |
| `nodemailer` | 7.0.3 | Outbound email (`helpers/sendMail.js`) |
| `multer` | 1.4.5-lts.2 | `multipart/form-data` upload handling |
| `cors` | 2.8.5 | CORS middleware (`server.js`, currently configured with `origin: "*"`) |
| `dotenv` | 16.5.0 | Loads `.env` |
| `uuid` | 11.1.0 | Session IDs, unified-exam IDs |
| `axios` | 1.11.0 | Server-side HTTP (downloading remote files for Adobe processing) |

**Declared but not found in use anywhere in `server/` source:** `handlebars` (no `.hbs` files and no `require("handlebars")` in any `.js` file — despite `nodemailer` being wired up, emails are sent as plain `text`, not templated), `helmet` (never `require`d — no security headers are actually applied), `redis` (never `require`d — no caching layer is wired up), `geoip-lite` (imported in `controllers/session.controller.js` with `const geoip = require("geoip-lite")`, but no `geoip.lookup(...)` or any other call on it exists anywhere in the file or the rest of the server — the import is dead code, and no session or activity-log endpoint actually resolves IP-to-location data), `puppeteer`, `pdf-lib`, `pdf2pic`, `docx` (npm package), `adm-zip`, `mammoth` (imported in `certificate.controller.js` but the import is unused in that file's logic — no `mammoth.*` call was found), `archiver` (imported in `certificate.controller.js`, never invoked — `jszip` does the actual zipping), `point-in-polygon`, `pdf-parse`. If prior documentation described Redis caching, Helmet security headers, or GeoIP-based location tracking as active features, none of that is supported by the current code.

### Infrastructure

| Technology | Evidence in repo |
|---|---|
| Docker | `server/DockerFile` (note the unconventional filename — not `Dockerfile`) builds a `node:18-bullseye` image, installs `poppler-utils`, and runs `node server.js`. No `docker-compose.yml` was found anywhere in the repository. |
| Vercel | `client/vercel.json` contains a single SPA rewrite rule (`"/(.*)" → "/"`), confirming the client is set up for Vercel static/SPA hosting. No `vercel.json` exists under `server/`. |
| CI/CD | No `.github/workflows` directory or any other CI configuration exists in this repository. |

---

## Architecture

**Client ↔ Server communication.** The client's `axiosInstance.js` hardcodes the API base URL to `http://localhost:3000/api` — it does not read a Vite environment variable. A commented-out line in the same file references a production Render URL, but it is not active. No `VITE_*` variables or `import.meta.env` reads exist anywhere in `client/src`, so **there is currently no environment-driven way to point the client at a different API URL without editing this file**.

Every authenticated request needs two custom headers, both read from `localStorage` by an Axios request interceptor: `x-auth-token` (the JWT) and `x-session-id` (the active session's ID). This is not a standard `Authorization: Bearer` scheme.

**Document-generation pipeline (verified flow):**

1. **Education content (PDF/video/PPT) upload** — `POST /api/education/single` or `/multiple`. If the uploaded file is a PDF, the server authenticates against Adobe PDF Services, submits an `ExportPDFToImagesJob`, polls for the result, downloads each resulting page image, and re-uploads each page image to Cloudinary; the resulting URL array is stored on the `educations` row (`page_image_urls`). Videos and PowerPoint files are uploaded to Cloudinary as-is with no conversion.
2. **Certificate generation** — `POST /api/certificate`. For each input row, `template.docx` (in `server/controllers/`) is rendered with `docxtemplater` using `«PlaceholderName»`-style delimiters, producing one DOCX per row plus a manually-XML-spliced `combined.docx`. All files are bundled into a single ZIP with `jszip` and streamed back as the HTTP response (`Content-Type: application/zip`). Nothing is written to the `certificates` table by this flow (see [Certificates](#certificates) above).
3. Runtime artifacts of both flows are visible in the repo at `server/controllers/temp/`, `server/controllers/temp_certs/`, and `server/tmp/` (leftover generated `.docx`/`.pdf`/`.jpg` files from prior runs) — these are working directories, not something to deploy or check in.

**Client-side route guarding.** `client/src/pages/protectedRoute.jsx` defines a `ProtectedRoute` component (token + role check against `localStorage`, redirecting to `/login/user` or `/unauthorized`), but it is not imported or used anywhere else in the client — every route in `App.jsx`, including all `/admin/*` routes, is registered directly with no wrapping guard component. A `<Route path="/admin" element={<AdminLayout />}>` wrapper is present in `App.jsx` but commented out, with an adjacent Turkish comment indicating a session-timeout check was deliberately disabled ("for now turning off the 20-minute check"). In the current code, **authorization is enforced only by the server** (`verifyToken` + `authorize(permissionId)` middleware on each route) — the client does not gate navigation to admin pages.

---

## Folder Structure

```
TavAkademi/
├── readme.md
├── client/
│   ├── public/                  # Static marketing/background/logo images
│   ├── src/
│   │   ├── components/          # admin/, user/, home/ component trees (mirrors pages/)
│   │   ├── features/
│   │   │   ├── services/        # Axios API modules, one per resource
│   │   │   ├── slices/          # Redux Toolkit slices, one per resource
│   │   │   └── thunks/          # Async thunks, one per resource
│   │   ├── hooks/                # useExamSecurity.js, disariAktar.js
│   │   ├── layout/               # adminLayout, navbar, footer, scroll helpers
│   │   ├── pages/                # admin/, user/, home/ route-level page components
│   │   ├── store/                # store.js (configureStore)
│   │   ├── data/provinces.json
│   │   ├── assets/x-ray/         # X-ray filter reference images
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   ├── vite.config.js
│   └── vercel.json
└── server/
    ├── config/config.json        # Sequelize CLI connection config (see Security note)
    ├── controllers/              # One controller module per resource
    │   ├── template.docx         # Certificate DOCX template
    │   ├── temp/, temp_certs/    # Generated certificate artifacts (runtime output)
    ├── data/
    │   ├── db.js                 # Sequelize instance + connection
    │   └── dummy-data.js         # Seed data inserted on every startup (see Database)
    ├── helpers/                  # sendMail.js, logActivity.js
    ├── middlewares/               # authorize.js, upload.js, verifyToken.js
    ├── migrations/                # One Sequelize CLI migration file
    ├── models/                    # ~40 Sequelize model files + index.js (associations)
    ├── routes/                    # ~22 Express route modules, mounted in server.js
    ├── tmp/                       # Runtime scratch files (downloaded/converted PDFs)
    ├── pdfservices-api-credentials.json   # Present; see Security note — not read by current code
    ├── DockerFile
    ├── package.json
    └── server.js
```

---

## Installation

### Prerequisites

- Node.js (no engine version is pinned in either `package.json`; `server/DockerFile` uses `node:18-bullseye`)
- A reachable MySQL 8-compatible database
- A Cloudinary account (image/file storage)
- A Gmail account with an app password (outbound email via `nodemailer`, SMTP host is hardcoded to `smtp.gmail.com` in `helpers/sendMail.js`)
- Adobe PDF Services API credentials (for the PDF→image conversion path — see the Security note below; the current code does **not** read them from a file)

### Server setup

```bash
cd server
npm install
```

Create a `server/.env` file (see [Environment Variables](#environment-variables) for the full, verified list — do not copy real values from any existing `.env` or `pdfservices-api-credentials.json` file into version control).

```bash
npm run dev     # nodemon server.js — auto-restart on file changes
# or
npm start       # node server.js
```

**Read this before running the server for the first time:** `server.js` calls `sequelize.sync({ force: true })` on every startup, immediately followed by a seed function (`data/dummy-data.js`). `force: true` **drops and recreates every table on every server start**, discarding all existing data and replacing it with the bundled dummy dataset. There is no environment flag that disables this in the current code. Do not point this server at a database containing real data you want to keep — see [Troubleshooting](#troubleshooting).

**Adobe PDF Services credentials:** a `server/pdfservices-api-credentials.json` file is present in this repository. However, `server/controllers/education.controller.js` does not read that file — it constructs `ServicePrincipalCredentials` with values written directly in the source. Whichever of the two you use in your own deployment, treat both as sensitive: never commit real values, and rotate any credentials that may already be exposed in this codebase.

### Client setup

```bash
cd client
npm install
npm run dev
```

Opens the Vite dev server (default `http://localhost:5173`; not overridden in `vite.config.js`). Note from [Architecture](#architecture): the client currently talks to a hardcoded `http://localhost:3000/api`, so the server must be running locally on port 3000 for the client to function as-is.

### Docker (server only)

```bash
cd server
docker build -f DockerFile -t tavakademi-server .
docker run -p 3000:3000 --env-file .env tavakademi-server
```

Only `server/DockerFile` exists — there is no Dockerfile for the client and no `docker-compose.yml` anywhere in the repository, so a combined "one command" Docker startup is not something this repo currently provides.

---

## Environment Variables

Names only, collected from every `process.env.*` reference actually found in `server/` source. No values are reproduced here — replace placeholders with your own secrets in a local `.env` file that is never committed.

| Variable | Read in | Purpose |
|---|---|---|
| `PORT` | `server.js` | Port the Express app listens on |
| `JWT_PRIVATE_KEY` | `middlewares/verifyToken.js`, `models/user.js`, `controllers/auth.controller.js` | Secret used to sign/verify JWTs |
| `DB_NAME` | `data/db.js` | MySQL database name |
| `DB_USER` | `data/db.js` | MySQL username |
| `DB_PASSWORD` | `data/db.js` | MySQL password |
| `DB_HOST` | `data/db.js` | MySQL host |
| `CLOUDINARY_CLOUD_NAME` | `middlewares/upload.js` | Cloudinary account identifier |
| `CLOUDINARY_API_KEY` | `middlewares/upload.js` | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | `middlewares/upload.js` | Cloudinary API secret |
| `GMAIL_USER` | `helpers/sendMail.js` | Gmail SMTP account used to send mail |
| `GMAIL_PASSWORD` | `helpers/sendMail.js` | Gmail app password |
| `NODE_ENV` | `middlewares/authorize.js` | Gates whether detailed error messages are returned |

**Declared/referenced but not actually wired up:** `FRONTEND_URL` and `DB_URL` each appear only inside commented-out code blocks (`server.js` line 9, `data/db.js` lines 30–47) — setting them currently has no effect. A `server/config/config.json` file also exists with its own hardcoded `development`/`test`/`production` MySQL connection blocks for the Sequelize CLI (used by `sequelize-cli` migration commands, independent of the `.env`-driven runtime connection in `data/db.js`); it is listed in `server/.gitignore`, meaning it is not meant to be committed with real values.

**Client:** no `VITE_*` variable or `import.meta.env` read was found anywhere in `client/src`. A `client/.env` file exists in the repository, but its purpose could not be verified against the source — nothing in `client/src` appears to consume it.

**Security note:** both `server/pdfservices-api-credentials.json` and any `.env` files in this repository may contain real secrets. Their contents were deliberately not read or reproduced while writing this document. Separately, this audit found what appear to be **real, hardcoded credentials directly in source code** — a plaintext database password in `server/config/config.json`, and inline Adobe `clientId`/`clientSecret` values in `server/controllers/education.controller.js`. Neither value is reproduced here. If these are live credentials, they should be rotated and moved to environment variables.

---

## Available Scripts

### Server (`server/package.json`)

| Script | Command | Behavior |
|---|---|---|
| `npm start` | `node server.js` | Runs the server once. **Destructive on every run**: drops and recreates all tables (`sequelize.sync({ force: true })`) and reseeds dummy data. |
| `npm run dev` | `nodemon server.js` | Same startup behavior as above, restarting on file changes. **Equally destructive** — every nodemon restart wipes the database again. |

No `test`, `build`, or `lint` script is defined in `server/package.json`.

### Client (`client/package.json`)

| Script | Command | Behavior |
|---|---|---|
| `npm run dev` | `vite` | Starts the Vite dev server with HMR. |
| `npm run build` | `vite build` | Produces a production build in `client/dist/`. |
| `npm run lint` | `eslint .` | Runs ESLint using `client/eslint.config.js`. |
| `npm run preview` | `vite preview` | Serves the built `dist/` output locally. |

No `test` script is defined in `client/package.json`, and no test framework (Jest, Vitest, etc.) appears in either package's dependencies.

---

## Development

1. Start MySQL and populate `server/.env` (see above).
2. `cd server && npm run dev` — note every restart reseeds the database with `data/dummy-data.js`'s content (inspect that file to see exactly what test accounts/records it creates).
3. `cd client && npm run dev`, browse to the Vite dev URL.
4. Because the client's API base URL is hardcoded (see Architecture), the server must be reachable at `http://localhost:3000/api` unless you edit `client/src/features/services/axiosInstance.js`.

## Build

- **Client**: `npm run build` in `client/` → static assets in `client/dist/`, deployable to any static host; `vercel.json`'s SPA rewrite confirms Vercel is the intended target.
- **Server**: no build step — it runs directly from source via `node server.js` (or inside the Docker image described above).

## Deployment

Only what is directly verifiable from files in this repo:

- **Client**: `client/vercel.json` configures an SPA rewrite, consistent with deployment to Vercel. No Vercel project settings (env vars, build command overrides) are present in the repo beyond this file.
- **Server**: `server/DockerFile` builds a runnable container image (`node:18-bullseye`, installs `poppler-utils`, runs `node server.js`, exposes port `3000`). No `docker-compose.yml`, Kubernetes manifests, or other hosting-provider configuration files exist in the repository, so beyond "build and run this Docker image somewhere," no specific hosting platform can be confirmed from the code.
- No `.github/workflows` or other CI/CD configuration exists, so there is no automated build/test/deploy pipeline in this repository as it stands.

---

## API

Base path: `/api` (mounted in `server.js`). Every route below was read directly from the corresponding file in `server/routes/`. "Auth" = `verifyToken` middleware (valid JWT + active session required); "Permission N" = an additional `authorize(N)` permission-ID check. Routes with neither are unauthenticated as implemented.

### Auth — `/api/auth` (`auth.routes.js`)

| Method | Path | Auth | Purpose |
|---|---|---|---|
| POST | `/upload-user-images` | — | Bulk-match uploaded images to users by filename (`sicil.jpg`) |
| POST | `/setup-2fa` | — | Generate TOTP secret + QR code for a user |
| POST | `/verify-2fa` | — | Verify TOTP code, create session, issue JWT |
| POST | `/bulk-register` | Auth, Perm 28 | Bulk-register users from an uploaded Excel file |
| POST | `/admin-login` | — | Password check for admin login (role must be set); 2FA still required after |
| POST | `/register` | Auth, Perm 1 | Register a single user (admin-initiated) |
| POST | `/login` | — | Password check for user login; 2FA still required after |
| POST | `/logout` | Auth | Deactivate the current session |
| POST | `/password-email` | — | Send a password-reset email with a JWT link |
| PUT | `/update-password/:token` | — | Reset password using the emailed token |

### User — `/api/user` (`user.routes.js`)

| Method | Path | Auth | Purpose |
|---|---|---|---|
| POST | `/excel` | Auth | Export users to Excel |
| GET | `/details/:id` | Auth | Get one user's details |
| GET | `/` | Auth | List all users |
| PUT | `/aktifpasif` | Auth | Toggle a user's active/inactive status |
| PUT | `/update/:id` | Auth | Update a user's details/photo |
| DELETE | `/` | Auth, Perm 28 | Delete user(s) |

### Gallery — `/api/gallery` (`gallery.routes.js`)

| Method | Path | Auth | Purpose |
|---|---|---|---|
| GET | `/` | Auth | List galleries |
| GET | `/:id` | Auth | Get gallery by ID |
| GET | `/cat/:imageCatId` | Auth | Filter by category |
| GET | `/sub/:imageSubCatId` | Auth | Filter by subcategory |
| POST | `/single` | Auth | Upload one image |
| POST | `/multiple` | Auth | Upload multiple images |
| DELETE | `/:id` | Auth | Delete a gallery image |
| PUT | `/:id` | Auth | Update a gallery image |

### Gallery categories — `/api/galleryCat` (`galleryCat.routes.js`)

| Method | Path | Auth | Purpose |
|---|---|---|---|
| GET | `/` | Auth | List categories |
| POST | `/` | Auth | Create category |
| PUT | `/:id` | Auth | Update category |
| DELETE | `/:id` | Auth | Delete category |
| GET | `/sub` | Auth | List all subcategories |
| GET | `/sub/:imageCatId` | Auth | List subcategories by category |
| POST | `/sub` | Auth | Create subcategory |
| PUT | `/sub/:id` | Auth | Update subcategory |
| DELETE | `/sub/:id` | Auth | Delete subcategory |

### Education — `/api/education` (`education.routes.js`)

| Method | Path | Auth | Purpose |
|---|---|---|---|
| GET | `/` | Auth | List educations |
| GET | `/complete` | Auth | List completed educations |
| GET | `/type/:type` | Auth | Filter by type |
| GET | `/edusetid/:id` | Auth | Educations for an education set |
| PUT | `/complete/:id` | Auth | Mark education completed for the current user |
| POST | `/single` | — | Upload one file (triggers Adobe PDF conversion if PDF) |
| POST | `/pages/:id` | — | Record page-duration data |
| GET | `/pages/:id` | Auth | Get page-duration data |
| POST | `/multiple` | — | Upload multiple files |
| DELETE | `/:id` | Auth | Delete an education |
| PUT | `/:id` | Auth, Perm 30 | Update an education |
| GET | `/:id` | Auth | Get education by ID |

Note: `/single`, `/pages/:id` (POST), and `/multiple` have their `verifyToken`/`authorize` calls commented out in the current source — they are effectively unauthenticated as written.

### Education Sets — `/api/educationset` (`educationSet.routes.js`)

| Method | Path | Auth | Purpose |
|---|---|---|---|
| POST | `/` | Auth, Perm 6 | Create education set |
| POST | `/assign` | Auth, Perm 6 | Assign a set to users |
| GET | `/user` | Auth | Sets assigned to current user |
| GET | `/complete` | — | List completed sets |
| PUT | `/complete/:id` | Auth | Mark a set completed |
| GET | `/:id` | Auth | Get set by ID |
| GET | `/` | Auth, Perm 11 | List all sets |
| DELETE | `/:id` | Auth, Perm 31 | Delete a set |
| PUT | `/:id` | Auth, Perm 31 | Update a set |

### Booklets — `/api/booklet` (`booklet.routes.js`)

| Method | Path | Auth | Purpose |
|---|---|---|---|
| GET | `/` | Auth, Perm 2 | List booklets |
| GET | `/type/:type` | Auth, Perm 2 | Filter by type |
| GET | `/teo` | Auth, Perm 2 | List theoretical booklets |
| GET | `/img` | Auth, Perm 2 | List image booklets |
| GET | `/:id` | Auth, Perm 2 | Get booklet by ID |
| POST | `/` | Auth, Perm 2 + 36 | Create booklet |
| PUT | `/:id` | Auth, Perm 2 | Update booklet |
| DELETE | `/:id` | Auth, Perm 2 + 37 | Delete booklet |

### Question Pool — Theoretical — `/api/poolTeo` (`poolTeo.routes.js`)

| Method | Path | Auth | Purpose |
|---|---|---|---|
| GET | `/` | Auth, Perm 2 | List questions |
| GET | `/:id` | Auth | Get question by ID |
| POST | `/upload-questions` | Auth | Bulk upload from Excel |
| POST | `/excel` | Auth | Export questions to Excel |
| POST | `/` | Auth | Create question |
| PUT | `/:id` | Auth | Update question |
| DELETE | `/:id` | Auth | Delete question |
| GET | `/booklet/:bookletId` | Auth | Questions by booklet |

### Question Pool — Image — `/api/poolImg` (`poolImg.routes.js`)

| Method | Path | Auth | Purpose |
|---|---|---|---|
| GET | `/booklet/:bookletId` | Auth | Questions by booklet |
| GET | `/:id` | Auth | Get question by ID |
| GET | `/` | Auth | List questions |
| POST | `/excel` | Auth | Export to Excel |
| POST | `/` | Auth | Create question |
| PUT | `/:id` | Auth | Update question |
| DELETE | `/:id` | Auth | Delete question |

### Exams — `/api/exam` (`exam.routes.js`)

| Method | Path | Auth | Purpose |
|---|---|---|---|
| POST | `/teo` | Auth, Perm 5 | Create theoretical exam |
| POST | `/img` | Auth, Perm 5 | Create image exam |
| POST | `/both` | Auth, Perm 5 | Create combined exam |
| GET | `/` | Auth, Perm 10 | List all exams |
| GET | `/user` | Auth | Exams assigned to current user |
| GET | `/:examId` | Auth | Get exam by ID |
| DELETE | `/:examId` | Auth | Delete exam |
| GET | `/user/teo` | Auth | Current user's theoretical exams |
| GET | `/user/img` | Auth | Current user's image exams |
| GET | `/user/both` | Auth | Current user's combined exams |

### Questions (exam-taking) — `/api/question` (`question.routes.js`)

| Method | Path | Auth | Purpose |
|---|---|---|---|
| GET | `/teo/:examId` | Auth | Get theoretical questions for an exam |
| GET | `/img/:examId` | Auth | Get image questions for an exam |
| GET | `/both/teo/:examId` | Auth | Combined exam's theoretical questions |
| GET | `/both/img/:examId` | Auth | Combined exam's image questions |
| POST | `/answer/teo` | Auth | Submit theoretical answers |
| POST | `/answer/img` | Auth | Submit image answers |

### Reports — `/api/report` (`report.routes.js`)

| Method | Path | Auth | Purpose |
|---|---|---|---|
| POST | `/excel-education-sets` | Auth | Export set assignments to Excel |
| POST | `/excel-assign-teo` | Auth | Export theoretical exam assignments |
| POST | `/excel-assign-img` | Auth | Export image exam assignments |
| POST | `/excel-teo` | Auth | Export theoretical results |
| POST | `/excel-img` | Auth | Export image results |
| GET | `/assign-exams` | Auth | List exam assignments |
| GET | `/assign-education-sets` | Auth | List set assignments |
| GET | `/result-detail/:userId/:examId` | Auth | Exam result detail |
| GET | `/education-result-detail/:userId/:educationSetId` | Auth | Education-set result detail |
| GET | `/question-category-result/:userId/:examId` | Auth | Results by question category |
| GET | `/img-question-result/:userId/:examId` | Auth | Image question results |
| GET | `/teo-question-result/:userId/:examId` | Auth | Theoretical question results |
| GET | `/education-set-result` | Auth | All users' education-set results |
| GET | `/teo-result` | Auth | All users' theoretical results |
| GET | `/img-result` | Auth | All users' image results |
| GET | `/user-teo-result` | Auth | Current user's theoretical results |
| GET | `/user-img-result` | Auth | Current user's image results |
| DELETE | `/delete-assign-exam/:examId` | Auth | Remove an exam assignment |
| DELETE | `/delete-assign-education-set/:educationSetId/:userId` | Auth | Remove a set assignment |
| DELETE | `/delete-user-education-result` | Auth | Delete a user's education result |
| DELETE | `/delete-user-result` | Auth | Delete a user's exam result |

### Question categories / difficulty — `/api/quedif` (`queDif.routes.js`)

| Method | Path | Auth | Purpose |
|---|---|---|---|
| GET | `/dif` | Auth | List difficulty levels |
| POST | `/dif` | Auth | Create difficulty level |
| DELETE | `/dif/:id` | Auth | Delete difficulty level |
| GET | `/` | Auth, Perm 15 | List question categories |
| POST | `/` | Auth | Create question category |
| DELETE | `/:id` | Auth | Delete question category |

### Banned users — `/api/bansubs` (`banSubs.routes.js`)

| Method | Path | Auth | Purpose |
|---|---|---|---|
| GET | `/` | Auth | List banned users |
| DELETE | `/:id` | Auth | Remove a ban |
| POST | `/` | Auth | Add a ban |
| PUT | `/:id` | Auth | Update a ban |

### Groups & institutions — `/api/grpinst` (`grpInst.routes.js`)

| Method | Path | Auth | Purpose |
|---|---|---|---|
| GET / POST | `/groups`, `/groups/:id` | Auth, Perm 17 | CRUD for groups |
| GET / POST | `/institutions`, `/institutions/:id` | Auth, Perm 17 | CRUD for institutions |

### Sessions — `/api/session` (`session.routes.js`)

| Method | Path | Auth | Purpose |
|---|---|---|---|
| GET | `/` | Auth, Perm 18 | List sessions |
| PUT | `/deactivate/:sessionId` | Auth, Perm 18 | Force-deactivate a session |
| PUT | `/activate/:sessionId` | Auth, Perm 18 | Reactivate a session |

### Announcements — `/api/announcement` (`announcement.routes.js`)

| Method | Path | Auth | Purpose |
|---|---|---|---|
| GET | `/user` | Auth | Announcements for current user |
| GET | `/` | Auth, Perm 19 | List all announcements |
| POST | `/` | Auth, Perm 19 | Create announcement |
| DELETE | `/:id` | Auth, Perm 19 | Delete announcement |
| PUT | `/:id` | Auth, Perm 19 | Update announcement |

### Roles & permissions — `/api/role` (`role.routes.js`)

| Method | Path | Auth | Purpose |
|---|---|---|---|
| GET/POST/PUT | `/role-level-perm`, `/role-level-perm/:id` | Auth, Perm 21 | Manage permission-to-role-level links |
| GET/POST/PUT/DELETE | `/role-level`, `/role-level/:id` | Auth, Perm 21 | Manage role levels |
| GET | `/permissions` | Auth, Perm 21 | List permissions |
| GET | `/` | Auth, Perm 21 | List roles |
| PUT | `/assign` | Auth, Perm 21 | Assign a role to a user |
| POST | `/` | Auth, Perm 21 | Create role |
| PUT | `/:id` | Auth, Perm 21 | Update role |
| DELETE | `/:id` | Auth, Perm 21 | Delete role |

### Activity log — `/api/logactivity` (`logActivity.routes.js`)

| Method | Path | Auth | Purpose |
|---|---|---|---|
| GET | `/` | Auth | List activity log entries |

### File uploads (documents) — `/api/uploadfile` (`uploadFile.routes.js`)

| Method | Path | Auth | Purpose |
|---|---|---|---|
| GET | `/downloaded` | Auth, Perm 9 + 20 | List users who downloaded a file |
| POST | `/` | Auth, Perm 9 + 20 | Upload a single file |
| POST | `/multiple` | Auth, Perm 9 + 20 | Upload multiple files |
| GET | `/manager` | Auth, Perm 9 + 20 | List files uploaded by managers |
| GET | `/user` | Auth | Files visible to current user |
| DELETE | `/` | Auth, Perm 9 | Delete a file |
| PUT | `/downloaded` | Auth | Mark a file as downloaded |

### Certificates — `/api/certificate` (`certificate.routes.js`)

| Method | Path | Auth | Purpose |
|---|---|---|---|
| GET | `/complete/:educationSetId` | Auth, Perm 7 | Users who completed a set (certificate candidates) |
| GET | `/` | Auth, Perm 7 | List `certificates` table rows (see note above — likely always empty) |
| POST | `/` | Auth, Perm 7 | Generate certificate ZIP (see Architecture) |
| GET | `/requesters` `/educators` `/courseno` `/coursetype` | Auth, Perm 7 | Lookup lists |
| POST | `/requester` `/educator` `/courseno` `/coursetype` | Auth, Perm 7 | Create lookup entries |
| DELETE | `/requester/:id` `/educator/:id` `/courseno/:id` `/coursetype/:id` | Auth, Perm 7 | Delete lookup entries |

### Practice exams — `/api/practiceexam` (`practiceExam.routes.js`)

| Method | Path | Auth | Purpose |
|---|---|---|---|
| GET | `/question/:examId` | Auth | Get questions for a practice exam |
| GET | `/` | Auth | List practice exams |
| POST | `/` | Auth | Create practice exam |
| DELETE | `/:id` | Auth | Delete practice exam |
| PUT | `/:id` | Auth | Update practice exam |

### Illegal moves — `/api/illegalmoves` (`illegalMoves.routes.js`)

| Method | Path | Auth | Purpose |
|---|---|---|---|
| GET | `/` | Auth | List logged illegal moves |
| POST | `/` | Auth | Log an illegal move |
| DELETE | `/:id` | Auth | Delete a logged move |

---

## Database

MySQL via Sequelize. Models are defined in `server/models/*.js` and wired together in `server/models/index.js`. **Two coexisting schema-management mechanisms were found**: (1) Sequelize model definitions applied destructively via `sequelize.sync({ force: true })` on every server start, and (2) a `server/migrations/` folder containing exactly one Sequelize CLI migration (`20250714065210-add-primary-key-to-rolelevelperms.js`, which fixes the composite primary key on `rolelevelperms`). Because `force: true` recreates tables from the model definitions on every startup, that single migration's effect would be reapplied automatically by `sync()` rather than by the migration itself in practice — the two mechanisms are not being used consistently together.

### Core tables and key relationships (from `models/index.js`)

| Table (model) | Notes |
|---|---|
| `users` | Core identity: `tcno`, `sicil` (employee no.), `kullanici_adi` (username), `sifre` (bcrypt-hashed password), `roleId`, `is2FAEnabled`, `twoFactorSecret`, `grupId`/`lokasyonId` FKs. Has `createAuthToken()` instance method and `beforeCreate`/`beforeUpdate` hooks that hash `sifre`. |
| `roles`, `role_levels`, `permissions`, `rolelevelperms` | `users.roleId → roles`; `roles.roleLevelId → role_levels`; `role_levels` ↔ `permissions` many-to-many through `rolelevelperms` — this join table is what `authorize(permissionId)` checks. |
| `groups`, `institutions` | `users` belongs to one group and one institution (aliased `grup`, `lokasyon`). |
| `sessions` | One row per active/inactive login session; `sessions.userId → users`; checked on every authenticated request. |
| `education_sets`, `educations`, `edu_and_edu_sets` | `educations` ↔ `education_sets` many-to-many through `edu_and_edu_sets`. |
| `education_pages` | `education_pages.educationId → educations`; stores per-page duration data. |
| `education_users`, `education_set_users` | Many-to-many assignment/completion tracking between `users` and `educations`/`education_sets`. |
| `exams`, `exam_users`, `exam_questions` | `exams` ↔ `users` many-to-many through `exam_users`; `exams.bookletId → booklets`; `exam_questions` links to `pool_teo`/`pool_img` polymorphically via `questionId` (no DB-level FK constraint — `constraints: false` in the association). |
| `pool_teo`, `pool_img` | Question pools; each `belongsTo booklets`, `difLevels`, and (image pool) `question_categories`. |
| `question_categories`, `dif_levels` | Lookup/classification tables for pool questions. |
| `user_teo_answers`, `user_img_answers` | Per-user, per-question answer records, linked to `users`, `exams`, and the relevant pool table. |
| `booklets` | Groups `exams`, `pool_teo`, and `pool_img` rows by `bookletId`. |
| `practice_exams`, `practice_exam_questions`, `practice_exam_users` | Separate practice-exam model tree, many-to-many through the two join tables. |
| `galleries`, `gallery_cats`, `gallery_sub_cats` | Category → subcategory → image hierarchy. |
| `certificates` | Certificate records — defined but not populated by the current certificate-generation endpoint (see Certificates above). |
| `requesters`, `educators`, `course_nos`, `course_types` | Lookup tables consumed by certificate generation input. |
| `announcements` | `belongsTo` both `institutions` and `groups`. |
| `activity_logs` | Free-form action/category log, written by `helpers/logActivity.js`. |
| `illegal_moves` | `belongsTo users` (aliased `user`); exam-security violation log. |
| `ban_subs` | Banned-user records. |
| `upload_files`, `upload_file_users` (table names `uploadfiles`/`uploadfileusers`) | Files ↔ users many-to-many, tracking who can access/downloaded which uploaded file. |

Table names above are the Sequelize-pluralized defaults as defined in each model's `sequelize.define(...)` call; a few models use explicit lowercase join-table names (`"rolelevelperms"`, `"uploadfileusers"`) rather than Sequelize's automatic pluralization.

---

## Authentication

Verified end-to-end from `controllers/auth.controller.js`, `models/user.js`, and `middlewares/verifyToken.js`:

1. **`POST /api/auth/login`** (or `/admin-login`) — checks `kullanici_adi` (username) + bcrypt-compared `sifre` (password). On success it does **not** issue a token yet; it returns `{ userId, is2FAEnabled }`. `/admin-login` additionally requires the user to have a non-null, non-zero `roleId`.
2. **`POST /api/auth/verify-2fa`** — verifies a `speakeasy` TOTP code against the user's stored `twoFactorSecret` (provisioned earlier via `/setup-2fa`, which returns a `qrcode` data URL). 2FA is unconditional in the current code — there is no branch that skips it. On success, any existing active session for that user is destroyed, a new `sessions` row is created with a fresh UUID, and a JWT is signed (`User.prototype.createAuthToken`, 24-hour expiry, payload `{ id, roleId, kullanici_adi }`, signed with `JWT_PRIVATE_KEY`).
3. **Subsequent requests** — the client sends the JWT as an `x-auth-token` header and the session UUID as `x-session-id` (not a standard `Authorization: Bearer` header). `middlewares/verifyToken.js` verifies the JWT, loads the user, and separately confirms a matching **active** row exists in `sessions` — a valid-but-logged-out JWT is rejected even before expiry, because logout (`POST /api/auth/logout`) flips `isActive` to `false` rather than revoking the token itself.
4. **Authorization** — `middlewares/authorize.js` takes a numeric permission ID, loads the requesting user's `role → roleLevel`, and checks whether that role level has the given permission via the `rolelevelperms` join table. It is applied per-route (see the API tables above), sometimes multiple permission IDs stacked on one route (e.g. `authorize(9), authorize(20)`), which both must pass since they run as separate sequential middleware.
5. **Password reset** — `/password-email` emails a JWT (1-hour expiry) embedded in a link. That link's host is **hardcoded** to a specific Vercel deployment URL in `auth.controller.js`, not derived from an environment variable. `/update-password/:token` verifies that JWT and updates `sifre` (re-hashed by the model's `beforeUpdate` hook).

---

## Configuration

- **`server/config/config.json`** — Sequelize-CLI-style `development`/`test`/`production` blocks (used by `sequelize-cli` commands such as migrations, independent from the `.env`-driven connection `data/db.js` uses at runtime). It is listed in `.gitignore`.
- **`server/data/db.js`** — the actual runtime DB connection, built from `DB_NAME`/`DB_USER`/`DB_PASSWORD`/`DB_HOST` environment variables, `dialect: "mysql"`, logging disabled.
- **`client/vite.config.js`** — minimal: the React plugin plus one `optimizeDeps.include` entry for `pdfjs-dist`'s worker.
- **CORS** — `server.js` applies `cors({ origin: "*", methods: ["GET","POST","PUT","DELETE"] })`, i.e. all origins are currently allowed.

---

## Troubleshooting

Grounded in the specific behaviors found above:

- **"My data disappeared after restarting the server."** This is expected with the current code: `server.js` runs `sequelize.sync({ force: true })` followed by seed data on every single startup (`npm start` and `npm run dev`, including every `nodemon` auto-restart). Do not run this against a database you care about without first removing/guarding that call.
- **"PDF uploads fail / Adobe errors."** `education.controller.js` uses hardcoded Adobe `ServicePrincipalCredentials` rather than reading `server/pdfservices-api-credentials.json`. If those inline credentials are invalid, expired, or rate-limited, every PDF upload (`/api/education/single` with a `.pdf` file) will fail; video/PowerPoint uploads are unaffected since they skip the Adobe path entirely.
- **"MySQL connection refused / authentication error."** Check `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME` in `server/.env`. Separately, if you use `sequelize-cli` for migrations, it reads `server/config/config.json` instead — the two configs are independent and can drift out of sync.
- **"Generated certificates never show up in the certificate list."** `GET /api/certificate` reads the `certificates` table, but `POST /api/certificate` (the generator) never writes to it — this is a real gap in the current implementation, not a client bug.
- **"CKEditor / Lexical don't seem to do anything."** Both are declared dependencies but no component in `client/src` imports them. The only rich-text editor actually wired up is TinyMCE (`components/admin/pool/questionEditor.jsx`).
- **"Client can't reach a non-local API."** `axiosInstance.js` hardcodes `http://localhost:3000/api`; there is no environment variable to override it in the current code — you must edit that file for any non-local deployment.
- **"Admin pages are reachable without logging in via direct URL."** By design in the current code — see [Architecture](#architecture): the client's `ProtectedRoute` component and the `AdminLayout` route wrapper are present but not active in `App.jsx`. Server-side `verifyToken`/`authorize` middleware is the only real access control.
- **CORS is fully open** (`origin: "*"`) — tighten this before any production exposure.

---

## License

No `LICENSE` file exists anywhere in this repository. `server/package.json` declares `"license": "ISC"` in its metadata field, but `client/package.json` declares no license field at all. Without a `LICENSE` file, the project's actual licensing terms cannot be confirmed from the repository alone.

---

## Contact

No contact information, contributor list, or issue-tracker URL was found in any source file in this repository (the previous version of this document listed a name/email that could not be verified against any file in the codebase, so it has been removed).
