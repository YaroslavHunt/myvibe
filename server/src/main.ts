import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from '@/app/app.module';
import { setupSwagger } from '@/config/swagger.config';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);
  const port = config.getOrThrow<number>('APP_PORT');

  // Pipes
  app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true
      })
  );

  // API docs
  app.setGlobalPrefix(config.getOrThrow<string>('APP_GLOBAL_PREFIX'));
  setupSwagger(app);

  await app.listen(port);
}

bootstrap()