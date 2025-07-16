import React, { useCallback } from "react";

const PermissionSelector = ({
  permissions = [],
  selectedPermissions = [],
  setSelectedPermissions,
  isPermissionEditable = false,
  onSave,
  categories = {},
}) => {
  const handleCheckboxChange = useCallback(
    (id) => {
      if (!isPermissionEditable) return;

      setSelectedPermissions((prevSelected) =>
        prevSelected.includes(id)
          ? prevSelected.filter((pid) => pid !== id)
          : [...prevSelected, id]
      );
    },
    [isPermissionEditable, setSelectedPermissions]
  );
  const handleSave = () => {
    if (onSave) {
      const result = onSave();

      // Eğer `onSave` async bir fonksiyonsa
      if (result instanceof Promise) {
        result
          .then(() => {
            window.alert("Yetkiler başarıyla kaydedildi.");
          })
          .catch(() => {
            window.alert("Kaydederken bir hata oluştu.");
          });
      } else {
        // Sync ise direkt uyarı ver
        window.alert("Yetkiler başarıyla kaydedildi.");
      }
    }
  };

  const renderCategory = ([categoryName, permissionNames]) => {
    const filtered = permissions.filter((p) =>
      permissionNames.includes(p.name)
    );
    if (filtered.length === 0) return null;

    return (
      <div key={categoryName} className="mb-4">
        <h5 className="fw-semibold border-start border-4 ps-2 mb-3 text-primary">
          {categoryName}
        </h5>
        <div className="row">
          {filtered.map(({ id, name }) => (
            <div key={id} className="col-12 col-md-6 mb-2">
              <div
                className={`form-check custom-permission ${
                  selectedPermissions.includes(id) ? "active" : ""
                }`}
              >
                <input
                  className="form-check-input"
                  type="checkbox"
                  id={`perm-${id}`}
                  disabled={!isPermissionEditable}
                  checked={selectedPermissions.includes(id)}
                  onChange={() => handleCheckboxChange(id)}
                />
                <label className="form-check-label" htmlFor={`perm-${id}`}>
                  {name}
                </label>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="mt-4 permission-selector-container">
      <h4 className="fw-bold mb-4 text-dark d-flex align-items-center">
        <i className="bi bi-check-circle-fill text-peimary me-2"></i> Yetki
        Seçimi
      </h4>
      {Object.entries(categories).map(renderCategory)}

      <button
        onClick={handleSave}
        disabled={!isPermissionEditable}
        className={`btn mt-3 ${
          isPermissionEditable ? "btn-primary" : "btn-secondary"
        } shadow-sm rounded-3 d-flex align-items-center gap-2`}
      >
        <i className="bi bi-save2" style={{ color: "white" }}></i>
        Kaydet
      </button>
    </div>
  );
};

export default PermissionSelector;
