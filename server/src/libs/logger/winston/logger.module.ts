import { Global, Module } from '@nestjs/common';

import { LoggingInterceptor } from '@/libs/logger/winston/logger-interceptor.service';

import { WinstonLoggerService } from './logger.service';

@Global()
@Module({
  providers: [WinstonLoggerService, LoggingInterceptor],
  exports: [WinstonLoggerService, LoggingInterceptor]
})
export class WinstonLoggerModule {}