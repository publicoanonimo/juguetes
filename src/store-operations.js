import { completeSale } from "./data.js";

export function prepareProduct(fields) {
  const p = {
    name: String(fields.name || "").trim(),
    sku: String(fields.sku || "").trim(),
    brand: String(fields.brand || "").trim(),
    category: String(fields.category || "").trim(),
    age: String(fields.age || "").trim(),
    art: fields.art,
    price: Number(fields.price),
    cost: Number(fields.cost),
    stock: Number(fields.stock),
    min: Number(fields.min),
  };
  if (
    !p.name ||
    !p.sku ||
    p.sku.length > 64 ||
    !p.brand ||
    !p.category ||
    !p.age
  )
    throw Error(
      "Completa los datos del producto. El SKU admite hasta 64 caracteres.",
    );
  if (!["blocks", "bear", "dino", "rocket", "car", "rings"].includes(p.art))
    throw Error("Selecciona una ilustración válida.");
  if (
    ![p.price, p.cost, p.stock, p.min].every(
      (n) => Number.isFinite(n) && n >= 0,
    ) ||
    !Number.isInteger(p.stock) ||
    !Number.isInteger(p.min)
  )
    throw Error("Revisa los precios y las cantidades.");
  return p;
}

export function prepareSupplier(fields) {
  const supplier = Object.fromEntries(
    ["name", "email", "phone", "country"].map((k) => [
      k,
      String(fields[k] || "").trim(),
    ]),
  );
  if (Object.values(supplier).some((v) => !v))
    throw Error("Completa los datos del proveedor.");
  return supplier;
}

// The transaction reads current inventory before any writes. Firestore retries
// this function if another register changes any of these product documents.
export async function applySaleTransaction(
  tx,
  { productRefs, saleRef, cart, customerId, payment, date },
) {
  if (new Set(cart.map((i) => i.productId)).size !== cart.length)
    throw Error("Hay productos repetidos en el carrito.");
  const snapshots = await Promise.all(productRefs.map((ref) => tx.get(ref)));
  const products = snapshots
    .filter((s) => s.exists())
    .map((s) => ({ ...s.data(), id: s.id }));
  const next = completeSale({ products, sales: [] }, cart, customerId, payment);
  const sale = { ...next.sales[0], id: saleRef.id, date };
  for (const ref of productRefs) {
    const previous = products.find((p) => p.id === ref.id);
    tx.update(ref, {
      stock: next.products.find((p) => p.id === ref.id).stock,
      version: (previous.version || 0) + 1,
    });
  }
  tx.set(saleRef, sale);
  return sale;
}
