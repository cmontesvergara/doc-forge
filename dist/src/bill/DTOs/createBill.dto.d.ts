declare class client {
    name: string;
    docType: string;
    docNumber: string;
}
declare class item {
    item: string;
    description: string;
    quantity: number;
    amount: number;
}
export declare class createInvoiceDTO {
    templateId: string;
    date: string;
    documentId: string;
    amount: string;
    signature: string;
    client: client;
    creditor: client;
    items: item[];
}
export {};
