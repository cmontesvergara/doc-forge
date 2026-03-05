/* eslint-disable @typescript-eslint/no-var-requires */
import { Injectable } from '@nestjs/common';
import path from 'path';
import crypto from 'crypto-js';
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

  private readonly UNIDADES = [
    '', 'UN', 'DOS', 'TRES', 'CUATRO', 'CINCO',
    'SEIS', 'SIETE', 'OCHO', 'NUEVE', 'DIEZ',
    'ONCE', 'DOCE', 'TRECE', 'CATORCE', 'QUINCE',
    'DIECISEIS', 'DIECISIETE', 'DIECIOCHO', 'DIECINUEVE', 'VEINTE',
    'VEINTIUN', 'VEINTIDOS', 'VEINTITRES', 'VEINTICUATRO', 'VEINTICINCO',
    'VEINTISEIS', 'VEINTISIETE', 'VEINTIOCHO', 'VEINTINUEVE',
  ];

  private readonly DECENAS = [
    '', '', '', 'TREINTA', 'CUARENTA', 'CINCUENTA',
    'SESENTA', 'SETENTA', 'OCHENTA', 'NOVENTA',
  ];

  private readonly CENTENAS = [
    '', 'CIENTO', 'DOSCIENTOS', 'TRESCIENTOS', 'CUATROCIENTOS', 'QUINIENTOS',
    'SEISCIENTOS', 'SETECIENTOS', 'OCHOCIENTOS', 'NOVECIENTOS',
  ];

  private convertirGrupo(n: number): string {
    if (n === 0) return '';
    if (n === 100) return 'CIEN';

    let resultado = '';
    const centena = Math.floor(n / 100);
    const resto = n % 100;

    if (centena > 0) {
      resultado = this.CENTENAS[centena];
      if (resto > 0) resultado += ' ';
    }

    if (resto > 0) {
      if (resto < 30) {
        resultado += this.UNIDADES[resto];
      } else {
        const decena = Math.floor(resto / 10);
        const unidad = resto % 10;
        resultado += this.DECENAS[decena];
        if (unidad > 0) {
          resultado += ' Y ' + this.UNIDADES[unidad];
        }
      }
    }

    return resultado;
  }

  getAmountInLetters(amount: number): string {
    if (amount === 0) return 'CERO';
    if (isNaN(amount) || !isFinite(amount)) return 'CERO';

    amount = Math.floor(Math.abs(amount));

    if (amount === 0) return 'CERO';

    const billones = Math.floor(amount / 1000000000);
    const millones = Math.floor((amount % 1000000000) / 1000000);
    const miles = Math.floor((amount % 1000000) / 1000);
    const unidades = amount % 1000;

    let resultado = '';

    if (billones > 0) {
      if (billones === 1) {
        resultado += 'MIL';
      } else {
        resultado += this.convertirGrupo(billones) + ' MIL';
      }
      resultado += ' MILLONES';
    }

    if (millones > 0) {
      if (millones === 1 && billones === 0) {
        resultado += 'UN MILLON';
      } else if (billones > 0) {
        // Already said MILLONES from billones
        resultado = resultado.replace(' MILLONES', '');
        resultado += ' ' + this.convertirGrupo(millones) + ' MILLONES';
      } else {
        resultado += this.convertirGrupo(millones) + ' MILLONES';
      }
    }

    if (miles > 0) {
      if (resultado) resultado += ' ';
      if (miles === 1) {
        resultado += 'MIL';
      } else {
        resultado += this.convertirGrupo(miles) + ' MIL';
      }
    }

    if (unidades > 0) {
      if (resultado) resultado += ' ';
      resultado += this.convertirGrupo(unidades);
    }

    return resultado.trim();
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

  Encrypt(word: string) {
    const encJson = crypto.AES.encrypt(
      JSON.stringify(word),
      process.env.CRYPTO_KEY,
    ).toString();
    const encData = crypto.enc.Base64.stringify(crypto.enc.Utf8.parse(encJson));
    return encData;
  }

  Decrypt(word: string) {
    const decData = crypto.enc.Base64.parse(word).toString(crypto.enc.Utf8);
    const bytes = crypto.AES.decrypt(decData, process.env.CRYPTO_KEY).toString(
      crypto.enc.Utf8,
    );
    return JSON.parse(bytes);
  }
}
