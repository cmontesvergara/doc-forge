/* eslint-disable @typescript-eslint/no-var-requires */
const PDFDocument = require('pdfkit');

export function t0000003000(payload) {
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
    //=> HEADER BLOCK — COMPANY NAME + VOUCHER TITLE
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

    //=> Voucher label in a dark bar
    const barY = doc.y + 4;
    doc.rect(contentLeft, barY, contentWidth, 18).fill('#444444');
    doc
        .font('Courier-Bold')
        .fontSize(10)
        .fillColor('#FFFFFF')
        .text('VOUCHER DE PRODUCCION', contentLeft, barY + 4, {
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
    //=> ORDER INFO ROW
    //==========================================================
    doc.y = barY + 30;

    //=> Left box: Order #
    const infoBoxY = doc.y;
    doc
        .rect(contentLeft, infoBoxY, contentWidth / 3, 32)
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

    //=> Center box: Print date
    const col2X = contentLeft + contentWidth / 3;
    doc
        .rect(col2X, infoBoxY, contentWidth / 3, 32)
        .lineWidth(0.5)
        .stroke('#999999');
    doc
        .font('Courier')
        .fontSize(7)
        .fillColor('#666666')
        .text('FECHA IMPRESION', col2X + 6, infoBoxY + 3)
        .font('Courier-Bold')
        .fontSize(11)
        .fillColor('#000000')
        .text(`${payload.date}`, col2X + 6, infoBoxY + 14);

    //=> Right box: Due date
    const col3X = contentLeft + (contentWidth / 3) * 2;
    doc
        .rect(col3X, infoBoxY, contentWidth / 3, 32)
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

    //=> Section header bar
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

    //=> Customer details (two columns)
    doc.y = custBarY + 22;
    const halfW = contentWidth / 2;

    doc
        .font('Courier-Bold')
        .fontSize(11)
        .text(`${payload.customer.name}`, contentLeft, doc.y, {
            width: contentWidth,
        });

    const detailY = doc.y + 2;
    doc
        .font('Courier')
        .fontSize(9)
        .text(`ID: ${payload.customer.identification}`, contentLeft, detailY)
        .text(
            `Tel: ${payload.customer.phone || 'N/A'}`,
            contentLeft + halfW,
            detailY,
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
            `Vendedor: ${payload.sellerName}`,
            contentLeft + halfW,
            doc.y - 11,
        );

    //=> Thin line after customer
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

    //=> Section header bar
    const itemsBarY = doc.y;
    doc.rect(contentLeft, itemsBarY, contentWidth, 16).fill('#444444');
    doc
        .font('Courier-Bold')
        .fontSize(9)
        .fillColor('#FFFFFF')
        .text('  ITEMS A PRODUCIR', contentLeft, itemsBarY + 4, {
            width: contentWidth,
        })
        .fillColor('#000000');

    //=> Table column headers
    doc.y = itemsBarY + 20;
    const colNum = contentLeft + 4;
    const colDesc = contentLeft + 40;
    const colQty = contentRight - 60;

    const thY = doc.y;

    //=> Header row with light gray bg
    doc.rect(contentLeft, thY, contentWidth, 14).fill('#EEEEEE');
    doc
        .font('Courier-Bold')
        .fontSize(8)
        .fillColor('#333333')
        .text('#', colNum, thY + 3)
        .text('DESCRIPCION', colDesc, thY + 3)
        .text('CANT.', colQty, thY + 3)
        .fillColor('#000000');

    doc.y = thY + 14;

    //=> Table top border
    doc
        .moveTo(contentLeft, thY)
        .lineTo(contentRight, thY)
        .lineWidth(0.5)
        .stroke('#999999');

    //=> ITEMS ROWS
    let itemNum = 1;
    let alternate = false;
    for (const item of payload.items) {
        //=> PAGE BREAK
        if (doc.y > 660) {
            doc.addPage();
            doc.y = 50;
        }

        const rowY = doc.y;
        const rowH = 16;

        //=> Alternating row background
        if (alternate) {
            doc.rect(contentLeft, rowY, contentWidth, rowH).fill('#F5F5F5');
            doc.fillColor('#000000');
        }

        //=> Row borders (left and right)
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

        //=> Row content
        doc
            .font('Courier')
            .fontSize(9)
            .fillColor('#000000')
            .text(`${itemNum}`, colNum, rowY + 4)
            .text(`${item.description}`, colDesc, rowY + 4, { width: colQty - colDesc - 10 })
            .text(`${item.quantity}`, colQty, rowY + 4);

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

    //=> Table bottom border (thicker)
    doc
        .moveTo(contentLeft, doc.y)
        .lineTo(contentRight, doc.y)
        .lineWidth(1)
        .stroke('#999999');

    //=> Total items count
    doc
        .moveDown(0.5)
        .font('Courier-Bold')
        .fontSize(9)
        .text(`Total items: ${payload.items.length}`, contentLeft, doc.y, {
            align: 'right',
            width: contentWidth,
        });

    //==========================================================
    //=> NOTES (if any)
    //==========================================================
    if (payload.notes && payload.notes.trim() !== '') {
        doc.moveDown();
        if (doc.y > 640) {
            doc.addPage();
            doc.y = 50;
        }

        const notesBarY = doc.y;
        doc.rect(contentLeft, notesBarY, contentWidth, 16).fill('#444444');
        doc
            .font('Courier-Bold')
            .fontSize(9)
            .fillColor('#FFFFFF')
            .text('  NOTAS', contentLeft, notesBarY + 4, {
                width: contentWidth,
            })
            .fillColor('#000000');

        doc.y = notesBarY + 22;
        doc
            .font('Courier')
            .fontSize(9)
            .text(`${payload.notes}`, contentLeft, doc.y, {
                align: 'left',
                width: contentWidth,
            });
    }

    //==========================================================
    //=> INJECT FOOTER ON ALL PAGES
    //==========================================================
    const range = doc.bufferedPageRange();
    for (let i = range.start; i < range.start + range.count; i++) {
        doc.switchToPage(i);

        //=> Bottom line
        doc
            .moveTo(contentLeft, 710)
            .lineTo(contentRight, 710)
            .lineWidth(0.5)
            .stroke('#999999');

        //=> Footer text
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
