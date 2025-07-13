import "bootstrap-icons/font/bootstrap-icons.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import React, { useState, useEffect } from "react";
import emitter from "./features/services/eventEmitter";
import UnauthorizedModal from "./pages/unAuthorizedModal";

import UserRegister from "./pages/user/register";
import UserLogin from "./pages/user/login";
import UserPasswordEmail from "./pages/user/passwordEmail";
import UserUpdatePassword from "./pages/user/updatePassword";
import UserDetails from "./pages/user/details";
import UserVerifyCode from "./pages/user/verifyCode";
import UserImageGallery from "./pages/user/imageGallery";
import UserEducationSet from "./pages/user/educationSet";
import UserEducation from "./pages/user/education";
import UserEducationSetDetail from "./pages/user/educationDetail";
import UserTeoExams from "./pages/user/teoExams";
import UserImgExams from "./pages/user/imgExams";
import UserBothExams from "./pages/user/bothExams";
import UserTeoQuestions from "./pages/user/teoQuestions";
import UserImgQuestions from "./pages/user/imgQuestions";
import UserBothImgQuestions from "./pages/user/bothImgQuestions";
import UserBothTeoQuestions from "./pages/user/bothTeoQuestions";
import UserExamInfo from "./pages/user/exam-info";
import UserDownloads from "./pages/user/downloads";
import UserPanelPage from "./pages/user/userPanel";
import UserTeoExamReport from "./pages/user/teoExamReport";
import UserImgExamReport from "./pages/user/imgExamReport";
import UserPracticeExam from "./pages/user/practiceExam";
import UserPracticeQuestions from "./pages/user/practiceQuestions";
import UserAnnouncement from "./pages/user/announcement";

import AdminLayout from "./layout/adminLayout"; // yukarıdaki componenti koyduğun dosya

import AdminCreateGallery from "./pages/admin/createGallery";
import AdminImageGallery from "./pages/admin/imageGallery";
import AdminUpdateGallery from "./pages/admin/updateGallery";
import AdminCreateEducation from "./pages/admin/createEducation";
import AdminEducation from "./pages/admin/education";
import AdminUpdateEducation from "./pages/admin/updateEducation";
import AdminCreatePoolImg from "./pages/admin/createPoolImg";
import AdminUpdatePoolImg from "./pages/admin/updatePoolImg";
import AdminPoolImg from "./pages/admin/poolImg";
import AdminCreatePoolTeo from "./pages/admin/createPoolTeo";
import AdminUpdatePoolTeo from "./pages/admin/updatePoolTeo";
import AdminPoolTeo from "./pages/admin/poolTeo";
import AdminTeoBooklets from "./pages/admin/teoBooklets";
import AdminImgBooklets from "./pages/admin/imgBooklets";

import AdminCreateTeoExam from "./pages/admin/createTeoExam";
import AdminCreateImgExam from "./pages/admin/createImgExam";
import AdminCreateGalleryCat from "./pages/admin/createGalleryCat";
import AdminGalleryCat from "./pages/admin/category";
import AdminUnifiedExam from "./pages/admin/unifiedExam";
import AdminCreateEducationSet from "./pages/admin/createEducationSet";
import AdminEducationDetail from "./pages/admin/educationDetail";
import AdminEducationSet from "./pages/admin/educationSet";
import AdminEducationSetDetail from "./pages/admin/educationSetDetail";
import AdminPageDuration from "./pages/admin/pageDuration";
import AdminAssignEducationSet from "./pages/admin/assignEducationSet";
import AdminTeoExamReports from "./pages/admin/teoExamReports";
import AdminImgExamReports from "./pages/admin/imgExamReports";
import AdminTeoReportDetail from "./pages/admin/teoReportDetail";
import AdminImgReportDetail from "./pages/admin/imgReportDetail";
import AdminEducationSetReports from "./pages/admin/educationSetReports";
import AdminEducationReportDetail from "./pages/admin/educationReportDetail";
import AdminQueDifPage from "./pages/admin/queDif";
import AdminImgQuestionResult from "./pages/admin/imgQuestionResult";
import AdminTeoQuestionResult from "./pages/admin/teoQuestionResult";
import AdminBanSubs from "./pages/admin/banSubs";
import AdminGrpInst from "./pages/admin/grpInst";
import AdminSessions from "./pages/admin/sessions";
import AdminAnnouncement from "./pages/admin/announcement";
import AdminRole from "./pages/admin/role";
import AdminLogActivity from "./pages/admin/logActivity";
import AdminUploadFile from "./pages/admin/uploadFile";
import AdminDownloaded from "./pages/admin/downloaded";
import AdminCertificate from "./pages/admin/certificate";
import AdminCertificateResult from "./pages/admin/certificateResult";
import AdminBulkRegister from "./pages/admin/bulkRegister";
import AdminBulkPoolTeo from "./pages/admin/bulkPoolTeo";
import AdminUserUpdateDetail from "./pages/admin/updateDetail";
import AdminAuthorized from "./pages/admin/authorized";
import AdminLogin from "./pages/admin/login";
import AdminPanelPage from "./pages/admin/adminPanel";
import AdminPracticeExam from "./pages/admin/practiceExam";
import Setup2FAPage from "./pages/user/setup2FA";
import AdminVerify2FA from "./pages/admin/verify2FA";
import AdminSetup2FA from "./pages/admin/setup2FA";
import AdminCertificateInputs from "./pages/admin/certificateInputs";

import HomePage from "./pages/home/homePage";
import About from "./pages/home/about";
import Contact from "./pages/home/contact";

import NotFound from "./pages/home/notFound";
function App() {
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const showModalHandler = () => setShowModal(true);
    emitter.on("showUnauthorizedModal", showModalHandler);

    return () => {
      emitter.off("showUnauthorizedModal", showModalHandler);
    };
  }, []);
  const handleCloseModal = () => {
    setShowModal(false);
    window.history.back(); // sayfayı geri gönder
  };
  return (
    <Router>
      {showModal && <UnauthorizedModal onClose={handleCloseModal} />}

      <div>
        <Routes>
          {/* kullanıcı sayfaları */}
          <Route path="*" element={<NotFound />} />
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login/user" element={<UserLogin />} />
          <Route path="/verify-2fa" element={<UserVerifyCode />} />
          <Route path="/password-email" element={<UserPasswordEmail />} />
          <Route
            path="/update-password/:token"
            element={<UserUpdatePassword />}
          />
          <Route path="/details" element={<UserDetails />} />
          <Route path="/image-gallery" element={<UserImageGallery />} />
          <Route path="/education-set" element={<UserEducationSet />} />
          <Route path="/education/:id" element={<UserEducation />} />
          <Route path="/announcements" element={<UserAnnouncement />} />
          <Route
            path="/education-set-detail/:id"
            element={<UserEducationSetDetail />}
          />
          <Route path="exam-info" element={<UserExamInfo />} />
          <Route path="/teo-exams" element={<UserTeoExams />} />
          <Route path="/img-exams" element={<UserImgExams />} />
          <Route path="/both-exams" element={<UserBothExams />} />
          <Route path="/practice-exams" element={<UserPracticeExam />} />
          <Route path="/teo-questions/:examId" element={<UserTeoQuestions />} />
          <Route path="/img-questions/:examId" element={<UserImgQuestions />} />
          <Route
            path="/both-teo-questions/:examId"
            element={<UserBothTeoQuestions />}
          />
          <Route
            path="/both-img-questions/:examId"
            element={<UserBothImgQuestions />}
          />
          <Route path="/downloads" element={<UserDownloads />} />
          <Route path="/user-panel" element={<UserPanelPage />} />
          <Route path="/teo-exam-report" element={<UserTeoExamReport />} />
          <Route path="/img-exam-report" element={<UserImgExamReport />} />

          <Route
            path="/practice-questions/:examId"
            element={<UserPracticeQuestions />}
          />
          <Route path="/setup-2fa" element={<Setup2FAPage />} />

          {/* admin sayfaları */}

          {/* şimdilik 20 dk lık kontrolü kapatıyorum */}
          {/* <Route path="/admin" element={<AdminLayout />}> */}
          <Route
            path="/admin/gallery-cat"
            element={<AdminCreateGalleryCat />}
          />

          <Route path="/admin/image-gallery" element={<AdminImageGallery />} />
          <Route
            path="/admin/update-gallery/:id"
            element={<AdminUpdateGallery />}
          />

          <Route
            path="/admin/create-education"
            element={<AdminCreateEducation />}
          />
          <Route path="/admin/education" element={<AdminEducation />} />
          <Route path="/admin/pool-img" element={<AdminPoolImg />} />
          <Route
            path="/admin/create-pool-img"
            element={<AdminCreatePoolImg />}
          />
          <Route
            path="/admin/update-pool-img/:id"
            element={<AdminUpdatePoolImg />}
          />
          <Route
            path="/admin/update-education/:id"
            element={<AdminUpdateEducation />}
          />
          <Route path="/admin/pool-teo" element={<AdminPoolTeo />} />
          <Route
            path="/admin/create-pool-teo"
            element={<AdminCreatePoolTeo />}
          />
          <Route
            path="/admin/update-pool-teo/:id"
            element={<AdminUpdatePoolTeo />}
          />

          <Route
            path="/admin/create-teo-exam"
            element={<AdminCreateTeoExam />}
          />
          <Route
            path="/admin/create-img-exam"
            element={<AdminCreateImgExam />}
          />
          <Route
            path="/admin/create-both-exam"
            element={<AdminUnifiedExam />}
          />
          <Route
            path="/admin/create-education-set"
            element={<AdminCreateEducationSet />}
          />
          <Route
            path="/admin/education-detail/:id"
            element={<AdminEducationDetail />}
          />
          <Route path="/admin/education-set" element={<AdminEducationSet />} />
          <Route
            path="/admin/education-set-detail/:id"
            element={<AdminEducationSetDetail />}
          />
          <Route
            path="/admin/page-duration/:id"
            element={<AdminPageDuration />}
          />
          <Route
            path="/admin/assign-education-set"
            element={<AdminAssignEducationSet />}
          />
          <Route
            path="/admin/teo-exam-report"
            element={<AdminTeoExamReports />}
          />
          <Route
            path="/admin/img-exam-report"
            element={<AdminImgExamReports />}
          />
          <Route
            path="/admin/teo-report-detail/:userId/:examId"
            element={<AdminTeoReportDetail />}
          />
          <Route
            path="/admin/img-report-detail/:userId/:examId"
            element={<AdminImgReportDetail />}
          />
          <Route
            path="/admin/education-set-report"
            element={<AdminEducationSetReports />}
          />
          <Route
            path="/admin/education-report/:userId/:educationSetId"
            element={<AdminEducationReportDetail />}
          />
          <Route path="admin/que-dif" element={<AdminQueDifPage />} />
          <Route path="/admin/teo-booklets" element={<AdminTeoBooklets />} />
          <Route path="/admin/img-booklets" element={<AdminImgBooklets />} />
          <Route
            path="/admin/img-question-report/:userId/:examId"
            element={<AdminImgQuestionResult />}
          />
          <Route
            path="/admin/teo-question-report/:userId/:examId"
            element={<AdminTeoQuestionResult />}
          />
          <Route path="/admin/ban-subs" element={<AdminBanSubs />} />
          <Route path="/admin/grp-inst" element={<AdminGrpInst />} />
          <Route path="/admin/session" element={<AdminSessions />} />
          <Route path="/admin/announcement" element={<AdminAnnouncement />} />
          <Route path="/admin/role" element={<AdminRole />} />
          <Route path="/admin/log-activity" element={<AdminLogActivity />} />
          <Route path="/admin/upload-file" element={<AdminUploadFile />} />
          <Route path="/admin/downloaded" element={<AdminDownloaded />} />
          <Route path="/admin/certificate" element={<AdminCertificate />} />
          <Route
            path="/admin/certificate-result"
            element={<AdminCertificateResult />}
          />
          <Route path="/admin/bulk-register" element={<AdminBulkRegister />} />
          <Route path="/admin/bulk-pool-teo" element={<AdminBulkPoolTeo />} />
          <Route
            path="/admin/user-update/:id"
            element={<AdminUserUpdateDetail />}
          />
          <Route path="/admin/authorized" element={<AdminAuthorized />} />
          <Route path="/login/admin" element={<AdminLogin />} />
          <Route path="/admin/register" element={<UserRegister />} />

          <Route path="/admin-panel" element={<AdminPanelPage />} />
          <Route path="/admin/practice-exam" element={<AdminPracticeExam />} />
          <Route path="/admin/setup-2fa" element={<AdminSetup2FA />} />
          <Route path="/admin/verify-2fa" element={<AdminVerify2FA />} />
          <Route
            path="/admin/certificate-inputs"
            element={<AdminCertificateInputs />}
          />

          {/* </Route> */}
        </Routes>
      </div>
    </Router>
  );
}
export default App;
