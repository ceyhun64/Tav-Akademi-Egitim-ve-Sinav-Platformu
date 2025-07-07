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

  useEffect(() => {
    dispatch(getImgQuestionResultThunk({ userId, examId }));
  }, [dispatch, userId, examId]);
  console.log(imgQuestionResults);
  if (!data?.userImgAnswers || !data.userImgAnswers.length) {
    return <p className="text-center mt-5">Yükleniyor...</p>;
  }

  const answers = data.userImgAnswers;
  const user = answers[0]?.user;
  const exam = answers[0]?.exam;
  const userExam = data.userExams?.[0]; // Skor gibi sınav performans verileri

  const currentQuestion = answers[currentIndex];

  return (
    <div
      className="poolteo-container"
      style={{
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        overflowX: "hidden", // yatay kaymayı engeller
      }}
    >
      {/* Sidebar */}
      <div
        style={{
          width: "260px",
          minHeight: "100vh",
          padding: "1.5rem 1.2rem",
          position: "fixed",
          left: 0,
          top: 0,
          backgroundColor: "#003399", // biraz daha canlı mavi
          color: "#fff",
          boxShadow: "2px 0 12px rgba(0, 0, 0, 0.25)",
          overflowY: "auto",
          zIndex: 10,
          borderRadius: "0 12px 12px 0",
        }}
      >
        <Sidebar />
      </div>

      {/* Main Content */}
      <div
        style={{
          marginLeft: "260px",
          padding: "2.5rem 3rem",
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
          }}
        >
          <h1
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
            <i
              className="bi bi-clipboard-check-fill"
              style={{ fontSize: "1.6rem" }}
            ></i>
            İşaretlenen Cevaplar
          </h1>
        </div>
        <div className="row">
          <div className="col-lg-3 mb-4">
            <UserInfoCard user={user} />
            <ExamInfoCard exam={exam} userExam={userExam} />
          </div>
          <div className="col-lg-6">
            <QuestionDetailCard
              question={currentQuestion}
              currentIndex={currentIndex}
            />
            <QuestionNavigator
              total={answers.length}
              current={currentIndex}
              setCurrent={setCurrentIndex}
            />
          </div>
          <div className="col-lg-3">
            <QuestionList
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
