import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { HashService } from './hash.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas/user.schema';
import { AuthService } from '../auth/auth.service';
import { TwoFactorAuthModule } from 'src/two-factor/verification.module';
import { EmailModule } from './email.module';

@Module({
  imports: [
    EmailModule,
    TwoFactorAuthModule,
    MongooseModule.forFeature([{
      name: User.name,
      schema: UserSchema
    }])
  ],
  controllers: [UserController],
  providers: [
    UserService,
    HashService,
    AuthService
  ],
  exports: [UserService, MongooseModule.forFeature([{ name: User.name, schema: UserSchema }])], 
})
export class UserModule { }
