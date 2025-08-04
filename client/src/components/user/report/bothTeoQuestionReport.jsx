import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { getTeoQuestionResultThunk } from "../../../features/thunks/reportThunk";
import UserInfoCard from "../../admin/report/teoQuestion/userInfo";
import ExamInfoCard from "../../admin/report/teoQuestion/examInfo";
import QuestionDetailCard from "../../admin/report/teoQuestion/questionDetail";
import QuestionNavigator from "../../admin/report/teoQuestion/questionNavigator";
import QuestionList from "../../admin/report/teoQuestion/questionList";

export default function BothTeoQuestionResult() {
  const dispatch = useDispatch();
  const { userId, teoExamId } = useParams();
  const navigate = useNavigate(); // 👈 ekle

  const location = useLocation();
  const imgExamId = location.state?.examId ?? false; // default false

  // const imgExamId = location.state?.examId ?? false; // default false
  const { teoQuestionResults } = useSelector((state) => state.report);
  const { data } = teoQuestionResults || {};
  const [currentIndex, setCurrentIndex] = useState(0);

  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isTablet, setIsTablet] = useState(
    window.innerWidth >= 768 && window.innerWidth < 1350
  );

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setIsMobile(width < 768);
      setIsTablet(width >= 768 && width < 1350);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const action = dispatch(
      getTeoQuestionResultThunk({ userId, examId: teoExamId })
    ).unwrap();
  }, [dispatch, userId, teoExamId]);

  if (!data?.userTeoAnswers || !data.userTeoAnswers.length) {
    return <p className="text-center mt-5">Yükleniyor...</p>;
  }
  const answers = data.userTeoAnswers;
  const user = answers[0]?.user;
  const exam = answers[0]?.exam;
  const userExam = data.userExams?.[0]; // Skor gibi sınav performans verileri

  const currentQuestion = answers[currentIndex];

  return (
    <div
      className="poolteo-container"
      style={{
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        overflowX: "hidden",
      }}
    >
      {/* Main Content */}
      <div
        style={{
          padding: isMobile || isTablet ? "1rem" : "2.5rem 3rem",
          backgroundColor: "#f4f6fc",
          minHeight: "100vh",
          transition: "margin-left 0.3s ease",
          color: "#222",
        }}
      >
        <div
          className="row"
          style={{
            display: "flex",
            flexWrap: isMobile || isTablet ? "wrap" : "nowrap",
            gap: isMobile || isTablet ? "1rem" : 0,
          }}
        >
          <div
            className="col-lg-3 mb-4"
            style={{
              flex: isMobile || isTablet ? "0 0 100%" : "0 0 25%",
              maxWidth: isMobile || isTablet ? "100%" : "25%",
            }}
          >
            <UserInfoCard user={user} />
            <ExamInfoCard exam={exam} userExam={userExam} />
          </div>

          <div
            className="col-lg-6"
            style={{
              flex: isMobile || isTablet ? "0 0 100%" : "0 0 50%",
              maxWidth: isMobile || isTablet ? "100%" : "50%",
            }}
          >
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

          <div
            className="col-lg-3"
            style={{
              flex: isMobile || isTablet ? "0 0 100%" : "0 0 25%",
              maxWidth: isMobile || isTablet ? "100%" : "25%",
            }}
          >
            <QuestionList
              data={answers}
              currentIndex={currentIndex}
              setCurrentIndex={setCurrentIndex}
            />
            <button
              onClick={() =>
                navigate(`/both-img-question-report/${userId}/${imgExamId}`)
              }
              className="btn btn-primary mt-3 w-100"
              disabled={!imgExamId}
            >
              Uygulamalı Soru Sonuçlarını Gör
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
