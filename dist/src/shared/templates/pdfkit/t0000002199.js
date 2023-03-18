"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.t0000002199 = void 0;
const PDFDocument = require('pdfkit');
function t0000002199(payload) {
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
        .font('Courier-Bold')
        .fontSize(18)
        .text('RECIBO DE PAGO', { align: 'center' });
    doc
        .moveDown()
        .moveDown()
        .font('Courier')
        .fontSize(16)
        .text(`${payload.client.name}`, {
        align: 'center',
    });
    doc
        .font('Courier')
        .fontSize(12)
        .text(`${payload.client.docType}: `, { align: 'center' });
    doc
        .font('Courier')
        .fontSize(14)
        .text(`${payload.client.docNumber} `, { align: 'center' })
        .font('Courier')
        .fontSize(16);
    doc
        .moveDown()
        .moveDown()
        .fontSize(12)
        .text('pago la cantidad de:', { align: 'center' });
    doc
        .moveDown()
        .moveDown()
        .font('Courier-Bold')
        .fontSize(22)
        .text(`$${payload.amount}`, {
        align: 'center',
    });
    doc.font('Courier').fontSize(20).text(`${payload.amountInLetters} PESOS`, {
        align: 'center',
    });
    doc.moveDown().fontSize(12).text('a:', { align: 'center' });
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
        .text('por concepto de:', { align: 'center' })
        .moveDown()
        .moveDown();
    for (const i of payload.items) {
        doc
            .fontSize(12)
            .text(`_________________________________________________________________`, {
            align: 'left',
        })
            .moveDown()
            .text(`* ${i.description}`, { align: 'left' });
    }
    doc
        .text(`_________________________________________________________________`, {
        align: 'left',
    })
        .moveDown()
        .moveDown()
        .moveDown()
        .fontSize(12)
        .text('Firma de quien recibe:', { align: 'left' });
    doc
        .moveDown()
        .image('public/img/firma_carlosm.png', {
        scale: 0.3,
        align: 'left ',
    })
        .moveDown()
        .moveDown()
        .moveDown()
        .font('Courier')
        .fontSize(10)
        .text('Valide la autenticidad de este documento en:', { align: 'left' })
        .fontSize(9)
        .font('Courier-Bold')
        .text('https://mountainsoft.co/validate-document', {
        align: 'left',
        link: 'https://mountainsoft.co',
    });
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
exports.t0000002199 = t0000002199;
//# sourceMappingURL=t0000002199.js.map