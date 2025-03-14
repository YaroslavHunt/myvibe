import { ExceptionFilter, Catch, ArgumentsHost, HttpException, Logger } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
	private readonly logger = new Logger(HttpExceptionFilter.name);

	catch(exception: unknown, host: ArgumentsHost) {
		const ctx = host.switchToHttp();
		const response = ctx.getResponse<Response>();
		const request = ctx.getRequest<Request>();

		const status = exception instanceof HttpException ? exception.getStatus() : 500;
		const exceptionResponse = exception instanceof HttpException ? exception.getResponse() : 'Internal Server Error';

		response.status(status).json({
			statusCode: status,
			error: exception instanceof HttpException ? (exceptionResponse as any).error || null : 'Internal Server Error',
			message: exception instanceof HttpException ? (exceptionResponse as any).message || exceptionResponse : exceptionResponse,
			timestamp: new Date().toISOString(),
			path: request.url,
		});

		this.logger.error(`${status} - ${(exceptionResponse as any).error || null} ${request.url} ${(exceptionResponse as any).message || exceptionResponse}`);
	}
}
