import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getImgQuestionResultThunk } from "../../../features/thunks/reportThunk";
import UserInfoCard from "../../admin/report/imgQuestion/userInfo";
import ExamInfoCard from "../../admin/report/imgQuestion/examInfo";
import QuestionDetailCard from "../../admin/report/imgQuestion/questionDetail";
import QuestionNavigator from "../../admin/report/imgQuestion/questionNavigator";
import QuestionList from "../../admin/report/imgQuestion/questionList"; 
export default function BothImgQuestionResult() {
  const dispatch = useDispatch();
  const { userId, imgExamId } = useParams();
  const { imgQuestionResults } = useSelector((state) => state.report);
  const { data } = imgQuestionResults || {};
  const [currentIndex, setCurrentIndex] = useState(0);

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
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    dispatch(getImgQuestionResultThunk({ userId, examId: imgExamId }));
  }, [dispatch, userId, imgExamId]);

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
      {/* Content */}
      <div
        className="poolImg-content"
        style={{
          padding: isMobile ? "1rem" : "2.5rem 3rem",
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
