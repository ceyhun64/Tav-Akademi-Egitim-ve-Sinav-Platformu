import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
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
import exampleUser from "../../../../public/example/exampleUser.jpg";
import "./register.css";
import { getRolesThunk } from "../../../features/thunks/roleThunk";
import ExportToExcel from "./exportToExcel";

export default function Register() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation(); // Burayı ekleyin

  const initialFormData = {
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
    imagePreview: null,
  };

  const [formData, setFormData] = useState(initialFormData);
  const [selectedPers, setSelectedPers] = useState(null);
  const [formErrors, setFormErrors] = useState({});

  // Resim input'unu referans almak için useRef kullanın
  const imageInputRef = useRef(null);

  // --- Yeni eklenen durumlar ---
  const [usernameAvailability, setUsernameAvailability] = useState(null); // 'checking', 'available', 'taken', 'error'
  const [typingTimeout, setTypingTimeout] = useState(null);
  // --- Yeni eklenen durumlar sonu ---

  useEffect(() => {
    dispatch(getGroupsThunk());
    dispatch(getInstitutionsThunk());
    dispatch(getRolesThunk());
  }, [dispatch]);

  const { roles } = useSelector((state) => state.role);
  const { groups, institutions } = useSelector((state) => state.grpInst);
  const { alert, loading } = useSelector((state) => state.auth);
  const { users, selectedUser } = useSelector((state) => state.user);
  const [selectedUserIds, setSelectedUserIds] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // districts state'ini formData.il'e göre türet
  const districts = formData.il
    ? provinces.find((p) => p.value === formData.il)?.districts || []
    : [];

  //il seçimi
  const handleProvinceChange = (e) => {
    const selectedProvinceValue = Number(e.target.value);

    setFormData((prev) => ({
      ...prev,
      il: selectedProvinceValue,
      ilce: "", // ilçe sıfırlanıyor
    }));
    // districts artık otomatik güncellenecek, burada setDistricts'e gerek yok
    validateField("il", selectedProvinceValue); // Validate on change
  };

  //ilçe seçimi
  const handleDistrictChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      ilce: Number(e.target.value),
    }));
    validateField("ilce", Number(e.target.value)); // Validate on change
  };

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setSidebarOpen(true);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    setSidebarOpen(!isMobile);
  }, [isMobile]);

  useEffect(() => {
    dispatch(getAllUsersThunk());
  }, [dispatch]);

  // Seçilen kullanıcı detayları formu güncelleyelim
  useEffect(() => {
    if (selectedUser) {
      setSelectedPers(selectedUser);

      setFormData((prev) => ({
        ...prev,
        tcno: selectedUser.tcno || "",
        sicil: selectedUser.sicil || "",
        ad: selectedUser.ad || "",
        soyad: selectedUser.soyad || "",
        kullanici_adi: selectedUser.kullanici_adi || "",
        sifre: "",
        telefon: selectedUser.telefon || "",
        email: selectedUser.email || "",
        il: selectedUser.il ? Number(selectedUser.il) : "", // Burayı kontrol edin
        ilce: selectedUser.ilce ? Number(selectedUser.ilce) : "", // Burası önemli!
        adres: selectedUser.adres || "",
        ise_giris_tarihi: selectedUser.ise_giris_tarihi
          ? new Date(selectedUser.ise_giris_tarihi).toISOString().split("T")[0]
          : "",
        cinsiyet: selectedUser.cinsiyet || "",
        grupId: selectedUser.grupId || "",
        lokasyonId: selectedUser.lokasyonId || "",
        image: null,
        imagePreview: selectedUser.image || null,
        roleId: selectedUser.roleId || "",
      }));
      // Kullanıcı güncellenirken kullanıcı adı uygunluğunu sıfırla veya mevcut kullanıcı adını kontrol etme
      setUsernameAvailability(null);
      clearTimeout(typingTimeout);
    } else {
      setFormData(initialFormData);
      setSelectedPers(null);
      setFormErrors({});
      setUsernameAvailability(null); // Yeni kullanıcı eklerken uygunluk durumunu sıfırla
      clearTimeout(typingTimeout); // Timeout'u temizle
      // Kullanıcı seçimi kalktığında veya yeni kullanıcı eklenirken input'u temizle
      if (imageInputRef.current) {
        imageInputRef.current.value = "";
      }
    }
  }, [selectedUser]);

  // --- All Validation Logic Consolidated Here ---
  const validateAllFields = (dataToValidate) => {
    let errors = {};
    const nameSurnameRegex = /^[a-zA-ZğüşıöçĞÜŞİÖÇ\s]+$/;

    // TC Kimlik No
    if (!dataToValidate.tcno) {
      errors.tcno = "T.C. Kimlik No zorunludur.";
    } else if (dataToValidate.tcno.length !== 11) {
      errors.tcno = "T.C. Kimlik No 11 karakter olmalıdır.";
    } else if (dataToValidate.tcno.startsWith("0")) {
      errors.tcno = "T.C. Kimlik No sıfır ile başlayamaz.";
    } else if (isNaN(dataToValidate.tcno)) {
      errors.tcno = "T.C. Kimlik No sadece rakamlardan oluşmalıdır.";
    }

    // Sicil No
    if (!dataToValidate.sicil) {
      errors.sicil = "Sicil No zorunludur.";
    } else if (
      dataToValidate.sicil.length < 4 ||
      dataToValidate.sicil.length > 11
    ) {
      errors.sicil = "Sicil No 4-11 karakter arasında olmalı.";
    } else if (isNaN(dataToValidate.sicil)) {
      errors.sicil = "Sicil No sadece rakamlardan oluşmalıdır.";
    }

    // E-posta
    if (!dataToValidate.email) {
      errors.email = "E-posta zorunludur.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(dataToValidate.email)) {
      errors.email = "Geçerli bir e-posta giriniz.";
    }

    // Ad
    if (!dataToValidate.ad) {
      errors.ad = "Ad zorunludur.";
    } else if (!nameSurnameRegex.test(dataToValidate.ad)) {
      errors.ad = "Ad sadece harf ve boşluk içermelidir.";
    } else if (dataToValidate.ad.length < 2 || dataToValidate.ad.length > 15) {
      errors.ad = `Ad 2-15 karakter arasında olmalıdır.`;
    }

    // Soyad
    if (!dataToValidate.soyad) {
      errors.soyad = "Soyad zorunludur.";
    } else if (!nameSurnameRegex.test(dataToValidate.soyad)) {
      errors.soyad = "Soyad sadece harf ve boşluk içermelidir.";
    } else if (
      dataToValidate.soyad.length < 2 ||
      dataToValidate.soyad.length > 15
    ) {
      errors.soyad = `Soyad 2-15 karakter arasında olmalıdır.`;
    }

    // Kullanıcı Adı
    if (!dataToValidate.kullanici_adi) {
      errors.kullanici_adi = "Kullanıcı Adı zorunludur.";
    } else if (
      dataToValidate.kullanici_adi.length < 2 ||
      dataToValidate.kullanici_adi.length > 15
    ) {
      errors.kullanici_adi = `Kullanıcı adı 2-15 karakter arasında olmalıdır.`;
    } else if (
      usernameAvailability === "taken" &&
      !(
        selectedPers &&
        dataToValidate.kullanici_adi === selectedPers.kullanici_adi
      )
    ) {
      errors.kullanici_adi = "Bu kullanıcı adı zaten sistemde kayıtlı.";
    } else if (usernameAvailability === "checking") {
      errors.kullanici_adi = "Kullanıcı adı uygunluk kontrolü devam ediyor.";
    }

    // Şifre (Sadece yeni kullanıcı eklenirken veya mevcut kullanıcı şifresini değiştirirken zorunlu)
    if (!selectedPers && !dataToValidate.sifre) {
      errors.sifre = "Şifre zorunludur.";
    } else if (
      dataToValidate.sifre &&
      !validatePassword(dataToValidate.sifre)
    ) {
      errors.sifre =
        "Şifre en az 8 karakter olmalı, büyük/küçük harf, rakam ve özel karakter içermelidir.";
    }

    // Rol Seçimi
    if (!dataToValidate.roleId) {
      errors.roleId = "Rol seçimi zorunludur.";
    }

    // Grup Seçimi
    if (!dataToValidate.grupId) {
      errors.grupId = "Grup seçimi zorunludur.";
    }

    // Lokasyon Seçimi
    if (!dataToValidate.lokasyonId) {
      errors.lokasyonId = "Lokasyon seçimi zorunludur.";
    }

    // İl Seçimi
    if (!dataToValidate.il) {
      errors.il = "İl seçimi zorunludur.";
    }

    // İlçe Seçimi
    if (!dataToValidate.ilce) {
      errors.ilce = "İlçe seçimi zorunludur.";
    }

    // İşe Giriş Tarihi
    if (!dataToValidate.ise_giris_tarihi) {
      errors.ise_giris_tarihi = "İşe giriş tarihi zorunludur.";
    }

    // Telefon
    if (!dataToValidate.telefon) {
      errors.telefon = "Telefon numarası zorunludur.";
    } else if (!/^\d{3}-\d{3}-\d{4}$/.test(dataToValidate.telefon)) {
      errors.telefon = "Telefon formatı 555-555-5555 şeklinde olmalıdır.";
    }

    // Cinsiyet
    if (!dataToValidate.cinsiyet) {
      errors.cinsiyet = "Cinsiyet seçimi zorunludur.";
    }

    // Adres
    if (!dataToValidate.adres) {
      errors.adres = "Adres zorunludur.";
    }

    return errors;
  };

  const validateField = (name, value) => {
    // This function will now call validateAllFields for the current formData state
    // and then specifically update the error for the changed field.
    const allErrors = validateAllFields({ ...formData, [name]: value });
    setFormErrors(allErrors); // This will update all errors based on the current state + the field being validated
    return !allErrors[name]; // Return true if there's no error for the specific field
  };

  // --- Kullanıcı adı uygunluk kontrolü fonksiyonu ---
  const checkUsernameAvailability = async (username) => {
    // If in edit mode and username hasn't changed, no need to check
    if (selectedPers && selectedPers.kullanici_adi === username) {
      setUsernameAvailability("available");
      setFormErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.kullanici_adi;
        return newErrors;
      });
      return;
    }

    try {
      const response = await fetch(
        `/api/users/check-username?username=${username}`
      ); // API yolunuzu düzenleyin
      const data = await response.json();

      if (response.ok) {
        if (data.exists) {
          setUsernameAvailability("taken");
          setFormErrors((prev) => ({
            ...prev,
            kullanici_adi: "Bu kullanıcı adı zaten sistemde kayıtlı.",
          }));
        } else {
          setUsernameAvailability("available");
          setFormErrors((prev) => {
            const newErrors = { ...prev };
            delete newErrors.kullanici_adi;
            return newErrors;
          });
        }
      } else {
        // API'den hata döndüğünde
        setUsernameAvailability("error");
      }
    } catch (error) {
      console.error("Kullanıcı adı uygunluk kontrolü başarısız:", error);
      setUsernameAvailability("error");
      setFormErrors((prev) => ({
        ...prev,
        kullanici_adi: "Kullanıcı adı kontrol edilirken bir hata oluştu.",
      }));
    }
  };
  // --- Kullanıcı adı uygunluk kontrolü fonksiyonu sonu ---

  const handleChange = (e) => {
    const { name, value } = e.target;

    let newValue = value;
    if (name === "telefon") {
      let formatted = value.replace(/\D/g, "").substring(0, 10);
      if (formatted.length > 3 && formatted.length <= 6) {
        formatted = formatted.replace(/(\d{3})(\d+)/, "$1-$2");
      } else if (formatted.length > 6) {
        formatted = formatted.replace(/(\d{3})(\d{3})(\d+)/, "$1-$2-$3");
      }
      newValue = formatted;
    }
    setFormData((prev) => ({ ...prev, [name]: newValue }));

    // --- Kullanıcı adı için eklenen kod ---
    if (name === "kullanici_adi") {
      if (typingTimeout) {
        clearTimeout(typingTimeout);
      }

      if (newValue.length > 0) {
        setUsernameAvailability("checking"); // Indicate that a check is in progress
        const newTimeout = setTimeout(() => {
          checkUsernameAvailability(newValue);
        }, 500); // 500ms debounce
        setTypingTimeout(newTimeout);
      } else {
        setUsernameAvailability(null); // Reset status if username is empty
        setFormErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors.kullanici_adi; // Clear error message too
          return newErrors;
        });
      }
    }
    // --- Kullanıcı adı için eklenen kod sonu ---

    // Validate the changed field immediately (will trigger a re-validation of all fields)
    validateField(name, newValue);
  };

  const handleGuncelleClick = async () => {
    if (selectedUserIds.length !== 1) return;

    const userId = selectedUserIds[0];
    dispatch(getUserDetailsThunk(userId));
    window.scrollTo({ top: 0, behavior: "smooth" });
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
    } else {
      // Eğer dosya seçimi iptal edilirse veya dosya yoksa, preview'i temizle
      setFormData((prev) => ({
        ...prev,
        image: null,
        imagePreview: null,
      }));
    }
  };

  // Yeni fonksiyon: Resmi silme
  const handleRemoveImage = () => {
    setFormData((prev) => ({
      ...prev,
      image: null,
      imagePreview: null,
    }));
    // input elementinin value'sini sıfırlayarak aynı dosyanın tekrar seçilmesini sağlarız
    if (imageInputRef.current) {
      imageInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const errors = validateAllFields(formData); // Validate all fields on submit
    setFormErrors(errors); // Update formErrors state

    if (Object.keys(errors).length > 0) {
      const errorMessages = Object.values(errors)
        .filter((msg) => msg)
        .join("\n");
      window.alert("Lütfen aşağıdaki hataları düzeltin:\n" + errorMessages);
      return;
    }

    // Final check for username availability before submission
    if (usernameAvailability === "checking") {
      window.alert(
        "Kullanıcı adı uygunluk kontrolü devam ediyor. Lütfen bekleyin."
      );
      return;
    }
    if (
      usernameAvailability === "taken" &&
      !(selectedPers && formData.kullanici_adi === selectedPers.kullanici_adi)
    ) {
      window.alert(
        "Bu kullanıcı adı zaten sistemde kayıtlı. Lütfen farklı bir kullanıcı adı seçin."
      );
      return;
    }

    const data = new FormData();

    if (selectedPers) {
      let hasChanges = false;

      for (const key in formData) {
        if (key === "imagePreview" || (key === "sifre" && !formData.sifre)) {
          continue;
        }

        if (key === "image" && formData.image) {
          data.append("file", formData.image);
          hasChanges = true;
          continue;
        }

        if (key === "sifre" && formData.sifre) {
          data.append(key, formData.sifre);
          hasChanges = true;
          continue;
        }

        let originalValue = selectedPers[key];

        if (key === "ise_giris_tarihi" && originalValue) {
          originalValue = new Date(originalValue).toISOString().split("T")[0];
        }

        if (
          ["roleId", "grupId", "lokasyonId", "il", "ilce"].includes(key) &&
          originalValue !== null &&
          originalValue !== undefined
        ) {
          originalValue = String(originalValue);
        }

        if (String(formData[key]) !== String(originalValue)) {
          data.append(key, formData[key]);
          hasChanges = true;
        }
      }

      if (selectedPers.image && formData.imagePreview === null) {
        data.append("deleteImage", "true");
        hasChanges = true;
      }

      if (
        !hasChanges &&
        !formData.image &&
        !(selectedPers.image && formData.imagePreview === null)
      ) {
        window.alert("Herhangi bir değişiklik yapılmadı.");
        return;
      }

      dispatch(updateUserDetailsThunk({ id: selectedPers.id, formData: data }))
        .unwrap()
        .then(() => {
          window.alert("Kullanıcı güncellendi");

          dispatch(getAllUsersThunk());

          // Burada formu sıfırla ve tekrar kayıt moduna geç
          setSelectedPers(null);
          setFormData(initialFormData);
          setFormErrors({});
          setUsernameAvailability(null);
          if (imageInputRef.current) {
            imageInputRef.current.value = "";
          }
        })
        .catch((err) => {
          const errorMessage = err.message || "Güncelleme başarısız.";
          window.alert("Güncelleme başarısız: " + errorMessage);
        });
    } else {
      Object.entries(formData).forEach(([key, value]) => {
        if (key !== "imagePreview" && key !== "image") {
          data.append(key, value);
        } else if (key === "image" && value) {
          data.append("file", value);
        }
      });

      dispatch(registerThunk(data))
        .unwrap()
        .then(() => {
          window.alert("Kullanıcı eklendi");
          dispatch(getAllUsersThunk());
          setFormData(initialFormData);
          setFormErrors({});
          setUsernameAvailability(null); // Reset status after successful registration
          if (imageInputRef.current) {
            imageInputRef.current.value = "";
          }
        })
        .catch((err) => {
          const errorMessage = err.message || "Kayıt başarısız.";
          window.alert("Kayıt başarısız: " + errorMessage);
        });
    }
  };

  const handleUserClick = async (id) => {
    try {
      const userDetails = await dispatch(getUserDetailsThunk(id)).unwrap();
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
    setSelectedUserIds((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  const handleDeleteSelected = async () => {
    if (selectedUserIds.length === 0) {
      alert("Lütfen en az bir kullanıcı seçin.");
      return;
    }

    if (!window.confirm(`${selectedUserIds.length} kullanıcı silinsin mi?`)) {
      return;
    }

    try {
      await dispatch(deleteUsersThunk(selectedUserIds)).unwrap();
      setSelectedUserIds([]);
      dispatch(getAllUsersThunk());
    } catch (error) {
      console.error("Silme işlemi başarısız:", error);
    }
  };

  const [filters, setFilters] = useState({
    sicil: "",
    ad: "",
    soyad: "",
    lokasyonId: "",
    grupId: "",
    il: "",
    ilce: "",
    kullanici_adi: "", // Kullanıcı adı filtresini ekledik
  });

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const filteredUsers = users.filter((user) => {
    const userIl = user.il ? String(user.il) : "";
    const userIlce = user.ilce ? String(user.ilce) : "";
    const filterIl = filters.il ? String(filters.il) : "";
    const filterIlce = filters.ilce ? String(filters.ilce) : "";

    return (
      (!filters.sicil || user.sicil?.includes(filters.sicil)) &&
      (!filters.ad ||
        user.ad?.toLowerCase().includes(filters.ad.toLowerCase())) &&
      (!filters.soyad ||
        user.soyad?.toLowerCase().includes(filters.soyad.toLowerCase())) &&
      (!filters.lokasyonId || user.lokasyonId === Number(filters.lokasyonId)) &&
      (!filters.grupId || user.grupId === Number(filters.grupId)) &&
      (!filterIl || userIl === filterIl) &&
      (!filterIlce || userIlce === filterIlce) &&
      (!filters.kullanici_adi ||
        user.kullanici_adi
          ?.toLowerCase()
          .includes(filters.kullanici_adi.toLowerCase()))
    );
  });

  const itemsPerPage = 50;
  const [currentPage, setCurrentPage] = useState(1);

  const limitedUsers = filteredUsers.slice(0, 50); // This line effectively limits the *total* filtered users to 50 before pagination
  const totalPages = Math.ceil(limitedUsers.length / itemsPerPage);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentUsers = limitedUsers.slice(indexOfFirstItem, indexOfLastItem);

  const uniqueValues = {
    lokasyonId: [...new Set(users.map((u) => u.lokasyonId).filter(Boolean))],
    grupId: [...new Set(users.map((u) => u.grupId).filter(Boolean))],
    il: [...new Set(users.map((u) => u.il).filter(Boolean))],
    ilce: [...new Set(users.map((u) => u.ilce).filter(Boolean))],
  };

  const [isTablet, setIsTablet] = useState(false); // 768px - 1200px
  const TABLET_BREAKPOINT = 1000;
  const DESKTOP_BREAKPOINT = 1350;

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setIsMobile(width < TABLET_BREAKPOINT);
      setIsTablet(width >= TABLET_BREAKPOINT && width < DESKTOP_BREAKPOINT);
      // Büyük ekranda sidebar açık kalsın, küçükte kapalı
      setSidebarOpen(width >= TABLET_BREAKPOINT); // Tablet ve masaüstünde açık
    };

    handleResize(); // İlk render'da boyutları ayarla
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const selectWidth = 300; // Hem mobil hem masaüstü için ortak genişlik

  // content-columns için grid şablonunu belirleme
  const gridTemplateColumnsStyle = isMobile || isTablet ? "1fr" : "2fr 1fr";

  function validatePassword(password) {
    const lengthCheck = password.length >= 8;
    const upperCheck = /[A-Z]/.test(password);
    const lowerCheck = /[a-z]/.test(password);
    const digitCheck = /\d/.test(password);
    const specialCheck = /[!@#$%^&*(),.?":{}|<>+-]/.test(password); // + eklendi

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
    password += upper[Math.floor(Math.random() * upper.length)];
    password += lower[Math.floor(Math.random() * lower.length)];
    password += digits[Math.floor(Math.random() * digits.length)];
    password += special[Math.floor(Math.random() * special.length)];

    for (let i = 4; i < 8; i++) {
      password += all[Math.floor(Math.random() * all.length)];
    }

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
      setSelectedUserIds([]);
      dispatch(getAllUsersThunk());
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

  const handleClearAllInputs = () => {
    setFormData(initialFormData); // Tüm form verilerini başlangıç durumuna sıfırla
    setShowPassword(false); // Şifre görünürlüğünü kapat
    // Eğer bir dosya input'u kullanıyorsanız, değerini manuel olarak sıfırlamanız gerekebilir:
    const fileInput = document.getElementById("image");
    if (fileInput) {
      fileInput.value = "";
    }
    // Eğer bir kullanıcı seçiliyse ve formu temizlerken seçimi de kaldırmak istiyorsanız:
    // setSelectedUser(null); // Seçili kullanıcıyı kaldır (varsa)
  };
  useEffect(() => {
    // Bu useEffect, component yüklendiğinde ve location.pathname değiştiğinde çalışır
    // Yani, başka bir sayfadan bu sayfaya dönüldüğünde tetiklenir
    handleClearAllInputs();
  }, [location.pathname]); // Bağımlılık olarak location.pathname'i verin
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
          overflowY: "auto",
          zIndex: 10,
          transition: "left 0.3s ease", // 👈 geçiş efekti
        }}
      >
        {/* <Sidebar /> */} {/* Assuming Sidebar is imported */}
        Sidebar Component
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
            maxWidth: isMobile ? "auto" : isTablet ? "650px" : "100%", // Tablet max genişlik 800px
            left: isTablet ? "260px" : "auto", // 👈 sidebar genişliğine göre ayarlandı
            width: isTablet ? "100%" : "auto",
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
              src={formData.imagePreview || exampleUser} // Use a placeholder image
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
                // 👈 BURADA EKLEME: Dosya input'unun value'sini resetlemek için
                value={formData.imagePreview ? undefined : ""} // Resim varsa undefined, yoksa boş string yaparak resetliyoruz
              />

              {/* Resmi Sil butonu */}
              {formData.imagePreview && (
                <button
                  type="button"
                  onClick={() => {
                    setFormData((prev) => ({ ...prev, imagePreview: "" }));
                    // 👈 BURADA EKLEME: Input'u temizle
                    const fileInput = document.getElementById("image");
                    if (fileInput) {
                      fileInput.value = ""; // Input değerini sıfırlayarak aynı dosyanın tekrar seçilmesini sağlarız
                    }
                  }}
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
              display: isMobile || isTablet ? "block" : "grid",
              gap: "20px",
              gridTemplateColumns:
                isMobile || isTablet ? undefined : "repeat(4, 1fr)",
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
                "telefon",
                "email",
                "il",
                "ilce",
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
                        required={!selectedPers} // Use selectedPers
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
                      {!selectedPers && ( // Use selectedPers
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
                      onChange={handleProvinceChange} // Use the new handler
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
                      onChange={handleDistrictChange} // Use the new handler
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

            <div
              style={{
                display: "flex",
                gap: "30px", // Butonlar arasında boşluk
                flexWrap: isMobile ? "wrap" : "nowrap", // Mobilde alt satıra geçebilir
                // Yeni eklenen stiller:
                gridColumn: "1 / -1", // Formun tüm grid genişliğini kapla
                justifyContent: "center", // İçindeki öğeleri yatayda ortala
              }}
            >
              <button
                type="submit"
                className="btn btn-primary mt-3"
                style={{
                  width: isMobile ? "100%" : "150px",
                  flexGrow: isMobile ? 1 : 0, // Mobilde genişlesin
                }}
              >
                {selectedPers ? "Güncelle" : "Kaydet"}
              </button>

              <button
                type="button"
                onClick={handleClearAllInputs}
                className="btn btn-info mt-3"
                style={{
                  width: isMobile ? "100%" : "150px",
                  backgroundColor: "#aa3030ff",
                  borderColor: "#6c757d",
                  color: "#fff",
                  fontSize: "15px",
                  flexGrow: isMobile ? 1 : 0,
                }}
              >
                Inputları Temizle
              </button>
            </div>
          </form>
        </section>

        <section
          style={{
            backgroundColor: "#fff",
            borderRadius: "12px",
            position: "relative", // Konumlandırma için
            left: isTablet ? "0px" : "auto", // Tabletde soldan sıfır
            padding: isMobile ? "0 12px" : isTablet ? "15px 20px" : "20px",
            boxShadow: "0 8px 24px rgba(0,27,102,0.08)",
            border: "1px solid #e0e6ed",
            display: "flex",
            flexDirection: "column",
            gap: "15px",
            height: "100%",
            maxHeight: "none",
            maxWidth: isMobile ? "400px" : isTablet ? "650px" : "100%", // Tablet max genişlik 800px
            overflowY: "visible",
            overflowX: isTablet ? "auto" : "hidden", // Tabletde yatay kaydırma
            margin: "0 auto",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "10px",
              marginTop: isMobile ? "10px" : "0",
              flexWrap: isMobile || isTablet ? "wrap" : "nowrap", // sarmayı aç
              gap: "10px",
            }}
          >
            <h5
              style={{
                color: "#001b66",
                fontWeight: "600",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                fontSize: "1.25rem",
                margin: 0,
                flex: isMobile || isTablet ? "1 1 100%" : "unset", // mobil ve tabletde tam genişlik
              }}
            >
              <i className="bi bi-people-fill"></i> Kullanıcı Listesi
            </h5>
            {/* Personel sayısı için alan gerekirse buraya */}
          </div>

          <div style={{ flexGrow: 1, overflowY: "auto" }}>
            <UserFilter
              isMobile={isMobile}
              isTablet={isTablet}
              filters={filters}
              onChange={handleFilterChange}
              uniqueValues={uniqueValues}
            />
          </div>

          {/* Butonlar container */}
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "12px",
              justifyContent: isMobile || isTablet ? "center" : "flex-start",
            }}
          >
            {[
              {
                label: "Seçilenleri Aktif Yap",
                onClick: () => handleAktifPasif(true),
                disabled: selectedUserIds.length === 0,
                color: "success",
              },
              {
                label: "Seçilenleri Pasif Yap",
                onClick: () => handleAktifPasif(false),
                disabled: selectedUserIds.length === 0,
                color: "secondary",
              },
              {
                label: "Seçileni Güncelle",
                onClick: handleGuncelleClick,
                disabled: selectedUserIds.length !== 1,
                color: "warning",
              },
              {
                label: "Seçilenleri Sil",
                onClick: () => handleDeleteSelected(),
                disabled: selectedUserIds.length === 0,
                color: "danger",
              },
            ].map(({ label, onClick, disabled, color }, i) => (
              <button
                key={i}
                className={`btn btn-${color}`}
                onClick={onClick}
                disabled={disabled}
                style={{
                  flex: isMobile || isTablet ? "1 1 45%" : "1 1 23%", // mobil/tablette yarı genişlik, desktopta 4'te 1
                  minWidth: "140px",
                  whiteSpace: "nowrap",
                }}
              >
                {label}
              </button>
            ))}

            <div
              style={{
                display: "flex",
                gap: "12px",
                justifyContent: isMobile || isTablet ? "center" : "flex-start",
                flexWrap: "nowrap", // burada wrap'ı kaldırdık
              }}
            >
              <div
                style={{
                  flex: "1 1 auto",
                  minWidth: "140px",
                }}
              >
                <BulkRegister />
              </div>
              <div
                style={{
                  marginTop: isMobile ? "10px" : "15px",
                  flex: "1 1 auto",
                  minWidth: "140px",
                }}
              >
                <ExportToExcel />
              </div>
            </div>
          </div>

          <div>
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <span
                style={{
                  fontSize: "1rem",
                  fontWeight: "600",
                  color: "#555",
                  whiteSpace: "nowrap",
                }}
              >
                Toplam Personel: {users.length}
              </span>
            </div>

            <UserList
              users={currentUsers}
              selectedUser={selectedUser}
              selectedUserIds={selectedUserIds}
              setSelectedUserIds={setSelectedUserIds}
              onUserClick={handleUserClick}
              onCheckboxChange={handleCheckboxChange}
              onDeleteSelected={handleDeleteSelected}
              isMobile={isMobile}
              isTablet={isTablet}
              style={{ flex: 1 }}
            />
          </div>
        </section>
      </div>
    </div>
  );
}
