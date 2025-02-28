import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from '@/app/app.module';
import { setupSwagger } from '@/config/swagger.config';
import { WinstonLoggerService } from '@/libs/logger/winston/logger.service';
import { LoggingInterceptor } from './libs/logger/winston/logger-interceptor.service';
import { GlobalExceptionFilter } from '@/libs/filters/error/global-exception.filter';


async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	const config = app.get(ConfigService);
	const logger = app.get(WinstonLoggerService);
	const port = config.getOrThrow<number>('APP_PORT');

	// Pipes
	app.useGlobalPipes(
		new ValidationPipe({
			whitelist: true,
			forbidNonWhitelisted: true,
			transform: true
		})
	);

	// Logger
	app.useLogger(logger);
	app.useGlobalInterceptors(new LoggingInterceptor(logger));
	app.useGlobalFilters(new GlobalExceptionFilter(logger));

	// API docs
	app.setGlobalPrefix(config.getOrThrow<string>('APP_GLOBAL_PREFIX'));
	setupSwagger(app);

	await app.listen(port);
}

bootstrap();