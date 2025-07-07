import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  getUploadedFilesByUserThunk,
  updateDownloadedThunk,
} from "../../../features/thunks/uploadFileThunk";

export default function Downloads() {
  const dispatch = useDispatch();
  const { uploadFiles } = useSelector((state) => state.uploadFile);

  useEffect(() => {
    dispatch(getUploadedFilesByUserThunk());
  }, [dispatch]);

  const handleDownload = async (fileUrl, fileName, fileId) => {
    try {
      const response = await fetch(fileUrl, {
        mode: "cors",
      });
      if (!response.ok) throw new Error("Dosya indirilemedi");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = fileName || "download";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      window.URL.revokeObjectURL(url);

      dispatch(updateDownloadedThunk(fileId));
    } catch (error) {
      console.error("Dosya indirilemedi:", error);
    }
  };

  const mainColor = "#001b66";

  return (
    <div className="container py-5" style={{ maxWidth: "900px" }}>
      <h2
        className="mb-4 fw-bold border-bottom pb-2"
        style={{ color: mainColor, borderColor: mainColor }}
      >
        Yüklenen Dosyalar
      </h2>

      {uploadFiles && uploadFiles.length > 0 ? (
        <div
          className="table-responsive shadow-sm rounded"
          style={{ backgroundColor: "#fff" }}
        >
          <table className="table table-hover align-middle mb-0">
            <thead
              className="text-uppercase small"
              style={{ backgroundColor: "#00194d", color: "white" }}
            >
              <tr>
                <th scope="col" style={{ width: "5%" }}>
                  #
                </th>
                <th scope="col" style={{ width: "35%" }}>
                  İsim
                </th>
                <th scope="col" style={{ width: "30%" }}>
                  Dosya URL
                </th>
                <th scope="col" style={{ width: "20%" }}>
                  Yüklenme Tarihi
                </th>
                <th scope="col" style={{ width: "10%" }}>
                  İndir
                </th>
              </tr>
            </thead>
            <tbody>
              {uploadFiles.map((file, index) => (
                <tr key={file.id} className="align-middle">
                  <td>{index + 1}</td>
                  <td className="fw-semibold" style={{ color: "#002080" }}>
                    {file.name}
                  </td>
                  <td>
                    <a
                      href={file.file_url}
                      target="_blank"
                      rel="noreferrer"
                      style={{ color: mainColor, textDecoration: "none" }}
                      onMouseOver={(e) =>
                        (e.target.style.textDecoration = "underline")
                      }
                      onMouseOut={(e) =>
                        (e.target.style.textDecoration = "none")
                      }
                    >
                      Dosyaya Git
                    </a>
                  </td>
                  <td>
                    {new Date(file.createdAt).toLocaleString("tr-TR", {
                      year: "numeric",
                      month: "short",
                      day: "2-digit",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </td>
                  <td>
                    <button
                      className="btn btn-sm"
                      style={{
                        borderColor: mainColor,
                        color: mainColor,
                        backgroundColor: "transparent",
                        transition: "all 0.3s ease",
                      }}
                      onClick={() =>
                        handleDownload(file.file_url, file.name, file.id)
                      }
                      aria-label={`İndir ${file.name}`}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = mainColor;
                        e.currentTarget.style.color = "#fff";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = "transparent";
                        e.currentTarget.style.color = mainColor;
                      }}
                    >
                      <i
                        className="bi bi-download"
                        style={{ fontSize: "1.1rem" }}
                      ></i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div
          className="alert text-center fs-6"
          style={{ backgroundColor: "#f0f4ff", color: mainColor }}
        >
          Henüz dosya bulunmamaktadır.
        </div>
      )}
    </div>
  );
}
