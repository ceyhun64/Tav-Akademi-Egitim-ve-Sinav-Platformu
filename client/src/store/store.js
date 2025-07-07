import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/slices/authSlice";
import userReducer from "../features/slices/userSlice";
import imageGalleryReducer from "../features/slices/imageGallerySlice";
import imageGalleryCatReducer from "../features/slices/imageGalleryCatSlice";
import educationReducer from "../features/slices/educationSlice";
import educationSetReducer from "../features/slices/educationSetSlice";
import bookletReducer from "../features/slices/bookletSlice";
import poolTeoReducer from "../features/slices/poolTeoSlice";
import poolImgReducer from "../features/slices/poolImgSlice";
import examReducer from "../features/slices/examSlice";
import questionReducer from "../features/slices/questionSlice";
import reportReducer from "../features/slices/reportSlice";
import queDifReducer from "../features/slices/queDifSlice";
import banSubsReducer from "../features/slices/banSubsSlice";
import grpInstReducer from "../features/slices/grpInstSlice";
import sessionReducer from "../features/slices/sessionSlice";
import announcementReducer from "../features/slices/announcementSlice";
import roleReducer from "../features/slices/roleSlice";
import logActivityReducer from "../features/slices/logActivitiySlice";
import uploadFileReducer from "../features/slices/uploadFileSlice"; 
import certificateReducer from "../features/slices/certificateSlice"; 
import practiceExamReducer from "../features/slices/practiceExamSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    imageGallery: imageGalleryReducer,
    imageGalleryCat: imageGalleryCatReducer,
    education: educationReducer,
    educationSet: educationSetReducer,
    booklet: bookletReducer,
    poolTeo: poolTeoReducer,
    poolImg: poolImgReducer,
    exam: examReducer,
    question: questionReducer,
    report: reportReducer,
    queDif: queDifReducer,
    banSubs: banSubsReducer,
    grpInst: grpInstReducer,
    session: sessionReducer,
    announcement: announcementReducer,
    role: roleReducer,
    logActivity: logActivityReducer,
    uploadFile: uploadFileReducer,
    certificate: certificateReducer,
    practiceExam: practiceExamReducer,
  },
});
