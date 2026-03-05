/* eslint-disable @typescript-eslint/no-var-requires */
import { Controller, Body, Res, Post, Get, Param } from '@nestjs/common';
import { UtilService } from 'src/shared/services/util/util.service';
import { createDocumentDTO } from './dtos/createDocument.dto';
import { GeneratorService } from './generator.service';
const fs = require('fs');
@Controller('api/generate')
export class GeneratorController {
  constructor(
    private generatorService: GeneratorService,
    private utilService: UtilService,
  ) { }

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
      console.log(file);
      res.set({
        'Content-Type': 'application/pdf',
      });

      res.status(200).sendFile(file.path, `${file.name}`);
      setTimeout(() => {
        if (fs.existsSync(file.path)) {
          fs.unlinkSync(file.path);
        }
      }, 2000);
    } catch (error) {
      res.status(400).send(error.message);
    }
  }
  @Post('link')
  async invoiceLink(
    @Body() body: createDocumentDTO,
    @Res() res,
  ): Promise<void> {
    try {
      if (!body.docTimeOut) {
        body.docTimeOut = 200000;
      }

      const file = await this.generatorService.generatePdf(
        body.templateId,
        body.documentData,
      );

      res.status(200).json({
        pathFile: this.utilService.Encrypt(file.path),
        documentLife: `${body.docTimeOut}ms`,
      });

      setTimeout(() => {
        if (fs.existsSync(file.path)) {
          fs.unlinkSync(file.path);
        }
      }, body.docTimeOut);
    } catch (error) {
      res.status(400).send(error.message);
    }
  }
  @Get('download/:path')
  async invoiceDown(
    @Body() body: any,
    @Res() res,
    @Param('path') path,
  ): Promise<void> {
    try {
      const pathFile = this.utilService.Decrypt(path);
      if (!fs.existsSync(pathFile)) {
        res.status(404).send('File Not Found');
      } else {
        res.set({
          'Content-Type': 'application/pdf',
        });
        res.status(200).sendFile(pathFile);
      }
    } catch (error) {
      res.status(400).send(error.message);
    }
  }
}
