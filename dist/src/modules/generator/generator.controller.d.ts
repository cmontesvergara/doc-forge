import { UtilService } from 'src/shared/services/util/util.service';
import { createDocumentDTO } from './dtos/createDocument.dto';
import { GeneratorService } from './generator.service';
export declare class GeneratorController {
    private generatorService;
    private utilService;
    constructor(generatorService: GeneratorService, utilService: UtilService);
    invoiceIndex(body: createDocumentDTO, res: any): Promise<void>;
    invoiceLink(body: createDocumentDTO, res: any): Promise<void>;
    invoiceDown(body: any, res: any, path: any): Promise<void>;
}
