import { CallHandler, ExecutionContext, Injectable, NestInterceptor, Logger } from '@nestjs/common';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
	private readonly logger = new Logger();

	intercept(context: ExecutionContext, next: CallHandler) {
		const request = context.switchToHttp().getRequest();
		const { method, url } = request;
		const ctx = context.getClass()?.name || 'Unknown';


		this.logger.log(`Request: ${method} ${url}`, ctx);

		const now = Date.now();
		return next.handle().pipe(
			tap(() => {
				this.logger.log(`Response: ${method} ${url} - ${Date.now() - now}ms`, ctx);
			}),
		);
	}
}
