import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { InvoiceController } from './bill/bill.controller';
import { BillService } from './bill/bill.service';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { UtilService } from './shared/services/util/util.service';
@Module({
  imports: [
    ConfigModule.forRoot(),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    }),
  ],
  controllers: [AppController, InvoiceController],
  providers: [AppService, BillService, UtilService],
})
export class AppModule {}
