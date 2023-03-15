import { UtilService } from 'src/shared/services/util/util.service';
export declare class BillService {
    private readonly utilService;
    constructor(utilService: UtilService);
    generateBill(payload: any): Promise<any>;
}
