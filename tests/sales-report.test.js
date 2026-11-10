import { test } from "node:test";
import assert from "node:assert/strict";
import { createSalesReport } from "../src/sales-report.js";
import { seed } from "../src/data.js";
import { formatMoney, saleTime } from "../src/format.js";

test("los importes omiten ceros decimales y conservan fracciones", () => {
  assert.equal(formatMoney(249), "Bs 249");
  assert.equal(formatMoney(249.5), "Bs 249,5");
  assert.equal(formatMoney(249.75), "Bs 249,75");
  assert.equal(formatMoney(0), "Bs 0");
  assert.equal(saleTime(new Date(2026, 10, 10, 14, 35)), "14:35");
});

test("genera un PDF con fechas, horas y ventas", () => {
  const sales = seed.sales.slice(0, 3);
  const doc = createSalesReport({
    sales,
    customers: seed.customers,
    period: 7,
  });
  const pdf = doc.output();
  assert.ok(pdf.startsWith("%PDF-"));
  for (const s of sales) {
    assert.ok(pdf.includes(s.id));
    assert.ok(pdf.includes(saleTime(s.date)));
  }
  assert.ok(pdf.includes(String.raw`Total \(Bs\)`));
  assert.equal(doc.getNumberOfPages(), 1);
});

test("el PDF admite listas de varias páginas y resultados vacíos", () => {
  const sales = Array.from({ length: 150 }, (_, i) => ({
    ...seed.sales[i % 30],
    id: `SALE-${i}`,
  }));
  const doc = createSalesReport({
    sales,
    customers: seed.customers,
    period: 365,
    query: "Filtro de prueba",
  });
  assert.ok(doc.getNumberOfPages() > 1);
  assert.ok(doc.output().includes("SALE-149"));
  const empty = createSalesReport({ sales: [], customers: [], period: 7 });
  assert.equal(empty.getNumberOfPages(), 1);
  assert.ok(empty.output().includes("No hay ventas"));
});
