# Juguetes

Aplicación React + Vite para gestionar inventario, ventas y proveedores, con Cloud Firestore como almacenamiento y despliegue en Vercel. La web abre directamente: no hay inicio de sesión, cuentas ni Firebase Authentication.

## Ejecutar

```bash
npm ci
npm run dev
```

Abre la URL que muestra Vite, normalmente http://localhost:5173.

```bash
npm run build     # Genera dist/
npm run preview   # Revisa la compilación
npm test          # Pruebas de negocio, PDF y operaciones de venta
```

## Activar el almacenamiento en Firebase

La configuración del proyecto `bdjuguetes-b5829` ya está en `src/firebase.js`. Solo se inicializan la aplicación Firebase y Cloud Firestore.

1. En la [consola de Firebase](https://console.firebase.google.com/project/bdjuguetes-b5829/firestore), crea la base de datos Cloud Firestore predeterminada si todavía no existe.
2. En **Firestore → Reglas**, pega el contenido completo de [firestore.rules](./firestore.rules) y pulsa **Publicar**. Si publicaste las reglas anteriores, debes reemplazarlas: las nuevas ya no requieren usuarios ni autenticación.
3. Abre la web para crear, editar y borrar productos y proveedores, y registrar ventas.

Con Firebase CLI, las reglas también pueden publicarse mediante:

```bash
firebase deploy --only firestore:rules --project bdjuguetes-b5829
```

El push a GitHub actualiza el código en Vercel; las reglas de Firestore se publican por separado. La aplicación no necesita configuración de Authentication ni documentos de usuarios.

**Acceso sin autenticación:** cualquier persona que acceda a la web puede consultar y modificar los datos de la tienda. Las reglas permiten estas operaciones en las colecciones de la aplicación y mantienen validaciones de formato, cantidades y versiones.

## Datos

| Ruta                                 | Contenido                                                    |
| ------------------------------------ | ------------------------------------------------------------ |
| `tiendas/principal/productos/{id}`   | Productos, precios, costos y existencias                     |
| `tiendas/principal/ventas/{id}`      | Ventas con fecha, hora, pago, cantidades y costos históricos |
| `tiendas/principal/proveedores/{id}` | Contactos de proveedores                                     |
| `tiendas/principal/skus/{sku}`       | Reserva de SKU para evitar productos duplicados              |

Los cambios se reciben en tiempo real. Al cobrar, una transacción guarda la venta y descuenta existencias conjuntamente. Si no hay stock suficiente, el cobro se rechaza. Las ediciones y borrados detectan cambios simultáneos de otra sesión.

Borrar un producto o proveedor lo oculta de las listas y conserva sus referencias históricas. La base empieza vacía; no se suben automáticamente los ejemplos ni los datos de la antigua versión local. Los datos antiguos de `localStorage` no se borran.

Se requiere conexión para guardar. Un error de conexión o de reglas se muestra en pantalla y no se presenta como un guardado exitoso.

## Vercel

`vercel.json` configura Vite, el comando `npm run build` y la salida `dist`. La configuración Firebase ya está incluida y no requiere variables adicionales. El despliegue conectado a `main` se actualiza con el push al repositorio.

## Funciones

- **Inicio:** ingresos, ganancia bruta, stock, evolución semanal y últimas ventas.
- **Inventario:** crear, editar, buscar y borrar productos; precios, costos y stock mínimo.
- **Punto de venta:** catálogo, carrito y pago por Efectivo o QR.
- **Ventas:** historial con fecha y hora, comprobantes, filtros y exportación CSV/PDF.
- **Proveedores:** contactos con búsqueda, edición y borrado.

Precios en bolivianos sin ceros decimales innecesarios. La ganancia es bruta, sin gastos operativos ni impuestos. Registrar un pago es una operación interna: no hay procesamiento bancario ni facturación fiscal.
