import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getEducationSetsUserThunk } from "../../../features/thunks/educationSetThunk";
import dayjs from "dayjs";

export default function ContinueEducation() {
  const dispatch = useDispatch();

  const educationSetUsers = useSelector(
    (state) => state.educationSet.educationSetUsers || []
  );

  const educationSets = educationSetUsers.educationSets || [];
  const educationSetUser = educationSetUsers.educationSetUser || [];

  const [selectedEducationUser, setSelectedEducationUser] = useState(null);

  useEffect(() => {
    dispatch(getEducationSetsUserThunk());
  }, [dispatch]);

  const getEducationSetName = (id) => {
    const found = educationSets.find((set) => set.id === id);
    return found ? found.name : "Eğitim Adı Bulunamadı";
  };

  return (
    <div className="container py-4">
      <h2 className="mb-4" style={{ color: "#001b66", fontWeight: "700" }}>
        <i className="bi bi-exclamation-circle-fill me-2 text-danger"></i>
        Tamamlanmamış Eğitimler
      </h2>

      <div className="row">
        <div className="col-md-5">
          <div className="list-group shadow-sm border rounded">
            {educationSetUser.length > 0 ? (
              educationSetUser.map((eduUser) => {
                const isCompleted = eduUser.completed;
                const bgColor = isCompleted ? "bg-light" : "bg-white";

                return (
                  <button
                    key={eduUser.educationSetId}
                    className={`list-group-item list-group-item-action d-flex justify-content-between align-items-center ${bgColor}`}
                    onClick={() => setSelectedEducationUser(eduUser)}
                    style={{
                      cursor: "pointer",
                      borderLeft: `5px solid ${
                        isCompleted ? "#28a745" : "#0d6efd"
                      }`,
                    }}
                  >
                    <div>
                      <strong>
                        {getEducationSetName(eduUser.educationSetId)}
                      </strong>
                      <div className="small text-muted">
                        Eğitmen: {eduUser.educator || "Bilinmiyor"}
                      </div>
                    </div>
                    <div>
                      {isCompleted ? (
                        <i
                          className="bi bi-check-circle-fill text-success fs-5"
                          title="Tamamlandı"
                        ></i>
                      ) : (
                        <i
                          className="bi bi-play-circle-fill text-primary fs-5"
                          title="Devam Ediyor"
                        ></i>
                      )}
                    </div>
                  </button>
                );
              })
            ) : (
              <p className="text-muted p-3">Devam eden eğitim bulunamadı.</p>
            )}
          </div>
        </div>

        <div className="col-md-7">
          {selectedEducationUser ? (
            <div className="card shadow-sm border-0 p-4">
              <h5 className="mb-3" style={{ color: "#001b66" }}>
                {getEducationSetName(selectedEducationUser.educationSetId)}
              </h5>

              <ul className="list-unstyled">
                <li>
                  <strong>Eğitmen:</strong>{" "}
                  {selectedEducationUser.educator || "Bilinmiyor"}
                </li>
                <li>
                  <strong>Başlangıç Tarihi:</strong>{" "}
                  {dayjs(selectedEducationUser.start_date).format(
                    "DD MMMM YYYY, HH:mm"
                  )}
                </li>
                <li>
                  <strong>Bitiş Tarihi:</strong>{" "}
                  {dayjs(selectedEducationUser.end_date).format(
                    "DD MMMM YYYY, HH:mm"
                  )}
                </li>
                <li>
                  <strong>Durum:</strong>{" "}
                  {selectedEducationUser.completed ? (
                    <span className="badge bg-success">Tamamlandı</span>
                  ) : (
                    <span className="badge bg-info text-white">
                      Devam Ediyor
                    </span>
                  )}
                </li>
              </ul>

              {!selectedEducationUser.completed && (
                <button
                  className="btn btn-primary mt-4"
                  style={{ backgroundColor: "#001b66", borderColor: "#001b66" }}
                  onClick={() =>
                    alert("Eğitime devam fonksiyonu burada çalışır")
                  }
                >
                  Eğitime Devam Et
                </button>
              )}
            </div>
          ) : (
            <div className="text-muted fst-italic p-4 border rounded shadow-sm bg-light">
              Devam etmek istediğiniz eğitimi listeden seçiniz.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
