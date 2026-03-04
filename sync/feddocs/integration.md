# Integration — DocForge

## Autenticación

DocForge no implementa autenticación propia. El servicio está diseñado para ser consumido dentro de la red interna por otros microservicios o aplicaciones frontend. No hay tokens, API keys, ni headers de autorización requeridos.

Si se expone públicamente, se recomienda colocar un API Gateway o reverse proxy con autenticación delante del servicio.

## Validación de Requests

Todos los endpoints `POST` validan el body usando `class-validator` con un `ValidationPipe` global configurado con las opciones `whitelist: true` y `transform: true`:

- **`whitelist: true`**: Cualquier campo no definido en el DTO es **silenciosamente eliminado** del body. No genera error, pero el campo no llega al servicio.
- **`transform: true`**: Los valores del body se transforman automáticamente al tipo definido en el DTO (por ejemplo, si `docTimeOut` llega como string `"300000"`, se convierte a número `300000`).

Si un campo requerido falta o tiene un tipo incorrecto, NestJS retorna un error `400 Bad Request` con un array de mensajes de validación **antes** de que el controlador ejecute cualquier lógica.

**Ejemplo de error de validación:**

```json
{
  "statusCode": 400,
  "message": [
    "templateId should not be empty",
    "templateId must be a string",
    "documentData should not be an empty object",
    "documentData must be an object"
  ],
  "error": "Bad Request"
}
```

## Endpoints

### Health Check

#### `GET` `/`

Verifica que el servicio está activo. Retorna un texto plano.

```sh
curl http://localhost:4400
```

**Response (200):**

```
Hello World!
```

---

### Generación de PDF — Descarga directa

#### `POST` `/api/generate/pdf`

Genera un documento PDF a partir de un template y datos proporcionados, y lo retorna como descarga directa. El archivo PDF se elimina del disco automáticamente **2 segundos** después de enviarse.

**Request — DTO `createDocumentDTO`:**

| Campo | Tipo | Requerido | Descripción |
|---|---|---|---|
| `templateId` | `string` | ✅ | ID del template. Debe ser uno de: `t0000002198`, `t0000002199`, `t0000002000` |
| `documentData` | `object` | ✅ | Objeto con los datos del documento. No puede ser vacío |
| `docTimeOut` | `number` | ❌ | No se usa en este endpoint (solo aplica para `/api/generate/link`) |

**Ejemplo completo de request para cuenta de cobro (`t0000002198`):**

```sh
curl -X POST http://localhost:4400/api/generate/pdf \
  -H "Content-Type: application/json" \
  -d '{
    "templateId": "t0000002198",
    "documentData": {
      "documentId": "FC-2026-0001",
      "date": "03 de marzo de 2026",
      "client": {
        "name": "Empresa ABC S.A.S",
        "docType": "NIT",
        "docNumber": "900.123.456-7"
      },
      "creditor": {
        "name": "Juan Pérez",
        "docType": "CC",
        "docNumber": "1.234.567.890"
      },
      "amount": "1500000",
      "items": [
        { "description": "Servicio de consultoría técnica — febrero 2026" },
        { "description": "Soporte técnico remoto — 40 horas" }
      ],
      "signature": "a1b2c3d4e5f6"
    }
  }' --output cuenta-cobro.pdf
```

**Response (200):**

El servidor retorna el archivo PDF directamente con header `Content-Type: application/pdf`. El body de la respuesta es el contenido binario del PDF. Usar `--output archivo.pdf` en curl para guardar.

**Errores:**

| Código | Cuándo ocurre | Mensaje |
|---|---|---|
| 400 | Falta `templateId` o `documentData` en el body | Array de mensajes de validación del DTO |
| 400 | El `templateId` no corresponde a un template registrado (`t0000002198`, `t0000002199`, `t0000002000`) | `alltemplates[templateId] is not a function` |
| 400 | Falta el campo `amount` dentro de `documentData` | `Cannot read properties of undefined (reading 'replace')` |
| 400 | La API externa `numerosaletras.com` no responde o no es alcanzable | Error de red / timeout de axios |
| 400 | Faltan imágenes en `public/img/` (header.png, footer.png, etc.) | `ENOENT: no such file or directory` |

---

### Generación de PDF — Enlace temporal cifrado

#### `POST` `/api/generate/link`

Genera el PDF en disco y retorna un enlace temporal cifrado con AES para descargarlo posteriormente. El archivo se elimina automáticamente del disco tras el tiempo especificado en `docTimeOut`.

**Request — DTO `createDocumentDTO`:**

| Campo | Tipo | Requerido | Descripción |
|---|---|---|---|
| `templateId` | `string` | ✅ | ID del template. Debe ser uno de: `t0000002198`, `t0000002199`, `t0000002000` |
| `documentData` | `object` | ✅ | Objeto con los datos del documento. No puede ser vacío |
| `docTimeOut` | `number` | ❌ | Tiempo de vida del archivo en milisegundos. **Default: 200000** (200 segundos ≈ 3.3 minutos) |

**Ejemplo de request:**

```sh
curl -X POST http://localhost:4400/api/generate/link \
  -H "Content-Type: application/json" \
  -d '{
    "templateId": "t0000002199",
    "docTimeOut": 300000,
    "documentData": {
      "documentId": "RP-2026-0042",
      "date": "03 de marzo de 2026",
      "client": {
        "name": "María García",
        "docType": "CC",
        "docNumber": "52.987.654"
      },
      "creditor": {
        "name": "Tech Solutions LTDA",
        "docType": "NIT",
        "docNumber": "800.456.789-1"
      },
      "amount": "750000",
      "items": [
        { "description": "Pago mensualidad servicio cloud — marzo 2026" }
      ],
      "signature": "x9y8z7w6"
    }
  }'
```

**Response (200):**

```json
{
  "pathFile": "U2FsdGVkX1+abc123encryptedPathBase64==",
  "documentLife": "300000ms"
}
```

- `pathFile`: Ruta del archivo PDF cifrada con AES y codificada en Base64. Se usa como parámetro para el endpoint de descarga.
- `documentLife`: Tiempo de vida del archivo en milisegundos seguido de "ms".

**Errores:**

Los mismos errores que `POST /api/generate/pdf` (ver tabla anterior).

---

### Descarga de PDF por enlace cifrado

#### `GET` `/api/generate/download/:path`

Descarga un PDF previamente generado usando el enlace cifrado obtenido del endpoint `POST /api/generate/link`.

**Request:**

El parámetro `:path` es el valor de `pathFile` retornado por `/api/generate/link`.

```sh
curl http://localhost:4400/api/generate/download/U2FsdGVkX1+abc123encryptedPathBase64== \
  --output documento.pdf
```

**Response (200):**

Retorna el archivo PDF con header `Content-Type: application/pdf`.

**Errores:**

| Código | Cuándo ocurre | Mensaje |
|---|---|---|
| 400 | La ruta cifrada es inválida, el parámetro `:path` no se puede descifrar (CRYPTO_KEY incorrecta o dato corrupto) | Error de descifrado de crypto-js |
| 404 | El archivo PDF ya fue eliminado del disco (expiró el `docTimeOut`) o nunca existió | `File Not Found` |

---

## Formato del campo `amount` — Comportamiento crítico

El campo `amount` dentro de `documentData` es **obligatorio para todos los templates** porque el servicio llama a `getAmountInLetters()` antes de evaluar cualquier template. Este procesamiento ocurre en `GeneratorService.generatePdf()`:

```typescript
payload.amountInLetters = await this.utilService.getAmountInLetters(
  Number.parseInt(payload.amount.replace('.', '')),
);
```

El método `.replace('.', '')` de JavaScript solo elimina **la primera ocurrencia** del punto. Esto tiene implicaciones directas en cómo enviar el campo `amount`:

| Valor de `amount` enviado | Resultado de `replace('.', '')` | `parseInt()` produce | ¿Correcto? |
|---|---|---|---|
| `"1500000"` | `"1500000"` | `1500000` | ✅ Correcto |
| `"1.500.000"` | `"1500.000"` | `1500` | ❌ Incorrecto — solo quita el primer punto |
| `"750.000"` | `"750000"` | `750000` | ✅ Correcto — solo tiene un punto |
| `"100000"` | `"100000"` | `100000` | ✅ Correcto |

**Recomendación:** Para montos superiores a 999.999, enviar el campo `amount` **sin separadores de miles** (ej: `"1500000"` en vez de `"1.500.000"`) para evitar errores en la conversión a letras. Para montos con un solo separador (ej: `"750.000"`) funciona correctamente.

Sin embargo, el valor de `amount` también se usa directamente en los templates para mostrar el monto formateado en el PDF (ej: `$1.500.000`). Para que el monto se muestre formateado en el PDF pero la conversión a letras sea correcta, enviar un monto **sin puntos** resultará en que el PDF mostrará `$1500000` sin formato. Esto es una limitación del diseño actual.

## Templates Disponibles

| Template ID | Tipo de Documento | Descripción |
|---|---|---|
| `t0000002198` | Cuenta de cobro | Documento de cobro con header, datos del cliente, acreedor, monto en números y letras, lista de conceptos, tabla de cuentas bancarias (`table_accounts.png`), firma de seguridad y paginación |
| `t0000002199` | Recibo de pago | Comprobante de pago con header, datos del pagador, receptor, monto en números y letras, lista de conceptos, firma digital (`firma_carlosm.png`), firma de seguridad y paginación |
| `t0000002000` | Constancia | Certificación con header. Solo muestra datos del acreedor/emisor (`creditor`), lista de items con texto justificado, y firma digital. **No renderiza** título "CONSTANCIA", datos del cliente, ni monto en el PDF (estas secciones están desactivadas en el template) |

## Campos de `documentData` por Template

### Campos usados por `t0000002198` (Cuenta de cobro)

| Campo | Tipo | Requerido | Descripción |
|---|---|---|---|
| `documentId` | string | ✅ | Identificador del documento (se muestra en el encabezado) |
| `date` | string | ✅ | Fecha formateada tal como se mostrará en el PDF |
| `client.name` | string | ✅ | Nombre del cliente (deudor) |
| `client.docType` | string | ✅ | Tipo de documento (CC, NIT, etc.) |
| `client.docNumber` | string | ✅ | Número de documento del cliente |
| `creditor.name` | string | ✅ | Nombre del acreedor |
| `creditor.docType` | string | ✅ | Tipo de documento del acreedor |
| `creditor.docNumber` | string | ✅ | Número de documento del acreedor |
| `amount` | string | ✅ | Monto. Se muestra como `$amount` en el PDF y se convierte a letras |
| `items` | array | ✅ | Lista de conceptos. Cada item tiene `{ "description": "..." }` |
| `signature` | string | ✅ | Cadena de seguridad que se muestra en cada página |

### Campos usados por `t0000002199` (Recibo de pago)

Misma estructura que `t0000002198`. Cambian los textos del template: dice "pago la cantidad de" en vez de "debe la cantidad de", y muestra firma digital (`firma_carlosm.png`) en lugar de tabla de cuentas bancarias.

### Campos usados por `t0000002000` (Constancia)

| Campo | Tipo | Requerido | Descripción |
|---|---|---|---|
| `documentId` | string | ✅ | Identificador del documento |
| `date` | string | ✅ | Fecha formateada |
| `creditor.name` | string | ✅ | Nombre del emisor de la constancia |
| `creditor.docType` | string | ✅ | Tipo de documento del emisor |
| `creditor.docNumber` | string | ✅ | Número de documento del emisor |
| `amount` | string | ✅ | **Requerido por el servicio** para la conversión a letras, aunque el template NO lo muestra en el PDF |
| `items` | array | ✅ | Lista de párrafos certificados. Cada item tiene `{ "description": "..." }` |
| `signature` | string | ✅ | Cadena de seguridad por página |

Los campos `client.name`, `client.docType`, `client.docNumber` y `amountInLetters` **no se renderizan** en este template (están comentados en el código), pero `amount` es obligatorio porque el servicio lo procesa antes de invocar el template. No incluir `client` no causa error en este template.

## Errores Comunes de Integración

| Problema | Causa | Solución |
|---|---|---|
| `Cannot read properties of undefined (reading 'replace')` | Falta el campo `amount` en `documentData`. El servicio llama `payload.amount.replace(...)` antes de evaluar cualquier template | Incluir siempre el campo `amount` como string en `documentData`, incluso para el template `t0000002000` que no lo muestra |
| `alltemplates[templateId] is not a function` | El `templateId` no corresponde a ningún template registrado | Usar exactamente uno de: `t0000002198`, `t0000002199`, `t0000002000` |
| Error 400 con array de mensajes de validación | El body no pasa la validación del DTO | Verificar: `templateId` (string, no vacío), `documentData` (objeto, no vacío). Si se envía `docTimeOut` debe ser número |
| Timeout o error de red al generar PDF | La API externa `http://numerosaletras.com` no responde. Todas las generaciones de PDF dependen de esta API | Verificar conectividad a internet del servidor. Si la API está caída, la generación de PDF falla completamente |
| `ENOENT: no such file or directory, open 'public/img/header.png'` | Las imágenes del directorio `public/img/` no están presentes o el proceso no se ejecuta desde la raíz del proyecto | Verificar que `public/img/` contiene: `header.png`, `footer.png`, `firma_carlosm.png`, `table_accounts.png` |
| Link de descarga retorna `File Not Found` (404) | El archivo PDF ya expiró y fue eliminado del disco | Generar un nuevo PDF. Considerar aumentar `docTimeOut` (default: 200000 ms) |
| Error de descifrado en endpoint download | La variable `CRYPTO_KEY` cambió entre la generación del link y la descarga, o el parámetro path está corrupto/truncado | Asegurar que `CRYPTO_KEY` sea constante entre deploys. Verificar que el valor de `pathFile` se pase completo (sin truncar caracteres especiales en la URL) |
| Response vacía o el PDF se descarga con 0 bytes | El `sendFile()` puede fallar si la ruta generada no es absoluta en ciertos entornos | Reportar al equipo. El servicio genera la ruta usando `path.join(__dirname, ...)` que debería ser absoluta |
