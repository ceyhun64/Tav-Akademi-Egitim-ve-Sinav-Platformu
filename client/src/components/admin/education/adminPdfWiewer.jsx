export default function AdminPdfViewer({ file }) {
  if (!file) return <p>PDF bulunamadı.</p>;

  return (
    <div style={{ width: "100%", height: "600px" }}>
      <iframe
        src={file}
        width="100%"
        height="100%"
        title="PDF Viewer"
        style={{ border: "none" }}
      ></iframe>
    </div>
  );
}

