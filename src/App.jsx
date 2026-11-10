import React, { useState, useEffect, useRef } from "react";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  ShoppingCart,
  Truck,
  Search,
  Plus,
  ChevronRight,
  Bell,
  ArrowRight,
  Wallet,
  TrendingUp,
  ReceiptText,
  Box,
  X,
  Minus,
  Check,
  Download,
  FileDown,
  Menu,
  Trash2,
  Pencil,
  LoaderCircle,
  RefreshCw,
} from "lucide-react";
import { today, totalSale, profitSale } from "./data";
import {
  emptyStore,
  subscribeStore,
  saveProduct,
  saveSupplier,
  removeRecord,
  createSale,
  firebaseMessage,
} from "./store.js";
import { formatMoney, saleDate, saleTime } from "./format.js";

const nav = [
  ["Inicio", LayoutDashboard],
  ["Inventario", Package],
  ["Punto de venta", ShoppingBag],
  ["Ventas", ReceiptText],
  ["Proveedores", Truck],
];
function Toy({ type = "blocks" }) {
  return (
    <svg viewBox="0 0 160 140" aria-hidden="true" className="toy">
      <ellipse cx="80" cy="121" rx="47" ry="7" fill="#000" opacity=".07" />
      {type === "bear" ? (
        <g fill="#c89362" stroke="#ae784e" strokeWidth="2">
          <ellipse cx="80" cy="91" rx="33" ry="32" />
          <circle cx="49" cy="36" r="15" />
          <circle cx="111" cy="36" r="15" />
          <circle cx="80" cy="56" r="34" />
          <ellipse cx="80" cy="95" rx="21" ry="23" fill="#eac5a0" />
          <ellipse
            cx="45"
            cy="92"
            rx="13"
            ry="23"
            transform="rotate(22 45 92)"
          />
          <ellipse
            cx="116"
            cy="92"
            rx="13"
            ry="23"
            transform="rotate(-22 116 92)"
          />
          <ellipse cx="57" cy="119" rx="18" ry="11" />
          <ellipse cx="103" cy="119" rx="18" ry="11" />
          <ellipse cx="80" cy="66" rx="16" ry="12" fill="#edccac" />
          <circle cx="68" cy="52" r="3" fill="#38302b" stroke="none" />
          <circle cx="92" cy="52" r="3" fill="#38302b" stroke="none" />
          <path d="M75 61 Q80 57 85 61 L80 67Z" fill="#38302b" stroke="none" />
        </g>
      ) : type === "dino" ? (
        <g>
          <path
            d="M27 100 Q60 120 98 101 L111 70 Q146 78 145 52 Q143 34 121 35 Q98 38 97 66 L76 83 Q56 98 20 75Z"
            fill="#73a984"
          />
          <path
            d="M42 90 L49 69 61 84 68 61 81 78 86 54 101 69"
            fill="#d2df9f"
          />
          <path
            d="M70 98 L66 122 82 122 87 99 M98 95 L102 120 119 120 111 86"
            fill="#659775"
          />
          <circle cx="129" cy="48" r="3" fill="#263a2d" />
          <path d="M131 62h12" stroke="#446d50" strokeWidth="2" />
        </g>
      ) : type === "rocket" ? (
        <g>
          <path d="M65 103 L70 132 81 118 88 134 97 101" fill="#f4bf63" />
          <path
            d="M61 77 Q38 89 43 117 L67 105 M99 77 Q122 89 117 117 L93 105"
            fill="#e89585"
          />
          <path
            d="M61 103 Q52 51 80 17 Q108 51 99 103Z"
            fill="#faf9f4"
            stroke="#b5bfd4"
            strokeWidth="2"
          />
          <path d="M64 44 Q70 27 80 17 Q91 28 96 44" fill="#839ad2" />
          <circle cx="80" cy="66" r="15" fill="#839ad2" />
          <circle cx="80" cy="66" r="10" fill="#cee2ed" />
          <path d="M62 99h36v8H62Z" fill="#839ad2" />
        </g>
      ) : type === "car" ? (
        <g>
          <path
            d="M27 83 L43 80 61 54 106 54 123 80 141 87 138 111H24Z"
            fill="#e68172"
          />
          <path d="M63 60h17v21H48Z M86 60h16l14 21H86Z" fill="#d4e6f0" />
          <rect x="24" y="96" width="116" height="9" fill="#c7675b" />
          <circle cx="49" cy="110" r="15" fill="#3d414c" />
          <circle cx="117" cy="110" r="15" fill="#3d414c" />
          <circle cx="49" cy="110" r="7" fill="#d6d8dd" />
          <circle cx="117" cy="110" r="7" fill="#d6d8dd" />
        </g>
      ) : type === "rings" ? (
        <g>
          <rect x="74" y="24" width="12" height="95" rx="6" fill="#d8b891" />
          {["#8398cc", "#78b6a2", "#edc65b", "#e6a16b", "#d78686"].map(
            (c, i) => (
              <rect
                key={c}
                x={28 + i * 9}
                y={100 - i * 17}
                width={104 - i * 18}
                height="20"
                rx="10"
                fill={c}
              />
            ),
          )}
        </g>
      ) : (
        <g strokeWidth="1.5">
          <path d="M27 78 L69 65 105 83 62 98Z" fill="#e4b958" />
          <path d="M27 78v34l35 17V98Z" fill="#d5a542" />
          <path d="M62 98l43-15v33l-43 13Z" fill="#edc56b" />
          <path d="M66 48l38-12 33 17-39 13Z" fill="#9fbda7" />
          <path d="M66 48v31l32 17V66Z" fill="#79a68c" />
          <path d="M98 66l39-13v31L98 96Z" fill="#91b79e" />
          <path d="M34 36l31-10 28 14-31 11Z" fill="#ac9acc" />
          <path d="M34 36v28l28 15V51Z" fill="#9780bf" />
          <path d="M62 51l31-11v28L62 79Z" fill="#b29bd4" />
          {[
            [44, 34],
            [63, 28],
            [63, 44],
            [81, 39],
          ].map(([x, y]) => (
            <ellipse
              key={x + "," + y}
              cx={x}
              cy={y}
              rx="6"
              ry="3.5"
              fill="#c5b4e0"
            />
          ))}
        </g>
      )}
    </svg>
  );
}
export default function App() {
  const [db, setDb] = useState(emptyStore);
  const [connection, setConnection] = useState("loading");
  const [connectionError, setConnectionError] = useState("");
  const [retry, setRetry] = useState(0);
  const [saving, setSaving] = useState(false);
  const savingRef = useRef(false);
  useEffect(() => {
    let active = true;
    setConnection("loading");
    setConnectionError("");
    const timeout = setTimeout(() => {
      if (active) {
        setConnection("error");
        setConnectionError(
          "La conexión está tardando demasiado. Comprueba tu conexión y que Cloud Firestore esté habilitado.",
        );
      }
    }, 20000);
    const stop = subscribeStore(
      (data) => {
        if (!active) return;
        clearTimeout(timeout);
        setDb(data);
        setConnection("ready");
      },
      (error) => {
        if (!active) return;
        clearTimeout(timeout);
        setConnectionError(firebaseMessage(error));
        setConnection("error");
      },
    );
    return () => {
      active = false;
      clearTimeout(timeout);
      stop();
    };
  }, [retry]);
  const [page, setPage] = useState("Inicio"),
    [query, setQuery] = useState(""),
    [category, setCategory] = useState("Todos"),
    [period, setPeriod] = useState("7"),
    [modal, setModal] = useState(null),
    [toast, setToast] = useState(""),
    [cart, setCart] = useState([]),
    [mobile, setMobile] = useState(false),
    [customer, setCustomer] = useState(""),
    [payment, setPayment] = useState("QR");
  useEffect(() => {
    if (toast) {
      const id = setTimeout(() => setToast(""), 4500);
      return () => clearTimeout(id);
    }
  }, [toast]);
  useEffect(() => {
    if (!modal || connection !== "ready") return;
    const previous = document.activeElement;
    const dialog = document.querySelector("[role=dialog]");
    if (!dialog) return;
    const focusables = () => [
      ...dialog.querySelectorAll("button:not(:disabled),input,select,a[href]"),
    ];
    focusables()[0]?.focus();
    function key(e) {
      if (e.key === "Escape") setModal(null);
      if (e.key === "Tab") {
        const items = focusables(),
          first = items[0],
          last = items.at(-1);
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last?.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first?.focus();
        }
      }
    }
    document.addEventListener("keydown", key);
    return () => {
      document.removeEventListener("keydown", key);
      previous?.focus();
    };
  }, [modal, connection]);
  const money = connection === "ready" ? formatMoney : () => "—";
  const products = db.products.filter((p) => !p.deleted);
  const navigate = (p) => {
    setPage(p);
    setQuery("");
    setCategory("Todos");
    setMobile(false);
  };
  const low = products.filter((p) => p.stock <= p.min);
  const sales = db.sales
    .filter(
      (s) =>
        Date.now() - new Date(s.date).getTime() < Number(period) * 86400000,
    )
    .sort((a, b) => new Date(b.date) - new Date(a.date));
  const revenue = sales.reduce((a, s) => a + totalSale(s), 0),
    profit = sales.reduce((a, s) => a + profitSale(s), 0),
    units = products.reduce((a, p) => a + p.stock, 0);
  const filtered = products.filter(
    (p) =>
      (category === "Todos" ||
        (category === "Stock bajo"
          ? p.stock <= p.min
          : p.category === category)) &&
      `${p.name} ${p.sku} ${p.brand}`
        .toLowerCase()
        .includes(query.toLowerCase()),
  );
  const notify = (msg) => setToast(msg);
  const visibleSales = sales.filter((s) =>
    `${s.id} ${db.customers.find((c) => c.id === s.customerId)?.name || "Cliente ocasional"}`
      .toLowerCase()
      .includes(query.toLowerCase()),
  );
  function exportData() {
    const content =
      "Venta,Fecha,Hora,Cliente,Total,Ganancia,Metodo\n" +
      visibleSales
        .map((s) =>
          [
            s.id,
            saleDate(s.date),
            saleTime(s.date),
            db.customers.find((c) => c.id === s.customerId)?.name ||
              "Cliente ocasional",
            totalSale(s),
            profitSale(s).toFixed(2),
            s.payment,
          ]
            .map(csvCell)
            .join(","),
        )
        .join("\n");
    const url = URL.createObjectURL(
      new Blob(["\uFEFF" + content], { type: "text/csv;charset=utf-8" }),
    );
    const a = document.createElement("a");
    a.href = url;
    a.download = `juguetes-ventas-${today()}.csv`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    notify("CSV exportado correctamente");
  }
  async function exportPDF() {
    try {
      const { createSalesReport } = await import("./sales-report.js");
      const doc = createSalesReport({
        sales: visibleSales,
        customers: db.customers,
        period: Number(period),
        query,
      });
      doc.save(`juguetes-ventas-${today()}.pdf`);
      notify("PDF de ventas exportado correctamente");
    } catch {
      notify("No se pudo generar el PDF. Inténtalo de nuevo.");
    }
  }
  function add(p) {
    const line = cart.find((i) => i.productId === p.id);
    if ((line?.qty || 0) >= p.stock)
      return notify("No hay más unidades disponibles");
    setCart(
      line
        ? cart.map((i) => (i.productId === p.id ? { ...i, qty: i.qty + 1 } : i))
        : [...cart, { productId: p.id, qty: 1 }],
    );
    notify("Producto añadido a la venta");
  }
  async function performWrite(operation) {
    if (connection !== "ready") {
      notify("Los datos no están conectados. No se guardó ningún cambio.");
      return;
    }
    if (savingRef.current) return;
    savingRef.current = true;
    setSaving(true);
    try {
      await operation();
    } catch (error) {
      notify(firebaseMessage(error));
    } finally {
      savingRef.current = false;
      setSaving(false);
    }
  }
  function checkout() {
    performWrite(async () => {
      const sale = await createSale(cart, customer, payment);
      setCart([]);
      setModal({ type: "receipt", sale });
    });
  }
  const sumCart = cart.reduce(
    (a, i) =>
      a + (products.find((p) => p.id === i.productId)?.price || 0) * i.qty,
    0,
  );
  function submit(e) {
    e.preventDefault();
    const fields = Object.fromEntries(new FormData(e.target));
    performWrite(async () => {
      if (modal.type === "product") await saveProduct(fields, modal.item);
      if (modal.type === "supplier") await saveSupplier(fields, modal.item);
      setModal(null);
      notify("Cambios guardados en Firebase");
    });
  }
  function Header({ title, description, action }) {
    return (
      <div className="page-heading">
        <div>
          <div className="eyebrow">TU NEGOCIO, EN ORDEN</div>
          <h1>{title}</h1>
          <p>{description}</p>
        </div>
        {action}
      </div>
    );
  }
  function Stat({ label, value, icon: Icon, color, detail }) {
    return (
      <div className="stat">
        <div className="stat-top">
          <span>{label}</span>
          <span className={"stat-icon " + color}>
            <Icon size={19} />
          </span>
        </div>
        <strong>{value}</strong>
        <div className="stat-detail">{detail}</div>
      </div>
    );
  }
  function SalesTable({ compact = false }) {
    const rows = visibleSales;
    return (
      <div className="table-scroll">
        <table>
          <thead>
            <tr>
              <th>N.º de venta</th>
              <th>Cliente</th>
              <th>Fecha</th>
              <th>Hora</th>
              <th>Total</th>
              <th>Pago</th>
              <th>Estado</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {rows.slice(0, compact ? 5 : rows.length).map((s) => (
              <tr key={s.id}>
                <td className="purple-text">#{s.id}</td>
                <td>
                  {db.customers.find((c) => c.id === s.customerId)?.name ||
                    "Cliente ocasional"}
                </td>
                <td className="muted">{saleDate(s.date)}</td>
                <td className="sale-time">
                  <time dateTime={s.date}>{saleTime(s.date)}</time>
                </td>
                <td className="strong">{money(totalSale(s))}</td>
                <td>{s.payment}</td>
                <td>
                  <span className="badge green">
                    <span />
                    Completada
                  </span>
                </td>
                <td>
                  <button
                    className="icon-button"
                    aria-label={"Ver venta " + s.id}
                    onClick={() => setModal({ type: "receipt", sale: s })}
                  >
                    <ChevronRight size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!rows.length && (
          <div className="empty">No se encontraron ventas en este período.</div>
        )}
      </div>
    );
  }
  return (
    <div className="app">
      {saving && (
        <div className="saving-overlay" role="status" aria-live="polite">
          <span>
            <LoaderCircle className="spin" size={23} />
            Guardando en Firebase…
          </span>
        </div>
      )}
      <div
        className={"shade " + (mobile ? "visible" : "")}
        onClick={() => setMobile(false)}
      />
      <aside className={"sidebar " + (mobile ? "open" : "")}>
        <a
          className="brand"
          href="#"
          onClick={(e) => {
            e.preventDefault();
            navigate("Inicio");
          }}
        >
          <span className="brand-icon">
            <Box size={24} />
          </span>
          Juguetes<span className="brand-dot">.</span>
        </a>
        <div className="nav-caption">PRINCIPAL</div>
        <nav>
          {nav.map(([label, Icon]) => (
            <button
              key={label}
              className={page === label ? "active" : ""}
              onClick={() => navigate(label)}
            >
              <Icon size={19} />
              <span>{label}</span>
              {label === "Inventario" && (
                <span className="nav-count">{products.length}</span>
              )}
            </button>
          ))}
        </nav>
      </aside>
      <div className="workspace">
        <header className="topbar">
          <div className="breadcrumb">
            <button
              className="icon-button menu-button"
              aria-label="Abrir menú"
              onClick={() => setMobile(true)}
            >
              <Menu size={21} />
            </button>
            <span>Mi tienda</span>
            <ChevronRight size={14} />
            <strong>{page}</strong>
          </div>
          <div className="top-actions">
            <span className="demo-label">
              <i
                style={{
                  background: connection === "ready" ? "#15a575" : "#e9a23b",
                }}
              />
              {connection === "ready"
                ? "Datos conectados"
                : connection === "loading"
                  ? "Conectando datos…"
                  : "Datos sin conexión"}
            </span>
            <button
              className="notification icon-button"
              aria-label="Ver alertas"
              onClick={() => setModal({ type: "alerts" })}
            >
              <Bell size={20} />
              <i />
            </button>
          </div>
        </header>
        <main>
          {connection === "loading" && (
            <div className="data-status" role="status">
              <LoaderCircle className="spin" size={18} />
              Cargando datos de la tienda…
            </div>
          )}
          {connection === "error" && (
            <div className="data-status data-status-error" role="alert">
              <div>
                <strong>No se pudieron cargar los datos.</strong>
                <p>{connectionError}</p>
              </div>
              <button className="button" onClick={() => setRetry((n) => n + 1)}>
                <RefreshCw size={16} />
                Reconectar
              </button>
            </div>
          )}

          {page === "Inicio" ? (
            <>
              <Header
                title={
                  <>
                    Tu tienda de un vistazo <span className="wave">✦</span>
                  </>
                }
                description="Resumen de ingresos, ventas y existencias."
              />
              <div className="overview-label">
                <div>
                  <span className="section-dot" /> Resumen de tu negocio{" "}
                  <span className="muted">· En tiempo real</span>
                </div>
                <select
                  value={period}
                  onChange={(e) => setPeriod(e.target.value)}
                  aria-label="Período"
                >
                  <option value="7">Últimos 7 días</option>
                  <option value="30">Últimos 30 días</option>
                  <option value="365">Este año</option>
                </select>
              </div>
              <div className="stats">
                <Stat
                  label="Ingresos por ventas"
                  value={money(revenue)}
                  icon={Wallet}
                  color="purple"
                  detail={
                    <>
                      <span className="positive">
                        <TrendingUp size={13} /> {sales.length} ventas
                      </span>
                      <span>en el período</span>
                    </>
                  }
                />
                <Stat
                  label="Ganancia bruta"
                  value={money(profit)}
                  icon={TrendingUp}
                  color="green"
                  detail={
                    <>
                      <span className="positive">
                        {revenue ? ((profit / revenue) * 100).toFixed(1) : 0}%
                      </span>
                      <span>margen sobre ventas</span>
                    </>
                  }
                />
                <Stat
                  label="Ventas realizadas"
                  value={connection === "ready" ? sales.length : "—"}
                  icon={ShoppingBag}
                  color="blue"
                  detail={
                    <>
                      <span className="muted">Promedio por venta</span>
                      <span className="strong">
                        {money(sales.length ? revenue / sales.length : 0)}
                      </span>
                    </>
                  }
                />
                <Stat
                  label="Productos en stock"
                  value={connection === "ready" ? units : "—"}
                  icon={Package}
                  color="orange"
                  detail={
                    <>
                      <span className="warning">
                        {low.length} con stock bajo
                      </span>
                      <button
                        className="text-link"
                        onClick={() => {
                          navigate("Inventario");
                          setCategory("Stock bajo");
                        }}
                      >
                        Revisar <ArrowRight size={13} />
                      </button>
                    </>
                  }
                />
              </div>
              <div className="charts-row">
                <section className="panel revenue-panel">
                  <div className="panel-title">
                    <div>
                      <h2>Ventas de la semana</h2>
                      <p>Ingresos y ganancias de los últimos 7 días</p>
                    </div>
                    <div className="chart-legend">
                      <span>
                        <i />
                        Ingresos
                      </span>
                      <span>
                        <i />
                        Ganancia
                      </span>
                    </div>
                  </div>
                  <RevenueChart sales={db.sales} money={money} />
                </section>
              </div>
              <div className="lower-row">
                <section className="panel">
                  <div className="panel-title">
                    <div>
                      <h2>
                        Productos más vendidos{" "}
                        <span className="inline-spark">✧</span>
                      </h2>
                      <p>Consulta sus precios y disponibilidad.</p>
                    </div>
                    <button
                      className="text-link"
                      onClick={() => navigate("Punto de venta")}
                    >
                      Ver catálogo <ArrowRight size={15} />
                    </button>
                  </div>
                  <div className="favorites">
                    {[...products]
                      .sort(
                        (a, b) =>
                          db.sales.reduce(
                            (n, s) =>
                              n +
                              s.items
                                .filter((i) => i.productId === b.id)
                                .reduce((v, i) => v + i.qty, 0),
                            0,
                          ) -
                          db.sales.reduce(
                            (n, s) =>
                              n +
                              s.items
                                .filter((i) => i.productId === a.id)
                                .reduce((v, i) => v + i.qty, 0),
                            0,
                          ),
                      )
                      .slice(0, 4)
                      .map((p, i) => (
                        <button
                          className="favorite"
                          key={p.id}
                          onClick={() => setModal({ type: "detail", item: p })}
                        >
                          <div
                            className="favorite-art"
                            style={{ background: p.color }}
                          >
                            <span className="rank">0{i + 1}</span>
                            <Toy type={p.art} />
                          </div>
                          <strong>{p.name}</strong>
                          <small>{p.brand}</small>
                          <div>
                            <b>{money(p.price)}</b>
                            <span>{p.stock} en stock</span>
                          </div>
                        </button>
                      ))}
                  </div>
                </section>
              </div>
              <section className="panel recent">
                <div className="panel-title">
                  <div>
                    <h2>Últimas ventas</h2>
                    <p>Revisa tus ventas más recientes.</p>
                  </div>
                  <button
                    className="text-link"
                    onClick={() => navigate("Ventas")}
                  >
                    Ver todas las ventas <ArrowRight size={15} />
                  </button>
                </div>
                <SalesTable compact />
              </section>
            </>
          ) : null}
          {["Inventario", "Punto de venta"].includes(page) && (
            <>
              <Header
                title={page === "Inventario" ? "Inventario" : "Vender juguetes"}
                description={
                  page === "Inventario"
                    ? "Controla tus productos, precios y existencias."
                    : "Elige los juguetes y prepara una nueva venta."
                }
                action={
                  page === "Inventario" ? (
                    <button
                      className="button primary"
                      onClick={() => setModal({ type: "product" })}
                    >
                      <Plus size={17} />
                      Nuevo producto
                    </button>
                  ) : (
                    <span className="badge green">
                      {filtered.length} productos
                    </span>
                  )
                }
              />
              <div
                className={
                  "catalog-layout " +
                  (page === "Punto de venta" ? "with-cart" : "")
                }
              >
                <div>
                  <div className="filters">
                    <div className="search-field">
                      <Search size={17} />
                      <input
                        aria-label="Buscar productos"
                        placeholder="Buscar por nombre, marca o SKU…"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                      />
                    </div>
                    <select
                      aria-label="Filtrar categoría"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                    >
                      {[
                        "Todos",
                        "Stock bajo",
                        ...new Set(products.map((p) => p.category)),
                      ].map((c) => (
                        <option key={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                  {page === "Inventario" ? (
                    <section className="panel">
                      <div className="table-scroll">
                        <table>
                          <thead>
                            <tr>
                              <th>Producto</th>
                              <th>SKU</th>
                              <th>Categoría</th>
                              <th>Costo unit.</th>
                              <th>Precio</th>
                              <th>Stock</th>
                              <th />
                            </tr>
                          </thead>
                          <tbody>
                            {filtered.map((p) => (
                              <tr key={p.id}>
                                <td>
                                  <div className="product-cell">
                                    <span style={{ background: p.color }}>
                                      <Toy type={p.art} />
                                    </span>
                                    <div>
                                      <strong>{p.name}</strong>
                                      <small>
                                        {p.brand} · {p.age}
                                      </small>
                                    </div>
                                  </div>
                                </td>
                                <td className="muted">{p.sku}</td>
                                <td>{p.category}</td>
                                <td>{money(p.cost)}</td>
                                <td className="strong">{money(p.price)}</td>
                                <td>
                                  <span
                                    className={
                                      "badge " +
                                      (p.stock <= p.min ? "orange" : "green")
                                    }
                                  >
                                    {p.stock} unidades
                                  </span>
                                </td>
                                <td>
                                  <button
                                    className="text-link"
                                    onClick={() =>
                                      setModal({ type: "product", item: p })
                                    }
                                  >
                                    Editar
                                  </button>
                                  <button
                                    className="delete-link"
                                    aria-label={`Eliminar ${p.name}`}
                                    onClick={() =>
                                      setModal({ type: "delete", item: p })
                                    }
                                  >
                                    <Trash2 size={15} />
                                    Eliminar
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                        {!filtered.length && (
                          <div className="empty">
                            No hay productos con estos filtros.
                          </div>
                        )}
                      </div>
                    </section>
                  ) : (
                    <div className="product-grid">
                      {filtered.map((p) => (
                        <article className="product-card" key={p.id}>
                          <div
                            className="product-art"
                            style={{ background: p.color }}
                          >
                            <span className="age-tag">{p.age}</span>
                            <Toy type={p.art} />
                          </div>
                          <small>
                            {p.category} · {p.brand}
                          </small>
                          <h3>{p.name}</h3>
                          <div className="product-stock">
                            {p.stock
                              ? p.stock + " unidades disponibles"
                              : "Agotado"}
                          </div>
                          <div className="product-price">
                            <strong>{money(p.price)}</strong>
                            <button
                              className="add-button"
                              aria-label={"Añadir " + p.name}
                              disabled={!p.stock}
                              onClick={() => add(p)}
                            >
                              <Plus size={19} />
                            </button>
                          </div>
                        </article>
                      ))}
                      {!filtered.length && (
                        <div className="empty">
                          No hay productos con estos filtros.
                        </div>
                      )}
                    </div>
                  )}
                </div>
                {page === "Punto de venta" && (
                  <aside className="panel cart">
                    <h2>
                      <ShoppingCart size={20} />
                      Venta actual{" "}
                      <span className="badge purple">
                        {cart.reduce((a, i) => a + i.qty, 0)}
                      </span>
                    </h2>
                    <label>
                      Cliente
                      <select
                        value={customer}
                        onChange={(e) => setCustomer(e.target.value)}
                      >
                        <option value="">Cliente ocasional</option>
                        {db.customers.map((c) => (
                          <option value={c.id} key={c.id}>
                            {c.name}
                          </option>
                        ))}
                      </select>
                    </label>
                    <div className="cart-items">
                      {cart.length ? (
                        cart.map((i) => {
                          const p = products.find((p) => p.id === i.productId);
                          return (
                            <div className="cart-item" key={p.id}>
                              <div
                                className="cart-image"
                                style={{ background: p.color }}
                              >
                                <Toy type={p.art} />
                              </div>
                              <div>
                                <strong>{p.name}</strong>
                                <small>{money(p.price)}</small>
                                <div className="quantity">
                                  <button
                                    aria-label="Quitar unidad"
                                    onClick={() =>
                                      setCart(
                                        cart
                                          .map((x) =>
                                            x.productId === p.id
                                              ? { ...x, qty: x.qty - 1 }
                                              : x,
                                          )
                                          .filter((x) => x.qty > 0),
                                      )
                                    }
                                  >
                                    <Minus size={12} />
                                  </button>
                                  <span>{i.qty}</span>
                                  <button
                                    aria-label="Añadir unidad"
                                    onClick={() => add(p)}
                                  >
                                    <Plus size={12} />
                                  </button>
                                </div>
                              </div>
                              <b>{money(p.price * i.qty)}</b>
                            </div>
                          );
                        })
                      ) : (
                        <div className="empty">
                          <ShoppingBag size={35} />
                          <strong>Tu venta empieza aquí</strong>
                          <p>Añade productos del catálogo.</p>
                        </div>
                      )}
                    </div>
                    <label>
                      Método de pago
                      <select
                        value={payment}
                        onChange={(e) => setPayment(e.target.value)}
                      >
                        {["QR", "Efectivo"].map((p) => (
                          <option key={p}>{p}</option>
                        ))}
                      </select>
                    </label>
                    <div className="cart-total">
                      <span>Total a cobrar</span>
                      <strong>{money(sumCart)}</strong>
                    </div>
                    <button
                      className="button primary full"
                      disabled={!cart.length || connection !== "ready"}
                      onClick={checkout}
                    >
                      <Check size={18} />
                      Cobrar venta
                    </button>
                    <p className="cart-note">
                      El stock se actualiza al confirmar el cobro.
                    </p>
                  </aside>
                )}
              </div>
            </>
          )}
          {page === "Ventas" && (
            <>
              <Header
                title="Historial de ventas"
                description="Consulta tus ventas y sus comprobantes."
                action={
                  <button
                    className="button primary"
                    onClick={() => navigate("Punto de venta")}
                  >
                    <Plus size={17} />
                    Nueva venta
                  </button>
                }
              />
              <div className="stats three">
                <Stat
                  label="Total vendido"
                  value={money(revenue)}
                  icon={Wallet}
                  color="purple"
                  detail="En el período seleccionado"
                />
                <Stat
                  label="Ganancia bruta"
                  value={money(profit)}
                  icon={TrendingUp}
                  color="green"
                  detail="Ventas menos costo de productos"
                />
                <Stat
                  label="Ventas completadas"
                  value={connection === "ready" ? sales.length : "—"}
                  icon={ReceiptText}
                  color="blue"
                  detail="Cobros registrados"
                />
              </div>
              <div className="filters">
                <div className="search-field">
                  <Search size={17} />
                  <input
                    placeholder="Buscar venta o cliente…"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                  />
                </div>
                <select
                  value={period}
                  onChange={(e) => setPeriod(e.target.value)}
                >
                  <option value="7">Últimos 7 días</option>
                  <option value="30">Últimos 30 días</option>
                  <option value="365">Este año</option>
                </select>
                <button
                  className="button"
                  onClick={exportData}
                  disabled={connection !== "ready"}
                >
                  <Download size={16} />
                  Exportar CSV
                </button>
                <button
                  className="button pdf-export"
                  onClick={exportPDF}
                  disabled={connection !== "ready"}
                >
                  <FileDown size={17} />
                  Exportar PDF
                </button>
              </div>
              <section className="panel">
                <SalesTable />
              </section>
            </>
          )}
          {page === "Proveedores" && (
            <>
              <Header
                title="Proveedores"
                description="Encuentra rápidamente los contactos de tus proveedores."
                action={
                  <button
                    className="button primary"
                    onClick={() => setModal({ type: "supplier" })}
                  >
                    <Plus size={17} />
                    Nuevo proveedor
                  </button>
                }
              />
              <div className="filters">
                <div className="search-field">
                  <Search size={17} />
                  <input
                    aria-label="Buscar proveedores"
                    placeholder="Buscar nombre o correo…"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                  />
                </div>
              </div>
              <div className="contact-grid">
                {db.suppliers
                  .filter((c) => !c.deleted)
                  .filter((c) =>
                    (c.name + " " + c.email)
                      .toLowerCase()
                      .includes(query.toLowerCase()),
                  )
                  .map((c, i) => (
                    <section className="panel contact-card" key={c.id}>
                      <span className={"contact-avatar color-" + (i % 3)}>
                        {c.name
                          .split(" ")
                          .slice(0, 2)
                          .map((n) => n[0])
                          .join("")}
                      </span>
                      <h2>{c.name}</h2>
                      <p>{c.country}</p>
                      <a href={"mailto:" + c.email}>{c.email}</a>
                      <a href={"tel:" + c.phone}>{c.phone}</a>
                      <div className="supplier-actions">
                        <button
                          className="button supplier-edit"
                          aria-label={`Editar proveedor ${c.name}`}
                          onClick={() =>
                            setModal({ type: "supplier", item: c })
                          }
                        >
                          <Pencil size={15} />
                          Editar
                        </button>
                        <button
                          className="button supplier-delete"
                          aria-label={`Borrar proveedor ${c.name}`}
                          onClick={() =>
                            setModal({ type: "delete-supplier", item: c })
                          }
                        >
                          <Trash2 size={15} />
                          Borrar
                        </button>
                      </div>
                    </section>
                  ))}
              </div>
            </>
          )}
          <footer className="footer">
            <span>
              <span className="footer-logo">✧</span> Un poquito de orden. Un
              montón de diversión.
            </span>
            <span>
              Hecho para hacer crecer tu tienda{" "}
              <span className="purple-text">♡</span>
            </span>
          </footer>
        </main>
      </div>
      {toast && (
        <div role="status" className="toast">
          <Check size={18} />
          {toast}
          <button aria-label="Cerrar aviso" onClick={() => setToast("")}>
            <X size={16} />
          </button>
        </div>
      )}
      {modal && (
        <div
          className="modal-backdrop"
          onClick={(e) => {
            if (e.target === e.currentTarget) setModal(null);
          }}
        >
          <section
            className="modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
          >
            <div className="modal-heading">
              <h2 id="modal-title">
                {
                  {
                    product: modal.item
                      ? "Editar producto"
                      : "Un nuevo juguete",
                    supplier: modal.item
                      ? "Editar proveedor"
                      : "Nuevo proveedor",
                    "delete-supplier": "Borrar proveedor",
                    delete: "Eliminar producto",
                    receipt: "Detalle de la venta",
                    detail: "Conoce este juguete",
                    alerts: "Todo bajo control",
                  }[modal.type]
                }
              </h2>
              <button
                className="icon-button"
                aria-label="Cerrar"
                onClick={() => setModal(null)}
              >
                <X size={21} />
              </button>
            </div>
            {["product", "supplier"].includes(modal.type) && (
              <form onSubmit={submit}>
                <div className="form-grid">
                  {modal.type === "product" && (
                    <>
                      <Field
                        label="Nombre"
                        name="name"
                        value={modal.item?.name}
                        full
                      />
                      <Field
                        label="SKU único"
                        name="sku"
                        value={modal.item?.sku}
                      />
                      <Field
                        label="Marca"
                        name="brand"
                        value={modal.item?.brand}
                      />
                      <Field
                        label="Categoría"
                        name="category"
                        value={modal.item?.category || "Educativos"}
                        options={[
                          "Construcción",
                          "Peluches",
                          "Figuras",
                          "Educativos",
                          "Vehículos",
                          "Juegos de mesa",
                        ]}
                      />
                      <Field
                        label="Edad recomendada"
                        name="age"
                        value={modal.item?.age || "3+ años"}
                      />
                      <Field
                        label="Precio de venta"
                        name="price"
                        type="number"
                        value={modal.item?.price}
                        min="0"
                        step="0.01"
                      />
                      <Field
                        label="Costo unitario"
                        name="cost"
                        type="number"
                        value={modal.item?.cost}
                        min="0"
                        step="0.01"
                      />
                      <Field
                        label="Stock actual"
                        name="stock"
                        type="number"
                        value={modal.item?.stock ?? 0}
                        min="0"
                        step="1"
                      />
                      <Field
                        label="Stock mínimo"
                        name="min"
                        type="number"
                        value={modal.item?.min ?? 5}
                        min="0"
                        step="1"
                      />
                      <Field
                        label="Ilustración"
                        name="art"
                        value={modal.item?.art || "blocks"}
                        options={[
                          "blocks",
                          "bear",
                          "dino",
                          "rocket",
                          "car",
                          "rings",
                        ]}
                      />
                    </>
                  )}
                  {modal.type === "supplier" && (
                    <>
                      <Field
                        label="Nombre completo o empresa"
                        name="name"
                        value={modal.item?.name}
                        full
                      />
                      <Field
                        label="Correo electrónico"
                        name="email"
                        value={modal.item?.email}
                        type="email"
                      />
                      <Field
                        label="Teléfono"
                        name="phone"
                        type="tel"
                        value={modal.item?.phone}
                      />
                      {modal.type === "supplier" && (
                        <Field
                          label="País"
                          name="country"
                          value={modal.item?.country}
                        />
                      )}
                    </>
                  )}
                </div>
                <div className="modal-actions">
                  <button
                    type="button"
                    className="button"
                    onClick={() => setModal(null)}
                  >
                    Cancelar
                  </button>
                  <button
                    className="button primary"
                    type="submit"
                    disabled={connection !== "ready" || saving}
                  >
                    Guardar {modal.type === "product" ? "producto" : "cambios"}
                  </button>
                </div>
              </form>
            )}
            {modal.type === "delete-supplier" && (
              <>
                <p className="modal-copy">
                  ¿Borrar a <strong>{modal.item.name}</strong> de tu lista de
                  proveedores?
                </p>
                <div className="modal-actions">
                  <button className="button" onClick={() => setModal(null)}>
                    Cancelar
                  </button>
                  <button
                    className="button danger"
                    onClick={() =>
                      performWrite(async () => {
                        await removeRecord("proveedores", modal.item);
                        setModal(null);
                        notify("Proveedor borrado correctamente");
                      })
                    }
                  >
                    <Trash2 size={16} />
                    Borrar proveedor
                  </button>
                </div>
              </>
            )}
            {modal.type === "receipt" && (
              <>
                <div className="receipt-title">
                  <span className="success-icon">
                    <Check size={25} />
                  </span>
                  <h3>Venta completada</h3>
                  <p>
                    #{modal.sale.id} ·{" "}
                    {new Date(modal.sale.date).toLocaleString("es-BO")}
                  </p>
                </div>
                <div className="receipt-meta">
                  <span>
                    {db.customers.find((c) => c.id === modal.sale.customerId)
                      ?.name || "Cliente ocasional"}
                  </span>
                  <span>Pago: {modal.sale.payment}</span>
                </div>
                {modal.sale.items.map((i, idx) => (
                  <div className="receipt-row" key={idx}>
                    <div>
                      <strong>{i.name}</strong>
                      <small>
                        {i.qty} × {money(i.price)}
                      </small>
                    </div>
                    <strong>{money(i.qty * i.price)}</strong>
                  </div>
                ))}
                <div className="cart-total">
                  <span>Total pagado</span>
                  <strong>{money(totalSale(modal.sale))}</strong>
                </div>
                <p className="form-hint">
                  Comprobante interno de venta. No constituye una factura
                  fiscal.
                </p>
                <button
                  className="button primary full"
                  onClick={() => setModal(null)}
                >
                  Listo
                </button>
              </>
            )}
            {modal.type === "delete" && (
              <>
                <p className="modal-copy">
                  ¿Eliminar <strong>{modal.item.name}</strong> del inventario?
                  Ya no aparecerá en el catálogo. Las ventas anteriores se
                  conservarán.
                </p>
                <div className="modal-actions">
                  <button className="button" onClick={() => setModal(null)}>
                    Cancelar
                  </button>
                  <button
                    className="button danger"
                    onClick={() =>
                      performWrite(async () => {
                        await removeRecord("productos", modal.item);
                        setCart(
                          cart.filter((i) => i.productId !== modal.item.id),
                        );
                        setModal(null);
                        notify("Producto eliminado del inventario");
                      })
                    }
                  >
                    <Trash2 size={16} />
                    Eliminar producto
                  </button>
                </div>
              </>
            )}
            {modal.type === "detail" && (
              <>
                <div
                  className="detail-art"
                  style={{ background: modal.item.color }}
                >
                  <Toy type={modal.item.art} />
                </div>
                <h3>{modal.item.name}</h3>
                <p className="muted">
                  {modal.item.brand} · {modal.item.category} · {modal.item.age}
                </p>
                <div className="cart-total">
                  <span>{modal.item.stock} unidades disponibles</span>
                  <strong>{money(modal.item.price)}</strong>
                </div>
                <button
                  className="button primary full"
                  disabled={!modal.item.stock}
                  onClick={() => {
                    add(modal.item);
                    setModal(null);
                    navigate("Punto de venta");
                  }}
                >
                  Añadir a una venta
                </button>
              </>
            )}
            {modal.type === "alerts" && (
              <>
                <p className="muted">
                  Productos por debajo de su nivel mínimo.
                </p>
                {low.map((p) => (
                  <div className="receipt-row" key={p.id}>
                    <div>
                      <strong>{p.name}</strong>
                      <small>Mínimo: {p.min} unidades</small>
                    </div>
                    <span className="badge orange">{p.stock} en stock</span>
                  </div>
                ))}
                {!low.length && <p>¡Tu inventario está al día!</p>}
                <button
                  className="button primary full"
                  onClick={() => {
                    setModal(null);
                    navigate("Inventario");
                    setCategory("Stock bajo");
                  }}
                >
                  Revisar inventario
                </button>
              </>
            )}
          </section>
        </div>
      )}
    </div>
  );
}
function csvCell(value) {
  const text = String(value);
  return (
    '"' +
    (/^[=+@\-\t\r]/.test(text) ? "'" : "") +
    text.replaceAll('"', '""') +
    '"'
  );
}
function Field({
  label,
  name,
  type = "text",
  value = "",
  options,
  full,
  ...props
}) {
  return (
    <label className={full ? "full" : ""}>
      {label}
      {options ? (
        <select name={name} defaultValue={value} required>
          {options.map((o) => (
            <option key={o.value || o} value={o.value || o}>
              {o.label || o}
            </option>
          ))}
        </select>
      ) : (
        <input
          name={name}
          type={type}
          defaultValue={value}
          required
          {...props}
        />
      )}
    </label>
  );
}
function RevenueChart({ sales, money }) {
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - 6 + i);
    const date = d.toISOString().slice(0, 10),
      items = sales.filter((s) => s.date.slice(0, 10) === date);
    return {
      label: d.toLocaleDateString("es-BO", { weekday: "short" }),
      revenue: items.reduce((a, s) => a + totalSale(s), 0),
      profit: items.reduce((a, s) => a + profitSale(s), 0),
    };
  });
  const max = Math.max(...days.map((d) => d.revenue), 100) * 1.2;
  const coords = (key) =>
    days
      .map((d, i) => `${55 + i * 78},${180 - (d[key] / max) * 150}`)
      .join(" ");
  return (
    <div className="chart">
      <svg
        viewBox="0 0 560 220"
        role="img"
        aria-label="Gráfico de ingresos y ganancia durante los últimos siete días"
      >
        <defs>
          <linearGradient id="area" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0" stopColor="#0ea5e9" stopOpacity=".22" />
            <stop offset="1" stopColor="#0ea5e9" stopOpacity="0" />
          </linearGradient>
        </defs>
        {[0, 1, 2, 3].map((i) => (
          <g key={i}>
            <line
              x1="55"
              y1={30 + i * 50}
              x2="530"
              y2={30 + i * 50}
              stroke="#ececf1"
              strokeDasharray="4 4"
            />
            <text
              x="43"
              y={34 + i * 50}
              textAnchor="end"
              fill="#9897a5"
              fontSize="10"
            >
              {Math.round(max * (1 - i / 3)).toLocaleString("es-BO")}
            </text>
          </g>
        ))}
        <polygon
          points={`55,180 ${coords("revenue")} 523,180`}
          fill="url(#area)"
        />
        <polyline
          points={coords("revenue")}
          fill="none"
          stroke="#0ea5e9"
          strokeWidth="3"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
        <polyline
          points={coords("profit")}
          fill="none"
          stroke="#10a67b"
          strokeWidth="2.5"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
        {days.map((d, i) => (
          <g key={i}>
            <circle
              cx={55 + i * 78}
              cy={180 - (d.revenue / max) * 150}
              r="4"
              fill="#fff"
              stroke="#0ea5e9"
              strokeWidth="2"
            >
              <title>{`${d.label}: ingresos ${money(d.revenue)}; ganancia ${money(d.profit)}`}</title>
            </circle>
            <text
              x={55 + i * 78}
              y="211"
              fill="#8c8b9a"
              fontSize="11"
              textAnchor="middle"
            >
              {d.label}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}
