import {
  collection,
  doc,
  onSnapshot,
  runTransaction,
  query,
  where,
} from "firebase/firestore";
import { firestore } from "./firebase.js";
import { uid } from "./data.js";
import {
  applySaleTransaction,
  prepareProduct,
  prepareSupplier,
} from "./store-operations.js";

import {
  storeCollections,
  skuDocumentId,
  visibleRecords,
} from "./store-schema.js";
const ref = (kind, id) => doc(firestore, storeCollections[kind], id);
const skuId = skuDocumentId;
export const emptyStore = () => ({
  products: [],
  suppliers: [],
  sales: [],
  customers: [],
});

export function subscribeStore(onChange, onError) {
  const data = emptyStore();
  const loaded = new Set();
  let failed = false;
  const sources = {
    productos: "products",
    ventas: "sales",
    proveedores: "suppliers",
  };
  const stops = Object.entries(sources).map(([source, key]) =>
    onSnapshot(
      source === "proveedores"
        ? query(
            collection(firestore, storeCollections[source]),
            where("recordType", "==", "supplier"),
          )
        : collection(firestore, storeCollections[source]),
      { includeMetadataChanges: true },
      (snapshot) => {
        if (failed) return;
        // Wait for the server before treating an empty local cache as real data.
        if (snapshot.metadata.fromCache) return;
        data[key] = visibleRecords(
          source,
          snapshot.docs.map((d) => ({ ...d.data(), id: d.id })),
        );
        loaded.add(key);
        if (loaded.size === 3) onChange({ ...data });
      },
      (error) => {
        failed = true;
        onError(error);
      },
    ),
  );
  return () => stops.forEach((stop) => stop());
}

export async function saveProduct(fields, existing) {
  const product = prepareProduct(fields);
  const productRef = ref("productos", existing?.id || uid());
  const skuRef = ref("skus", skuId(product.sku));
  return runTransaction(firestore, async (tx) => {
    const current = await tx.get(productRef);
    const sku = await tx.get(skuRef);
    if (existing && (!current.exists() || current.data().deleted))
      throw Error("Este producto ya fue eliminado.");
    if (existing && (current.data().version || 0) !== (existing.version || 0))
      throw Error(
        "Este producto cambió en otra sesión. Ciérralo y vuelve a editarlo.",
      );
    if (sku.exists() && sku.data().productId !== productRef.id)
      throw Error("El SKU ya está en uso.");
    if (current.exists() && skuId(current.data().sku) !== skuId(product.sku))
      tx.delete(ref("skus", skuId(current.data().sku)));
    tx.set(skuRef, { recordType: "skuReservation", productId: productRef.id });
    tx.set(productRef, {
      ...product,
      recordType: "product",
      id: productRef.id,
      color: current.data()?.color || "#e0f2fe",
      deleted: false,
      version: (current.data()?.version || 0) + 1,
    });
  });
}

export function saveSupplier(fields, existing) {
  const supplier = prepareSupplier(fields);
  const supplierRef = ref("proveedores", existing?.id || `supplier-${uid()}`);
  return runTransaction(firestore, async (tx) => {
    const current = await tx.get(supplierRef);
    if (existing && (!current.exists() || current.data().deleted))
      throw Error("Este proveedor ya fue borrado.");
    if (existing && (current.data().version || 0) !== (existing.version || 0))
      throw Error(
        "Este proveedor cambió en otra sesión. Ciérralo y vuelve a editarlo.",
      );
    tx.set(supplierRef, {
      ...supplier,
      recordType: "supplier",
      id: supplierRef.id,
      deleted: false,
      version: (current.data()?.version || 0) + 1,
    });
  });
}

export function removeRecord(kind, existing) {
  if (!["productos", "proveedores"].includes(kind))
    throw Error("Tipo de registro inválido.");
  const recordRef = ref(kind, existing.id);
  return runTransaction(firestore, async (tx) => {
    const current = await tx.get(recordRef);
    if (!current.exists() || current.data().deleted)
      throw Error("Este registro ya fue eliminado.");
    if ((current.data().version || 0) !== (existing.version || 0))
      throw Error(
        "Este registro cambió en otra sesión. Revisa sus datos antes de borrarlo.",
      );
    tx.update(recordRef, {
      deleted: true,
      version: (current.data().version || 0) + 1,
    });
  });
}

export function createSale(cart, customerId, payment) {
  const saleRef = ref("ventas", `V-${uid().slice(0, 12).toUpperCase()}`);
  const date = new Date().toISOString();
  return runTransaction(firestore, (tx) =>
    applySaleTransaction(tx, {
      productRefs: cart.map((i) => ref("productos", i.productId)),
      saleRef,
      cart,
      customerId: customerId || null,
      payment,
      date,
    }),
  );
}

export function firebaseMessage(error) {
  if (error?.code === "permission-denied")
    return "No se pudo guardar el cambio. Inténtalo más tarde.";
  if (error?.code === "unavailable")
    return "No se pudo conectar con Firebase. Revisa tu conexión e inténtalo de nuevo.";
  if (error?.code === "resource-exhausted")
    return "Firebase alcanzó su cuota de uso. Revisa el proyecto en la consola.";
  return error?.code
    ? "No se pudo completar la operación en Firebase. Inténtalo de nuevo."
    : error?.message || "No se pudo completar la operación.";
}
