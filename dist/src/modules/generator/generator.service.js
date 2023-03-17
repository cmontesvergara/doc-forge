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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GeneratorService = void 0;
const common_1 = require("@nestjs/common");
const util_service_1 = require("../../shared/services/util/util.service");
const templates_1 = __importDefault(require("../../shared/templates"));
const fs = require('fs');
let GeneratorService = class GeneratorService {
    constructor(utilService) {
        this.utilService = utilService;
    }
    async generatePdf(templateId, payload) {
        payload.amountInLetters = await this.utilService.getAmountInLetters(Number.parseInt(payload.amount.replace('.', '')));
        const pdfBuffer = await new Promise((resolve, reject) => {
            let writerStream;
            try {
                const doc = (0, templates_1.default)(templateId, payload);
                this.utilService.validateFolderCreation(this.utilService.billPathFolder());
                const file = this.utilService.billPathFile(payload.documentId);
                doc.pipe((writerStream = fs.createWriteStream(file.path)));
                doc.end();
                writerStream.on('finish', async () => {
                    resolve(file);
                });
            }
            catch (error) {
                reject(error);
            }
        });
        return pdfBuffer;
    }
};
GeneratorService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [util_service_1.UtilService])
], GeneratorService);
exports.GeneratorService = GeneratorService;
//# sourceMappingURL=generator.service.js.map