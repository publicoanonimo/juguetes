import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import {
  storeCollections,
  skuDocumentId,
  visibleRecords,
} from "../src/store-schema.js";

test("todas las operaciones utilizan únicamente las colecciones permitidas por las reglas", () => {
  const rules = readFileSync(
    new URL("../firestore.rules", import.meta.url),
    "utf8",
  );
  const allowed = [
    ...rules.matchAll(/match \/([A-Za-z][A-Za-z0-9]*)\/\{[^}]+\}\s*\{/g),
  ].map((match) => match[1]);
  assert.deepEqual(allowed, [
    "costumeRegistrations",
    "posProducts",
    "posSales",
  ]);
  for (const name of Object.values(storeCollections))
    assert.ok(allowed.includes(name), `Colección no autorizada: ${name}`);
});

test("las reservas SKU no aparecen como productos y se conservan los productos existentes", () => {
  const records = [
    { id: "legacy", name: "Producto anterior" },
    { id: "new", recordType: "product" },
    { id: skuDocumentId(" ABC/123 "), recordType: "skuReservation" },
  ];
  assert.deepEqual(
    visibleRecords("productos", records).map((r) => r.id),
    ["legacy", "new"],
  );
  assert.equal(skuDocumentId("ABC/123"), skuDocumentId(" abc/123 "));
  assert.ok(!skuDocumentId("ABC/123").includes("/"));
  assert.equal(records.length, 3);
});

test("el directorio solo usa proveedores identificados y conserva otros registros", () => {
  const records = [
    { id: "registration", name: "Registro existente" },
    { id: "supplier-1", recordType: "supplier", name: "Proveedor" },
  ];
  assert.deepEqual(visibleRecords("proveedores", records), [records[1]]);
  assert.equal(records[0].name, "Registro existente");
});
