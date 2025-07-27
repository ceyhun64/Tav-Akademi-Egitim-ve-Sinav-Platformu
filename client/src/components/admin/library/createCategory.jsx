import React, { useState, useEffect } from "react"; //react ve useState ve useEffect hook'larını dahil ettik
import { useDispatch, useSelector } from "react-redux"; //useDispatch ve useSelector hook'larını dahil ettik
import {
  createImageGalleryCategoryThunk,
  createImageGallerySubCategoryThunk,
  getImageGallerySubCategoryThunk,
  getImageGalleryCategoryThunk,
} from "../../../features/thunks/imageGalleryCatThunk"; //createCategoryThunk, createSubCategoryThunk, getCategoriesThunk, getAllSubCategoriesThunk fonksiyonlarını dahil ettik
import Categories from "./category";
import Sidebar from "../adminPanel/sidebar";
import "./createCategory.css";

export default function CreateCategory() {
  const dispatch = useDispatch(); //useDispatch hook'unu kullanarak dispatch fonksiyonunu oluşturduk
  const { imageGalleryCategory, imageGallerySubCategory } = useSelector(
    (state) => state.imageGalleryCat
  ); //category state'ini kullanarak kategorileri ve alt kategorileri çektik
  const [categoryName, setCategoryName] = useState(""); //categoryName state'ini oluşturduk
  const [subCategoryName, setSubCategoryName] = useState(""); //subCategoryName state'ini oluşturduk
  const [selectedCategoryId, setSelectedCategoryId] = useState(""); //selectedCategoryId state'ini oluşturduk

  //bileşen yenilendiğinde ve güncellendiğinde çalışır
  useEffect(() => {
    const fetchData = async () => {
      //getCategoriesThunk fonksiyonunu kullanarak kategorileri çektik
      await dispatch(getImageGalleryCategoryThunk()).unwrap(); //getCategoriesThunk fonksiyonunu kullanarak kategorileri çektik
      await dispatch(getImageGallerySubCategoryThunk()).unwrap(); //getAllSubCategoriesThunk fonksiyonunu kullanarak alt kategorileri çektik
    };
    fetchData();
  }, [dispatch]); //dispatch ve category state'i değiştiğinde useEffect hook'u çalışacak

  // Yeni Kategori Ekle
  const handleAddCategory = async () => {
    //aynı kategori adı varsa ekleme yapma
    //categoryName'i boşlukları kaldırıp küçük harfe çeviriyoruz

    const isDuplicate = imageGalleryCategory.some(
      (cat) => cat.name.toLowerCase() === categoryName.toLowerCase()
    );
    if (isDuplicate || !categoryName.trim()) return;

    const categoryData = { name: categoryName }; //name değerine categoryName'i atıyoruz
    await dispatch(createImageGalleryCategoryThunk(categoryData)).unwrap(); //createCategoryThunk fonksiyonunu kullanarak kategori ekliyoruz
    setTimeout(() => {
      //1 saniye sonra ne olacağını yazıyoruz
      dispatch(getImageGalleryCategoryThunk()); //getCategoriesThunk fonksiyonunu kullanarak kategorileri çekiyoruz
      setCategoryName(""); //categoryName'i temizliyoruz
    }, 1000);
  };

  // Yeni Alt Kategori Ekle
  const handleAddSubCategory = async (e) => {
    e.preventDefault(); //formun submit edilmesini engelliyoruz

    const subCategoryData = {
      //subCategoryName'i trim() ile boşlukları kaldırıyoruz
      name: subCategoryName.trim(), //subCategoryName'i trim() ile boşlukları kaldırıyoruz
      categoryId: Number(selectedCategoryId), //selectedCategoryId'i Number() ile sayıya çeviriyoruz
    };

    try {
      await dispatch(
        createImageGallerySubCategoryThunk(subCategoryData)
      ).unwrap(); //createSubCategoryThunk fonksiyonunu kullanarak alt kategori ekliyoruz
      setTimeout(() => {
        //1 saniye sonra ne olacağını yazıyoruz
        dispatch(getImageGalleryCategoryThunk()); //getCategoriesThunk fonksiyonunu kullanarak kategorileri çekiyoruz
        dispatch(getImageGallerySubCategoryThunk()); //getAllSubCategoriesThunk fonksiyonunu kullanarak alt kategorileri çekiyoruz
        setSubCategoryName(""); //subCategoryName'i temizliyoruz
        setSelectedCategoryId(""); //selectedCategoryId'i temizliyoruz
      }, 1000);
    } catch (error) {
      console.error("Alt kategori eklenirken hata:", error);
    }
  };
  const [sidebarOpen, setSidebarOpen] = useState(false);
  // Responsive durumları yönetimi
  const [isMobile, setIsMobile] = useState(false); // < 768px
  const [isTablet, setIsTablet] = useState(false); // 768px - 1200px
  const TABLET_BREAKPOINT = 768;
  const DESKTOP_BREAKPOINT = 1200;

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
  return (
    <div
      className="poolImg-container"
      style={{ overflowX: "hidden", padding: "1rem" }}
    >
      {/* Sidebar */}
      <div
        style={{
          padding: "1rem",
          position: "fixed",
          left: 0,
          top: 0,
          backgroundColor: "white",
          color: "#fff",
          overflowY: "auto",
          zIndex: 99999,
        }}
      >
        <Sidebar />
      </div>

      {/* Ana İçerik */}
      <div
        className="poolImg-content"
        style={{ marginLeft: isMobile ? "0px" : "260px" }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "2.5rem",
          }}
        >
          <h1
            className="mb-4 mt-2 ms-5"
            style={{
              color: "#003399",
              fontSize: "28px",
              fontWeight: "700",
              display: "flex",
              alignItems: "center",
              gap: "0.6rem",
              userSelect: "none",
            }}
          >
            {!isMobile && (
              <i
                className="bi bi-journal-bookmark-fill"
                style={{ fontSize: "1.6rem" }}
              ></i>
            )}
            Kütüphane Kategorileri
            <button
              onClick={() => window.history.back()}
              style={{
                marginLeft: isMobile ? "auto" : "30px",
                backgroundColor: "#001b66",
                color: "white",
                border: "none",
                borderRadius: "4px",
                padding: "6px 16px", // padding yatay biraz artırıldı
                cursor: "pointer",
                fontSize: "1rem",
                whiteSpace: "nowrap", // metnin tek satırda kalmasını sağlar
              }}
            >
              Geri Dön
            </button>
          </h1>
        </div>
        {/* İçerik */}
        <main className="galcat-content">
          <div className="row gx-4">
            {/* Sol sütun */}
            <section
              className={`col-12 ${isMobile || isTablet ? "" : "col-md-5"}`}
            >
              <h2>Kategori ve Alt Kategori Ekle</h2>

              {/* Yeni Kategori Ekle */}
              <div className="card mb-4">
                <div className="card-body">
                  <h5>Yeni Kategori Ekle</h5>
                  <input
                    type="text"
                    className="form-control mb-2"
                    placeholder="Kategori ismini girin"
                    value={categoryName}
                    onChange={(e) => setCategoryName(e.target.value)}
                  />
                  <button className="btn-primary" onClick={handleAddCategory}>
                    Ekle
                  </button>
                </div>
              </div>

              {/* Yeni Alt Kategori Ekle */}
              <div className="card mb-4">
                <div className="card-body">
                  <h5>Yeni Alt Kategori Ekle</h5>
                  <form onSubmit={handleAddSubCategory}>
                    <input
                      type="text"
                      className="form-control mb-2"
                      placeholder="Alt kategori adı"
                      value={subCategoryName}
                      onChange={(e) => setSubCategoryName(e.target.value)}
                      required
                    />
                    <select
                      className="form-select mb-2"
                      value={selectedCategoryId}
                      onChange={(e) => setSelectedCategoryId(e.target.value)}
                      required
                    >
                      <option value="">Ana Kategori Seçin</option>
                      {imageGalleryCategory
                        .filter((cat) => cat && cat.id && cat.name)
                        .map((cat) => (
                          <option key={cat.id} value={cat.id}>
                            {cat.name}
                          </option>
                        ))}
                    </select>
                    <button className="btn-primary" type="submit">
                      Ekle
                    </button>
                  </form>
                </div>
              </div>
            </section>

            {/* Sağ sütun */}
            <aside
              className={`col-12 ${isMobile || isTablet ? "" : "col-md-7"}`}
            >
              <h2>Kategoriler</h2>
              <div className="card">
                <div className="card-body">
                  <Categories />
                </div>
              </div>
            </aside>
          </div>
        </main>
      </div>
    </div>
  );
}
