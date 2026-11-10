import { test } from "node:test";
import assert from "node:assert/strict";
import {
  seed,
  completeSale,
  receiveImport,
  totalSale,
  profitSale,
} from "../src/data.js";
test("cobrar una venta descuenta stock y conserva el costo histórico", () => {
  const db = structuredClone(seed),
    original = db.products[0];
  const next = completeSale(
    db,
    [{ productId: original.id, qty: 2 }],
    "c1",
    "QR",
  );
  assert.equal(next.products[0].stock, original.stock - 2);
  assert.equal(db.products[0].stock, 32);
  assert.equal(totalSale(next.sales[0]), original.price * 2);
  assert.equal(profitSale(next.sales[0]), (original.price - original.cost) * 2);
  next.products[0].cost = 999;
  assert.equal(next.sales[0].items[0].cost, original.cost);
});
test("impide ventas vacías, stock insuficiente y cantidades inválidas", () => {
  for (const cart of [
    [],
    [{ productId: "p1", qty: 1000 }],
    [{ productId: "p1", qty: -1 }],
    [{ productId: "p1", qty: 1.5 }],
    [{ productId: "missing", qty: 1 }],
  ])
    assert.throws(() => completeSale(structuredClone(seed), cart, null, "QR"));
});
test("recepción incorpora gastos al costo promedio ponderado", () => {
  const db = structuredClone(seed),
    order = db.imports[0],
    p = db.products[0];
  const expected =
    (p.stock * p.cost + 30 * (120 + (450 + 280) / 50)) / (p.stock + 30);
  const next = receiveImport(db, order.id);
  assert.equal(next.products[0].stock, p.stock + 30);
  assert.equal(next.products[0].cost, expected);
  assert.equal(next.imports[0].status, "Recibido");
  assert.equal(next.products[2].stock, db.products[2].stock);
  assert.throws(() => receiveImport(next, order.id));
});
test("la copia de seguridad valida estructura y valores", async () => {
  const { validDatabase } = await import("../src/data.js");
  assert.equal(validDatabase(seed), true);
  assert.equal(validDatabase(null), false);
  const invalid = structuredClone(seed);
  invalid.products[0].stock = -1;
  assert.equal(validDatabase(invalid), false);
  const broken = structuredClone(seed);
  broken.sales[0].items = null;
  assert.equal(validDatabase(broken), false);
});

test("eliminar un producto lo retira del catálogo y conserva las ventas anteriores", async () => {
  const { deleteProduct, validDatabase } = await import("../src/data.js");
  const db = structuredClone(seed);
  const next = deleteProduct(db, "p1");
  assert.equal(
    next.products.filter((p) => !p.deleted).length,
    db.products.length - 1,
  );
  assert.equal(next.products.find((p) => p.id === "p1").deleted, true);
  assert.deepEqual(next.sales, db.sales);
  assert.equal(db.products[0].deleted, undefined);
  assert.equal(validDatabase(JSON.parse(JSON.stringify(next))), true);
  assert.throws(() =>
    completeSale(next, [{ productId: "p1", qty: 1 }], null, "QR"),
  );
  assert.throws(() => deleteProduct(next, "p1"));
});

test("solo permite nuevos cobros por Efectivo o QR", () => {
  const cart = [{ productId: "p1", qty: 1 }];
  for (const method of ["Tarjeta", "Transferencia", ""]) {
    assert.throws(() =>
      completeSale(structuredClone(seed), cart, null, method),
    );
  }
  for (const method of ["Efectivo", "QR"]) {
    assert.equal(
      completeSale(structuredClone(seed), cart, null, method).sales[0].payment,
      method,
    );
  }
});
