export declare class UtilService {
    validateFolderCreation(path: string): boolean;
    generatePathFile(pathFolder: string, fileName: string, nameFlat?: string, extension?: string | 'pdf'): {
        path: string;
        name: string;
    };
    generatePathFolder(...names: string[]): string;
    getAmountInLetters(amount: number): Promise<any>;
    billPathFolder(): string;
    billPathFile(nameFlat?: string): {
        path: string;
        name: string;
    };
    Encrypt(word: string): any;
    Decrypt(word: string): any;
}
