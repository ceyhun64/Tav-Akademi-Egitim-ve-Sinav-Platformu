import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { registerThunk } from "../../../features/thunks/authThunk";
import {
  getAllUsersThunk,
  getUserDetailsThunk,
  updateUserDetailsThunk,
  deleteUsersThunk,
  aktifPasifUserThunk,
} from "../../../features/thunks/userThunk";
import provinces from "../../../data/provinces.json";
import {
  getGroupsThunk,
  getInstitutionsThunk,
} from "../../../features/thunks/grpInstThunk";
import UserList from "./userList";
import UserFilter from "./userFilter";
import BulkRegister from "./bulkRegister";
import Sidebar from "../adminPanel/sidebar";
import exampleUser from "../../../../public/example/exampleUser.jpg";
import "./register.css";
import {
  getRolesThunk,
  assignRoleToUserThunk,
} from "../../../features/thunks/roleThunk";

export default function Register() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    roleId: "",
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
    grupId: "",
    lokasyonId: "",
    image: null,
    imagePreview: null, // <--- burası eklendi
  });

  useEffect(() => {
    dispatch(getGroupsThunk());
    dispatch(getInstitutionsThunk());
  }, [dispatch]);
  const { roles } = useSelector((state) => state.role);

  const { groups, institutions } = useSelector((state) => state.grpInst);
  const { alert, loading } = useSelector((state) => state.auth);
  const { users, selectedUser } = useSelector((state) => state.user);
  const [selectedUserIds, setSelectedUserIds] = useState([]); // 1. Seçilen kullanıcılar
  const [selectedPers, setSelectedPers] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  const [districts, setDistricts] = useState([]); // seçilen ilin ilçeleri

  //il seçimi
  const handleProvinceChange = (e) => {
    const selectedProvinceValue = Number(e.target.value);
    const selectedProvince = provinces.find(
      (p) => p.value === selectedProvinceValue
    );

    setFormData((prev) => ({
      ...prev,
      il: selectedProvinceValue,
      ilce: "", // ilçe sıfırlanıyor
    }));

    setDistricts(selectedProvince ? selectedProvince.districts : []);
  };

  //ilçe seçimi
  const handleDistrictChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      ilce: Number(e.target.value),
    }));
  };

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setSidebarOpen(true); // büyük ekranda sidebar açık kalsın
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    // ilk yüklemede sidebar büyük ekranda açık, küçükte kapalı
    setSidebarOpen(!isMobile);
  }, [isMobile]);

  useEffect(() => {
    dispatch(getAllUsersThunk());
  }, [dispatch]);

  // Seçilen kullanıcı detayları formu güncellesin
  useEffect(() => {
    if (selectedUser) {
      setFormData((prev) => ({
        ...prev,
        tcno: selectedUser.tcno || "",
        sicil: selectedUser.sicil || "",
        ad: selectedUser.ad || "",
        soyad: selectedUser.soyad || "",
        kullanici_adi: selectedUser.kullanici_adi || "",
        sifre: selectedUser.sifre || "", // burayı ekledik
        telefon: selectedUser.telefon || "",
        email: selectedUser.email || "",
        il: selectedUser.il || "",
        ilce: selectedUser.ilce || "",
        adres: selectedUser.adres || "",
        ise_giris_tarihi: selectedUser.ise_giris_tarihi
          ? new Date(selectedUser.ise_giris_tarihi).toISOString().split("T")[0]
          : "",
        cinsiyet: selectedUser.cinsiyet || "",
        grup: selectedUser.grup || "",
        lokasyon: selectedUser.lokasyon || "",
        image: null,
      }));
    }
  }, [selectedUser]);

  const [formErrors, setFormErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Telefon inputunu formatla
    if (name === "telefon") {
      let formatted = value
        .replace(/\D/g, "") // rakam olmayanları çıkar
        .substring(0, 10); // max 10 hane al
      if (formatted.length > 3 && formatted.length <= 6) {
        formatted = formatted.replace(/(\d{3})(\d+)/, "$1-$2");
      } else if (formatted.length > 6) {
        formatted = formatted.replace(/(\d{3})(\d{3})(\d+)/, "$1-$2-$3");
      }
      setFormData((prev) => ({ ...prev, [name]: formatted }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }

    // Validasyon kontrolü
    validateField(name, value);
  };
  const handleGuncelleClick = () => {
    if (selectedUserIds.length !== 1) return;

    const userId = selectedUserIds[0];
    const userToEdit = users.find((user) => user.id === userId);

    if (userToEdit) {
      dispatch(getUserDetailsThunk(userId));
      setSelectedPers(userToEdit);
      setFormData({
        tcno: userToEdit.tcno || "",
        sicil: userToEdit.sicil || "",
        ad: userToEdit.ad || "",
        soyad: userToEdit.soyad || "",
        kullanici_adi: userToEdit.kullanici_adi || "",
        sifre: "",
        telefon: userToEdit.telefon || "",
        email: userToEdit.email || "",
        il: userToEdit.il || "",
        ilce: userToEdit.ilce || "",
        adres: userToEdit.adres || "",
        ise_giris_tarihi: userToEdit.ise_giris_tarihi?.split("T")[0] || "",
        cinsiyet: userToEdit.cinsiyet || "",
        grupId: userToEdit.grupId || "",
        lokasyonId: userToEdit.lokasyonId || "",
        image: null,
        imagePreview: userToEdit.image || null,
        roleId: userToEdit.roleId || "",
      });

      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({
          ...prev,
          image: file,
          imagePreview: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const data = new FormData();

    Object.entries(formData).forEach(([key, value]) => {
      if (key !== "imagePreview") {
        if (key === "image" && value) {
          data.append("file", value);
        } else {
          data.append(key, value);
        }
      }
    });

    if (selectedPers) {
      dispatch(updateUserDetailsThunk({ id: selectedPers.id, formData: data }))
        .unwrap()
        .then(() => {
          window.alert("Kullanıcı güncellendi");
          dispatch(getAllUsersThunk()); // Listeyi yenile
          setFormData(initialFormData);
        })
        .catch((err) => window.alert("Güncelleme başarısız: " + err.message));
    } else {
      dispatch(registerThunk(data))
        .unwrap()
        .then(() => {
          window.alert("Kullanıcı eklendi");
          dispatch(getAllUsersThunk()); // Listeyi yenile
          setFormData(initialFormData); // resetle
        })
        .catch((err) => window.alert("Kayıt başarısız: " + err.message));
    }
  };

  const handleUserClick = async (id) => {
    try {
      const userDetails = await dispatch(getUserDetailsThunk(id)).unwrap();
      console.log("Seçilen kullanıcı:", userDetails);
    } catch (error) {
      console.error("Kullanıcı detayları alınamadı:", error);
    }
  };

  const labels = {
    tcno: "T.C. Kimlik No",
    sicil: "Sicil No",
    telefon: "Telefon No",
    ad: "Ad",
    soyad: "Soyad",
    kullanici_adi: "Kullanıcı Adı",
    sifre: "Şifre",
    telefon: "Telefon",
    email: "E-posta Adresi",
    il: "İl",
    ilce: "İlçe",
    adres: "Adres",
    ise_giris_tarihi: "İşe Giriş Tarihi",
    cinsiyet: "Cinsiyet",
    grupId: "Grup",
    lokasyonId: "Lokasyon",
    imagePreview: "Resim Url",
    roleId: "Rol",
  };

  const handleCheckboxChange = (userId) => {
    setSelectedUserIds(
      (prev) =>
        prev.includes(userId)
          ? prev.filter((id) => id !== userId) // varsa çıkar
          : [...prev, userId] // yoksa ekle
    );
  };

  // Silme işlemi
  const handleDeleteSelected = async () => {
    if (selectedUserIds.length === 0) {
      alert("Lütfen en az bir kullanıcı seçin.");
      return;
    }

    if (!window.confirm(`${selectedUserIds.length} kullanıcı silinsin mi?`)) {
      return;
    }

    try {
      console.log("Seçilen kullanıcılar:", selectedUserIds);
      await dispatch(deleteUsersThunk(selectedUserIds)).unwrap();
      setSelectedUserIds([]); // Seçimleri temizle
      dispatch(getAllUsersThunk()); // Listeyi yenile
    } catch (error) {
      console.error("Silme işlemi başarısız:", error);
    }
  };

  //filtreleme
  const [filters, setFilters] = useState({
    sicil: "",
    ad: "",
    soyad: "",
    lokasyon: "",
    grup: "",
    il: "",
    ilce: "",
  });

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const filteredUsers = users.filter((user) => {
    return (
      (!filters.sicil || user.sicil?.includes(filters.sicil)) &&
      (!filters.ad ||
        user.ad?.toLowerCase().includes(filters.ad.toLowerCase())) &&
      (!filters.soyad ||
        user.soyad?.toLowerCase().includes(filters.soyad.toLowerCase())) &&
      (!filters.lokasyon || user.lokasyon === filters.lokasyon) &&
      (!filters.grup || user.grup === filters.grup) &&
      (!filters.il || user.il === filters.il) &&
      (!filters.ilce || user.ilce === filters.ilce)
    );
  });
  const itemsPerPage = 50;
  const [currentPage, setCurrentPage] = useState(1);

  const limitedUsers = filteredUsers.slice(0, 50);
  const totalPages = Math.ceil(limitedUsers.length / itemsPerPage);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentUsers = limitedUsers.slice(indexOfFirstItem, indexOfLastItem);

  // Lokasyon ve grup için unique değerler
  const uniqueValues = {
    lokasyon: [...new Set(users.map((u) => u.lokasyon).filter(Boolean))],
    grup: [...new Set(users.map((u) => u.grup).filter(Boolean))],
    il: [...new Set(users.map((u) => u.il).filter(Boolean))],
    ilce: [...new Set(users.map((u) => u.ilce).filter(Boolean))],
  };

  function validatePassword(password) {
    const lengthCheck = password.length >= 8;
    const upperCheck = /[A-Z]/.test(password);
    const lowerCheck = /[a-z]/.test(password);
    const digitCheck = /\d/.test(password);
    const specialCheck = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    return (
      lengthCheck && upperCheck && lowerCheck && digitCheck && specialCheck
    );
  }

  function generatePassword() {
    const upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const lower = "abcdefghijklmnopqrstuvwxyz";
    const digits = "0123456789";
    const special = "!@#$%^&*()_+~`|}{[]:;?><,./-=";
    const all = upper + lower + digits + special;

    let password = "";
    // Her şarttan en az 1 karakter ekle
    password += upper[Math.floor(Math.random() * upper.length)];
    password += lower[Math.floor(Math.random() * lower.length)];
    password += digits[Math.floor(Math.random() * digits.length)];
    password += special[Math.floor(Math.random() * special.length)];

    // Geri kalan 4 karakter rastgele
    for (let i = 4; i < 8; i++) {
      password += all[Math.floor(Math.random() * all.length)];
    }

    // Karakterleri karıştır (shuffle)
    password = password
      .split("")
      .sort(() => 0.5 - Math.random())
      .join("");

    return password;
  }
  const [showPassword, setShowPassword] = useState(false);

  const toggleShowPassword = () => {
    setShowPassword((prev) => !prev);
  };
  const validateField = (name, value) => {
    let errors = { ...formErrors };

    switch (name) {
      case "tcno":
        if (!value) errors.tcno = "T.C. Kimlik No zorunludur.";
        else if (value.length !== 11)
          errors.tcno = "T.C. Kimlik No 11 karakter olmalıdır.";
        else if (value.startsWith("0"))
          errors.tcno = "T.C. Kimlik No sıfır ile başlayamaz.";
        else delete errors.tcno;
        break;

      case "sicil":
        if (!value) errors.sicil = "Sicil No zorunludur.";
        else if (value.length < 4 || value.length > 11)
          errors.sicil = "Sicil No 4-11 karakter arasında olmalı.";
        else delete errors.sicil;
        break;

      case "telefon":
        if (!value) errors.telefon = "Telefon numarası zorunludur.";
        else if (!/^\d{3}-\d{3}-\d{4}$/.test(value))
          errors.telefon = "Telefon formatı 555-555-5555 şeklinde olmalıdır.";
        else delete errors.telefon;
        break;

      case "email":
        if (!value) errors.email = "E-posta zorunludur.";
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
          errors.email = "Geçerli bir e-posta giriniz.";
        else delete errors.email;
        break;

      default:
        break;
    }

    setFormErrors(errors);
  };
  const handleAktifPasif = async (durum) => {
    if (selectedUserIds.length === 0) {
      alert("Lütfen en az bir kullanıcı seçin.");
      return;
    }

    const actionText = durum ? "aktif" : "pasif";
    if (
      !window.confirm(
        `${selectedUserIds.length} kullanıcı ${actionText} yapılsın mı?`
      )
    ) {
      return;
    }

    try {
      await dispatch(
        aktifPasifUserThunk({ userIds: selectedUserIds, durum })
      ).unwrap();
      setSelectedUserIds([]); // Seçimleri temizle
      dispatch(getAllUsersThunk()); // Listeyi yenile
      dispatch({
        type: "auth/setAlert",
        payload: {
          type: "success",
          message: `Kullanıcılar ${actionText} yapıldı.`,
        },
      });
    } catch (error) {
      console.error("Aktif/Pasif işlemi başarısız:", error);
      dispatch({
        type: "auth/setAlert",
        payload: {
          type: "danger",
          message: "Aktif/Pasif işlemi sırasında hata oluştu.",
        },
      });
    }
  };
  return (
    <div
      className="register-container"
      style={{
        padding: isMobile ? "2rem 1rem" : "2rem 2rem 2rem 2rem",
        backgroundColor: "#f8f9fc",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: "100%",
      }}
    >
      {/* Sidebar */}
      <div
        style={{
          width: "260px",
          minHeight: "100vh",
          padding: "1rem",
          position: "fixed",
          left: sidebarOpen ? "0" : "-300px", // 👈 kontrol burada
          top: 0,
          backgroundColor: "#001b66",
          color: "#fff",
          boxShadow: "2px 0 8px rgba(0, 0, 0, 0.15)",
          overflowY: "auto",
          zIndex: 10,
          transition: "left 0.3s ease", // 👈 geçiş efekti
        }}
      >
        <Sidebar />
      </div>
      {/* Main content */}
      <div
        style={{
          padding: "2rem",
          backgroundColor: "#f8f9fc",
          minHeight: "100vh",
          display: "flex",
          gap: "20px",
          flexDirection: "column",
          flexWrap: "nowrap",
        }}
      >
        {/* top column - Form */}
        <section
          style={{
            backgroundColor: "#fff",
            borderRadius: "16px",
            padding: "24px",
            boxShadow: "0 4px 12px rgba(0, 27, 102, 0.1)",
            minWidth: "320px",
            maxWidth: "1200px",
            margin: "0 auto",
            fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
            color: "#222",
          }}
        >
          <h1
            style={{
              color: "#001b66",
              fontWeight: "700",
              fontSize: "28px",
              marginBottom: "24px",
              display: "flex",
              alignItems: "center",
              gap: "12px",
            }}
          >
            <i
              className="bi bi-person-fill-add"
              style={{ fontSize: "1.5rem" }}
            ></i>
            Kullanıcı Kayıt
          </h1>

          <section
            style={{
              marginBottom: "30px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "14px",
            }}
          >
            <img
              src={formData.imagePreview || exampleUser}
              alt="Kullanıcı"
              style={{
                width: "150px",
                height: "150px",
                objectFit: "contain",
                borderRadius: "12px",
                boxShadow: "0 4px 10px rgba(0,0,0,0.12)",
                border: "none",
                backgroundColor: "#f5f5f5",
              }}
            />

            {/* Butonları yan yana hizalamak için container */}
            <div style={{ display: "flex", gap: "12px", marginTop: "8px" }}>
              {/* Dosya seçimi butonu */}
              <label
                htmlFor="image"
                style={{
                  padding: "8px 16px",
                  fontSize: "14px",
                  color: "#fff",
                  backgroundColor: "#001b66",
                  borderRadius: "8px",
                  cursor: "pointer",
                  userSelect: "none",
                  display: "inline-block",
                }}
              >
                Resim Ekle
              </label>

              {/* Dosya seçme inputunu gizliyoruz */}
              <input
                type="file"
                id="image"
                name="image"
                onChange={handleFileChange}
                style={{ display: "none" }}
              />

              {/* Resmi Sil butonu */}
              {formData.imagePreview && (
                <button
                  type="button"
                  onClick={() =>
                    setFormData((prev) => ({ ...prev, imagePreview: "" }))
                  }
                  style={{
                    padding: "8px 16px",
                    fontSize: "14px",
                    color: "#d32f2f",
                    backgroundColor: "transparent",
                    border: "1px solid #d32f2f",
                    borderRadius: "8px",
                    cursor: "pointer",
                  }}
                >
                  Resmi Sil
                </button>
              )}
            </div>
          </section>

          <form
            onSubmit={handleSubmit}
            style={{
              display: isMobile ? "block" : "grid",
              gap: "20px",
              gridTemplateColumns: isMobile ? undefined : "repeat(4, 1fr)",
              fontSize: "14px",
            }}
          >
            {[
              "durum",
              "roleId",
              "lokasyonId",
              "grupId",
              "cinsiyet",
              "sicil",
              "tcno",
              "ad",
              "soyad",
              "kullanici_adi",
              "sifre",
              "telefon",
              "email",
              "ise_giris_tarihi",
              "il",
              "ilce",
              "adres",
            ].map((field) => {
              if (field === "image") return null;

              if (!(field in formData)) return null; // formData içinde olmayan alanları atla

              const requiredFields = [
                "tcno",
                "sicil",
                "ad",
                "soyad",
                "kullanici_adi",
                "email",
              ];
              const isRequired = requiredFields.includes(field);

              const labelText = (
                <>
                  {labels[field]}{" "}
                  {isRequired && (
                    <span style={{ color: "#d32f2f" }} title="Zorunlu">
                      *
                    </span>
                  )}
                </>
              );

              if (field === "roleId") {
                return (
                  <div
                    key={field}
                    style={{ display: "flex", flexDirection: "column" }}
                  >
                    <label
                      htmlFor={field}
                      style={{
                        fontWeight: "600",
                        marginBottom: "6px",
                        color: "#444",
                      }}
                    >
                      {labelText}
                    </label>
                    <select
                      id={field}
                      name={field}
                      value={formData[field]}
                      onChange={handleChange}
                      required
                      style={{
                        padding: "10px 12px",
                        borderRadius: "10px",
                        border: "1px solid #ccc",
                        fontSize: "14px",
                        cursor: "pointer",
                        transition: "border-color 0.3s",
                      }}
                      onFocus={(e) => (e.target.style.borderColor = "#001b66")}
                      onBlur={(e) => (e.target.style.borderColor = "#ccc")}
                    >
                      <option value="">Rol seçiniz</option>
                      {roles.map((role) => (
                        <option key={role.id} value={role.id}>
                          {role.name}
                        </option>
                      ))}
                    </select>
                  </div>
                );
              }

              if (field === "sifre") {
                return (
                  <div
                    key={field}
                    style={{ display: "flex", flexDirection: "column" }}
                  >
                    <label
                      htmlFor={field}
                      style={{
                        fontWeight: "600",
                        marginBottom: "6px",
                        color: "#444",
                      }}
                    >
                      {labelText}
                    </label>
                    <div style={{ display: "flex", gap: "8px" }}>
                      <input
                        id={field}
                        name={field}
                        type={showPassword ? "text" : "password"}
                        value={formData[field] || ""}
                        onChange={handleChange}
                        placeholder={labels[field]}
                        required={!selectedUser}
                        disabled={!!selectedUser}
                        style={{
                          flexGrow: 1,
                          padding: "10px 12px",
                          borderRadius: "10px",
                          border: "1px solid #ccc",
                          fontSize: "14px",
                          transition: "border-color 0.3s",
                        }}
                        onFocus={(e) =>
                          (e.target.style.borderColor = "#001b66")
                        }
                        onBlur={(e) => (e.target.style.borderColor = "#ccc")}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((prev) => !prev)}
                        style={{
                          fontSize: "13px",
                          padding: "8px 14px",
                          borderRadius: "10px",
                          border: "1px solid #001b66",
                          backgroundColor: showPassword
                            ? "#001b66"
                            : "transparent",
                          color: showPassword ? "#fff" : "#001b66",
                          cursor: "pointer",
                          transition: "all 0.3s ease",
                        }}
                      >
                        {showPassword ? "Gizle" : "Göster"}
                      </button>
                      {!selectedUser && (
                        <button
                          type="button"
                          onClick={() => {
                            const newPassword = generatePassword();
                            setFormData((prev) => ({
                              ...prev,
                              sifre: newPassword,
                            }));
                          }}
                          style={{
                            fontSize: "13px",
                            padding: "8px 14px",
                            borderRadius: "10px",
                            border: "1px solid #0d6efd",
                            backgroundColor: "#0d6efd",
                            color: "#fff",
                            cursor: "pointer",
                            transition: "background-color 0.3s",
                          }}
                          onMouseEnter={(e) =>
                            (e.target.style.backgroundColor = "#084298")
                          }
                          onMouseLeave={(e) =>
                            (e.target.style.backgroundColor = "#0d6efd")
                          }
                        >
                          Oluştur
                        </button>
                      )}
                    </div>
                    {formData.sifre && !validatePassword(formData.sifre) && (
                      <small
                        style={{
                          color: "#d32f2f",
                          marginTop: "6px",
                          fontSize: "12px",
                        }}
                      >
                        Şifre en az 8 karakter, 1 büyük harf, 1 küçük harf, 1
                        rakam ve 1 özel karakter içermelidir.
                      </small>
                    )}
                  </div>
                );
              }

              if (["cinsiyet", "grupId", "lokasyonId"].includes(field)) {
                const options =
                  field === "cinsiyet"
                    ? [
                        { value: "", label: "Seçiniz" },
                        { value: "Erkek", label: "Erkek" },
                        { value: "Kadın", label: "Kadın" },
                        { value: "Diğer", label: "Diğer" },
                      ]
                    : field === "grupId"
                    ? [
                        { value: "", label: "Seçiniz" },
                        ...groups.map((g) => ({ value: g.id, label: g.name })),
                      ]
                    : [
                        { value: "", label: "Seçiniz" },
                        ...institutions.map((i) => ({
                          value: i.id,
                          label: i.name,
                        })),
                      ];

                return (
                  <div
                    key={field}
                    style={{ display: "flex", flexDirection: "column" }}
                  >
                    <label
                      htmlFor={field}
                      style={{
                        fontWeight: "600",
                        marginBottom: "6px",
                        color: "#444",
                      }}
                    >
                      {labelText}
                    </label>
                    <select
                      id={field}
                      name={field}
                      value={formData[field]}
                      onChange={handleChange}
                      required
                      style={{
                        padding: "10px 12px",
                        borderRadius: "10px",
                        border: "1px solid #ccc",
                        fontSize: "14px",
                        cursor: "pointer",
                        transition: "border-color 0.3s",
                      }}
                      onFocus={(e) => (e.target.style.borderColor = "#001b66")}
                      onBlur={(e) => (e.target.style.borderColor = "#ccc")}
                    >
                      {options.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>
                );
              }

              if (field === "il") {
                return (
                  <div
                    key={field}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <label
                      htmlFor={field}
                      style={{
                        fontWeight: "600",
                        marginBottom: "6px",
                        color: "#444",
                      }}
                    >
                      {labelText}
                    </label>
                    <select
                      id={field}
                      name="il"
                      value={formData.il || ""}
                      onChange={handleProvinceChange}
                      required
                      style={{
                        padding: "10px 12px",
                        borderRadius: "10px",
                        border: "1px solid #ccc",
                        fontSize: "14px",
                        cursor: "pointer",
                        transition: "border-color 0.3s",
                      }}
                      onFocus={(e) => (e.target.style.borderColor = "#001b66")}
                      onBlur={(e) => (e.target.style.borderColor = "#ccc")}
                    >
                      <option value="" disabled>
                        İl seçiniz
                      </option>
                      {provinces.map((province) => (
                        <option key={province.value} value={province.value}>
                          {province.text}
                        </option>
                      ))}
                    </select>
                  </div>
                );
              }

              if (field === "ilce") {
                return (
                  <div
                    key={field}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <label
                      htmlFor={field}
                      style={{
                        fontWeight: "600",
                        marginBottom: "6px",
                        color: "#444",
                      }}
                    >
                      {labelText}
                    </label>
                    <select
                      id={field}
                      name="ilce"
                      value={formData.ilce || ""}
                      onChange={handleDistrictChange}
                      required
                      disabled={!formData.il}
                      style={{
                        padding: "10px 12px",
                        borderRadius: "10px",
                        border: "1px solid #ccc",
                        fontSize: "14px",
                        cursor: formData.il ? "pointer" : "not-allowed",
                        transition: "border-color 0.3s",
                      }}
                      onFocus={(e) => (e.target.style.borderColor = "#001b66")}
                      onBlur={(e) => (e.target.style.borderColor = "#ccc")}
                    >
                      <option value="" disabled>
                        İlçe seçiniz
                      </option>
                      {districts.map((district) => (
                        <option key={district.value} value={district.value}>
                          {district.text}
                        </option>
                      ))}
                    </select>
                  </div>
                );
              }

              if (field === "adres") {
                return (
                  <div
                    key={field}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <label
                      htmlFor={field}
                      style={{
                        fontWeight: "600",
                        marginBottom: "6px",
                        color: "#444",
                      }}
                    >
                      {labelText}
                    </label>
                    <input
                      id={field}
                      name={field}
                      value={formData[field] || ""}
                      onChange={handleChange}
                      placeholder={labels[field]}
                      style={{
                        padding: "10px 12px",
                        borderRadius: "10px",
                        border: "1px solid #ccc",
                        fontSize: "14px",
                        transition: "border-color 0.3s",
                        width: "100%", // kapsadığı grid alanına göre genişlik
                        boxSizing: "border-box",
                      }}
                      onFocus={(e) => (e.target.style.borderColor = "#001b66")}
                      onBlur={(e) => (e.target.style.borderColor = "#ccc")}
                    />
                  </div>
                );
              }

              // Text/date inputs
              return (
                <div
                  key={field}
                  style={{ display: "flex", flexDirection: "column" }}
                >
                  <label
                    htmlFor={field}
                    style={{
                      fontWeight: "600",
                      marginBottom: "6px",
                      color: "#444",
                    }}
                  >
                    {labelText}
                  </label>
                  <input
                    id={field}
                    name={field}
                    type={field === "ise_giris_tarihi" ? "date" : "text"}
                    value={formData[field] || ""}
                    onChange={handleChange}
                    placeholder={labels[field]}
                    required={isRequired}
                    style={{
                      padding: "10px 12px",
                      borderRadius: "10px",
                      border: "1px solid #ccc",
                      fontSize: "14px",
                      transition: "border-color 0.3s",
                    }}
                    onFocus={(e) => (e.target.style.borderColor = "#001b66")}
                    onBlur={(e) => (e.target.style.borderColor = "#ccc")}
                  />
                </div>
              );
            })}

            <button
              type="submit"
              className="btn btn-primary mt-3"
              style={{
                gridColumn: isMobile ? undefined : "1 / -1",
                justifySelf: "center", // Ortalamak için start yerine center
                width: isMobile ? "100%" : "150px", // Masaüstünde sabit, küçük genişlik
              }}
            >
              {selectedPers ? "Güncelle" : "Kaydet"}
            </button>
          </form>
        </section>

        {/* bottom column - User list */}
        <section
          style={{
            backgroundColor: "#fff",
            borderRadius: "12px",
            padding: isMobile ? "0 12px" : "20px", // mobilde sadece yatay padding
            boxShadow: "0 8px 24px rgba(0,27,102,0.08)",
            border: "1px solid #e0e6ed",
            display: "flex",
            flexDirection: "column",
            gap: "15px",
            height: "100%",
            maxHeight: "none",
            maxWidth: isMobile ? "400px" : "100%",
            overflowY: "visible",
            overflowX: "hidden", // taşmayı tamamen engelle
          }}
        >
          <h5
            style={{
              color: "#001b66",
              marginBottom: "10px",
              fontWeight: "600",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              fontSize: "1.25rem",
              marginTop: isMobile ? "10px" : "0",
            }}
          >
            <i className="bi bi-people-fill"></i> Kullanıcı Listesi
          </h5>

          <div style={{ flexGrow: 1, overflowY: "auto" }}>
            <UserFilter
              filters={filters}
              onChange={handleFilterChange}
              uniqueValues={uniqueValues}
            />
          </div>
          <div className="row g-2 mt-3">
            <div className="col-12 col-md-3">
              <button
                className="btn btn-success w-100"
                disabled={selectedUserIds.length === 0}
                onClick={() => handleAktifPasif(true)}
              >
                Seçilenleri Aktif Yap
              </button>
            </div>
            <div className="col-12 col-md-3">
              <button
                className="btn btn-secondary w-100"
                disabled={selectedUserIds.length === 0}
                onClick={() => handleAktifPasif(false)}
              >
                Seçilenleri Pasif Yap
              </button>
            </div>
            <div className="col-12 col-md-3">
              <button
                className="btn btn-warning w-100"
                disabled={selectedUserIds.length !== 1}
                onClick={handleGuncelleClick}
              >
                Seçileni Güncelle
              </button>
            </div>
            <div className="col-12 col-md-3">
              <button
                className="btn btn-danger w-100"
                disabled={selectedUserIds.length === 0}
                onClick={() => handleDeleteSelected()}
              >
                Seçilenleri Sil
              </button>
            </div>
            <div className="col-12 col-md-3">
              <BulkRegister />
            </div>
          </div>

          <UserList
            users={currentUsers}
            selectedUser={selectedUser}
            selectedUserIds={selectedUserIds}
            setSelectedUserIds={setSelectedUserIds}
            onUserClick={handleUserClick}
            onCheckboxChange={handleCheckboxChange}
            onDeleteSelected={handleDeleteSelected}
            isMobile={isMobile} // sütun gizlemek için prop
            style={{ flex: 1 }}
          />

          {/* Pagination */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "8px",
              marginTop: "10px",
              marginBottom: isMobile ? "10px" : "0",
            }}
          >
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i + 1}
                onClick={() => setCurrentPage(i + 1)}
                disabled={currentPage === i + 1}
                style={{
                  padding: "6px 12px",
                  cursor: currentPage === i + 1 ? "default" : "pointer",
                  backgroundColor: currentPage === i + 1 ? "#001b66" : "#fff",
                  color: currentPage === i + 1 ? "#fff" : "#001b66",
                  border: "1px solid #001b66",
                  borderRadius: "4px",
                }}
              >
                {i + 1}
              </button>
            ))}
          </div>

          {/* Butonlar */}
        </section>
      </div>
    </div>
  );
}
