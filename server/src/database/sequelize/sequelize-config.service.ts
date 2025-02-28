import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
	SequelizeModuleOptions,
	SequelizeOptionsFactory
} from '@nestjs/sequelize';
import { Dialect } from 'sequelize';

@Injectable()
export class SequelizeConfigService implements SequelizeOptionsFactory {
	constructor(
		private readonly configService: ConfigService
	) {
	}

	createSequelizeOptions(): SequelizeModuleOptions {
		const mode = this.configService.getOrThrow<string>('NODE_ENV');

		return {
			dialect: this.configService.getOrThrow<Dialect>('DB_DIALECT'),
			host: this.configService.getOrThrow<string>('DB_HOST'),
			port: this.configService.getOrThrow<number>('DB_PORT'),
			username: this.configService.getOrThrow<string>('DB_USER'),
			password: this.configService.getOrThrow<string>('DB_PASSWORD'),
			database: this.configService.getOrThrow<string>('DB_NAME'),
			autoLoadModels: true,
			synchronize: mode === 'development',
			logging: mode === 'development',
			timezone: '+00:00',
			dialectOptions: { timezone: 'Etc/UTC' }
		};
	}
}