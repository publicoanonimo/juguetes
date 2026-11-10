import { jsPDF } from "jspdf";
import { autoTable } from "jspdf-autotable";
import { totalSale, profitSale } from "./data.js";
import { formatMoney, saleDate, saleTime } from "./format.js";

export function createSalesReport({
  sales,
  customers,
  period,
  query = "",
  generatedAt = new Date(),
}) {
  const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
  doc.setProperties({
    title: "Juguetes - Reporte de ventas",
    subject: "Ventas registradas",
    author: "Juguetes",
  });
  doc.setFillColor(2, 132, 199);
  doc.rect(0, 0, 297, 32, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(21);
  doc.text("Juguetes", 14, 15);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.text("Reporte de ventas", 14, 24);
  doc.setTextColor(56, 67, 82);
  doc.setFontSize(10);
  doc.text(
    `Últimos ${period} días | Generado: ${saleDate(generatedAt)} ${saleTime(generatedAt)}`,
    14,
    42,
  );
  const total = sales.reduce((a, s) => a + totalSale(s), 0);
  const profit = sales.reduce((a, s) => a + profitSale(s), 0);
  doc.text(
    `${sales.length} ventas | Total vendido: ${formatMoney(total)} | Ganancia bruta: ${formatMoney(profit)}`,
    14,
    49,
  );
  if (query) doc.text(doc.splitTextToSize(`Búsqueda: ${query}`, 265), 14, 56);
  const start = query
    ? 58 + doc.splitTextToSize(`Búsqueda: ${query}`, 265).length * 5
    : 57;
  if (sales.length) {
    autoTable(doc, {
      startY: start,
      head: [
        ["N.º de venta", "Fecha", "Hora", "Cliente", "Pago", "Total (Bs)"],
      ],
      body: sales.map((s) => [
        s.id,
        saleDate(s.date),
        saleTime(s.date),
        customers.find((c) => c.id === s.customerId)?.name ||
          "Cliente ocasional",
        s.payment,
        formatMoney(totalSale(s)),
      ]),
      foot: [["TOTAL", "", "", "", "", formatMoney(total)]],
      showFoot: "lastPage",
      theme: "grid",
      styles: {
        font: "helvetica",
        fontSize: 9,
        cellPadding: 3,
        lineColor: [225, 235, 243],
        textColor: [56, 67, 82],
        overflow: "linebreak",
      },
      headStyles: {
        fillColor: [2, 132, 199],
        textColor: 255,
        fontStyle: "bold",
      },
      footStyles: {
        fillColor: [224, 242, 254],
        textColor: [3, 105, 161],
        fontStyle: "bold",
      },
      alternateRowStyles: { fillColor: [245, 250, 254] },
      columnStyles: {
        0: { cellWidth: 42 },
        1: { cellWidth: 27 },
        2: { cellWidth: 22 },
        4: { cellWidth: 30 },
        5: { cellWidth: 38, halign: "right" },
      },
      margin: { top: 15, left: 14, right: 14, bottom: 20 },
    });
  } else {
    doc.text(
      "No hay ventas que coincidan con los filtros seleccionados.",
      14,
      start + 8,
    );
  }
  const pages = doc.getNumberOfPages();
  for (let page = 1; page <= pages; page++) {
    doc.setPage(page);
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(115, 130, 146);
    doc.text("Reporte interno. No constituye una factura fiscal.", 14, 200);
    doc.text(`Página ${page} de ${pages}`, 283, 200, { align: "right" });
  }
  return doc;
}
