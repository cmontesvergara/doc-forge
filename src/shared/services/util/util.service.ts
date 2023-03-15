/* eslint-disable @typescript-eslint/no-var-requires */
import { Injectable } from '@nestjs/common';
import axios from 'axios';
import path from 'path';
const fs = require('fs');
@Injectable()
export class UtilService {
  // General Functions
  validateFolderCreation(path: string): boolean {
    if (!fs.existsSync(path)) {
      fs.mkdirSync(path, { recursive: true });
      return true;
    }
    return false;
  }
  generatePathFile(
    pathFolder: string,
    fileName: string,
    nameFlat?: string,
    extension?: string | 'pdf',
  ): { path: string; name: string } {
    const userFileName = `${fileName}-${nameFlat}.${extension}`;
    const join = path.join(pathFolder, `${userFileName}`);

    return { path: join, name: userFileName };
  }
  generatePathFolder(...names: string[]): string {
    return path.join(__dirname, '..', '..', '..', '..', ...names);
  }

  async getAmountInLetters(amount: number) {
    const response = await axios.get(
      `http://numerosaletras.com/Home/ConvertirNumerosALetras?numero=${amount}`,
    );
    return response.data;
  }
  // Especific Functions (for Bills)
  billPathFolder(): string {
    return this.generatePathFolder('pdfs', 'bills');
  }
  billPathFile(nameFlat?: string): { path: string; name: string } {
    return this.generatePathFile(
      this.billPathFolder(),
      'bill',
      nameFlat,
      'pdf',
    );
  }
}
