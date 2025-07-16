import React, { useEffect, useState } from "react"; //react ve useEffect dahil ettik
import { useDispatch, useSelector } from "react-redux"; //useDispatch ve useSelector hook'larını dahil ettik
import {
  getImageGalleryCategoryThunk,
  deleteImageGalleryCategoryThunk,
  getImageGallerySubCategoryThunk,
  deleteImageGallerySubCategoryThunk,
  updateImageGalleryCategoryThunk,
  updateImageGallerySubCategoryThunk,
} from "../../../features/thunks/imageGalleryCatThunk";
import { Link, useNavigate } from "react-router-dom"; //Link ve useNavigate hook'larını dahil ettik
export default function Categories() {
  const [selectedCategoryId, setSelectedCategoryId] = useState("all");
  const [isEditingCategoryId, setIsEditingCategoryId] = useState(null);
  const [editedCategoryName, setEditedCategoryName] = useState("");

  const [isEditingSubCategoryId, setIsEditingSubCategoryId] = useState(null);
  const [editedSubCategoryName, setEditedSubCategoryName] = useState("");
  const [editedSubCategoryParentId, setEditedSubCategoryParentId] =
    useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { imageGalleryCategory, imageGallerySubCategory } = useSelector(
    (state) => state.imageGalleryCat
  );
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await dispatch(getImageGalleryCategoryThunk()).unwrap();
        await dispatch(getImageGallerySubCategoryThunk()).unwrap();
        setIsLoading(false);
      } catch (error) {
        console.error("Veri yüklenirken hata oluştu:", error);
        setIsLoading(false);
      }
    };
    fetchData();
  }, [dispatch]);

  const handleDelete = (id) => {
    dispatch(deleteImageGalleryCategoryThunk(id));
    setTimeout(() => {
      dispatch(getImageGalleryCategoryThunk());
      dispatch(getImageGallerySubCategoryThunk());
    }, 1000);
  };

  const handleDeleteSubCategory = (id) => {
    dispatch(deleteImageGallerySubCategoryThunk(id));
    setTimeout(() => {
      dispatch(getImageGalleryCategoryThunk());
      dispatch(getImageGallerySubCategoryThunk());
    }, 1000);
  };

  const startEditCategory = (category) => {
    setIsEditingCategoryId(category.id);
    setEditedCategoryName(category.name);
  };

  const saveEditCategory = async (id) => {
    try {
      await dispatch(
        updateImageGalleryCategoryThunk({ id, name: editedCategoryName })
      ).unwrap();
      setIsEditingCategoryId(null);
      dispatch(getImageGalleryCategoryThunk());
    } catch (err) {
      console.error("Kategori güncellenemedi:", err);
    }
  };

  const startEditSubCategory = (sub) => {
    setIsEditingSubCategoryId(sub.id);
    setEditedSubCategoryName(sub.name);
    setEditedSubCategoryParentId(sub.imageCatId);
  };

  const saveEditSubCategory = async (id) => {
    try {
      await dispatch(
        updateImageGallerySubCategoryThunk({
          id,
          name: editedSubCategoryName,
          imageCatId: Number(editedSubCategoryParentId),
        })
      ).unwrap();
      setIsEditingSubCategoryId(null);
      dispatch(getImageGallerySubCategoryThunk());
    } catch (err) {
      console.error("Alt kategori güncellenemedi:", err);
    }
  };

  if (isLoading) {
    return (
      <div className="container mt-5 mb-5 text-center">
        <h3>Yükleniyor...</h3>
      </div>
    );
  }

  return (
    <div className="container">
      {/* Ana Kategori Listesi */}
      <section className="mb-4">
        <h5>Kategori Listesi</h5>
        <div className="table-responsive mt-2">
          <table className="table table-striped table-bordered table-hover">
            <thead>
              <tr>
                <th>ID</th>
                <th>Ad</th>
                <th>İşlemler</th>
              </tr>
            </thead>
            <tbody>
              {imageGalleryCategory.map((category) => (
                <tr key={category.id}>
                  <td>{category.id}</td>
                  <td>
                    {isEditingCategoryId === category.id ? (
                      <input
                        value={editedCategoryName}
                        onChange={(e) => setEditedCategoryName(e.target.value)}
                        className="form-control form-control-sm"
                      />
                    ) : (
                      category.name
                    )}
                  </td>
                  <td>
                    {isEditingCategoryId === category.id ? (
                      <button
                        className="btn btn-sm btn-success me-2"
                        onClick={() => saveEditCategory(category.id)}
                      >
                        Kaydet
                      </button>
                    ) : (
                      <button
                        className="btn btn-sm btn-outline-secondary me-2"
                        onClick={() => startEditCategory(category)}
                      >
                        <i className="bi bi-pencil-square"></i>
                      </button>
                    )}
                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => handleDelete(category.id)}
                    >
                      <i className="bi bi-trash-fill"></i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Filtre */}
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

      {/* Alt Kategoriler */}
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
              {imageGallerySubCategory
                .filter((sub) =>
                  selectedCategoryId === "all"
                    ? true
                    : sub.imageCatId === Number(selectedCategoryId)
                )
                .map((sub) => (
                  <tr key={sub.id}>
                    <td>{sub.id}</td>
                    <td>
                      {isEditingSubCategoryId === sub.id ? (
                        <input
                          value={editedSubCategoryName}
                          onChange={(e) =>
                            setEditedSubCategoryName(e.target.value)
                          }
                          className="form-control form-control-sm"
                        />
                      ) : (
                        sub.name
                      )}
                    </td>
                    <td>
                      {isEditingSubCategoryId === sub.id ? (
                        <select
                          className="form-select form-select-sm"
                          value={editedSubCategoryParentId}
                          onChange={(e) =>
                            setEditedSubCategoryParentId(e.target.value)
                          }
                        >
                          {imageGalleryCategory.map((cat) => (
                            <option key={cat.id} value={cat.id}>
                              {cat.name}
                            </option>
                          ))}
                        </select>
                      ) : (
                        imageGalleryCategory.find(
                          (cat) => cat.id === sub.imageCatId
                        )?.name || sub.imageCatId
                      )}
                    </td>
                    <td>
                      {isEditingSubCategoryId === sub.id ? (
                        <button
                          className="btn btn-sm btn-success me-2"
                          onClick={() => saveEditSubCategory(sub.id)}
                        >
                          Kaydet
                        </button>
                      ) : (
                        <button
                          className="btn btn-sm btn-outline-secondary me-2"
                          onClick={() => startEditSubCategory(sub)}
                        >
                          <i className="bi bi-pencil-square"></i>
                        </button>
                      )}
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => handleDeleteSubCategory(sub.id)}
                      >
                        <i className="bi bi-trash-fill"></i>
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
