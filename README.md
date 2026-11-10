# Juguetes

Aplicación React + Vite para administrar una tienda de importación y venta de juguetes. Interfaz en español, adaptable a escritorio y móvil.

## Ejecutar

```bash
npm install
npm run dev
```

Abre la URL que muestra Vite (normalmente http://localhost:5173).

```bash
npm run build     # Genera dist/
npm run preview   # Revisa la compilación
npm test          # Pruebas de las operaciones de inventario
```

## Módulos

- **Inicio:** ingresos, ganancia bruta, stock, ventas de la semana, productos más vendidos y últimas ventas.
- **Inventario:** crear y editar productos, precios, costos, SKU único, edad recomendada y mínimos; buscar, filtrar y eliminar con confirmación. Los productos eliminados se ocultan del inventario y catálogo; se conservan sus registros para mantener el historial de ventas.
- **Punto de venta:** catálogo en tarjetas, carrito, cantidades y método de pago. El cobro descuenta stock y conserva el precio y costo de cada venta.
- **Ventas:** historial, comprobantes internos, fecha y hora, filtros y exportación CSV y PDF. El PDF respeta el período y la búsqueda seleccionados.
- **Proveedores:** directorio de contactos con búsqueda, edición y borrado con confirmación.

## Alcance de esta versión

Los registros iniciales son ficticios. Los datos se guardan en `localStorage` con la clave `juguetea-v1`, solo en el navegador y origen utilizados. No hay servidor, autenticación, sincronización entre dispositivos, facturación fiscal ni procesamiento bancario. Registrar un pago es una operación interna. La ganancia mostrada es bruta y no descuenta gastos operativos ni impuestos.

Los precios se muestran siempre en bolivianos (Bs), sin decimales innecesarios: Bs 249 o Bs 249,5. Pagos admitidos: Efectivo y QR. La exportación CSV y PDF se encuentra en Ventas; estos reportes no son copias completas de los datos de la aplicación.

Para usarlo como sistema compartido en una tienda real, el siguiente paso es conectar una API y base de datos con usuarios, permisos, transacciones de inventario y copias de seguridad del servidor.

## Referencia funcional

Se incluyeron mínimos de stock y reposición siguiendo las prácticas descritas en la [guía de gestión de inventario de Shopify](https://help.shopify.com/en/manual/inventory-and-locations/fundamentals/understanding-inventory-management).
