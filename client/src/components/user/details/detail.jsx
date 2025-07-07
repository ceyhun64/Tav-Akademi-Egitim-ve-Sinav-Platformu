import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { getUserDetailsThunk } from "../../../features/thunks/userThunk";

export default function Detail() {
  const dispatch = useDispatch();
  const { user, isLoading, error } = useSelector((state) => state.user);
  console.log(user);

  useEffect(() => {
    dispatch(getUserDetailsThunk());
  }, [dispatch]);

  const labels = {
    tcno: "T.C. Kimlik No",
    sicil: "Sicil No",
    ad: "Ad",
    soyad: "Soyad",
    kullanici_adi: "Kullanıcı Adı",
    telefon: "Telefon",
    email: "E-posta Adresi",
    il: "İl",
    ilce: "İlçe",
    adres: "Adres",
    ise_giris_tarihi: "İşe Giriş Tarihi",
    cinsiyet: "Cinsiyet",
    grup: "Grup",
    lokasyon: "Lokasyon",
    image: "Kullanıcı Resmi",
  };

  if (isLoading) {
    return (
      <div
        className="text-center"
        style={{ fontSize: "1.2rem", fontWeight: "bold" }}
      >
        Yükleniyor...
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger" role="alert">
        {error}
      </div>
    );
  }

  if (!user) {
    return <div>Veri bulunamadı.</div>;
  }

  return (
    <div
      className="card shadow-lg p-4"
      style={{ borderRadius: "15px", backgroundColor: "#f8f9fa" }}
    >
      {Object.entries(labels).map(([key, label]) => (
        <div className="row mb-3" key={key}>
          <div className="col-md-6">
            <strong>{label}:</strong>
            <div>
              {key === "image" ? (
                user.image ? (
                  <img
                    src={user.image}
                    alt="Kullanıcı Resmi"
                    style={{
                      width: "100px",
                      height: "100px",
                      objectFit: "cover",
                      borderRadius: "50%",
                    }}
                  />
                ) : (
                  "Resim yok"
                )
              ) : key === "ise_giris_tarihi" ? (
                user.ise_giris_tarihi ? (
                  new Date(user.ise_giris_tarihi).toLocaleDateString("tr-TR")
                ) : (
                  "-"
                )
              ) : (
                user[key] ?? "-"
              )}
            </div>
          </div>
        </div>
      ))}
      <button>
        <Link to="/update">güncelle</Link>
      </button>
    </div>
  );
}
