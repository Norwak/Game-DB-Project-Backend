import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DeleteImageOnErrorFilter } from './filters/delete-image-on-error.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
}
bootstrap();
