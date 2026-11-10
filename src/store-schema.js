// These are the three root collections allowed by the supplied Firestore rules.
export const storeCollections = {
  productos: "posProducts",
  ventas: "posSales",
  proveedores: "costumeRegistrations",
  skus: "posProducts",
};
export const skuDocumentId = (sku) =>
  `_sku_${encodeURIComponent(sku.trim().toLowerCase())}`;
export function visibleRecords(kind, records) {
  if (kind === "productos")
    return records.filter((record) => record.recordType !== "skuReservation");
  if (kind === "proveedores")
    return records.filter((record) => record.recordType === "supplier");
  return records;
}
