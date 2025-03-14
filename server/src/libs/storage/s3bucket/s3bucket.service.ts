import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { GetObjectCommand, S3 } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { ConfigService } from '@nestjs/config';


@Injectable()
export class S3bucketService {
	private readonly s3: S3;
	private readonly bucket: string;
	private readonly region: string;

	constructor(
		private readonly configService: ConfigService,
	) {
		this.region = this.configService.getOrThrow<string>('AWS_REGION');
		this.bucket = this.configService.getOrThrow<string>('AWS_BUCKET_NAME');
		this.s3 = new S3({
			region: this.region,
			credentials: {
				accessKeyId: this.configService.getOrThrow<string>('AWS_ACCESS_KEY_ID'),
				secretAccessKey: this.configService.getOrThrow<string>('AWS_SECRET_ACCESS_KEY')
			}
		});
	}

	async getFileUrl(fileName: string): Promise<string | null> {
		try {
			if (this.isPublicBucket()) {
				return `https://${this.bucket}.s3.${this.region}.amazonaws.com/${fileName}`;
			}

			const command = new GetObjectCommand({
				Bucket: this.bucket,
				Key: fileName
			});

			return (
				(await getSignedUrl(this.s3, command, { expiresIn: 3600 })) ||
				null
			);
		} catch (e) {
			throw new InternalServerErrorException(
				'Failed to generate file URL'
			);
		}
	}

	private isPublicBucket(): boolean {
		return this.configService.getOrThrow<boolean>('AWS_IS_BUCKET_PUBLIC') ?? false;
	}
}