/* eslint-disable @typescript-eslint/no-var-requires */
import { Injectable } from '@nestjs/common';
import { UtilService } from 'src/shared/services/util/util.service';
import template from 'src/shared/templates';
const fs = require('fs');
@Injectable()
export class GeneratorService {
  constructor(private readonly utilService: UtilService) { }

  async generatePdf(templateId, payload): Promise<any> {
    payload.amountInLetters = this.utilService.getAmountInLetters(
      Number.parseInt(payload.amount.replace(/\./g, '')),
    );
    const pdfBuffer = await new Promise((resolve, reject) => {
      let writerStream;
      //=> FETCH TEMPLATE
      try {
        const doc = template(templateId, payload);

        //=> CREATION OF FILE IN STORAGE
        this.utilService.validateFolderCreation(
          this.utilService.billPathFolder(),
        );
        const file = this.utilService.billPathFile(payload.documentId);
        doc.pipe((writerStream = fs.createWriteStream(file.path)));
        doc.end();
        writerStream.on('finish', async () => {
          resolve(file);
        });
      } catch (error) {
        reject(error);
      }
    });
    return pdfBuffer;
  }
}
