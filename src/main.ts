import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { configureApp, setupSwagger } from './bootstrap';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  configureApp(app);
  setupSwagger(app);

  const port = process.env.PORT ? Number(process.env.PORT) : 3000;
  await app.listen(port);
}

bootstrap();
