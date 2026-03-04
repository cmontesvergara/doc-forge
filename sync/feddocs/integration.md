# Integration — DocForge

## Autenticación

DocForge no requiere autenticación propia. El servicio está diseñado para ser consumido dentro de la red interna por otros microservicios. Si se expone públicamente, se recomienda colocar un API Gateway o reverse proxy con autenticación delante del servicio.

## Endpoints

### Generación de PDF

#### `POST` `/api/generate/pdf`

Genera un documento PDF a partir de un template y datos proporcionados, y lo retorna como descarga directa.

**Request:**

```json
{
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
    "amount": "1.500.000",
    "items": [
      { "description": "Servicio de consultoría técnica — febrero 2026" },
      { "description": "Soporte técnico remoto — 40 horas" }
    ],
    "signature": "a1b2c3d4e5f6"
  }
}
```

**Response (200):**

El servidor retorna el archivo PDF directamente con header `Content-Type: application/pdf`. El body de la respuesta es el contenido binario del PDF.

**Errores:**

| Código | Significado |
|---|---|
| 400 | El `templateId` no existe en el registro de templates, o los datos del `documentData` son inválidos o incompletos |
| 400 | Error de validación del DTO: falta `templateId` o `documentData` está vacío |

---

#### `POST` `/api/generate/link`

Genera el PDF y retorna un enlace temporal cifrado para descargarlo posteriormente. El archivo se elimina automáticamente tras el tiempo especificado en `docTimeOut`.

**Request:**

```json
{
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
    "amount": "750.000",
    "items": [
      { "description": "Pago mensualidad servicio cloud — marzo 2026" }
    ],
    "signature": "x9y8z7w6"
  }
}
```

**Response (200):**

```json
{
  "pathFile": "U2FsdGVkX1+abc123encryptedPathBase64==",
  "documentLife": "300000ms"
}
```

**Errores:**

| Código | Significado |
|---|---|
| 400 | El `templateId` no existe o los datos del documento son inválidos |
| 400 | Error de validación del DTO |

---

### Descarga de PDF

#### `GET` `/api/generate/download/:path`

Descarga un PDF previamente generado usando el enlace cifrado obtenido del endpoint `/api/generate/link`.

**Request:**

El parámetro `:path` es el valor de `pathFile` retornado por el endpoint `/api/generate/link`.

```sh
curl http://localhost:4400/api/generate/download/U2FsdGVkX1+abc123encryptedPathBase64== \
  --output documento.pdf
```

**Response (200):**

Retorna el archivo PDF con header `Content-Type: application/pdf`.

**Errores:**

| Código | Significado |
|---|---|
| 400 | La ruta cifrada es inválida o no se puede descifrar (clave `CRYPTO_KEY` incorrecta o dato corrupto) |
| 404 | El archivo PDF ya fue eliminado (expiró el `docTimeOut`) o nunca existió |

## Templates Disponibles

| Template ID | Tipo de Documento | Descripción |
|---|---|---|
| `t0000002198` | Cuenta de cobro | Documento de cobro con datos del cliente, acreedor, monto, conceptos y tabla de cuentas bancarias |
| `t0000002199` | Recibo de pago | Comprobante de pago con datos del pagador, receptor, monto, conceptos y firma digital |
| `t0000002000` | Constancia | Certificación genérica con datos del emisor, items descriptivos y firma |

## Campos Comunes del Payload (`documentData`)

| Campo | Tipo | Descripción |
|---|---|---|
| `documentId` | string | Identificador único del documento (se muestra en el encabezado del PDF) |
| `date` | string | Fecha formateada para mostrar en el documento |
| `client.name` | string | Nombre completo del cliente o pagador |
| `client.docType` | string | Tipo de documento de identidad (CC, NIT, etc.) |
| `client.docNumber` | string | Número del documento de identidad |
| `creditor.name` | string | Nombre completo del acreedor o receptor |
| `creditor.docType` | string | Tipo de documento del acreedor |
| `creditor.docNumber` | string | Número del documento del acreedor |
| `amount` | string | Monto formateado con separador de miles (ej: "1.500.000") |
| `items` | array | Lista de conceptos, cada uno con campo `description` |
| `signature` | string | Cadena de firma de seguridad (se muestra en cada página) |

## Errores Comunes de Integración

| Problema | Causa | Solución |
|---|---|---|
| Response vacía o timeout al generar PDF | El payload contiene un `templateId` que no está registrado en el sistema | Verificar que el `templateId` sea uno de los templates disponibles: `t0000002198`, `t0000002199`, `t0000002000` |
| Error 400 al enviar request | El body no cumple las validaciones del DTO: `templateId` debe ser string no vacío, `documentData` debe ser un objeto no vacío | Revisar que el JSON tenga la estructura correcta con ambos campos requeridos |
| Link de descarga retorna 404 | El archivo PDF ya expiró y fue eliminado del disco | Generar un nuevo PDF o aumentar el valor de `docTimeOut` en la solicitud (default: 200000ms) |
| Error de descifrado en download | La variable `CRYPTO_KEY` del servidor cambió entre la generación del link y la descarga | Asegurar que `CRYPTO_KEY` sea constante y no cambie entre deploys |
