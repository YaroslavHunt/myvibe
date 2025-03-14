import { DatabaseModule } from '@/database/database.module';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { S3bucketModule } from '@/libs/storage/s3bucket/s3bucket.module';
import { UserModule } from '@/modules/user/user.module';

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true
		}),
		DatabaseModule,
		S3bucketModule,
		UserModule,
	]
})
export class AppModule {
}
