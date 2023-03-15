"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvoiceController = void 0;
const common_1 = require("@nestjs/common");
const createBill_dto_1 = require("./DTOs/createBill.dto");
const bill_service_1 = require("./bill.service");
const fs = require('fs');
let InvoiceController = class InvoiceController {
    constructor(invoiceService) {
        this.invoiceService = invoiceService;
    }
    async invoiceIndex(invoice, res) {
        try {
            const file = await this.invoiceService.generateBill(invoice);
            res.set({
                'Content-Type': 'application/pdf',
            });
            res.status(200).download(file.path, `${file.name}`);
            setTimeout(() => {
                fs.unlinkSync(file.path);
            }, 20000);
        }
        catch (error) {
            res.status(400).send(error.message);
        }
    }
};
__decorate([
    (0, common_1.Get)('pdf/down'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [createBill_dto_1.createInvoiceDTO, Object]),
    __metadata("design:returntype", Promise)
], InvoiceController.prototype, "invoiceIndex", null);
InvoiceController = __decorate([
    (0, common_1.Controller)('invoice'),
    __metadata("design:paramtypes", [bill_service_1.BillService])
], InvoiceController);
exports.InvoiceController = InvoiceController;
//# sourceMappingURL=bill.controller.js.map