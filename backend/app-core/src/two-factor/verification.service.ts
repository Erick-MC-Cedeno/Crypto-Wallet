import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { EmailService } from '../user/email.service';
import { Token } from './schemas/verification.schema';

@Injectable()
export class TwoFactorAuthService {
  private readonly TOKEN_EXPIRY_MS = 60000; // 1 minuto

  constructor(
    private readonly emailService: EmailService,
    @InjectModel('Token') private readonly tokenModel: Model<Token>,
  ) {}

  async sendToken(toEmail: string): Promise<{ message: string }> {
    return this.createAndSendToken(toEmail);
  }

  async verifyToken(toEmail: string, token: string): Promise<{ isValid: boolean; message: string }> {
    try {
      const tokenEntry = await this.tokenModel.findOne({ token, email: toEmail }).exec();
      if (!tokenEntry) {
        return { isValid: false, message: 'Token incorrecto o correo electrónico incorrecto' };
      }

      const currentTime = Date.now();
      const tokenAge = currentTime - tokenEntry.timestamp;
      if (tokenAge > this.TOKEN_EXPIRY_MS) {
        await this.tokenModel.deleteOne({ token }).exec();
        return { isValid: false, message: 'Token expirado' };
      }

      if (tokenEntry.isValid) {
        return { isValid: false, message: 'Token ya validado' };
      }

      tokenEntry.isValid = true;
      await tokenEntry.save();
      return { isValid: true, message: 'Token validado correctamente' };
    } catch (error) {
      console.error('Error en la verificación del token', error);
      throw new InternalServerErrorException('Error en la verificación del token.');
    }
  }

  async resendToken(toEmail: string): Promise<{ message: string }> {
    return this.createAndSendToken(toEmail);
  }

  private async createAndSendToken(toEmail: string): Promise<{ message: string }> {
    try {
      const token = await this.emailService.generateToken(); 
      const timestamp = Date.now();
      await this.tokenModel.create({
        email: toEmail,
        token,
        timestamp,
        isValid: false,
      });
      await this.emailService.sendTokenLogin(toEmail, token);
      return { message: `Token enviado a ${toEmail}` };
    } catch (error) {
      throw new InternalServerErrorException('Error al enviar el token.');
    }
  }
}
