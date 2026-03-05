/* eslint-disable @typescript-eslint/no-var-requires */
const PDFDocument = require('pdfkit');

export function t0000003003(payload) {
    const setting = {
        size: 'LETTER',
        font: 'Courier',
        bufferPages: true,
        margins: { top: 80, bottom: 50, left: 50, right: 50 },
    };
    const doc = new PDFDocument(setting);

    const pageWidth = 612;
    const contentLeft = 50;
    const contentRight = pageWidth - 50;
    const contentWidth = contentRight - contentLeft;

    // Helper: draw a table row
    function drawRow(cols: { x: number; text: string; width?: number }[], y: number, h: number, alt: boolean, bold = false) {
        if (alt) {
            doc.rect(contentLeft, y, contentWidth, h).fill('#F5F5F5');
            doc.fillColor('#000000');
        }
        doc.moveTo(contentLeft, y).lineTo(contentLeft, y + h).lineWidth(0.3).stroke('#CCCCCC');
        doc.moveTo(contentRight, y).lineTo(contentRight, y + h).lineWidth(0.3).stroke('#CCCCCC');
        doc.font(bold ? 'Courier-Bold' : 'Courier').fontSize(9).fillColor('#000000');
        for (const col of cols) {
            doc.text(col.text, col.x, y + 4, { width: col.width || 100 });
        }
        doc.moveTo(contentLeft, y + h).lineTo(contentRight, y + h).lineWidth(0.3).stroke('#CCCCCC');
    }

    // Helper: section bar
    function sectionBar(title: string) {
        const y = doc.y;
        doc.rect(contentLeft, y, contentWidth, 16).fill('#444444');
        doc.font('Courier-Bold').fontSize(9).fillColor('#FFFFFF')
            .text(`  ${title}`, contentLeft, y + 4, { width: contentWidth })
            .fillColor('#000000');
        doc.y = y + 20;
    }

    // Helper: table header
    function tableHeader(cols: { x: number; text: string }[]) {
        const y = doc.y;
        doc.rect(contentLeft, y, contentWidth, 14).fill('#EEEEEE');
        doc.font('Courier-Bold').fontSize(8).fillColor('#333333');
        for (const col of cols) {
            doc.text(col.text, col.x, y + 3);
        }
        doc.fillColor('#000000');
        doc.moveTo(contentLeft, y).lineTo(contentRight, y).lineWidth(0.5).stroke('#999999');
        doc.y = y + 14;
    }

    // Helper: total row
    function totalRow(cols: { x: number; text: string }[]) {
        const y = doc.y;
        doc.rect(contentLeft, y, contentWidth, 16).fill('#EEEEEE');
        doc.font('Courier-Bold').fontSize(9).fillColor('#000000');
        for (const col of cols) {
            doc.text(col.text, col.x, y + 4);
        }
        doc.moveTo(contentLeft, y + 16).lineTo(contentRight, y + 16).lineWidth(1).stroke('#999999');
        doc.y = y + 16;
    }

    function checkPage(min = 660) {
        if (doc.y > min) { doc.addPage(); doc.y = 50; }
    }

    //==========================================================
    //=> HEADER
    //==========================================================
    doc.moveTo(contentLeft, 25).lineTo(contentRight, 25).lineWidth(3).stroke('#000000');

    doc.font('Courier-Bold').fontSize(24)
        .text(`${payload.companyName || ''}`, contentLeft, 35, {
            align: 'center', width: contentWidth,
        });

    const barY = doc.y + 4;
    doc.rect(contentLeft, barY, contentWidth, 18).fill('#444444');
    doc.font('Courier-Bold').fontSize(10).fillColor('#FFFFFF')
        .text('CORTE MENSUAL', contentLeft, barY + 4, {
            align: 'center', width: contentWidth,
        }).fillColor('#000000');

    doc.moveTo(contentLeft, barY + 22).lineTo(contentRight, barY + 22)
        .lineWidth(1).stroke('#000000');

    //=> Period box
    doc.y = barY + 30;
    const dateBoxY = doc.y;
    doc.rect(contentLeft, dateBoxY, contentWidth, 28).lineWidth(0.5).stroke('#999999');
    doc.font('Courier').fontSize(7).fillColor('#666666')
        .text('PERIODO', contentLeft + 6, dateBoxY + 3);
    doc.font('Courier-Bold').fontSize(14).fillColor('#000000')
        .text(`${payload.date}`, contentLeft + 6, dateBoxY + 12);

    //==========================================================
    //=> SUMMARY — 4 BOXES
    //==========================================================
    doc.y = dateBoxY + 36;
    const sumY = doc.y;
    const boxW = contentWidth / 4;

    // Ingresos
    doc.rect(contentLeft, sumY, boxW, 36).lineWidth(0.5).stroke('#999999');
    doc.font('Courier').fontSize(7).fillColor('#666666')
        .text('INGRESOS', contentLeft + 6, sumY + 3);
    doc.font('Courier-Bold').fontSize(11).fillColor('#007A33')
        .text(`COP ${payload.income}`, contentLeft + 6, sumY + 16)
        .fillColor('#000000');

    // Egresos
    const b2X = contentLeft + boxW;
    doc.rect(b2X, sumY, boxW, 36).lineWidth(0.5).stroke('#999999');
    doc.font('Courier').fontSize(7).fillColor('#666666')
        .text('EGRESOS', b2X + 6, sumY + 3);
    doc.font('Courier-Bold').fontSize(11).fillColor('#CC0000')
        .text(`COP ${payload.expenses}`, b2X + 6, sumY + 16)
        .fillColor('#000000');

    // Neto
    const b3X = contentLeft + boxW * 2;
    doc.rect(b3X, sumY, boxW, 36).lineWidth(0.5).stroke('#999999');
    doc.font('Courier').fontSize(7).fillColor('#666666')
        .text('NETO', b3X + 6, sumY + 3);
    doc.font('Courier-Bold').fontSize(11).fillColor('#000000')
        .text(`COP ${payload.net}`, b3X + 6, sumY + 16);

    // Ordenes
    const b4X = contentLeft + boxW * 3;
    doc.rect(b4X, sumY, boxW, 36).lineWidth(0.5).stroke('#999999');
    doc.font('Courier').fontSize(7).fillColor('#666666')
        .text('ORDENES', b4X + 6, sumY + 3);
    doc.font('Courier-Bold').fontSize(12).fillColor('#000000')
        .text(`${payload.ordersCount}`, b4X + 6, sumY + 13);
    doc.font('Courier').fontSize(7).fillColor('#666666')
        .text(`(COP ${payload.ordersTotal || ''})`, b4X + 6, sumY + 26)
        .fillColor('#000000');

    //==========================================================
    //=> INGRESOS POR MEDIO DE PAGO
    //==========================================================
    doc.y = sumY + 48;
    const colMethod = contentLeft + 4;
    const colTx = 300;
    const colTotal = 430;

    sectionBar('INGRESOS POR MEDIO DE PAGO');
    tableHeader([
        { x: colMethod, text: 'MEDIO' },
        { x: colTx, text: 'TRANSACCIONES' },
        { x: colTotal, text: 'TOTAL' },
    ]);

    let alt = false;
    for (const row of payload.incomeByMethod || []) {
        const rY = doc.y;
        drawRow([
            { x: colMethod, text: row.method, width: 240 },
            { x: colTx, text: `${row.transactions}`, width: 100 },
            { x: colTotal, text: `COP ${row.total}`, width: 120 },
        ], rY, 16, alt);
        doc.y = rY + 16;
        alt = !alt;
    }

    totalRow([
        { x: colMethod, text: 'Total' },
        { x: colTotal, text: `COP ${payload.incomeTotalAmount || ''}` },
    ]);

    //==========================================================
    //=> EGRESOS POR MEDIO DE PAGO
    //==========================================================
    doc.y += 10;
    checkPage();

    sectionBar('EGRESOS POR MEDIO DE PAGO');
    tableHeader([
        { x: colMethod, text: 'MEDIO' },
        { x: colTx, text: 'TRANSACCIONES' },
        { x: colTotal, text: 'TOTAL' },
    ]);

    alt = false;
    for (const row of payload.expensesByMethod || []) {
        const rY = doc.y;
        drawRow([
            { x: colMethod, text: row.method, width: 240 },
            { x: colTx, text: `${row.transactions}`, width: 100 },
            { x: colTotal, text: `COP ${row.total}`, width: 120 },
        ], rY, 16, alt);
        doc.y = rY + 16;
        alt = !alt;
    }

    totalRow([
        { x: colMethod, text: 'Total' },
        { x: colTotal, text: `COP ${payload.expensesTotalAmount || ''}` },
    ]);

    //==========================================================
    //=> EGRESOS POR CATEGORÍA
    //==========================================================
    doc.y += 10;
    checkPage();

    const colCat = contentLeft + 4;
    const colCatQty = 320;
    const colCatTotal = 430;

    sectionBar('EGRESOS POR CATEGORIA');
    tableHeader([
        { x: colCat, text: 'CATEGORIA' },
        { x: colCatQty, text: 'CANTIDAD' },
        { x: colCatTotal, text: 'TOTAL' },
    ]);

    alt = false;
    for (const row of payload.expensesByCategory || []) {
        checkPage();
        const rY = doc.y;
        drawRow([
            { x: colCat, text: row.category, width: 260 },
            { x: colCatQty, text: `${row.quantity}`, width: 80 },
            { x: colCatTotal, text: `COP ${row.total}`, width: 120 },
        ], rY, 16, alt);
        doc.y = rY + 16;
        alt = !alt;
    }

    doc.moveTo(contentLeft, doc.y).lineTo(contentRight, doc.y).lineWidth(1).stroke('#999999');

    //==========================================================
    //=> FOOTER ON ALL PAGES
    //==========================================================
    const range = doc.bufferedPageRange();
    for (let i = range.start; i < range.start + range.count; i++) {
        doc.switchToPage(i);

        doc.moveTo(contentLeft, 710).lineTo(contentRight, 710)
            .lineWidth(0.5).stroke('#999999');

        doc.font('Courier').fontSize(7).fillColor('#888888')
            .text('ORDAMY - BY BIGSO.CO', contentLeft, 714, {
                width: contentWidth / 2, align: 'left',
            })
            .text(`Pagina ${i + 1} de ${range.count}`,
                contentLeft + contentWidth / 2, 714,
                { width: contentWidth / 2, align: 'right' },
            ).fillColor('#000000');
    }

    return doc;
}
