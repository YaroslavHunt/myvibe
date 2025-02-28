import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { UserController } from '@/modules/user/user.controller';

import User from './model/user.model';
import { UserService } from './user.service';
import Account from '@/modules/auth/model/account.model';

@Module({
  imports: [
    SequelizeModule.forFeature([User, Account]),
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService]
})
export class UserModule {}