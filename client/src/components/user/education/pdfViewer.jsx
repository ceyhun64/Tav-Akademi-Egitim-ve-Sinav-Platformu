import { useEffect, useRef, useState } from "react";
import styles from "./PdfViewer.module.css"; // CSS modül importu

// pageDurations: [{ page: 1, duration: 30 }, { page: 2, duration: 45 }]
export default function PdfViewer({
  file,
  pageDurations,
  onPdfLastPageComplete,
}) {
  const containerRef = useRef(null);
  const [pdfDoc, setPdfDoc] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isCurrentPageDurationMet, setIsCurrentPageDurationMet] =
    useState(false);
  const pageDurationTimerRef = useRef(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const loadPdf = async () => {
      const pdfjsLib = window["pdfjs-dist/build/pdf"];
      pdfjsLib.GlobalWorkerOptions.workerSrc =
        "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.6.347/pdf.worker.min.js";

      const loadingTask = pdfjsLib.getDocument(file);
      try {
        const pdf = await loadingTask.promise;
        setPdfDoc(pdf);
        setCurrentPage(1);
        setIsCurrentPageDurationMet(false);
        setMessage("");
      } catch (error) {
        console.error("PDF yüklenirken hata oluştu:", error);
        setMessage("PDF yüklenirken bir sorun oluştu.");
      }
    };

    loadPdf();

    return () => {
      clearTimeout(pageDurationTimerRef.current);
    };
  }, [file]);

  useEffect(() => {
    if (!pdfDoc) return;

    let isCancelled = false;

    const renderPage = async (pageNum) => {
      const container = containerRef.current;
      if (!container) return;

      container.innerHTML = "";
      setMessage("");

      try {
        const page = await pdfDoc.getPage(pageNum);
        if (isCancelled) return;

        const viewport = page.getViewport({ scale: 1.5 });
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        await page.render({
          canvasContext: context,
          viewport,
        }).promise;

        if (isCancelled) return;

        container.appendChild(canvas);
        container.appendChild(document.createElement("hr"));

        clearTimeout(pageDurationTimerRef.current);
        setIsCurrentPageDurationMet(false);

        const pageInfo = pageDurations?.find((pd) => pd.page === pageNum);
        const requiredDurationMs =
          pageInfo && Number(pageInfo.duration) > 0
            ? Number(pageInfo.duration) * 1000
            : 0;

        if (requiredDurationMs > 0) {
          pageDurationTimerRef.current = setTimeout(() => {
            setIsCurrentPageDurationMet(true);
            if (pageNum === pdfDoc.numPages && onPdfLastPageComplete) {
              onPdfLastPageComplete();
            }
          }, requiredDurationMs);
        } else {
          setIsCurrentPageDurationMet(true);
          if (pageNum === pdfDoc.numPages && onPdfLastPageComplete) {
            onPdfLastPageComplete();
          }
        }
      } catch (error) {
        console.error(`Sayfa ${pageNum} render edilirken hata oluştu:`, error);
        setMessage(`Sayfa ${pageNum} render edilirken bir hata oluştu.`);
        setIsCurrentPageDurationMet(true);
      }
    };

    renderPage(currentPage);

    return () => {
      isCancelled = true;
      clearTimeout(pageDurationTimerRef.current);
      if (containerRef.current) {
        containerRef.current.innerHTML = "";
      }
    };
  }, [currentPage, pdfDoc, pageDurations, onPdfLastPageComplete]);

  const goPrev = () => {
    setMessage("");
    setCurrentPage((p) => Math.max(1, p - 1));
  };

  const goNext = () => {
    setMessage("");
    if (!isCurrentPageDurationMet) {
      setMessage("Bu sayfayı tamamlama süresi dolmadan ilerleyemezsiniz.");
      return;
    }
    if (pdfDoc && currentPage < pdfDoc.numPages) {
      setCurrentPage((p) => p + 1);
    }
  };

  return (
    <div>
      {message && <div className={styles.message}>{message}</div>}

      <div ref={containerRef} className={styles.container}>
        {/* PDF sayfası burada render edilecek */}
      </div>
      <p className={styles.paginationText}>
        Sayfa: {currentPage} / {pdfDoc ? pdfDoc.numPages : "..."}
      </p>
      <div className={styles.buttonsContainer}>
        <button
          onClick={goPrev}
          disabled={currentPage === 1}
          className={`${styles.button} ${
            currentPage === 1 ? styles.buttonDisabled : ""
          }`}
        >
          Önceki Sayfa
        </button>
        <button
          onClick={goNext}
          disabled={
            !isCurrentPageDurationMet ||
            (pdfDoc && currentPage === pdfDoc.numPages)
          }
          className={`${styles.button} ${
            !isCurrentPageDurationMet ||
            (pdfDoc && currentPage === pdfDoc.numPages)
              ? styles.buttonDisabled
              : ""
          }`}
        >
          Sonraki Sayfa
        </button>
      </div>
    </div>
  );
}
