import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

/**
 * JSON dizisini Excel dosyasına çevirip indirir.
 * 
 * @param {Array<Object>} data - Dışa aktarılacak JSON verisi (array of objects).
 * @param {string} fileName - Kaydedilecek Excel dosyasının adı (örn: "export.xlsx").
 */
export function exportToExcel(data, fileName = "export.xlsx") {
  if (!Array.isArray(data) || data.length === 0) {
    alert("Dışa aktarılacak veri bulunamadı!");
    return;
  }

  // json_to_sheet, tüm objelerdeki anahtarları sütun başlığı olarak alır, esnektir.
  const worksheet = XLSX.utils.json_to_sheet(data);

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Sayfa1");

  const wbout = XLSX.write(workbook, { bookType: "xlsx", type: "array" });

  const blob = new Blob([wbout], { type: "application/octet-stream" });
  saveAs(blob, fileName);
}
