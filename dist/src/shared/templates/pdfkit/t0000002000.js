"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.t0000002000 = void 0;
const PDFDocument = require('pdfkit');
function t0000002000(payload) {
    const setting = {
        size: 'LETTER',
        font: 'Courier',
        bufferPages: true,
    };
    const doc = new PDFDocument(setting);
    doc.image('public/img/header.png', 0, 15, {
        fit: [610, 600],
        align: 'center',
    });
    doc.image('public/img/footer.png', 0, 700, {
        fit: [610, 600],
        align: 'center ',
    });
    doc
        .moveUp()
        .font('Courier-Bold')
        .fontSize(14)
        .text(`#${payload.documentId}`, { align: 'right' });
    doc
        .font('Courier-Bold')
        .fontSize(11)
        .text(`${payload.date}`, { align: 'right' })
        .moveDown();
    doc
        .moveDown()
        .moveDown()
        .font('Courier')
        .fontSize(16)
        .text(`${payload.creditor.name}`, {
        align: 'center',
    })
        .font('Courier')
        .fontSize(12)
        .text(`${payload.creditor.docType}: `, { align: 'center' })
        .font('Courier')
        .fontSize(14)
        .text(`${payload.creditor.docNumber} `, { align: 'center' })
        .font('Courier')
        .fontSize(16);
    doc
        .moveDown()
        .moveDown()
        .fontSize(12)
        .text('Certifica que:', { align: 'center' })
        .moveDown()
        .moveDown();
    for (const i of payload.items) {
        doc
            .fontSize(12)
            .moveDown()
            .text(`* ${i.description}`, { align: 'justify' });
    }
    doc
        .moveDown()
        .moveDown()
        .moveDown()
        .fontSize(12)
        .text('Atentamente:', { align: 'left' });
    doc
        .moveDown()
        .moveDown()
        .moveDown()
        .moveDown()
        .moveDown()
        .image('public/img/firma_carlosm.png', {
        scale: 0.3,
        align: 'left ',
    })
        .moveDown()
        .moveDown()
        .moveDown()
        .font('Courier')
        .fontSize(10);
    const range = doc.bufferedPageRange();
    for (let i = range.start; i < range.start + range.count; i++) {
        doc.switchToPage(i);
        if (i > 0) {
            doc.image('public/img/footer.png', 0, 700, {
                fit: [610, 600],
                align: 'center ',
            });
        }
        doc
            .font('Courier')
            .fontSize(12)
            .text(`Page ${i + 1} of ${range.count}`, 20, 10)
            .fontSize(10)
            .text(`Firma: ${payload.signature}`, 20, 10, { align: 'right' });
    }
    return doc;
}
exports.t0000002000 = t0000002000;
//# sourceMappingURL=t0000002000.js.map