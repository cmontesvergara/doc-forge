import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
// import path from 'path';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  // app.useStaticAssets(path.join(__dirname, '/../public'));
  await app.listen(process.env.APP_PORT);
}
bootstrap();
