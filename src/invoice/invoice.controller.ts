/* eslint-disable @typescript-eslint/no-var-requires */
import { Controller, Get, Body, Res } from '@nestjs/common';
import { createInvoiceDTO } from './DTOs/createInvoice.dto';
import { InvoiceService } from './invoice.service';
const fs = require('fs');
@Controller('invoice')
export class InvoiceController {
  constructor(private invoiceService: InvoiceService) {}

  @Get('pdf/down')
  async invoiceIndex(
    @Body() invoice: createInvoiceDTO,
    @Res() res,
  ): Promise<void> {
    const invoic = {
      templateName: 'mountainsoft',
      date: '21/04/2023',
      documentId: '1000012345',
      amount: '230.000',
      signature: 'sdfsdfdsfsdfs7fsd97fs7f9743249232893fh34h09g248h48g2h40t28',
      client: {
        name: 'CENTRO COLOR SOLUCIONES IMPRESAS',
        nit: '1234.445.555',
        address: '1234 Main Street',
        city: 'San Francisco',
        state: 'CA',
        country: 'US',
        postal_code: 94111,
      },
      creditor: {
        name: 'CARLOS ALFREDO MONTES VERGARA',
        nit: '1.067.961.864',
        address: '1234 Main Street',
        city: 'San Francisco',
        state: 'CA',
        country: 'US',
        postal_code: 94111,
      },
      items: [
        {
          item: 'TC 100',
          description:
            'Soporte y mantenimiento de software periodo 15/03/2023 - 15/04/2023.',
          quantity: 2,
          amount: 6000,
        },
        {
          item: 'USB_EXT',
          description: 'USB Cable Extender',
          quantity: 1,
          amount: 2000,
        },
      ],
      subtotal: 8000,
      paid: 0,
      invoice_nr: 1234,
    };
    const file = await this.invoiceService.generateBill(invoic);
    res.set({
      'Content-Type': 'application/pdf',
    });

    res.status(200).download(file.path, `${file.name}`);
    setTimeout(() => {
      fs.unlinkSync(file.path);
    }, 20000);
  }
}
