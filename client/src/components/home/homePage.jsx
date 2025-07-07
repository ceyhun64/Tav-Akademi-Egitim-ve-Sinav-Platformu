import React, { useState } from "react";

const trainings = [
  { id: 1, title: "Temel Güvenlik Eğitimi", completed: false },
  { id: 2, title: "Yangın Güvenliği", completed: false },
  { id: 3, title: "İlk Yardım Eğitimi", completed: false },
];

export default function Home() {
  const [modules, setModules] = useState(trainings);
  const [examStarted, setExamStarted] = useState(false);

  const completeModule = (id) => {
    setModules(
      modules.map((m) => (m.id === id ? { ...m, completed: true } : m))
    );
  };

  const allCompleted = modules.every((m) => m.completed);

  return (
    <div className="container my-5">
      <h1 className="mb-5 text-center fw-bold">Güvenlik Firması Eğitim Portalı</h1>
      <p className="text-center fs-5 mb-4">
        Hoşgeldiniz! Eğitim modüllerini tamamlayın ve sınava girin.
      </p>

      <div className="row g-4 mb-5">
        {modules.map((mod) => (
          <div key={mod.id} className="col-md-4">
            <div
              className={`card h-100 shadow-sm ${
                mod.completed ? "border-success bg-light" : ""
              }`}
            >
              <div className="card-body d-flex flex-column justify-content-between">
                <h5
                  className={`card-title ${
                    mod.completed ? "text-success" : ""
                  }`}
                >
                  {mod.title}
                </h5>

                {!mod.completed ? (
                  <button
                    className="btn btn-primary mt-3"
                    onClick={() => completeModule(mod.id)}
                  >
                    Tamamla
                  </button>
                ) : (
                  <span className="badge bg-success fs-6 mt-3 align-self-start">
                    ✔️ Tamamlandı
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="text-center">
        <h3 className="mb-3">Sınav</h3>
        {!allCompleted ? (
          <p className="text-danger fs-5">
            Tüm modülleri tamamlamadan sınava başlayamazsınız.
          </p>
        ) : !examStarted ? (
          <button
            className="btn btn-success btn-lg px-5"
            onClick={() => setExamStarted(true)}
          >
            Sınava Başla
          </button>
        ) : (
          <p className="fs-5 text-info">Sınav başladı! Başarılar dileriz.</p>
        )}
      </div>
    </div>
  );
}
