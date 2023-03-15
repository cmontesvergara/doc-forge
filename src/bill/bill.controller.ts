/* eslint-disable @typescript-eslint/no-var-requires */
import { Controller, Get, Body, Res } from '@nestjs/common';
import { createInvoiceDTO } from './DTOs/createBill.dto';
import { BillService } from './bill.service';
const fs = require('fs');
@Controller('invoice')
export class InvoiceController {
  constructor(private invoiceService: BillService) {}

  @Get('pdf/down')
  async invoiceIndex(
    @Body() invoice: createInvoiceDTO,
    @Res() res,
  ): Promise<void> {
    try {
      const file = await this.invoiceService.generateBill(invoice);
      res.set({
        'Content-Type': 'application/pdf',
      });

      res.status(200).download(file.path, `${file.name}`);
      setTimeout(() => {
        fs.unlinkSync(file.path);
      }, 20000);
    } catch (error) {
      res.status(400).send(error.message);
    }
  }
}
