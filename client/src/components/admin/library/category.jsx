import React, { useEffect, useState } from "react"; //react ve useEffect dahil ettik
import { useDispatch, useSelector } from "react-redux"; //useDispatch ve useSelector hook'larını dahil ettik
import {
  getImageGalleryCategoryThunk,
  deleteImageGalleryCategoryThunk,
  getImageGallerySubCategoryThunk,
  deleteImageGallerySubCategoryThunk,
} from "../../../features/thunks/imageGalleryCatThunk";
import { Link, useNavigate } from "react-router-dom"; //Link ve useNavigate hook'larını dahil ettik

export default function Categories() {
  const [selectedCategoryId, setSelectedCategoryId] = useState("all");

  const dispatch = useDispatch(); //useDispatch hook'unu kullanarak dispatch fonksiyonunu oluşturduk
  const navigate = useNavigate(); //useNavigate hook'unu kullanarak navigate fonksiyonunu oluşturduk
  const { imageGalleryCategory, imageGallerySubCategory } = useSelector(
    (state) => state.imageGalleryCat
  ); //category state'ini kullanarak kategorileri ve alt kategorileri çektik
  const [isLoading, setIsLoading] = useState(true); // Veri yüklenip yüklenmediğini kontrol etmek için

  //bileşen yenilendiğinde ve güncellendiğinde çalışır
  useEffect(() => {
    const fetchData = async () => {
      try {
        await dispatch(getImageGalleryCategoryThunk()).unwrap(); //getImageGalleryCategoryThunk fonksiyonunu kullanarak kategorileri çektik
        await dispatch(getImageGallerySubCategoryThunk()).unwrap(); //getImageGallerySubCategoryThunk fonksiyonunu kullanarak alt kategorileri çektik
        setIsLoading(false); // Veriler başarıyla yüklendiğinde loading'i false yapıyoruz
      } catch (error) {
        console.error("Veri yüklenirken hata oluştu:", error);
        setIsLoading(false); // Yükleme hatası olsa da loading'i false yapıyoruz
      }
    };
    fetchData();
  }, [dispatch]); //dispatch ve category state'i değiştiğinde useEffect hook'u çalışacak

  const handleDelete = (id) => {
    //deleteCategoryThunk fonksiyonunu kullanarak kategoriyi siler
    dispatch(deleteImageGalleryCategoryThunk(id)); //id parametresi ile kategoriyi siler
    setTimeout(() => {
      //1 sn sonra yapılacaklar
      dispatch(getImageGalleryCategoryThunk()); //getImageGalleryCategoryThunk fonksiyonunu kullanarak kategorileri çeker
      dispatch(getImageGallerySubCategoryThunk()); //getImageGallerySubCategoryThunk fonksiyonunu kullanarak alt kategorileri çeker
    }, 1000);
  };

  const handleDeleteSubCategory = (id) => {
    //deleteSubCategoryThunk fonksiyonunu kullanarak alt kategoriyi siler
    dispatch(deleteImageGallerySubCategoryThunk(id)); //id parametresi ile alt kategoriyi siler
    setTimeout(() => {
      //1 sn sonra yapılacaklar
      dispatch(getImageGalleryCategoryThunk()); //getImageGalleryCategoryThunk fonksiyonunu kullanarak kategorileri çeker
      dispatch(getImageGallerySubCategoryThunk()); //getImageGallerySubCategoryThunk fonksiyonunu kullanarak alt kategorileri çeker
    }, 1000);
  };

  const handleNavigateToCreatePage = () => {
    //createPage'a yönlendirir(category/create)
    navigate("/admin/create-gallery-cat");
  };

  if (isLoading) {
    //Veriler yüklenirken gösterilecek
    return (
      <div className="container mt-5 mb-5 text-center">
        <h3>Yükleniyor...</h3>
      </div>
    );
  }

  return (
    <div className="container">
      {/* Alert */}
      {alert?.message && (
        <div className={`alert alert-${alert?.type}`} role="alert">
          {alert.message}
        </div>
      )}

      {/* Kategori Listesi */}
      <section className="mb-4">
        <h5>Kategori Listesi</h5>
        <div className="table-responsive">
          <table className="table table-striped table-bordered table-hover">
            <thead>
              <tr>
                <th>ID</th>
                <th>Ad</th>
                <th>İşlemler</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(imageGalleryCategory) &&
              imageGalleryCategory.length > 0 ? (
                imageGalleryCategory.map((category) => (
                  <tr key={category.id}>
                    <td>{category.id}</td>
                    <td>{category.name}</td>
                    <td>
                      <button
                        className="btn btn-sm ms-3"
                        onClick={() => handleDelete(category.id)}
                      >
                        <i className="bi bi-trash-fill"></i>
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="text-center">
                    Kategori bulunamadı
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Kategori Filtresi */}
      <section className="mb-4">
        <label htmlFor="categoryFilter" className="form-label">
          Ana Kategoriye Göre Filtrele:
        </label>
        <select
          id="categoryFilter"
          className="form-select"
          value={selectedCategoryId}
          onChange={(e) => setSelectedCategoryId(e.target.value)}
        >
          <option value="all">Tüm Kategoriler</option>
          {imageGalleryCategory.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </section>

      {/* Alt Kategori Listesi */}
      <section>
        <h5>Alt Kategoriler</h5>
        <div className="table-responsive">
          <table className="table table-striped table-bordered table-hover">
            <thead>
              <tr>
                <th>ID</th>
                <th>Ad</th>
                <th>Ana Kategori</th>
                <th>İşlemler</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(imageGallerySubCategory) &&
              imageGallerySubCategory.length > 0 ? (
                imageGallerySubCategory
                  .filter((sub) =>
                    selectedCategoryId === "all"
                      ? true
                      : sub.imageCatId === Number(selectedCategoryId)
                  )
                  .map((sub) => (
                    <tr key={sub.id}>
                      <td>{sub.id}</td>
                      <td>{sub.name}</td>
                      <td>
                        {imageGalleryCategory.find(
                          (cat) => cat.id === sub.imageCatId
                        )?.name || sub.imageCatId}
                      </td>
                      <td>
                        <button
                          className="btn btn-sm ms-3"
                          onClick={() => handleDeleteSubCategory(sub.id)}
                        >
                          <i className="bi bi-trash-fill"></i>
                        </button>
                      </td>
                    </tr>
                  ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center">
                    Alt kategori bulunamadı
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
