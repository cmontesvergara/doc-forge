# Onboarding — DocForge

## ¿Qué es DocForge?

DocForge es un microservicio de generación de documentos PDF construido con NestJS y PdfKit. Su propósito es generar documentos financieros y legales en formato PDF a partir de datos estructurados enviados vía API REST, usando templates parametrizados.

El servicio resuelve la necesidad de generar cuentas de cobro, recibos de pago y constancias de forma programática desde cualquier sistema interno. Cada documento se genera con header, footer, firma digital y paginación automática. Los archivos PDF resultantes pueden descargarse directamente o a través de enlaces temporales cifrados con AES.

DocForge está pensado para ser consumido por otros microservicios o aplicaciones frontend que necesiten emitir documentos estandarizados sin implementar lógica de renderizado PDF. Actualmente cuenta con tres templates registrados que cubren los casos de uso más comunes del equipo.

## Prerequisitos

- **Node.js** ≥ 20 (el Dockerfile usa `node:20-alpine`)
- **npm** ≥ 8
- Acceso al repositorio del proyecto
- Un archivo `.env` configurado con las variables requeridas (ver sección de configuración)

## Setup Local

### 1. Clonar el repositorio

```sh
git clone <url-del-repositorio>
cd doc-forge
```

### 2. Instalar dependencias

```sh
npm install
```

### 3. Configurar variables de entorno

El archivo `.env.example` existe pero está vacío. Debes crear el archivo `.env` manualmente en la raíz del proyecto con las siguientes variables:

```sh
PORT=4400
CRYPTO_KEY=<tu_clave_secreta_para_cifrado_AES>
```

| Variable | Requerida | Descripción | Ejemplo |
|---|---|---|---|
| `PORT` | ❌ | Puerto en el que escucha el servicio. Actualmente hardcodeado a `3000` en `main.ts` | `3000` |
| `CRYPTO_KEY` | ✅ | Clave secreta para cifrado AES de rutas de descarga. Sin esta variable, el endpoint `/api/generate/link` falla al cifrar | `MiClaveSecretaSegura2026` |

### 4. Ejecutar

```sh
npm run start:dev
```

El servicio estará disponible en `http://localhost:3000`.

## Verificar que funciona

Ejecuta el siguiente comando para verificar que el servicio responde correctamente:

```sh
curl http://localhost:3000
```

Deberías recibir como respuesta el texto `Hello World!`. Esto confirma que el servidor NestJS está levantado y sirviendo requests.

Para probar la generación de PDF, envía un request al endpoint principal:

```sh
curl -X POST http://localhost:3000/api/generate/pdf \
  -H "Content-Type: application/json" \
  -d '{
    "templateId": "t0000002199",
    "documentData": {
      "documentId": "TEST-001",
      "date": "2026-03-03",
      "client": { "name": "Cliente Test", "docType": "NIT", "docNumber": "900123456" },
      "creditor": { "name": "Acreedor Test", "docType": "CC", "docNumber": "1234567890" },
      "amount": "100000",
      "items": [{ "description": "Servicio de prueba" }],
      "signature": "abc123"
    }
  }' --output test.pdf
```

Si se genera el archivo `test.pdf` correctamente, el setup fue exitoso.

## Problemas Comunes

| Problema | Causa | Solución |
|---|---|---|
| `Error: ENOENT: no such file or directory, open 'public/img/header.png'` | Las imágenes del directorio `public/img/` no están presentes o el proceso no se ejecuta desde la raíz del proyecto | Asegúrate de ejecutar el servicio desde la raíz del repositorio (`doc-forge/`) y verifica que `public/img/` contiene: `header.png`, `footer.png`, `firma_carlosm.png` y `table_accounts.png` |
| `Error: Cannot find module 'pdfkit'` | Las dependencias no se instalaron correctamente | Ejecuta `npm install` nuevamente. Si persiste, elimina `node_modules/` y `package-lock.json` y vuelve a instalar |
| `CRYPTO_KEY undefined` al generar links de descarga | Falta la variable de entorno `CRYPTO_KEY` en el archivo `.env` | Crea el archivo `.env` y agrega `CRYPTO_KEY=<tu_clave_secreta>`. El archivo `.env.example` está vacío y no sirve como referencia |
| El servicio arranca en puerto 3000 | El puerto está hardcodeado en `main.ts` como `3000` | Si necesitas otro puerto, modifica `main.ts` directamente |
| `Cannot read properties of undefined (reading 'replace')` al generar PDF | Falta el campo `amount` en `documentData`. El servicio procesa este campo antes de invocar el template | Incluir siempre `amount` como string en `documentData`, incluso para templates que no lo muestran |

## Canales de Soporte

| Canal | Propósito |
|---|---|
| #core-team | Soporte general, consultas técnicas y reportes de incidentes |
| lead@bigso.co | Escalamiento directo al Tech Lead del proyecto |
