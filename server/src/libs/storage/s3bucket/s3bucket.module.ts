import { Module } from '@nestjs/common';
import { S3bucketService } from './s3bucket.service';

@Module({
  providers: [S3bucketService],
  exports: [S3bucketService]
})
export class S3bucketModule {}
