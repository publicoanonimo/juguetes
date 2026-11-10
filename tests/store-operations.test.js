import { test } from "node:test";
import assert from "node:assert/strict";
import {
  applySaleTransaction,
  prepareProduct,
  prepareSupplier,
} from "../src/store-operations.js";
import { seed } from "../src/data.js";

function transaction(products) {
  const writes = [];
  let writing = false;
  return {
    writes,
    async get(ref) {
      assert.equal(
        writing,
        false,
        "No se debe leer después de comenzar las escrituras",
      );
      const product = products.find((p) => p.id === ref.id);
      return {
        id: ref.id,
        exists: () => !!product,
        data: () => structuredClone(product),
      };
    },
    update(ref, value) {
      writing = true;
      writes.push({ kind: "update", id: ref.id, value });
    },
    set(ref, value) {
      writing = true;
      writes.push({ kind: "set", id: ref.id, value });
    },
  };
}
const params = () => ({
  productRefs: [{ id: "p1" }, { id: "p2" }],
  saleRef: { id: "V-TEST" },
  cart: [
    { productId: "p1", qty: 2 },
    { productId: "p2", qty: 1 },
  ],
  customerId: null,
  payment: "QR",
  date: "2026-11-10T15:30:00.000Z",
});

test("la transacción usa el stock actual y registra el cobro junto con sus descuentos", async () => {
  const products = structuredClone(seed.products);
  products[0].stock = 3;
  products[0].version = 8;
  const tx = transaction(products);
  const sale = await applySaleTransaction(tx, params());
  assert.equal(sale.id, "V-TEST");
  assert.equal(sale.date, params().date);
  assert.equal(sale.items[0].cost, 145);
  assert.equal(tx.writes.length, 3);
  assert.deepEqual(tx.writes[0], {
    kind: "update",
    id: "p1",
    value: { stock: 1, version: 9 },
  });
  assert.equal(tx.writes[1].value.stock, 4);
  assert.deepEqual(tx.writes[2].value, sale);
  assert.equal(products[0].stock, 3);
});

test("no escribe una venta si otra caja agotó el inventario", async () => {
  const products = structuredClone(seed.products);
  products[0].stock = 1;
  const tx = transaction(products);
  await assert.rejects(
    () => applySaleTransaction(tx, params()),
    /Stock insuficiente/,
  );
  assert.equal(tx.writes.length, 0);
});

test("rechaza productos borrados o faltantes, carritos repetidos y pagos inválidos sin escribir", async () => {
  for (const scenario of ["deleted", "missing", "duplicate", "payment"]) {
    const products = structuredClone(seed.products),
      input = params();
    if (scenario === "deleted") products[0].deleted = true;
    if (scenario === "missing") products.shift();
    if (scenario === "duplicate") input.cart.push({ ...input.cart[0] });
    if (scenario === "payment") input.payment = "Tarjeta";
    const tx = transaction(products);
    await assert.rejects(() => applySaleTransaction(tx, input));
    assert.equal(tx.writes.length, 0);
  }
});

test("valida y normaliza datos antes de enviarlos a Firestore", () => {
  const valid = {
    ...seed.products[0],
    name: "  Bloques  ",
    stock: "4",
    min: "2",
    price: "10.5",
    cost: "5",
  };
  assert.equal(prepareProduct(valid).name, "Bloques");
  assert.equal(prepareProduct(valid).price, 10.5);
  for (const fields of [
    { ...valid, stock: 1.5 },
    { ...valid, cost: -1 },
    { ...valid, price: "incorrecto" },
    { ...valid, sku: "a".repeat(65) },
    { ...valid, name: " " },
  ])
    assert.throws(() => prepareProduct(fields));
  assert.equal(
    prepareSupplier({ ...seed.suppliers[0], name: "  Mi proveedor  " }).name,
    "Mi proveedor",
  );
  assert.throws(() => prepareSupplier({ ...seed.suppliers[0], email: " " }));
});
