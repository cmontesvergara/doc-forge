/* eslint-disable @typescript-eslint/no-var-requires */
const PDFDocument = require('pdfkit');

export function t0000003001(payload) {
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

    //==========================================================
    //=> HEADER — COMPANY NAME + INVOICE TITLE
    //==========================================================

    //=> Top line (thick)
    doc
        .moveTo(contentLeft, 25)
        .lineTo(contentRight, 25)
        .lineWidth(3)
        .stroke('#000000');

    //=> Company name
    doc
        .font('Courier-Bold')
        .fontSize(24)
        .text(`${payload.companyName || ''}`, contentLeft, 35, {
            align: 'center',
            width: contentWidth,
        });

    //=> Invoice label bar
    const barY = doc.y + 4;
    doc.rect(contentLeft, barY, contentWidth, 18).fill('#444444');
    doc
        .font('Courier-Bold')
        .fontSize(10)
        .fillColor('#FFFFFF')
        .text('CUENTA DE COBRO', contentLeft, barY + 4, {
            align: 'center',
            width: contentWidth,
        })
        .fillColor('#000000');

    //=> Line after bar
    doc
        .moveTo(contentLeft, barY + 22)
        .lineTo(contentRight, barY + 22)
        .lineWidth(1)
        .stroke('#000000');

    //==========================================================
    //=> ORDER INFO — 3 BOXES
    //==========================================================
    doc.y = barY + 30;
    const infoBoxY = doc.y;
    const boxW = contentWidth / 3;

    //=> Box 1: Order #
    doc
        .rect(contentLeft, infoBoxY, boxW, 32)
        .lineWidth(0.5)
        .stroke('#999999');
    doc
        .font('Courier')
        .fontSize(7)
        .fillColor('#666666')
        .text('ORDEN No.', contentLeft + 6, infoBoxY + 3)
        .font('Courier-Bold')
        .fontSize(14)
        .fillColor('#000000')
        .text(`${payload.documentId}`, contentLeft + 6, infoBoxY + 13);

    //=> Box 2: Date
    const col2X = contentLeft + boxW;
    doc
        .rect(col2X, infoBoxY, boxW, 32)
        .lineWidth(0.5)
        .stroke('#999999');
    doc
        .font('Courier')
        .fontSize(7)
        .fillColor('#666666')
        .text('FECHA', col2X + 6, infoBoxY + 3)
        .font('Courier-Bold')
        .fontSize(11)
        .fillColor('#000000')
        .text(`${payload.date}`, col2X + 6, infoBoxY + 14);

    //=> Box 3: Due date
    const col3X = contentLeft + boxW * 2;
    doc
        .rect(col3X, infoBoxY, boxW, 32)
        .lineWidth(0.5)
        .stroke('#999999');
    doc
        .font('Courier')
        .fontSize(7)
        .fillColor('#666666')
        .text('FECHA LIMITE', col3X + 6, infoBoxY + 3)
        .font('Courier-Bold')
        .fontSize(11)
        .fillColor('#000000')
        .text(`${payload.dueDate || 'Sin definir'}`, col3X + 6, infoBoxY + 14);

    //==========================================================
    //=> CUSTOMER SECTION
    //==========================================================
    doc.y = infoBoxY + 44;
    const custBarY = doc.y;
    doc.rect(contentLeft, custBarY, contentWidth, 16).fill('#444444');
    doc
        .font('Courier-Bold')
        .fontSize(9)
        .fillColor('#FFFFFF')
        .text('  DATOS DEL CLIENTE', contentLeft, custBarY + 4, {
            width: contentWidth,
        })
        .fillColor('#000000');

    doc.y = custBarY + 22;
    const halfW = contentWidth / 2;

    doc
        .font('Courier-Bold')
        .fontSize(11)
        .text(`${payload.customer.name}`, contentLeft, doc.y, {
            width: contentWidth,
        });

    const detY = doc.y + 2;
    doc
        .font('Courier')
        .fontSize(9)
        .text(`ID: ${payload.customer.identification}`, contentLeft, detY)
        .text(
            `Tel: ${payload.customer.phone || 'N/A'}`,
            contentLeft + halfW,
            detY,
        );

    doc
        .font('Courier')
        .fontSize(9)
        .text(
            `Dir: ${payload.customer.address || 'N/A'}`,
            contentLeft,
            doc.y + 2,
        )
        .text(
            `Email: ${payload.customer.email || 'N/A'}`,
            contentLeft + halfW,
            doc.y - 11,
        );

    //=> Thin separator
    doc.y = doc.y + 6;
    doc
        .moveTo(contentLeft, doc.y)
        .lineTo(contentRight, doc.y)
        .lineWidth(0.5)
        .stroke('#CCCCCC');

    //==========================================================
    //=> ITEMS TABLE
    //==========================================================
    doc.y = doc.y + 8;
    const itemsBarY = doc.y;
    doc.rect(contentLeft, itemsBarY, contentWidth, 16).fill('#444444');
    doc
        .font('Courier-Bold')
        .fontSize(9)
        .fillColor('#FFFFFF')
        .text('  DETALLE', contentLeft, itemsBarY + 4, {
            width: contentWidth,
        })
        .fillColor('#000000');

    //=> Table header
    doc.y = itemsBarY + 20;
    const colNum = contentLeft + 4;
    const colDesc = contentLeft + 35;
    const colQty = 330;
    const colPrice = 390;
    const colTotal = 470;

    const thY = doc.y;
    doc.rect(contentLeft, thY, contentWidth, 14).fill('#EEEEEE');
    doc
        .font('Courier-Bold')
        .fontSize(8)
        .fillColor('#333333')
        .text('#', colNum, thY + 3)
        .text('DESCRIPCION', colDesc, thY + 3)
        .text('CANT.', colQty, thY + 3)
        .text('P. UNIT', colPrice, thY + 3)
        .text('TOTAL', colTotal, thY + 3)
        .fillColor('#000000');

    doc.y = thY + 14;

    doc
        .moveTo(contentLeft, thY)
        .lineTo(contentRight, thY)
        .lineWidth(0.5)
        .stroke('#999999');

    //=> ITEMS ROWS
    let itemNum = 1;
    let alternate = false;
    for (const item of payload.items) {
        if (doc.y > 620) {
            doc.addPage();
            doc.y = 50;
        }

        const rowY = doc.y;
        const rowH = 16;

        if (alternate) {
            doc.rect(contentLeft, rowY, contentWidth, rowH).fill('#F5F5F5');
            doc.fillColor('#000000');
        }

        //=> Row side borders
        doc
            .moveTo(contentLeft, rowY)
            .lineTo(contentLeft, rowY + rowH)
            .lineWidth(0.3)
            .stroke('#CCCCCC');
        doc
            .moveTo(contentRight, rowY)
            .lineTo(contentRight, rowY + rowH)
            .lineWidth(0.3)
            .stroke('#CCCCCC');

        doc
            .font('Courier')
            .fontSize(9)
            .fillColor('#000000')
            .text(`${itemNum}`, colNum, rowY + 4)
            .text(`${item.description}`, colDesc, rowY + 4, {
                width: colQty - colDesc - 10,
            })
            .text(`${item.quantity}`, colQty, rowY + 4)
            .text(`$${item.unitPrice}`, colPrice, rowY + 4)
            .text(`$${item.lineTotal}`, colTotal, rowY + 4);

        //=> Row bottom border
        doc
            .moveTo(contentLeft, rowY + rowH)
            .lineTo(contentRight, rowY + rowH)
            .lineWidth(0.3)
            .stroke('#CCCCCC');

        doc.y = rowY + rowH;
        itemNum++;
        alternate = !alternate;
    }

    //=> Table bottom border
    doc
        .moveTo(contentLeft, doc.y)
        .lineTo(contentRight, doc.y)
        .lineWidth(1)
        .stroke('#999999');

    //==========================================================
    //=> TOTALS SECTION
    //==========================================================
    if (doc.y > 540) {
        doc.addPage();
        doc.y = 50;
    }

    doc.moveDown();

    const labelX = 370;
    const valX = 475;

    //=> Subtotal
    let tY = doc.y;
    doc
        .font('Courier')
        .fontSize(10)
        .text('Subtotal:', labelX, tY)
        .text(`$${payload.subtotal}`, valX, tY, { align: 'right', width: 85 });

    //=> Discount
    if (
        payload.discount &&
        payload.discount !== '0' &&
        payload.discount !== '0.00'
    ) {
        tY = doc.y + 3;
        doc
            .text('Descuento:', labelX, tY)
            .text(`-$${payload.discount}`, valX, tY, {
                align: 'right',
                width: 85,
            });
    }

    //=> Tax
    if (
        payload.taxAmount &&
        payload.taxAmount !== '0' &&
        payload.taxAmount !== '0.00'
    ) {
        tY = doc.y + 3;
        doc
            .text(`IVA (${payload.taxRate}%):`, labelX, tY)
            .text(`$${payload.taxAmount}`, valX, tY, {
                align: 'right',
                width: 85,
            });
    }

    //=> Total — highlighted box
    doc.moveDown(0.5);
    const totalBoxY = doc.y;
    doc
        .rect(labelX - 5, totalBoxY, contentRight - labelX + 5, 22)
        .fill('#444444');
    doc
        .font('Courier-Bold')
        .fontSize(13)
        .fillColor('#FFFFFF')
        .text('TOTAL:', labelX, totalBoxY + 5)
        .text(`$${payload.amount}`, valX, totalBoxY + 5, {
            align: 'right',
            width: 85,
        })
        .fillColor('#000000');

    //=> Amount in letters
    doc.y = totalBoxY + 30;
    doc
        .font('Courier')
        .fontSize(9)
        .text(`Son: ${payload.amountInLetters} PESOS`, contentLeft, doc.y);

    //=> Balance
    if (payload.balance && payload.balance !== '0') {
        doc
            .moveDown(0.5)
            .font('Courier-Bold')
            .fontSize(10)
            .text(`Saldo pendiente: $${payload.balance}`, contentLeft);
    }

    //==========================================================
    //=> NOTES
    //==========================================================
    if (payload.notes && payload.notes.trim() !== '') {
        doc.moveDown();
        if (doc.y > 640) {
            doc.addPage();
            doc.y = 50;
        }
        const nBarY = doc.y;
        doc.rect(contentLeft, nBarY, contentWidth, 16).fill('#444444');
        doc
            .font('Courier-Bold')
            .fontSize(9)
            .fillColor('#FFFFFF')
            .text('  NOTAS', contentLeft, nBarY + 4, { width: contentWidth })
            .fillColor('#000000');

        doc.y = nBarY + 22;
        doc
            .font('Courier')
            .fontSize(9)
            .text(`${payload.notes}`, contentLeft, doc.y, {
                width: contentWidth,
            });
    }

    //==========================================================
    //=> SELLER + SIGNATURE
    //==========================================================
    if (doc.y > 600) {
        doc.addPage();
        doc.y = 50;
    }

    doc
        .moveDown()
        .moveDown()
        .font('Courier')
        .fontSize(9)
        .text(`Vendedor: ${payload.sellerName}`, contentLeft);

    doc
        .moveDown()
        .moveDown()
        .moveDown()
        .moveTo(contentLeft, doc.y)
        .lineTo(contentLeft + 200, doc.y)
        .lineWidth(0.5)
        .stroke('#000000');

    doc
        .font('Courier')
        .fontSize(8)
        .text('Firma autorizada', contentLeft, doc.y + 3);

    //==========================================================
    //=> FOOTER ON ALL PAGES
    //==========================================================
    const range = doc.bufferedPageRange();
    for (let i = range.start; i < range.start + range.count; i++) {
        doc.switchToPage(i);

        doc
            .moveTo(contentLeft, 710)
            .lineTo(contentRight, 710)
            .lineWidth(0.5)
            .stroke('#999999');

        doc
            .font('Courier')
            .fontSize(7)
            .fillColor('#888888')
            .text('ORDAMY - BY BIGSO.CO', contentLeft, 714, {
                width: contentWidth / 2,
                align: 'left',
            })
            .text(
                `Pagina ${i + 1} de ${range.count}`,
                contentLeft + contentWidth / 2,
                714,
                { width: contentWidth / 2, align: 'right' },
            )
            .fillColor('#000000');
    }

    return doc;
}
