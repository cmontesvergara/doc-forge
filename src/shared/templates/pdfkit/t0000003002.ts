/* eslint-disable @typescript-eslint/no-var-requires */
const PDFDocument = require('pdfkit');

export function t0000003002(payload) {
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

    // Helper: draw a table row with alternating bg
    function drawRow(cols: { x: number; text: string; width?: number; align?: string }[], y: number, h: number, alt: boolean, bold = false) {
        if (alt) {
            doc.rect(contentLeft, y, contentWidth, h).fill('#F5F5F5');
            doc.fillColor('#000000');
        }
        doc.moveTo(contentLeft, y).lineTo(contentLeft, y + h).lineWidth(0.3).stroke('#CCCCCC');
        doc.moveTo(contentRight, y).lineTo(contentRight, y + h).lineWidth(0.3).stroke('#CCCCCC');

        doc.font(bold ? 'Courier-Bold' : 'Courier').fontSize(9).fillColor('#000000');
        for (const col of cols) {
            doc.text(col.text, col.x, y + 4, {
                width: col.width || 100,
                align: (col.align as any) || 'left',
            });
        }
        doc.moveTo(contentLeft, y + h).lineTo(contentRight, y + h).lineWidth(0.3).stroke('#CCCCCC');
    }

    // Helper: section bar
    function sectionBar(title: string) {
        const barY = doc.y;
        doc.rect(contentLeft, barY, contentWidth, 16).fill('#444444');
        doc.font('Courier-Bold').fontSize(9).fillColor('#FFFFFF')
            .text(`  ${title}`, contentLeft, barY + 4, { width: contentWidth })
            .fillColor('#000000');
        doc.y = barY + 20;
    }

    // Helper: check page break
    function checkPage(minSpace = 660) {
        if (doc.y > minSpace) { doc.addPage(); doc.y = 50; }
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
        .text('CORTE DIARIO', contentLeft, barY + 4, {
            align: 'center', width: contentWidth,
        }).fillColor('#000000');

    doc.moveTo(contentLeft, barY + 22).lineTo(contentRight, barY + 22)
        .lineWidth(1).stroke('#000000');

    //=> Date box
    doc.y = barY + 30;
    const dateBoxY = doc.y;
    doc.rect(contentLeft, dateBoxY, contentWidth, 28).lineWidth(0.5).stroke('#999999');
    doc.font('Courier').fontSize(7).fillColor('#666666')
        .text('FECHA DEL CORTE', contentLeft + 6, dateBoxY + 3);
    doc.font('Courier-Bold').fontSize(14).fillColor('#000000')
        .text(`${payload.date}`, contentLeft + 6, dateBoxY + 12);

    //==========================================================
    //=> SUMMARY — 4 BOXES
    //==========================================================
    doc.y = dateBoxY + 36;
    const sumY = doc.y;
    const boxW = contentWidth / 4;

    // Box 1: Ingresos
    doc.rect(contentLeft, sumY, boxW, 36).lineWidth(0.5).stroke('#999999');
    doc.font('Courier').fontSize(7).fillColor('#666666')
        .text('INGRESOS', contentLeft + 6, sumY + 3);
    doc.font('Courier-Bold').fontSize(11).fillColor('#007A33')
        .text(`COP ${payload.income}`, contentLeft + 6, sumY + 16)
        .fillColor('#000000');

    // Box 2: Egresos
    const b2X = contentLeft + boxW;
    doc.rect(b2X, sumY, boxW, 36).lineWidth(0.5).stroke('#999999');
    doc.font('Courier').fontSize(7).fillColor('#666666')
        .text('EGRESOS', b2X + 6, sumY + 3);
    doc.font('Courier-Bold').fontSize(11).fillColor('#CC0000')
        .text(`COP ${payload.expenses}`, b2X + 6, sumY + 16)
        .fillColor('#000000');

    // Box 3: Neto
    const b3X = contentLeft + boxW * 2;
    doc.rect(b3X, sumY, boxW, 36).lineWidth(0.5).stroke('#999999');
    doc.font('Courier').fontSize(7).fillColor('#666666')
        .text('NETO', b3X + 6, sumY + 3);
    doc.font('Courier-Bold').fontSize(11).fillColor('#000000')
        .text(`COP ${payload.net}`, b3X + 6, sumY + 16);

    // Box 4: Ordenes creadas
    const b4X = contentLeft + boxW * 3;
    doc.rect(b4X, sumY, boxW, 36).lineWidth(0.5).stroke('#999999');
    doc.font('Courier').fontSize(7).fillColor('#666666')
        .text('ORDENES CREADAS', b4X + 6, sumY + 3);
    doc.font('Courier-Bold').fontSize(14).fillColor('#000000')
        .text(`${payload.ordersCreated}`, b4X + 6, sumY + 15);

    //==========================================================
    //=> INGRESOS POR MEDIO DE PAGO
    //==========================================================
    doc.y = sumY + 48;
    sectionBar('INGRESOS POR MEDIO DE PAGO');

    // Table header
    const incColMethod = contentLeft + 4;
    const incColTx = 300;
    const incColTotal = 430;

    let thY = doc.y;
    doc.rect(contentLeft, thY, contentWidth, 14).fill('#EEEEEE');
    doc.font('Courier-Bold').fontSize(8).fillColor('#333333')
        .text('MEDIO', incColMethod, thY + 3)
        .text('TRANSACCIONES', incColTx, thY + 3)
        .text('TOTAL', incColTotal, thY + 3)
        .fillColor('#000000');
    doc.moveTo(contentLeft, thY).lineTo(contentRight, thY).lineWidth(0.5).stroke('#999999');
    doc.y = thY + 14;

    // Rows
    let alt = false;
    for (const row of payload.incomeByMethod || []) {
        const rY = doc.y;
        drawRow([
            { x: incColMethod, text: row.method, width: 240 },
            { x: incColTx, text: `${row.transactions}`, width: 100 },
            { x: incColTotal, text: `COP ${row.total}`, width: 120 },
        ], rY, 16, alt);
        doc.y = rY + 16;
        alt = !alt;
    }

    // Total row
    const incTotalY = doc.y;
    doc.rect(contentLeft, incTotalY, contentWidth, 16).fill('#EEEEEE');
    doc.font('Courier-Bold').fontSize(9).fillColor('#000000')
        .text('Total', incColMethod, incTotalY + 4)
        .text(`COP ${payload.incomeTotalAmount || ''}`, incColTotal, incTotalY + 4);
    doc.moveTo(contentLeft, incTotalY + 16).lineTo(contentRight, incTotalY + 16).lineWidth(1).stroke('#999999');
    doc.y = incTotalY + 16;

    //==========================================================
    //=> EGRESOS POR MEDIO DE PAGO
    //==========================================================
    doc.y += 10;
    checkPage();
    sectionBar('EGRESOS POR MEDIO DE PAGO');

    thY = doc.y;
    doc.rect(contentLeft, thY, contentWidth, 14).fill('#EEEEEE');
    doc.font('Courier-Bold').fontSize(8).fillColor('#333333')
        .text('MEDIO', incColMethod, thY + 3)
        .text('TRANSACCIONES', incColTx, thY + 3)
        .text('TOTAL', incColTotal, thY + 3)
        .fillColor('#000000');
    doc.moveTo(contentLeft, thY).lineTo(contentRight, thY).lineWidth(0.5).stroke('#999999');
    doc.y = thY + 14;

    alt = false;
    for (const row of payload.expensesByMethod || []) {
        const rY = doc.y;
        drawRow([
            { x: incColMethod, text: row.method, width: 240 },
            { x: incColTx, text: `${row.transactions}`, width: 100 },
            { x: incColTotal, text: `COP ${row.total}`, width: 120 },
        ], rY, 16, alt);
        doc.y = rY + 16;
        alt = !alt;
    }

    // Total row
    const expTotalY = doc.y;
    doc.rect(contentLeft, expTotalY, contentWidth, 16).fill('#EEEEEE');
    doc.font('Courier-Bold').fontSize(9).fillColor('#000000')
        .text('Total', incColMethod, expTotalY + 4)
        .text(`COP ${payload.expensesTotalAmount || ''}`, incColTotal, expTotalY + 4);
    doc.moveTo(contentLeft, expTotalY + 16).lineTo(contentRight, expTotalY + 16).lineWidth(1).stroke('#999999');
    doc.y = expTotalY + 16;

    //==========================================================
    //=> DETALLE DE PAGOS
    //==========================================================
    doc.y += 10;
    checkPage();
    const paymentsCount = (payload.payments || []).length;
    sectionBar(`DETALLE DE PAGOS (${paymentsCount})`);

    const payColOrder = contentLeft + 4;
    const payColClient = contentLeft + 60;
    const payColMethod = 300;
    const payColAmount = 440;

    thY = doc.y;
    doc.rect(contentLeft, thY, contentWidth, 14).fill('#EEEEEE');
    doc.font('Courier-Bold').fontSize(8).fillColor('#333333')
        .text('ORDEN', payColOrder, thY + 3)
        .text('CLIENTE', payColClient, thY + 3)
        .text('MEDIO', payColMethod, thY + 3)
        .text('MONTO', payColAmount, thY + 3)
        .fillColor('#000000');
    doc.moveTo(contentLeft, thY).lineTo(contentRight, thY).lineWidth(0.5).stroke('#999999');
    doc.y = thY + 14;

    alt = false;
    for (const row of payload.payments || []) {
        checkPage();
        const rY = doc.y;
        drawRow([
            { x: payColOrder, text: `${row.orderNumber}`, width: 50 },
            { x: payColClient, text: `${row.customer}`, width: 230 },
            { x: payColMethod, text: `${row.method}`, width: 130 },
            { x: payColAmount, text: `COP ${row.amount}`, width: 110 },
        ], rY, 16, alt);
        doc.y = rY + 16;
        alt = !alt;
    }

    doc.moveTo(contentLeft, doc.y).lineTo(contentRight, doc.y).lineWidth(1).stroke('#999999');

    //==========================================================
    //=> DETALLE DE EGRESOS
    //==========================================================
    doc.y += 10;
    checkPage();
    const expensesCount = (payload.expenseDetails || []).length;
    sectionBar(`DETALLE DE EGRESOS (${expensesCount})`);

    const expColNum = contentLeft + 4;
    const expColDesc = contentLeft + 35;
    const expColCat = 230;
    const expColMethod = 360;
    const expColAmount = 460;

    thY = doc.y;
    doc.rect(contentLeft, thY, contentWidth, 14).fill('#EEEEEE');
    doc.font('Courier-Bold').fontSize(8).fillColor('#333333')
        .text('#', expColNum, thY + 3)
        .text('DESCRIPCION', expColDesc, thY + 3)
        .text('CATEGORIA', expColCat, thY + 3)
        .text('MEDIO', expColMethod, thY + 3)
        .text('MONTO', expColAmount, thY + 3)
        .fillColor('#000000');
    doc.moveTo(contentLeft, thY).lineTo(contentRight, thY).lineWidth(0.5).stroke('#999999');
    doc.y = thY + 14;

    alt = false;
    let expNum = 1;
    for (const row of payload.expenseDetails || []) {
        checkPage();
        const rY = doc.y;
        drawRow([
            { x: expColNum, text: `${expNum}`, width: 25 },
            { x: expColDesc, text: `${row.description}`, width: 185 },
            { x: expColCat, text: `${row.category}`, width: 120 },
            { x: expColMethod, text: `${row.method}`, width: 90 },
            { x: expColAmount, text: `COP ${row.amount}`, width: 100 },
        ], rY, 16, alt);
        doc.y = rY + 16;
        expNum++;
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
