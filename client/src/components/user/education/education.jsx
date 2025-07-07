import React, { useEffect, useState, useRef } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import PdfViewer from "./pdfViewer";
import {
  getEducationByIdThunk,
  getPageDurationThunk,
  updateEducationUserThunk,
} from "../../../features/thunks/educationThunk";
import { updateEducationSetUserThunk } from "../../../features/thunks/educationSetThunk";
import EducationProgressSidebar from "./educationProgressBar";
import "./education.css";

const formatDateTime = (timestamp) => {
  const date = new Date(timestamp);
  const isoDate = date.toISOString().split("T")[0];
  const time = date.toLocaleTimeString("tr-TR", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
  return { isoDate, time };
};

export default function Education() {
  const location = useLocation();
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { education, pageDurations, completedEducations } = useSelector(
    (state) => state.education
  );

  const {
    eduIds = [],
    teoExams = [],
    imgExams = [],
    educationSetId,
  } = location.state || {};

  const [canProgressThisLesson, setCanProgressThisLesson] = useState(false);
  const [hasUpdated, setHasUpdated] = useState(false);
  const [entryTimestamp, setEntryTimestamp] = useState(null);
  const hasEntryTimestampSet = useRef(false);
  const videoRef = useRef(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    dispatch(getEducationByIdThunk(id));
    dispatch(getPageDurationThunk(id));
    setCanProgressThisLesson(false);
    setHasUpdated(false);
    setEntryTimestamp(null);
    hasEntryTimestampSet.current = false;
    setMessage("");
  }, [dispatch, id]);

  useEffect(() => {
    const handleBeforeUnload = () => {
      if (videoRef.current) {
        const currentTime = videoRef.current.currentTime;
        dispatch(
          updateEducationUserThunk({
            id,
            data: {
              lastTime: currentTime,
              lastSection: `video-${Math.floor(currentTime)}`,
            },
          })
        );
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, []);

  const updateCompletion = async () => {
    if (hasUpdated || !educationSetId) return;
    setHasUpdated(true);
    const now = new Date();
    const entry = entryTimestamp || now;
    const { isoDate: entryDate, time: entryTime } = formatDateTime(entry);
    const { isoDate: exitDate, time: exitTime } = formatDateTime(now);

    await dispatch(
      updateEducationUserThunk({
        id,
        data: {
          completed: true,
          entry_date: entryDate,
          entry_time: entryTime,
          exit_date: exitDate,
          exit_time: exitTime,
        },
      })
    ).unwrap();
  };

  const updateSetCompletion = async () => {
    if (!educationSetId) return;
    await dispatch(
      updateEducationSetUserThunk({
        id: educationSetId,
        data: {
          completed: true,
          completed_date: new Date().toISOString(),
        },
      })
    ).unwrap();
  };

  const lastUpdateTime = useRef(0);

  const handleVideoTimeUpdate = () => {
    const currentTime = videoRef.current?.currentTime || 0;
    const now = Date.now();

    const requiredDuration = (education?.duration || 0) * 60;
    const threshold = requiredDuration * 0.9;

    if (currentTime >= threshold) {
      setCanProgressThisLesson(true);
      setMessage("");
    }

    if (now - lastUpdateTime.current > 10000) {
      lastUpdateTime.current = now;
      dispatch(
        updateEducationUserThunk({
          id,
          data: {
            lastTime: currentTime,
            lastSection: "video-1",
          },
        })
      );
    }
  };

  const handleVideoPlay = () => {
    if (!hasEntryTimestampSet.current) {
      setEntryTimestamp(Date.now());
      hasEntryTimestampSet.current = true;
    }
  };

  const handlePdfLastPageComplete = () => {
    setCanProgressThisLesson(true);
    setMessage("");
    if (!hasEntryTimestampSet.current) {
      setEntryTimestamp(Date.now());
      hasEntryTimestampSet.current = true;
    }
  };

  const currentIndex = eduIds.findIndex(
    (eduId) => String(eduId) === String(id)
  );
  const nextEduId = eduIds[currentIndex + 1];
  const isLastLesson = !nextEduId;
  const buttonText = isLastLesson
    ? "Eğitim Sınavına Başla"
    : "Sonraki Derse Geç";

  const handleCompleteAndNext = async () => {
    setMessage("");

    if (!canProgressThisLesson) {
      setMessage("Bu eğitimi tamamlamadan sonraki derse/sınava geçemezsiniz!");
      return;
    }

    if (!hasUpdated) {
      await updateCompletion();
    }

    if (isLastLesson) {
      await updateSetCompletion();
      navigate("/exam-info", {
        state: { teoExams, imgExams },
      });
    } else {
      navigate(`/education/${nextEduId}`, {
        state: { eduIds, teoExams, imgExams, educationSetId },
      });
    }
  };

  const handleExit = () => {
    navigate(
      educationSetId
        ? `/education-set-detail/${educationSetId}`
        : "/user/education-sets"
    );
  };

  if (!education || !education.file_url) {
    return <p className="text-center my-4 text-muted">Yükleniyor...</p>;
  }

  const fileType = education.file_url.split(".").pop()?.toLowerCase();

  return (
    <div className="education-container">
      <button
        onClick={handleExit}
        className="btn-exit"
        title="Eğitim Setine Geri Dön"
      >
        <i className="bi bi-x"></i>
      </button>

      <h2 className="education-header">{education.name}</h2>
      {message && (
        <div
          className="alert alert-danger d-flex align-items-center"
          role="alert"
        >
          <i className="bi bi-exclamation-triangle-fill me-2"></i>
          {message}
        </div>
      )}
    

      <div className="education-main">
        {/* Sol taraf: Eğitim içeriği */}
        <div className="education-content">
          <div className="education-media-wrapper">
            {fileType === "pdf" ? (
              <PdfViewer
                file={education.file_url}
                pageDurations={pageDurations}
                onPdfLastPageComplete={handlePdfLastPageComplete}
                onProgress={(pageNum) => {
                  dispatch(
                    updateEducationUserThunk({
                      id,
                      data: {
                        lastSection: `pdf-page-${pageNum}`,
                      },
                    })
                  );
                }}
              />
            ) : fileType === "mp4" ? (
              <video
                ref={videoRef}
                src={education.file_url}
                controls
                className="education-video"
                onTimeUpdate={handleVideoTimeUpdate}
                onPlay={handleVideoPlay}
                onLoadedMetadata={() => {
                  if (videoRef.current && educationUser?.lastTime) {
                    videoRef.current.currentTime = educationUser.lastTime;
                  }
                }}
                key={id}
              />
            ) : fileType === "ppt" || fileType === "pptx" ? (
              <iframe
                src={`https://docs.google.com/gview?url=${encodeURIComponent(
                  education.file_url
                )}&embedded=true`}
                style={{
                  width: "100%",
                  height: "600px",
                  border: "none",
                  borderRadius: "12px",
                }}
                title="PowerPoint Viewer"
                onLoad={() => {
                  if (!hasEntryTimestampSet.current) {
                    setEntryTimestamp(Date.now());
                    hasEntryTimestampSet.current = true;
                  }

                  dispatch(
                    updateEducationUserThunk({
                      id,
                      data: {
                        lastSection: "ppt-opened",
                        lastTime: 0,
                      },
                    })
                  );
                }}
              />
            ) : (
              <p className="text-danger text-center my-2">
                Desteklenmeyen dosya türü
              </p>
            )}
          </div>

          <button
            onClick={handleCompleteAndNext}
            className="btn-education-next"
            disabled={!canProgressThisLesson}
            title={
              !canProgressThisLesson
                ? "Eğitimi tamamlamadan ilerleyemezsiniz"
                : ""
            }
          >
            {isLastLesson ? (
              <i className="bi bi-check-circle"></i>
            ) : (
              <i className="bi bi-arrow-right"></i>
            )}
            {buttonText}
          </button>
        </div>

        {/* Sağ taraf: İlerleme çubuğu */}
        <div className="education-sidebar">
          <EducationProgressSidebar
            eduIds={eduIds}
            currentEduId={id}
            completedEducations={completedEducations}
          />
        </div>
      </div>
    </div>
  );
}
