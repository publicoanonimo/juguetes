export const uid = () => globalThis.crypto.randomUUID();
export const today = () => new Date().toISOString().slice(0, 10);
const ago = (n) => new Date(Date.now() - n * 86400000).toISOString();
export const seed = {
  settings: {
    name: "Juguetes",
    currency: "BOB",
    owner: "Valeria",
    goal: 15000,
  },
  products: [
    {
      id: "p1",
      name: "Set de bloques creativos",
      category: "Construcción",
      brand: "LEGO",
      sku: "JUG-001",
      price: 249,
      cost: 145,
      stock: 32,
      min: 8,
      art: "blocks",
      color: "#f3eafc",
      age: "6+ años",
    },
    {
      id: "p2",
      name: "Osito de peluche",
      category: "Peluches",
      brand: "Fisher-Price",
      sku: "JUG-002",
      price: 129,
      cost: 65,
      stock: 5,
      min: 8,
      art: "bear",
      color: "#fff0df",
      age: "0+ años",
    },
    {
      id: "p3",
      name: "Dinosaurio aventurero",
      category: "Figuras",
      brand: "Jurassic World",
      sku: "JUG-003",
      price: 189,
      cost: 102,
      stock: 18,
      min: 5,
      art: "dino",
      color: "#e5f3e9",
      age: "3+ años",
    },
    {
      id: "p4",
      name: "Cohete espacial",
      category: "Educativos",
      brand: "Hape",
      sku: "JUG-004",
      price: 215,
      cost: 125,
      stock: 24,
      min: 6,
      art: "rocket",
      color: "#e9eefc",
      age: "3+ años",
    },
    {
      id: "p5",
      name: "Auto de carreras",
      category: "Vehículos",
      brand: "Hot Wheels",
      sku: "JUG-005",
      price: 59,
      cost: 28,
      stock: 7,
      min: 10,
      art: "car",
      color: "#fce9e6",
      age: "3+ años",
    },
    {
      id: "p6",
      name: "Torre de aros arcoíris",
      category: "Educativos",
      brand: "Fisher-Price",
      sku: "JUG-006",
      price: 99,
      cost: 48,
      stock: 21,
      min: 6,
      art: "rings",
      color: "#fff6dd",
      age: "1+ años",
    },
    {
      id: "p7",
      name: "Conejito de peluche",
      category: "Peluches",
      brand: "Hape",
      sku: "JUG-007",
      price: 139,
      cost: 72,
      stock: 0,
      min: 5,
      art: "bear",
      color: "#f9eaf1",
      age: "0+ años",
    },
    {
      id: "p8",
      name: "Bloques de madera",
      category: "Construcción",
      brand: "Hape",
      sku: "JUG-008",
      price: 159,
      cost: 82,
      stock: 16,
      min: 6,
      art: "blocks",
      color: "#e6f4f2",
      age: "2+ años",
    },
  ],
  customers: [
    {
      id: "c1",
      name: "María Fernanda López",
      email: "maria@example.com",
      phone: "70123456",
    },
    {
      id: "c2",
      name: "Carlos Mendoza",
      email: "carlos@example.com",
      phone: "71234567",
    },
    {
      id: "c3",
      name: "Ana Paula Rojas",
      email: "ana@example.com",
      phone: "72345678",
    },
  ],
  suppliers: [
    {
      id: "s1",
      name: "Happy Toys Trading",
      country: "China",
      email: "ventas@example.com",
      phone: "+86 555 0101",
    },
    {
      id: "s2",
      name: "Mundo Kids Distribuciones",
      country: "Perú",
      email: "kids@example.com",
      phone: "+51 555 0102",
    },
  ],
  imports: [
    {
      id: "i1",
      reference: "IMP-2026-001",
      supplier: "s1",
      origin: "China",
      eta: today(),
      status: "En tránsito",
      freight: 450,
      customs: 280,
      items: [
        { productId: "p1", qty: 30, unitCost: 120 },
        { productId: "p2", qty: 20, unitCost: 50 },
      ],
    },
    {
      id: "i2",
      reference: "IMP-2026-002",
      supplier: "s2",
      origin: "Perú",
      eta: today(),
      status: "En preparación",
      freight: 180,
      customs: 120,
      items: [{ productId: "p5", qty: 50, unitCost: 22 }],
    },
  ],
  sales: Array.from({ length: 30 }, (_, i) => {
    const p = [0, 1, 2, 3, 4, 5][i % 6];
    const prices = [249, 129, 189, 215, 59, 99],
      costs = [145, 65, 102, 125, 28, 48];
    return {
      id: `V-${1040 + i}`,
      date: ago(Math.floor(i / 4)),
      customerId: ["c1", "c2", "c3", null][i % 4],
      payment: ["Efectivo", "QR"][i % 2],
      items: [
        {
          productId: `p${p + 1}`,
          name: [
            "Set de bloques creativos",
            "Osito de peluche",
            "Dinosaurio aventurero",
            "Cohete espacial",
            "Auto de carreras",
            "Torre de aros arcoíris",
          ][p],
          qty: (i % 3) + 1,
          price: prices[p],
          cost: costs[p],
        },
      ],
    };
  }),
};
export const totalSale = (s) =>
  s.items.reduce((a, i) => a + i.price * i.qty, 0);
export const profitSale = (s) =>
  s.items.reduce((a, i) => a + (i.price - i.cost) * i.qty, 0);
export function completeSale(db, cart, customerId, payment) {
  if (!["QR", "Efectivo"].includes(payment))
    throw new Error("Selecciona Efectivo o QR.");
  if (!cart.length) throw new Error("Añade al menos un producto.");
  const items = cart.map((i) => {
    const p = db.products.find((p) => p.id === i.productId);
    if (
      !p ||
      p.deleted ||
      !Number.isInteger(i.qty) ||
      i.qty < 1 ||
      i.qty > p.stock
    )
      throw new Error("Stock insuficiente. Revisa las cantidades.");
    return {
      productId: p.id,
      name: p.name,
      qty: i.qty,
      price: p.price,
      cost: p.cost,
    };
  });
  const sale = {
    id: `V-${uid().slice(0, 8).toUpperCase()}`,
    date: new Date().toISOString(),
    customerId,
    payment,
    items,
  };
  return {
    ...db,
    products: db.products.map((p) => ({
      ...p,
      stock: p.stock - (items.find((i) => i.productId === p.id)?.qty || 0),
    })),
    sales: [sale, ...db.sales],
  };
}
export function receiveImport(db, id) {
  const order = db.imports.find((i) => i.id === id);
  if (!order || order.status === "Recibido")
    throw new Error("Esta importación ya fue recibida o no existe.");
  const units = order.items.reduce((a, i) => a + i.qty, 0);
  const extra = (order.freight + order.customs) / units;
  return {
    ...db,
    imports: db.imports.map((i) =>
      i.id === id ? { ...i, status: "Recibido" } : i,
    ),
    products: db.products.map((p) => {
      const item = order.items.find((i) => i.productId === p.id);
      return item
        ? {
            ...p,
            stock: p.stock + item.qty,
            cost:
              (p.stock * p.cost + item.qty * (item.unitCost + extra)) /
              (p.stock + item.qty),
          }
        : p;
    }),
  };
}
export function validDatabase(d) {
  const finite = (n) => typeof n === "number" && Number.isFinite(n) && n >= 0;
  const str = (s) => typeof s === "string" && s.trim().length > 0;
  const list = (k) => Array.isArray(d?.[k]);
  if (
    !d?.settings ||
    !str(d.settings.name) ||
    !str(d.settings.owner) ||
    !["BOB", "USD", "PEN"].includes(d.settings.currency) ||
    !finite(d.settings.goal) ||
    d.settings.goal <= 0 ||
    !["products", "sales", "customers", "suppliers", "imports"].every(list)
  )
    return false;
  const unique = (rows) => new Set(rows.map((x) => x.id)).size === rows.length;
  if (
    !["products", "sales", "customers", "suppliers", "imports"].every(
      (k) => unique(d[k]) && d[k].every((x) => str(x.id)),
    )
  )
    return false;
  if (
    !d.products.every(
      (p) =>
        ["name", "sku", "brand", "category", "age", "art", "color"].every((k) =>
          str(p[k]),
        ) &&
        ["price", "cost", "stock", "min"].every((k) => finite(p[k])) &&
        Number.isInteger(p.stock) &&
        Number.isInteger(p.min),
    )
  )
    return false;
  if (
    !d.customers.every((c) =>
      ["name", "email", "phone"].every((k) => str(c[k])),
    ) ||
    !d.suppliers.every((c) =>
      ["name", "email", "phone", "country"].every((k) => str(c[k])),
    )
  )
    return false;
  if (
    !d.sales.every(
      (s) =>
        str(s.date) &&
        Number.isFinite(Date.parse(s.date)) &&
        str(s.payment) &&
        Array.isArray(s.items) &&
        s.items.length > 0 &&
        s.items.every(
          (i) =>
            str(i.productId) &&
            str(i.name) &&
            Number.isInteger(i.qty) &&
            i.qty > 0 &&
            finite(i.price) &&
            finite(i.cost),
        ),
    )
  )
    return false;
  return d.imports.every(
    (o) =>
      str(o.reference) &&
      d.suppliers.some((s) => s.id === o.supplier) &&
      str(o.origin) &&
      /^\d{4}-\d{2}-\d{2}$/.test(o.eta) &&
      ["En preparación", "En tránsito", "Recibido"].includes(o.status) &&
      finite(o.freight) &&
      finite(o.customs) &&
      Array.isArray(o.items) &&
      o.items.length > 0 &&
      o.items.every(
        (i) =>
          d.products.some((p) => p.id === i.productId) &&
          Number.isInteger(i.qty) &&
          i.qty > 0 &&
          finite(i.unitCost),
      ),
  );
}

// Keep referenced records so historical sales and existing backups remain valid.
export function deleteProduct(db, id) {
  const product = db.products.find((p) => p.id === id && !p.deleted);
  if (!product) throw new Error("El producto ya fue eliminado o no existe.");
  return {
    ...db,
    products: db.products.map((p) =>
      p.id === id ? { ...p, deleted: true } : p,
    ),
  };
}
