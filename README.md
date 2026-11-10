# Juguetes

Aplicación React + Vite para gestionar inventario, ventas y proveedores. Datos compartidos en Cloud Firestore, acceso con Firebase Authentication y despliegue en Vercel. Interfaz en español, adaptable a escritorio y móvil.

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

## Activar Firebase

La configuración web del proyecto `bdjuguetes-b5829` está en `src/firebase.js`. Se inicializa una sola aplicación y se exportan `auth` y `firestore`. La configuración del SDK web identifica el proyecto; el acceso a los datos se controla con Authentication y las reglas de Firestore. No hay claves de servicio ni credenciales de administrador en el cliente.

Completa estos pasos en la [consola de Firebase del proyecto](https://console.firebase.google.com/project/bdjuguetes-b5829/overview):

1. En **Firestore Database**, crea la base de datos **Cloud Firestore predeterminada** si todavía no existe. Selecciona el modo de producción.
2. En **Authentication → Método de acceso**, habilita **Correo electrónico/contraseña**.
3. En **Authentication → Usuarios**, crea la cuenta del administrador y copia su **UID**. La aplicación no permite registrar usuarios.
4. En **Firestore → Datos**, crea la colección `usuarios`, con un documento cuyo identificador sea el UID del paso anterior. Añade el campo `activo`, de tipo **booleano**, con valor **true**. Esto autoriza a esa cuenta para gestionar la tienda. Para cada empleado autorizado, repite el proceso. Para revocar su acceso, cambia `activo` a `false`.
5. En **Firestore → Reglas**, reemplaza las reglas por el contenido completo de [firestore.rules](./firestore.rules) y pulsa **Publicar**. Las reglas incluidas rechazan usuarios no autorizados y evitan que alguien se dé acceso desde la aplicación.
6. Abre la aplicación e ingresa con el correo y la contraseña de la cuenta creada.

Si utilizas Firebase CLI con una sesión autorizada, el paso 5 también se puede hacer con:

```bash
firebase deploy --only firestore:rules --project bdjuguetes-b5829
```

**Un push a GitHub actualiza la aplicación en Vercel, pero no publica las reglas ni crea los usuarios de Firebase.** Si el usuario no está autorizado o Firestore aún no está habilitado, la aplicación mostrará el problema de conexión en lugar de funcionar con datos ficticios.

## Datos compartidos

Los registros se guardan individualmente en:

| Ruta                                 | Contenido                                              |
| ------------------------------------ | ------------------------------------------------------ |
| `tiendas/principal/productos/{id}`   | Productos, precios, costos, existencias y versión      |
| `tiendas/principal/ventas/{id}`      | Ventas con fecha, pago, cantidades y costos históricos |
| `tiendas/principal/proveedores/{id}` | Contactos de proveedores                               |
| `tiendas/principal/skus/{sku}`       | Reserva del SKU para evitar duplicados simultáneos     |
| `usuarios/{uid}`                     | Autorización de empleados mediante `activo: true`      |

Se reciben cambios en tiempo real. Las ventas leen el inventario actual y registran el cobro y el descuento de stock en una sola transacción. Si otra sesión modifica el inventario, Firestore reintenta la transacción; si no hay suficientes unidades, el cobro se rechaza. La aplicación solo muestra el comprobante tras confirmar el guardado.

Las ediciones y los borrados usan versiones para detectar cambios de otra sesión. El borrado oculta el registro sin eliminar las referencias históricas. El historial de ventas no permite modificaciones ni borrados desde el cliente.

La base empieza vacía; no se cargan automáticamente productos, proveedores ni ventas ficticias. Los datos anteriores de `localStorage` no se borran, pero tampoco se suben automáticamente a Firebase. Si necesitas migrar registros reales de la versión anterior, conserva el navegador original y prepara una importación explícita antes de eliminar sus datos. El archivo `src/data.js` mantiene ejemplos para las pruebas; no se utilizan para inicializar Firestore.

Se requiere conexión para guardar. Un error de permisos o de conexión se muestra en pantalla y no se presenta como un guardado exitoso. La aplicación no almacena contraseñas; la sesión la gestiona el SDK de Firebase Authentication.

## Despliegue en Vercel

El archivo `vercel.json` configura Vite, el comando `npm run build` y la salida `dist`. La configuración Firebase suministrada ya está incluida; no hay variables adicionales obligatorias para esta versión. El despliegue conectado a la rama `main` puede actualizarse mediante el push habitual al repositorio.

## Módulos

- **Inicio:** ingresos, ganancia bruta, stock, evolución semanal, productos más vendidos y últimas ventas.
- **Inventario:** crear, editar, buscar y borrar productos; SKU único, precios, costos, edad recomendada y mínimos.
- **Punto de venta:** catálogo, carrito, cantidades y pago por Efectivo o QR. El cobro descuenta existencias.
- **Ventas:** historial con fecha y hora, comprobantes internos, filtros y exportación CSV/PDF.
- **Proveedores:** contactos con búsqueda, edición y borrado con confirmación.

Los importes se muestran en bolivianos, sin ceros decimales innecesarios: Bs 249 o Bs 249,5. La ganancia es bruta: no descuenta gastos operativos ni impuestos. Registrar un pago es una operación interna; no hay procesamiento bancario ni facturación fiscal. Los reportes CSV y PDF no son copias completas de la base de datos.

## Validación

Las pruebas verifican cálculos de ventas, descuento de stock, recepción histórica, borrado, métodos de pago, formato de importes, PDF con varias páginas y operaciones transaccionales frente a stock agotado, productos borrados y carritos inválidos. Estas pruebas no sustituyen una comprobación del acceso y las reglas publicadas en el proyecto real de Firebase.

Referencias: [configuración web de Firebase](https://firebase.google.com/docs/web/setup), [transacciones de Firestore](https://firebase.google.com/docs/firestore/manage-data/transactions), [reglas de acceso](https://firebase.google.com/docs/firestore/security/rules-conditions).
