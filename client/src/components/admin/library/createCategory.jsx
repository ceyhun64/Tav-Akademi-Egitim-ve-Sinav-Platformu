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

  return (
    <div className="galcat-container">
      {/* Sidebar */}
      <aside className="galcat-sidebar">
        <Sidebar />
      </aside>

      {/* İçerik */}
      <main className="galcat-content">
        <div className="content-columns">
          {/* Sol sütun */}
          <section className="left-column">
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
          <aside className="right-column">
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
  );
}
