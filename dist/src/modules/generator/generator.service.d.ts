import { UtilService } from 'src/shared/services/util/util.service';
export declare class GeneratorService {
    private readonly utilService;
    constructor(utilService: UtilService);
    generatePdf(templateId: any, payload: any): Promise<any>;
}
