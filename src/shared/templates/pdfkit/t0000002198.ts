/* eslint-disable @typescript-eslint/no-var-requires */
const PDFDocument = require('pdfkit');

export function t0000002198(payload) {
  const setting = {
    size: 'LETTER',
    font: 'Courier',
    bufferPages: true,
  };
  const doc = new PDFDocument(setting);

  //=> HEADER FOR FIST PAGE
  doc.image('public/img/header.png', 0, 15, {
    fit: [610, 600],
    align: 'center',
  });
  //=> FOOTER FOR FIST PAGE
  doc.image('public/img/footer.png', 0, 700, {
    fit: [610, 600],
    align: 'center ',
  });
  //=> DOCUMENT ID
  doc
    .moveUp()
    .font('Courier-Bold')
    .fontSize(14)
    .text(`#${payload.documentId}`, { align: 'right' });

  //=> DATE

  doc
    .font('Courier-Bold')
    .fontSize(11)
    .text(`${payload.date}`, { align: 'right' })
    .moveDown();
  //=> TITLE
  doc
    .moveDown()
    .moveDown()
    .font('Courier-Bold')
    .fontSize(18)
    .text('CUENTA DE COBRO ', { align: 'center' });

  //=> CLIENT NAME
  doc
    .moveDown()
    .moveDown()
    .font('Courier')
    .fontSize(16)
    .text(`${payload.client.name}`, {
      align: 'center',
    });
  //=> CLIENT TYPE ID
  doc
    .font('Courier')
    .fontSize(12)
    .text(`${payload.client.docType}: `, { align: 'center' });
  //=> CLIENT ID NUMBER
  doc
    .font('Courier')
    .fontSize(14)
    .text(`${payload.client.docNumber} `, { align: 'center' })
    .font('Courier')
    .fontSize(16);
  //=> TEXT AUXILIAR
  doc
    .moveDown()
    .moveDown()
    .fontSize(12)
    .text('debe la cantidad de:', { align: 'center' });
  //=> AMOUNT
  doc
    .moveDown()
    .moveDown()
    .font('Courier-Bold')
    .fontSize(22)
    .text(`$${payload.amount}`, {
      align: 'center',
    });
  //=> AMOUNT IN LETTERS
  doc.font('Courier').fontSize(20).text(`${payload.amountInLetters} PESOS`, {
    align: 'center',
  });
  //=> TEXT AUX
  doc.moveDown().fontSize(12).text('a:', { align: 'center' });
  //=> EXPEDITOR NAME
  doc
    .moveDown()
    .moveDown()
    .font('Courier')
    .fontSize(16)
    .text(`${payload.creditor.name}`, {
      align: 'center',
    })
    //=> EXPEDITOR DOCUMENT TYPE
    .font('Courier')
    .fontSize(12)
    .text(`${payload.creditor.docType}: `, { align: 'center' })
    //=> EXPEDITOR DOCUMENT NUMBER
    .font('Courier')
    .fontSize(14)
    .text(`${payload.creditor.docNumber} `, { align: 'center' })
    .font('Courier')
    .fontSize(16);
  //=> TEXT AUXILIAR
  doc
    .moveDown()
    .moveDown()
    .fontSize(12)
    .text('por concepto de:', { align: 'center' })
    .moveDown()
    .moveDown();
  //=> CONCEPTS LIST
  for (const i of payload.items) {
    doc
      .fontSize(12)
      .text(`_________________________________________________________`, {
        align: 'left',
      })
      .moveDown()
      .text(`* ${i.description}`, { align: 'left' });
  }
  //=> AUXILIAR LINE
  doc
    .text(`_________________________________________________________`, {
      align: 'left',
    })
    .moveDown()
    .moveDown()
    .moveDown()
    //=> AUXILIAR TEXT
    .fontSize(12)
    .text(
      'Cancelar a la mayor brevedad posible a una de las siguientes cuentas bancarias:',
      { align: 'left' },
    );

  //=> INSERT ACCOUNTS IMAGE TABLE
  doc
    .moveDown()
    .image('public/img/table_accounts.png', {
      scale: 0.3,
      align: 'left ',
    })
    .moveDown()
    .moveDown()
    .moveDown()
    //=> FINISH COMMENTS
    .font('Courier')
    .fontSize(10)
    .text('Valide la firma de este documento en:', { align: 'left' })
    .fontSize(9)
    .font('Courier-Bold')
    .text('https://mountainsoft.co/validate-document', {
      align: 'left',
      link: 'https://mountainsoft.co',
    });

  //=> LOOP FOR ALL PAGES
  const range = doc.bufferedPageRange();
  for (let i = range.start; i < range.start + range.count; i++) {
    doc.switchToPage(i);
    //=> ALL PAGES WITHOUT FIRST PAGE
    if (i > 0) {
      //=> INSERT FOOTER IMAGE
      doc.image('public/img/footer.png', 0, 700, {
        fit: [610, 600],
        align: 'center ',
      });
    }
    //=> PAGIANTION ENTRY
    doc
      .font('Courier')
      .fontSize(12)
      .text(`Page ${i + 1} of ${range.count}`, 20, 10)
      //=> INSERT SECURITY SIGNATURE
      .fontSize(10)
      .text(`Firma: ${payload.signature}`, 20, 10, { align: 'right' });
  }
  return doc;
}
