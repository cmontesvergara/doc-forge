import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { GeneratorController } from './modules/generator/generator.controller';
import { GeneratorService } from './modules/generator/generator.service';
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
  controllers: [AppController, GeneratorController],
  providers: [AppService, GeneratorService, UtilService],
})
export class AppModule {}
