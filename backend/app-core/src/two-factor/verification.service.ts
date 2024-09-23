import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { EmailService } from '../user/email.service';
import { Token } from './schemas/verification.schema';

@Injectable()
export class TwoFactorAuthService {
  private readonly TOKEN_EXPIRY_MS = 300000; 

  constructor(
    private readonly emailService: EmailService,
    @InjectModel('Token') private readonly tokenModel: Model<Token>,
  ) {}

  async sendToken(userId: string, toEmail: string): Promise<{ message: string }> {
    try {
      const token = await this.emailService.generateToken(userId);
      const timestamp = Date.now();
      await this.tokenModel.create({
        userId,
        email: toEmail, 
        token,
        timestamp,
        isValid: false,
      });
      await this.emailService.sendTokenLogin(userId, toEmail, token);
      return { message: `Token sent to email ${toEmail}` };
    } catch (error) {
      throw new InternalServerErrorException('Failed to send token.');
    }
  }

  
  async verifyToken(userId: string, token: string): Promise<{ isValid: boolean; message: string }> {
    try {
      const tokenEntry = await this.tokenModel.findOne({ token, userId }).exec();
      if (!tokenEntry) {
        return { isValid: false, message: 'Token incorrecto o userId incorrecto' };
      }
      const currentTime = Date.now();
      const tokenAge = currentTime - tokenEntry.timestamp;


      if (tokenAge > this.TOKEN_EXPIRY_MS) {
        await this.tokenModel.deleteOne({ token }).exec();
        return { isValid: false, message: 'Token expired' };
      }
      if (tokenEntry.isValid) {
        return { isValid: false, message: 'Token already validated' };
      }
      tokenEntry.isValid = true;
      await tokenEntry.save();
      return { isValid: true, message: 'Token validated successfully' };
    } catch (error) {
      console.error('Token verification failed', error);
      throw new InternalServerErrorException('Token verification failed.');
    }
  }
}
