import { createInvoiceDTO } from './DTOs/createBill.dto';
import { BillService } from './bill.service';
export declare class InvoiceController {
    private invoiceService;
    constructor(invoiceService: BillService);
    invoiceIndex(invoice: createInvoiceDTO, res: any): Promise<void>;
}
