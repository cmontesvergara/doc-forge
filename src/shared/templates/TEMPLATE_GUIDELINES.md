# Lineamientos para Templates PdfKit — DocForge

## Reglas Generales

1. Cada template es una **función exportada** en `src/shared/templates/pdfkit/` con nombre `tXXXXXXXXXX.ts`
2. La función recibe un único parámetro `payload` (objeto con todos los datos del documento)
3. Retorna un objeto `PDFDocument` de PdfKit
4. **Debe registrarse** en `src/shared/templates/pdfkit/index.ts` con `export * from './tXXXXXXXXXX'`
5. El campo `payload.amount` es **obligatorio** — el servicio lo procesa antes de invocar el template para calcular `payload.amountInLetters`
6. El campo `payload.signature` se usa como firma de seguridad en todas las páginas

## Configuración Base del Documento

```typescript
const setting = {
  size: 'LETTER',          // Siempre LETTER (612 x 792 pts)
  font: 'Courier',         // Fuente base: Courier (built-in PdfKit)
  bufferPages: true,       // OBLIGATORIO para inyectar headers/footers al final
  margins: { top: 80, bottom: 50, left: 50, right: 50 },
};
const doc = new PDFDocument(setting);
```

### Constantes de Layout

```typescript
const pageWidth = 612;
const contentLeft = 50;
const contentRight = pageWidth - 50;   // 562
const contentWidth = contentRight - contentLeft;  // 512
```

## Sistema Visual

### Paleta de Colores

| Uso | Color | Hex |
|---|---|---|
| Barras de sección (fondo) | Gris oscuro | `#444444` |
| Texto sobre barras | Blanco | `#FFFFFF` |
| Texto principal | Negro | `#000000` |
| Labels/subtítulos | Gris | `#666666` |
| Bordes de cajas | Gris medio | `#999999` |
| Bordes de filas de tabla | Gris claro | `#CCCCCC` |
| Fila alterna de tabla | Gris muy claro | `#F5F5F5` |
| Header de tabla (fondo) | Gris claro | `#EEEEEE` |
| Header de tabla (texto) | Gris oscuro | `#333333` |
| Footer texto | Gris medio | `#888888` |

### Tipografía

| Elemento | Fuente | Tamaño |
|---|---|---|
| Company name (header) | `Courier-Bold` | 24 |
| Título del documento (en barra) | `Courier-Bold` | 10 |
| Valores destacados (orden #, total) | `Courier-Bold` | 13-14 |
| Sección header (en barra) | `Courier-Bold` | 9 |
| Labels de info boxes | `Courier` | 7 |
| Valores de info boxes | `Courier-Bold` | 11 |
| Nombre de cliente | `Courier-Bold` | 11 |
| Datos de cliente | `Courier` | 9 |
| Header de tabla de items | `Courier-Bold` | 8 |
| Filas de tabla | `Courier` | 9-10 |
| Notas | `Courier` | 9 |
| Footer | `Courier` | 7 |

## Estructura del Template

### 1. Header — Company Name + Título

```typescript
//=> Línea gruesa superior
doc.moveTo(contentLeft, 25).lineTo(contentRight, 25).lineWidth(3).stroke('#000000');

//=> Nombre de la empresa (centrado, grande)
doc.font('Courier-Bold').fontSize(24)
  .text(`${payload.companyName || ''}`, contentLeft, 35, {
    align: 'center', width: contentWidth,
  });

//=> Barra oscura con título del documento
const barY = doc.y + 4;
doc.rect(contentLeft, barY, contentWidth, 18).fill('#444444');
doc.font('Courier-Bold').fontSize(10).fillColor('#FFFFFF')
  .text('TITULO DEL DOCUMENTO', contentLeft, barY + 4, {
    align: 'center', width: contentWidth,
  }).fillColor('#000000');

//=> Línea después de la barra
doc.moveTo(contentLeft, barY + 22).lineTo(contentRight, barY + 22)
  .lineWidth(1).stroke('#000000');
```

### 2. Info Boxes (hasta 3 columnas)

```typescript
const infoBoxY = doc.y;
const boxW = contentWidth / 3;

//=> Cada box: borde gris + label pequeño arriba + valor grande abajo
doc.rect(contentLeft, infoBoxY, boxW, 32).lineWidth(0.5).stroke('#999999');
doc.font('Courier').fontSize(7).fillColor('#666666')
  .text('LABEL', contentLeft + 6, infoBoxY + 3);
doc.font('Courier-Bold').fontSize(14).fillColor('#000000')
  .text('VALOR', contentLeft + 6, infoBoxY + 13);
```

### 3. Barras de Sección

Cada sección del documento usa una barra oscura como encabezado:

```typescript
const sectionBarY = doc.y;
doc.rect(contentLeft, sectionBarY, contentWidth, 16).fill('#444444');
doc.font('Courier-Bold').fontSize(9).fillColor('#FFFFFF')
  .text('  NOMBRE SECCION', contentLeft, sectionBarY + 4, {
    width: contentWidth,
  }).fillColor('#000000');
```

### 4. Tabla de Items

```typescript
//=> Header con fondo gris
doc.rect(contentLeft, thY, contentWidth, 14).fill('#EEEEEE');
doc.font('Courier-Bold').fontSize(8).fillColor('#333333')
  .text('COL1', x1, thY + 3).text('COL2', x2, thY + 3);

//=> Filas con alternancia de color
let alternate = false;
for (const item of payload.items) {
  // Page break si doc.y > 620-660
  if (doc.y > 660) { doc.addPage(); doc.y = 50; }

  if (alternate) {
    doc.rect(contentLeft, rowY, contentWidth, rowH).fill('#F5F5F5');
    doc.fillColor('#000000');
  }

  // Bordes laterales + bottom
  // Contenido de la fila

  alternate = !alternate;
}

//=> Borde inferior de tabla (más grueso)
doc.moveTo(contentLeft, doc.y).lineTo(contentRight, doc.y)
  .lineWidth(1).stroke('#999999');
```

### 5. Footer (inyectado en todas las páginas)

```typescript
const range = doc.bufferedPageRange();
for (let i = range.start; i < range.start + range.count; i++) {
  doc.switchToPage(i);

  //=> Línea separadora
  doc.moveTo(contentLeft, 710).lineTo(contentRight, 710)
    .lineWidth(0.5).stroke('#999999');

  //=> Texto footer
  doc.font('Courier').fontSize(7).fillColor('#888888')
    .text('ORDAMY - BY BIGSO.CO', contentLeft, 714, {
      width: contentWidth / 2, align: 'left',
    })
    .text(`Pagina ${i + 1} de ${range.count}`,
      contentLeft + contentWidth / 2, 714,
      { width: contentWidth / 2, align: 'right' },
    ).fillColor('#000000');
}
```

## Reglas de Paginación

1. **NO colocar imágenes o contenido con posición fija** al inicio del documento (causa páginas en blanco)
2. Usar `bufferPages: true` e inyectar headers/footers en el loop final
3. Antes de cada sección que pueda desbordar, verificar espacio disponible:
   - Items de tabla: `if (doc.y > 660) { doc.addPage(); doc.y = 50; }`
   - Sección de totales: `if (doc.y > 540)`
   - Notas: `if (doc.y > 640)`
   - Firma: `if (doc.y > 600)`
4. El footer se posiciona a `y = 710-714` — no colocar contenido debajo de `y = 700`

## Payload Mínimo Requerido

Todos los templates reciben estos campos (procesados por `GeneratorService`):

| Campo | Tipo | Origen |
|---|---|---|
| `amount` | string | Enviado por el consumidor. Se usa para calcular `amountInLetters` |
| `amountInLetters` | string | Inyectado por `GeneratorService` antes de invocar el template |
| `signature` | string | Enviado por el consumidor. Firma de seguridad |

## Templates Existentes

| ID | Tipo | Archivo | Usa imágenes | Datos monetarios |
|---|---|---|---|---|
| `t0000002198` | Cuenta de cobro (legacy) | `t0000002198.ts` | ✅ header, footer, table_accounts | ✅ |
| `t0000002199` | Recibo de pago (legacy) | `t0000002199.ts` | ✅ header, footer, firma_carlosm | ✅ |
| `t0000002000` | Constancia (legacy) | `t0000002000.ts` | ✅ header, footer, firma_carlosm | ❌ |
| `t0000003000` | Voucher de producción | `t0000003000.ts` | ❌ texto puro | ❌ |
| `t0000003001` | Cuenta de cobro (Ordamy) | `t0000003001.ts` | ❌ texto puro | ✅ |

Los templates `t0000003XXX` usan el nuevo sistema visual (barras, cajas, tablas con bordes). Los `t0000002XXX` son legacy y usan imágenes PNG.

## Convención de IDs

- `t0000002XXX` — Templates legacy (con imágenes de header/footer)
- `t0000003XXX` — Templates Ordamy (sistema visual con barras y cajas, sin imágenes)
