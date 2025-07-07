import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  createRoleLevelThunk,
  deleteRoleLevelThunk,
  getRoleLevelsThunk,
  updateRoleLevelThunk,
  getPermissionsThunk,
  updateRoleLevelPermThunk,
  createRoleLevelPermThunk,
  getRoleLevelPermsThunk,
} from "../../../features/thunks/roleThunk";
import PermissionSelector from "./permission";

export default function RoleLevel() {
  const dispatch = useDispatch();
  const { roleLevels, permissions, roleLevelPerms, isLoading } = useSelector(
    (state) => state.role
  );

  const [name, setName] = useState("");
  const [id, setId] = useState(null);
  const [level, setLevel] = useState("");
  const [selectedRoleLevelId, setSelectedRoleLevelId] = useState("");
  const [selectedPermissions, setSelectedPermissions] = useState([]);
  const [isPermissionEditable, setIsPermissionEditable] = useState(false);

  useEffect(() => {
    dispatch(getRoleLevelsThunk());
    dispatch(getPermissionsThunk());
  }, [dispatch]);

  useEffect(() => {
    if (selectedRoleLevelId) {
      dispatch(getRoleLevelPermsThunk(selectedRoleLevelId));
      setIsPermissionEditable(true);
    } else {
      setIsPermissionEditable(false);
      setSelectedPermissions([]);
    }
  }, [dispatch, selectedRoleLevelId]);

  useEffect(() => {
    if (roleLevelPerms) {
      setSelectedPermissions(roleLevelPerms.map((perm) => perm.permissionId));
    }
  }, [roleLevelPerms]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const isDuplicateLevel = roleLevels.some(
      (r) => r.level === Number(level) && r.id !== id
    );

    if (isDuplicateLevel) {
      alert("Aynı level değerine sahip başka bir role level zaten mevcut!");
      return;
    }

    if (id) {
      await dispatch(updateRoleLevelThunk({ id, name, level }));
    } else {
      await dispatch(createRoleLevelThunk({ name, level }));
    }

    dispatch(getRoleLevelsThunk());
    setName("");
    setId(null);
    setLevel("");
  };

  const handleEdit = (roleLevel) => {
    setName(roleLevel.name);
    setId(roleLevel.id);
    setLevel(roleLevel.level);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Silmek istediğinize emin misiniz?")) {
      await dispatch(deleteRoleLevelThunk(id));
      dispatch(getRoleLevelsThunk());
    }
  };

  const handleSelectChange = (e) => {
    setSelectedRoleLevelId(e.target.value);
  };

  const handlePermissionSave = () => {
    if (!selectedRoleLevelId) return;

    const action =
      roleLevelPerms.length > 0
        ? updateRoleLevelPermThunk
        : createRoleLevelPermThunk;

    dispatch(
      action({
        roleLevelId: selectedRoleLevelId,
        permissionIds: selectedPermissions,
      })
    );
  };

  const categories = {
    "Ana Ekran Yetkileri": [
      "Kullanıcı Ekle",
      "Yetki Ekle",
      "Teorik Kitapçıklar",
      "Görüntü Kitapçıkları",
      "Sınav Atama",
      "Eğitim Atama",
      "Sertifika İşlemleri",
      "Raporlar",
      "Ayarlar",
      "Görüntü Kütüphanesi",
    ],
    "Kayıtlı Sınav Ekranı Yetkileri": [
      "Teorik Sınav Sonuçları",
      "Görüntü Sınav Sonuçları",
      "Perf Teorik Sınav Sonuçları",
      "Perf Görüntü Sınav Sonuçları",
    ],
    "Konum Yetkileri": [
      "Tüm Konum Verilerini Göster",
      "Grubuna Göre Verileri Göster",
    ],
    "Rapor Ekranı Yetkileri": [
      "Teorik Sınav Sonuçları",
      "Görüntü Sınav Sonuçları",
      "Sınav Atama Listesi",
      "Eğitim Atama Listesi",
      "Eğitim Sonuçları",
      "Kayıtlı Sınavlar",
    ],
    "Diğer Yetkiler": [
      "Toplu Kullanıcı Ekleme",
      "Toplu Kullanıcı Silme",
      "Eğitim Düzenleme",
      "Eğitim Seti Düzenleme",
      "Teorik Sınav Sonuç Silme",
      "Görüntü Sınav Sonuç Silme",
      "Eğitim Sonuç Silme",
      "Kayıtlı Sınav Sonuç Silme",
      "Teorik Kitapçık Ekle",
      "Teorik Kitapçık Sil",
      "Görüntü Kitapçık Ekle",
      "Görüntü Kitapçık Sil",
    ],
    "Ayarlar Ekranı Yetkileri": [
      "Yasaklı Madde Listesi",
      "Görüntü Sorusu Kategori Listesi",
      "Pratik Sınav Ayarları",
      "Kurum ve Grup İşlemleri",
      "Aktif Kullanıcılar",
      "Duyuru İşlemleri",
      "Dosya Yükleme İşlemleri",
      "Yetki Ayarları",
    ],
  };

  return (
    <div>
      <div className="row">
        <div className="col-md-6 mb-4">
          <div className="card shadow-sm">
            <div className="card-body">
              <h4 className="card-title mb-3">Rol Derecesi Oluştur</h4>
              <form
                onSubmit={handleSubmit}
                className="p-3 bg-white rounded shadow-sm"
              >
                <div className="mb-3">
                  <label
                    htmlFor="roleLevelName"
                    className="form-label text-dark fw-semibold"
                  >
                    Rol Derece Adı
                  </label>
                  <input
                    id="roleLevelName"
                    type="text"
                    className="form-control rounded-3"
                    placeholder="Role level adı"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label
                    htmlFor="roleLevelLevel"
                    className="form-label text-dark fw-semibold"
                  >
                    Level (Sayı)
                  </label>
                  <input
                    id="roleLevelLevel"
                    type="number"
                    className="form-control rounded-3"
                    placeholder="Level"
                    value={level}
                    onChange={(e) => setLevel(Number(e.target.value))}
                    required
                  />
                </div>

                <div className="d-flex gap-2">
                  <button type="submit" className="btn btn-primary shadow-sm">
                    <i
                      className={`bi ${
                        id ? "bi-pencil" : "bi-plus-circle"
                      } me-2`}
                      style={{ color: "white" }}
                    ></i>
                    {id ? "Güncelle" : "Oluştur"}
                  </button>
                  {id && (
                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      onClick={() => {
                        setId(null);
                        setName("");
                        setLevel("");
                      }}
                    >
                      <i className="bi bi-x-circle me-1"></i> İptal
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>

        <div className="col-md-6 mb-4">
          <div className="card shadow-sm">
            <div className="card-body">
              <h4 className="card-title mb-3">Rol Dereceleri</h4>

              {isLoading ? (
                <div className="text-center py-3">
                  <div
                    className="spinner-border text-primary"
                    role="status"
                  ></div>
                </div>
              ) : roleLevels.length === 0 ? (
                <p>Rol bulunamadı</p>
              ) : (
                <ul className="list-group">
                  {roleLevels.map((role) => (
                    <li
                      key={role.id}
                      className="list-group-item d-flex justify-content-between align-items-center"
                    >
                      <div>
                        <strong>{role.name}</strong>{" "}
                      </div>
                      <div>
                        <button
                          className="btn btn-sm btn-outline-primary me-2"
                          onClick={() => handleEdit(role)}
                        >
                          Düzenle
                        </button>
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => handleDelete(role.id)}
                        >
                          Sil
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="row mt-4">
        <select
          className="form-select mb-4 shadow-sm"
          value={selectedRoleLevelId}
          onChange={handleSelectChange}
        >
          <option value="">Bir rol derecesi seçiniz</option>
          {roleLevels.map((rl) => (
            <option key={rl.id} value={rl.id}>
              {rl.name}
            </option>
          ))}
        </select>
        <PermissionSelector
          permissions={permissions}
          selectedPermissions={selectedPermissions}
          setSelectedPermissions={setSelectedPermissions}
          isPermissionEditable={isPermissionEditable}
          categories={categories}
          onSave={handlePermissionSave}
        />
      </div>
    </div>
  );
}
