/* eslint-disable @typescript-eslint/no-var-requires */
import { Controller, Body, Res, Post } from '@nestjs/common';
import { createDocumentDTO } from './dtos/createDocument.dto';
import { GeneratorService } from './generator.service';
const fs = require('fs');
@Controller('api/generate')
export class GeneratorController {
  constructor(private generatorService: GeneratorService) {}

  @Post('pdf')
  async invoiceIndex(
    @Body() body: createDocumentDTO,
    @Res() res,
  ): Promise<void> {
    try {
      const file = await this.generatorService.generatePdf(
        body.templateId,
        body.documentData,
      );
      res.set({
        'Content-Type': 'application/pdf',
      });

      res.status(200).download(file.path, `${file.name}`);
      setTimeout(() => {
        if (fs.existsSync(file.path)) {
          fs.unlinkSync(file.path);
        }
      }, 20000);
    } catch (error) {
      res.status(400).send(error.message);
    }
  }
}
