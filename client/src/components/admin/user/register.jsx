import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { registerThunk } from "../../../features/thunks/authThunk";
import { clearAlert } from "../../../features/slices/authSlice";
import {
  getAllUsersThunk,
  getUserDetailsThunk,
  updateUserDetailsThunk,
  deleteUsersThunk,
  aktifPasifUserThunk,
} from "../../../features/thunks/userThunk";
import {
  getGroupsThunk,
  getInstitutionsThunk,
} from "../../../features/thunks/grpInstThunk";
import UserList from "./userList";
import UserFilter from "./userFilter";
import BulkRegister from "./bulkRegister";
import Sidebar from "../adminPanel/sidebar";

export default function Register() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

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
    grupId: "",
    lokasyonId: "",
    image: null,
  });

  useEffect(() => {
    dispatch(getGroupsThunk());
    dispatch(getInstitutionsThunk());
  }, [dispatch]);

  const { groups, institutions } = useSelector((state) => state.grpInst);
  const { alert, loading } = useSelector((state) => state.auth);
  const { users, selectedUser } = useSelector((state) => state.user);
  const [selectedUserIds, setSelectedUserIds] = useState([]); // 1. Seçilen kullanıcılar
  const [selectedPers, setSelectedPers] = useState("");

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
    const userToEdit = filteredUsers.find((user) => user.id === userId);

    if (userToEdit) {
      setSelectedPers(userToEdit);

      setFormData({
        tcno: userToEdit.tcno || "",
        sicil: userToEdit.sicil || "",
        ad: userToEdit.ad || "",
        soyad: userToEdit.soyad || "",
        kullanici_adi: userToEdit.kullanici_adi || "",
        sifre: "", // şifre güvenlik için boş
        telefon: userToEdit.telefon || "",
        email: userToEdit.email || "",
        il: userToEdit.il || "",
        ilce: userToEdit.ilce || "",
        adres: userToEdit.adres || "",
        ise_giris_tarihi: userToEdit.ise_giris_tarihi || "",
        cinsiyet: userToEdit.cinsiyet || "",
        grupId: userToEdit.grupId || "",
        lokasyonId: userToEdit.lokasyonId || "",
        image: userToEdit.image || null,
      });

      // Sayfanın en üstüne kaydır
      window.scrollTo({
        top: 0,
        behavior: "smooth", // yumuşak kaydırma efekti için
      });
    }
  };

  const handleFileChange = (e) => {
    setFormData({
      ...formData,
      image: e.target.files[0],
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (selectedUser) {
      // Güncelleme işlemi
      updateUser(selectedUser.id, formData)
        .then(() => {
          alert("Kullanıcı güncellendi");
          setSelectedUser(null);
          setFormData(initialFormData); // formu resetle
          // Listeyi güncelle veya yeniden yükle
        })
        .catch((err) => alert("Güncelleme başarısız: " + err.message));
    } else {
      // Yeni kayıt işlemi
      createUser(formData)
        .then(() => {
          alert("Kullanıcı eklendi");
          setFormData(initialFormData);
          // Listeyi güncelle veya yeniden yükle
        })
        .catch((err) => alert("Kayıt başarısız: " + err.message));
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
    grup: "Grup",
    lokasyon: "Lokasyon",
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
    <div className="register-container">
      {/* Sidebar */}
      <div
        style={{
          width: "260px",
          minHeight: "100vh",
          padding: "1rem",
          position: "fixed",
          left: 0,
          top: 0,
          backgroundColor: "#001b66",
          color: "#fff",
          boxShadow: "2px 0 8px rgba(0, 0, 0, 0.15)",
          overflowY: "auto",
          zIndex: 10,
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
          flexDirection: "column", // burayı row'dan column'a değiştirdik
          flexWrap: "nowrap",
        }}
      >
        {/* Left column - Form */}
        <section
          style={{
            backgroundColor: "#fff",
            borderRadius: "12px",
            padding: "20px",
            boxShadow: "0 8px 24px rgba(0,27,102,0.08)",
            border: "1px solid #e0e6ed",
            minWidth: "320px",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <h1
            style={{
              color: "#001b66",
              fontSize: "24px",
              fontWeight: "600",
              marginBottom: "20px",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <i className="bi bi-file-earmark-text-fill"></i> Kullanıcı Kayıt
          </h1>

          <form onSubmit={handleSubmit} style={{ display: "grid" }}>
            <div className="row g-3">
              {Object.keys(formData).map((field) => {
                if (field === "image") return null;

                if (field === "cinsiyet") {
                  return (
                    <div
                      className="col-6 d-flex align-items-center"
                      key={field}
                    >
                      <label
                        htmlFor={field}
                        className="form-label me-2"
                        style={{ minWidth: "110px" }}
                      >
                        {labels[field]}
                      </label>
                      <select
                        id={field}
                        name={field}
                        className="form-select form-select-sm flex-grow-1"
                        value={formData[field]}
                        onChange={handleChange}
                        required
                      >
                        <option value="">Seçiniz</option>
                        <option value="Erkek">Erkek</option>
                        <option value="Kadın">Kadın</option>
                        <option value="Diğer">Diğer</option>
                      </select>
                    </div>
                  );
                }

                if (field === "sifre") {
                  return (
                    <div
                      className="col-12 d-flex align-items-start"
                      key={field}
                      style={{ gap: "8px" }}
                    >
                      <label
                        htmlFor={field}
                        className="form-label pt-2"
                        style={{ minWidth: "110px" }}
                      >
                        {labels[field]}
                      </label>
                      <div className="flex-grow-1 d-flex gap-2 flex-column">
                        <div className="input-group input-group-sm">
                          <input
                            id={field}
                            name={field}
                            type={showPassword ? "text" : "password"}
                            className="form-control"
                            value={formData[field] || ""}
                            onChange={handleChange}
                            placeholder={labels[field]}
                            required={!selectedUser}
                            disabled={!!selectedUser}
                          />
                          <button
                            type="button"
                            className="btn btn-outline-secondary btn-sm"
                            onClick={() => setShowPassword((prev) => !prev)}
                            tabIndex={-1}
                          >
                            {showPassword ? "Gizle" : "Göster"}
                          </button>
                          {!selectedUser && (
                            <button
                              type="button"
                              className="btn btn-outline-primary btn-sm"
                              onClick={() => {
                                const newPassword = generatePassword();
                                setFormData((prev) => ({
                                  ...prev,
                                  sifre: newPassword,
                                }));
                              }}
                              tabIndex={-1}
                            >
                              Şifre Oluştur
                            </button>
                          )}
                        </div>
                        {formData.sifre &&
                          !validatePassword(formData.sifre) && (
                            <small className="text-danger">
                              Şifre en az 8 karakter, 1 büyük harf, 1 küçük
                              harf, 1 rakam ve 1 özel karakter içermelidir.
                            </small>
                          )}
                      </div>
                    </div>
                  );
                }

                if (field === "grupId") {
                  return (
                    <div
                      className="col-6 d-flex align-items-center"
                      key={field}
                    >
                      <label
                        htmlFor={field}
                        className="form-label me-2"
                        style={{ minWidth: "110px" }}
                      >
                        {labels[field] || "Grup"}
                      </label>
                      <select
                        id={field}
                        name={field}
                        className="form-select form-select-sm flex-grow-1"
                        value={formData[field]}
                        onChange={handleChange}
                        required
                      >
                        <option value="">Seçiniz</option>
                        {groups.map((group) => (
                          <option key={group.id} value={group.id}>
                            {group.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  );
                }

                if (field === "lokasyonId") {
                  return (
                    <div
                      className="col-6 d-flex align-items-center"
                      key={field}
                    >
                      <label
                        htmlFor={field}
                        className="form-label me-2"
                        style={{ minWidth: "110px" }}
                      >
                        {labels[field] || "Lokasyon"}
                      </label>
                      <select
                        id={field}
                        name={field}
                        className="form-select form-select-sm flex-grow-1"
                        value={formData[field]}
                        onChange={handleChange}
                        required
                      >
                        <option value="">Seçiniz</option>
                        {institutions.map((inst) => (
                          <option key={inst.id} value={inst.id}>
                            {inst.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  );
                }

                return (
                  <div
                    className="col-6 d-flex align-items-center"
                    key={field}
                    style={{ gap: "8px" }}
                  >
                    <label
                      htmlFor={field}
                      className="form-label me-2"
                      style={{ minWidth: "110px" }}
                    >
                      {labels[field]}
                    </label>
                    <input
                      id={field}
                      name={field}
                      type={field === "ise_giris_tarihi" ? "date" : "text"}
                      className="form-control form-control-sm flex-grow-1"
                      value={formData[field] || ""}
                      onChange={handleChange}
                      placeholder={labels[field]}
                      required={[
                        "tcno",
                        "sicil",
                        "ad",
                        "soyad",
                        "kullanici_adi",
                        "email",
                      ].includes(field)}
                    />
                  </div>
                );
              })}

              {/* Dosya Yükleme full width */}
              <div
                className="col-12 d-flex align-items-center"
                style={{ gap: "8px" }}
              >
                <label
                  htmlFor="image"
                  className="form-label"
                  style={{ minWidth: "110px" }}
                >
                  Resim
                </label>
                <input
                  type="file"
                  id="image"
                  name="image"
                  className="form-control form-control-sm flex-grow-1"
                  onChange={handleFileChange}
                />
              </div>
            </div>

            {/* Submit Butonu */}
            <button
              type="submit"
              className="btn btn-primary w-100 mt-4"
              disabled={loading}
            >
              {loading ? (
                <span
                  className="spinner-border spinner-border-sm"
                  role="status"
                />
              ) : selectedUser ? (
                "Güncelle"
              ) : (
                "Kayıt Et"
              )}
            </button>
          </form>
        </section>

        {/* Right column - User list */}
        <section
          style={{
            backgroundColor: "#fff",
            borderRadius: "12px",
            padding: "20px",
            boxShadow: "0 8px 24px rgba(0,27,102,0.08)",
            border: "1px solid #e0e6ed",
            minWidth: "320px",
            display: "flex",
            flexDirection: "column",
            gap: "15px",
            maxHeight: "90vh",
            overflowY: "auto",
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
            }}
          >
            <i className="bi bi-people-fill"></i> Kullanıcı Listesi
          </h5>

          <UserFilter
            filters={filters}
            onChange={handleFilterChange}
            uniqueValues={uniqueValues}
          />

          <div className="d-flex align-items-center gap-3 my-3">
            <button
              className="btn btn-success flex-grow-1"
              disabled={selectedUserIds.length === 0}
              onClick={() => handleAktifPasif(true)}
              style={{ minWidth: "150px" }}
            >
              Seçilenleri Aktif Yap
            </button>
            <button
              className="btn btn-secondary flex-grow-1"
              disabled={selectedUserIds.length === 0}
              onClick={() => handleAktifPasif(false)}
              style={{ minWidth: "150px" }}
            >
              Seçilenleri Pasif Yap
            </button>

            <button
              className="btn btn-warning flex-grow-1"
              disabled={selectedUserIds.length !== 1}
              onClick={handleGuncelleClick}
              style={{ minWidth: "150px" }}
            >
              Seçileni Güncelle
            </button>

            <button
              className="btn btn-danger flex-grow-1"
              disabled={selectedUserIds.length === 0}
              onClick={() => handleDeleteSelected()}
              style={{ minWidth: "150px" }}
            >
              Seçilenleri Sil
            </button>

            <div style={{ flexShrink: 0 }}>
              <BulkRegister />
            </div>
          </div>

          <UserList
            users={filteredUsers}
            selectedUser={selectedUser}
            selectedUserIds={selectedUserIds}
            setSelectedUserIds={setSelectedUserIds} // 🔧 EKLENDİ
            onUserClick={handleUserClick}
            onCheckboxChange={handleCheckboxChange}
            onDeleteSelected={handleDeleteSelected}
            style={{ flex: 1 }}
          />
        </section>
      </div>
    </div>
  );
}
