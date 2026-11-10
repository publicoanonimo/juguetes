export const formatMoney = (n) =>
  `Bs ${new Intl.NumberFormat("es-BO", { minimumFractionDigits: 0, maximumFractionDigits: 2 }).format(n)}`;
export const saleDate = (date) =>
  new Date(date).toLocaleDateString("es-BO", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
export const saleTime = (date) =>
  new Date(date).toLocaleTimeString("es-BO", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
