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
  const [isTablet, setIsTablet] = useState(
    window.innerWidth >= 768 && window.innerWidth < 1350
  );
  const isStackedLayout = isMobile || isTablet;

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setIsMobile(width < 768);
      setIsTablet(width >= 768 && width < 1350);
      if (width >= 768) {
        setSidebarOpen(true);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    setSidebarOpen(!isMobile);
  }, [isMobile]);

  useEffect(() => {
    dispatch(getImgQuestionResultThunk({ userId, examId }));
  }, [dispatch, userId, examId]);

  const answers = data?.userImgAnswers || [];
  const user = answers[0]?.user;
  const exam = answers[0]?.exam;
  const userExam = data?.userExams?.[0];

  const currentQuestion = answers[currentIndex];

  if (!answers.length) {
    return <p className="text-center mt-5">Yükleniyor...</p>;
  }

  return (
    <div
      className="poolImg-container"
      style={{
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        overflowX: "hidden",
      }}
    >
      {/* Sidebar */}
      <div
        style={{
          width: isMobile ? "100%" : "260px",
          minHeight: isMobile ? "auto" : "100vh",
          padding: isMobile ? "1rem" : "1.5rem 1.2rem",
          position: isMobile ? "relative" : "fixed",
          left: isMobile ? "auto" : 0,
          top: 0,
          backgroundColor: "white",
          color: "#fff",
          overflowY: isMobile ? "visible" : "auto",
          zIndex: 99999,
          borderRadius: isMobile ? "0" : "0 12px 12px 0",
          marginBottom: isMobile ? "1rem" : 0,
        }}
      >
        <Sidebar />
      </div>

      {/* Content */}
      <div
        className="poolImg-content"
        style={{
          marginLeft: isMobile ? "0" : "260px",
          padding: isMobile ? "1rem" : "2.5rem 3rem",
          backgroundColor: "#f4f6fc",
          minHeight: "100vh",
          transition: "margin-left 0.3s ease",
          color: "#222",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "2.5rem",
            flexWrap: isStackedLayout ? "wrap" : "nowrap",
          }}
        >
          <h1
            className="mb-4 mt-2 ms-5"
            style={{
              color: "#003399",
              fontSize: isMobile ? "24px" : "28px",
              fontWeight: "700",
              display: "flex",
              alignItems: "center",
              gap: "0.6rem",
              userSelect: "none",
              width: isMobile ? "100%" : "auto",
            }}
          >
            {!isMobile && (
              <i
                className="bi bi-journal-bookmark-fill"
                style={{ fontSize: isMobile ? "1.4rem" : "1.6rem" }}
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
                padding: "6px 16px",
                cursor: "pointer",
                fontSize: "1rem",
                whiteSpace: "nowrap",
              }}
            >
              Geri Dön
            </button>
          </h1>
        </div>

        <div
          className="row"
          style={{
            display: "flex",
            flexWrap: isStackedLayout ? "wrap" : "nowrap",
            gap: isStackedLayout ? "1rem" : 0,
          }}
        >
          <div
            className="col-lg-3 mb-4"
            style={{
              flex: isStackedLayout ? "0 0 100%" : "0 0 25%",
              maxWidth: isStackedLayout ? "100%" : "25%",
            }}
          >
            <UserInfoCard user={user} />
            <ExamInfoCard exam={exam} userExam={userExam} />
          </div>
          <div
            className="col-lg-6"
            style={{
              flex: isStackedLayout ? "0 0 100%" : "0 0 50%",
              maxWidth: isStackedLayout ? "100%" : "50%",
            }}
          >
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
          <div
            className="col-lg-3"
            style={{
              flex: isStackedLayout ? "0 0 100%" : "0 0 25%",
              maxWidth: isStackedLayout ? "100%" : "25%",
            }}
          >
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
