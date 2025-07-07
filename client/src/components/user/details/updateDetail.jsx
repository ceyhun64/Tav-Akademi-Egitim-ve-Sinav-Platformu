import React, { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getUserDetailsThunk,
  updateUserDetailsThunk,
} from "../../../features/thunks/userThunk";
import { useNavigate, useParams } from "react-router-dom";

export default function UserUpdateDetail() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Redux state’inden çekiyoruz
  const { userDetails, isLoading, error, alert } = useSelector(
    (state) => state.user
  );

  // Form state
  const [formData, setFormData] = useState({
    tcno: "",
    sicil: "",
    ad: "",
    soyad: "",
    kullanici_adi: "",
    sifre: "",
    telefon: "",
    email: "",
    il: "",
    ilce: "",
    adres: "",
    ise_giris_tarihi: "",
    cinsiyet: "",
    grup: "",
    lokasyon: "",
    image: null,
  });

  // 1) Sayfa açılınca userDetails’ı çek
  useEffect(() => {
    if (id) {
      dispatch(getUserDetailsThunk(id));
    } else {
      console.warn("useParams ile gelen id undefined!");
    }
  }, [dispatch, id]);

  // 2) userDetails geldiğinde formu doldur
  useEffect(() => {
    if (userDetails) {
      setFormData({
        tcno: userDetails.tcno || "",
        sicil: userDetails.sicil || "",
        ad: userDetails.ad || "",
        soyad: userDetails.soyad || "",
        kullanici_adi: userDetails.kullanici_adi || "",
        sifre: "", // parola değiştirmek istenirse girilecek
        telefon: userDetails.telefon || "",
        email: userDetails.email || "",
        il: userDetails.il || "",
        ilce: userDetails.ilce || "",
        adres: userDetails.adres || "",
        ise_giris_tarihi: userDetails.ise_giris_tarihi
          ? userDetails.ise_giris_tarihi.slice(0, 10)
          : "",
        cinsiyet: userDetails.cinsiyet || "",
        grup: userDetails.grup || "",
        lokasyon: userDetails.lokasyon || "",
        image: null,
      });
    }
  }, [userDetails]);

  const handleChange = useCallback((e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "image" ? files[0] : value,
    }));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const fd = new FormData();
    Object.entries(formData).forEach(([key, val]) => {
      // sadece dolu gelenleri ekle
      if (val !== null && val !== "") {
        fd.append(key, val);
      }
    });
    try {
      await dispatch(updateUserDetailsThunk(fd)).unwrap();
      navigate("/profile");
    } catch (err) {
      console.error("Güncelleme hatası:", err);
    }
  };

  if (isLoading) {
    return <div className="text-center">Yükleniyor…</div>;
  }
  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  return (
    <div className="container mt-4">
      {alert?.message && (
        <div className={`alert alert-${alert.type}`}>{alert.message}</div>
      )}
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div className="row">
          {[
            { name: "tcno", label: "T.C. Kimlik No", type: "text" },
            { name: "sicil", label: "Sicil No", type: "text" },
            { name: "ad", label: "Ad", type: "text" },
            { name: "soyad", label: "Soyad", type: "text" },
            {
              name: "kullanici_adi",
              label: "Kullanıcı Adı",
              type: "text",
            },
            { name: "sifre", label: "Şifre (yeni)", type: "password" },
            { name: "telefon", label: "Telefon", type: "text" },
            { name: "email", label: "E-posta", type: "email" },
            { name: "il", label: "İl", type: "text" },
            { name: "ilce", label: "İlçe", type: "text" },
            { name: "adres", label: "Adres", type: "text" },
            {
              name: "ise_giris_tarihi",
              label: "İşe Giriş Tarihi",
              type: "date",
            },
            { name: "cinsiyet", label: "Cinsiyet", type: "text" },
            { name: "grup", label: "Grup", type: "text" },
            { name: "lokasyon", label: "Lokasyon", type: "text" },
          ].map((field) => (
            <div className="col-md-6 mb-3" key={field.name}>
              <label htmlFor={field.name} className="form-label">
                {field.label}
              </label>
              <input
                id={field.name}
                name={field.name}
                type={field.type}
                className="form-control"
                value={formData[field.name]}
                onChange={handleChange}
              />
            </div>
          ))}
          <div className="col-md-6 mb-3">
            <label htmlFor="image" className="form-label">
              Resim
            </label>
            <input
              id="image"
              name="image"
              type="file"
              accept="image/*"
              className="form-control"
              onChange={handleChange}
            />
          </div>
        </div>
        <button type="submit" className="btn btn-primary">
          Güncelle
        </button>
      </form>
    </div>
  );
}
