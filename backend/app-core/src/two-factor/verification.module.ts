import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TwoFactorAuthService } from './verification.service';
import { TwoFactorAuthController } from './verification.controller';
import { EmailService } from '../user/email.service';
import { TokenSchema } from './schemas/verification.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Token', schema: TokenSchema }]), 
  ],
  controllers: [TwoFactorAuthController],
  providers: [TwoFactorAuthService, EmailService],
  exports: [TwoFactorAuthService], 
})
export class TwoFactorAuthModule {}
