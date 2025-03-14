import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from '@/app/app.module';
import { setupSwagger } from '@/app/config/swagger.config';
import { LoggingInterceptor } from '@/libs/logger/logging.interceptor';
import { HttpExceptionFilter } from './libs/filters/http-exception.filter';


async function bootstrap() {
	const app = await NestFactory.create(AppModule, { logger: new Logger() });
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

	// Logger Interceptor
	app.useGlobalInterceptors(new LoggingInterceptor())

	// Global Exception Filter
	app.useGlobalFilters(new HttpExceptionFilter());

	// API docs
	app.setGlobalPrefix(config.getOrThrow<string>('APP_GLOBAL_PREFIX'));
	setupSwagger(app);

	await app.listen(port);
}

bootstrap();