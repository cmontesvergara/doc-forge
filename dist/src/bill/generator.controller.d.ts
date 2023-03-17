import { createDocumentDTO } from './dtos/createDocument.dto';
import { GeneratorService } from './generator.service';
export declare class GeneratorController {
    private generatorService;
    constructor(generatorService: GeneratorService);
    invoiceIndex(body: createDocumentDTO, res: any): Promise<void>;
}
