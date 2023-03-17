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
exports.GeneratorController = void 0;
const common_1 = require("@nestjs/common");
const createDocument_dto_1 = require("./dtos/createDocument.dto");
const generator_service_1 = require("./generator.service");
const fs = require('fs');
let GeneratorController = class GeneratorController {
    constructor(generatorService) {
        this.generatorService = generatorService;
    }
    async invoiceIndex(body, res) {
        try {
            const file = await this.generatorService.generatePdf(body.templateId, body.documentData);
            res.set({
                'Content-Type': 'application/pdf',
            });
            res.status(200).download(file.path, `${file.name}`);
            setTimeout(() => {
                if (fs.existsSync(file.path)) {
                    fs.unlinkSync(file.path);
                }
            }, 20000);
        }
        catch (error) {
            res.status(400).send(error.message);
        }
    }
};
__decorate([
    (0, common_1.Post)('pdf'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [createDocument_dto_1.createDocumentDTO, Object]),
    __metadata("design:returntype", Promise)
], GeneratorController.prototype, "invoiceIndex", null);
GeneratorController = __decorate([
    (0, common_1.Controller)('api/generate'),
    __metadata("design:paramtypes", [generator_service_1.GeneratorService])
], GeneratorController);
exports.GeneratorController = GeneratorController;
//# sourceMappingURL=generator.controller.js.map