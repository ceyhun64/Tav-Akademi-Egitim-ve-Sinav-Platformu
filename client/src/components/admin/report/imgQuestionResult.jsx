import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getImgQuestionResultThunk } from "../../../features/thunks/reportThunk";
import UserInfoCard from "./imgQuestion/userInfo";
import ExamInfoCard from "./imgQuestion/examInfo";
import QuestionDetailCard from "./imgQuestion/questionDetail";
import QuestionNavigator from "./imgQuestion/questionNavigator";
import QuestionList from "./imgQuestion/questionList";
import Sidebar from "../adminPanel/sidebar";

export default function ImgQuestionResult() {
  const dispatch = useDispatch();
  const { userId, examId } = useParams();
  const { imgQuestionResults } = useSelector((state) => state.report);
  const { data } = imgQuestionResults || {};
  const [currentIndex, setCurrentIndex] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setSidebarOpen(true); // büyük ekranda sidebar açık kalsın
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    setSidebarOpen(!isMobile);
  }, [isMobile]);
  const selectWidth = 300;
  useEffect(() => {
    dispatch(getImgQuestionResultThunk({ userId, examId }));
  }, [dispatch, userId, examId]);
  console.log(imgQuestionResults);

  const answers = data.userImgAnswers;
  const user = answers[0]?.user;
  const exam = answers[0]?.exam;
  const userExam = data.userExams?.[0]; // Skor gibi sınav performans verileri

  const currentQuestion = answers[currentIndex];

  if (!data?.userImgAnswers || !data.userImgAnswers.length) {
    return <p className="text-center mt-5">Yükleniyor...</p>;
  }
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
            İşaretlenen Cevaplar
            <button
              onClick={() => window.history.back()}
              style={{
                marginLeft: isMobile ? "auto" : "30px",
                backgroundColor: "#001b66",
                color: "white",
                border: "none",
                borderRadius: "4px",
                padding: "6px 16px", // padding yatay biraz artırıldı
                cursor: "pointer",
                fontSize: "1rem",
                whiteSpace: "nowrap", // metnin tek satırda kalmasını sağlar
              }}
            >
              Geri Dön
            </button>
          </h1>
        </div>
        <div className="row">
          <div className="col-lg-3 mb-4">
            <UserInfoCard user={user} />
            <ExamInfoCard exam={exam} userExam={userExam} />
          </div>
          <div className="col-lg-6">
            <QuestionDetailCard
              isMobile={isMobile}
              question={currentQuestion}
              currentIndex={currentIndex}
            />
            <QuestionNavigator
              isMobile={isMobile}
              total={answers.length}
              current={currentIndex}
              setCurrent={setCurrentIndex}
            />
          </div>
          <div className="col-lg-3">
            <QuestionList
              isMobile={isMobile}
              data={answers}
              currentIndex={currentIndex}
              setCurrentIndex={setCurrentIndex}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
