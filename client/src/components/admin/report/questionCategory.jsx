import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getQuestionCategoryResultThunk } from "../../../features/thunks/reportThunk";
import { useParams } from "react-router-dom";

export default function QuestionCategory() {
  const { examId, userId } = useParams();
  const dispatch = useDispatch();
  const { questionCategoryResult } = useSelector((state) => state.report);

  useEffect(() => {
    dispatch(getQuestionCategoryResultThunk({ userId, examId }));
  }, [dispatch, userId, examId]);

  const data = questionCategoryResult?.data || [];

  return (
    <div className="container my-5" style={{ maxWidth: 700 }}>
      {data.length > 0 ? (
        <div className="table-responsive shadow-sm rounded border">
          <table className="table mb-0">
            <thead
              style={{
                backgroundColor: "#001b66",
                color: "#ffffff",
              }}
            >
              <tr>
                <th style={{ padding: "0.75rem" }}>Kategori Adı</th>
                <th className="text-center" style={{ padding: "0.75rem" }}>
                  Doğru Sayısı
                </th>
                <th className="text-center" style={{ padding: "0.75rem" }}>
                  Yanlış Sayısı
                </th>
              </tr>
            </thead>
            <tbody>
              {data.map(
                ({
                  questionCategoryId,
                  categoryName,
                  correctCount,
                  incorrectCount,
                }) => (
                  <tr key={questionCategoryId}>
                    <td style={{ verticalAlign: "middle" }}>{categoryName}</td>
                    <td
                      className="text-center fw-semibold"
                      style={{ color: "#28a745", verticalAlign: "middle" }}
                    >
                      {correctCount}
                    </td>
                    <td
                      className="text-center fw-semibold"
                      style={{ color: "#dc3545", verticalAlign: "middle" }}
                    >
                      {incorrectCount}
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-center text-muted">Sonuç bulunamadı.</p>
      )}
    </div>
  );
}
