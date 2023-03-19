"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UtilService = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = __importDefault(require("axios"));
const path_1 = __importDefault(require("path"));
const crypto_js_1 = __importDefault(require("crypto-js"));
const fs = require('fs');
let UtilService = class UtilService {
    validateFolderCreation(path) {
        if (!fs.existsSync(path)) {
            fs.mkdirSync(path, { recursive: true });
            return true;
        }
        return false;
    }
    generatePathFile(pathFolder, fileName, nameFlat, extension) {
        const userFileName = `${fileName}-${nameFlat}.${extension}`;
        const join = path_1.default.join(pathFolder, `${userFileName}`);
        return { path: join, name: userFileName };
    }
    generatePathFolder(...names) {
        return path_1.default.join(__dirname, '..', '..', '..', '..', ...names);
    }
    async getAmountInLetters(amount) {
        const response = await axios_1.default.get(`http://numerosaletras.com/Home/ConvertirNumerosALetras?numero=${amount}`);
        return response.data;
    }
    billPathFolder() {
        return this.generatePathFolder('pdfs', 'bills');
    }
    billPathFile(nameFlat) {
        return this.generatePathFile(this.billPathFolder(), 'bill', nameFlat, 'pdf');
    }
    Encrypt(word) {
        const encJson = crypto_js_1.default.AES.encrypt(JSON.stringify(word), process.env.CRYPTO_KEY).toString();
        const encData = crypto_js_1.default.enc.Base64.stringify(crypto_js_1.default.enc.Utf8.parse(encJson));
        return encData;
    }
    Decrypt(word) {
        const decData = crypto_js_1.default.enc.Base64.parse(word).toString(crypto_js_1.default.enc.Utf8);
        const bytes = crypto_js_1.default.AES.decrypt(decData, process.env.CRYPTO_KEY).toString(crypto_js_1.default.enc.Utf8);
        return JSON.parse(bytes);
    }
};
UtilService = __decorate([
    (0, common_1.Injectable)()
], UtilService);
exports.UtilService = UtilService;
//# sourceMappingURL=util.service.js.map