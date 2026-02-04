import { Injectable, InternalServerErrorException, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { EmailService } from '../user/email.service';
import { Token } from './schemas/verification.schema';
import { HashService } from '../user/hash.service';

@Injectable()
export class TwoFactorAuthService {
  private readonly TOKEN_EXPIRY_MS = 5 * 60 * 1000; // 5 minutos
  private readonly COOLDOWN_MS = 60 * 1000; // 1 minuto entre envíos
  private readonly MAX_ATTEMPTS = 5;

  constructor(
    private readonly emailService: EmailService,
    @InjectModel('Token') private readonly tokenModel: Model<Token>,
    private readonly hashService: HashService,
  ) {}


  //Methods for 2FA token management
  async sendToken(toEmail: string): Promise<{ message: string }> {
    return this.createAndSendToken(toEmail);
  }


  // Verify the token provided by the user
  async verifyToken(toEmail: string, token: string): Promise<{ isValid: boolean; message: string }> {
    try {
      const tokenEntry = await this.tokenModel.findOne({ email: toEmail }).sort({ createdAt: -1 }).exec();
      if (!tokenEntry) {
        return { isValid: false, message: 'Token incorrecto o correo electrónico incorrecto' };
      }

      const currentTime = Date.now();
      const tokenAge = currentTime - tokenEntry.createdAt.getTime();
      if (tokenAge > this.TOKEN_EXPIRY_MS) {
        await this.tokenModel.deleteOne({ _id: tokenEntry._id }).exec();
        return { isValid: false, message: 'Token expirado' };
      }

      if (tokenEntry.isValid) {
        return { isValid: false, message: 'Token ya validado' };
      }

      if (tokenEntry.attempts >= this.MAX_ATTEMPTS) {
        return { isValid: false, message: 'Demasiados intentos. Intenta más tarde.' };
      }

      const isMatch = await this.hashService.comparePassword(token, tokenEntry.tokenHash);
      if (!isMatch) {
        tokenEntry.attempts = (tokenEntry.attempts || 0) + 1;
        await tokenEntry.save();
        return { isValid: false, message: 'Token incorrecto' };
      }

      tokenEntry.isValid = true;
      await tokenEntry.save();
      return { isValid: true, message: 'Token validado correctamente' };
    } catch (error) {
      console.error('Error en la verificación del token', error);
      throw new InternalServerErrorException('Error en la verificación del token.');
    }
  }


  // Resend a new token to the user, enforcing cooldown
  async resendToken(toEmail: string): Promise<{ message: string }> {
    return this.createAndSendToken(toEmail);
  }


  // Internal method to create a new token, save it, and send it via email
  private async createAndSendToken(toEmail: string): Promise<{ message: string }> {
    try {
      const last = await this.tokenModel.findOne({ email: toEmail }).sort({ createdAt: -1 }).exec();
      const now = Date.now();
      if (last && last.lastSentAt && (now - last.lastSentAt) < this.COOLDOWN_MS) {
        const remainingMs = this.COOLDOWN_MS - (now - last.lastSentAt);
        const remainingSec = Math.ceil(remainingMs / 1000);
        throw new BadRequestException(`Debes esperar ${remainingSec} segundos antes de solicitar otro token.`);
      }

      const token = await this.emailService.generateToken();
      const tokenHash = await this.hashService.hashPassword(token);

      await this.tokenModel.create({
        email: toEmail,
        tokenHash,
        createdAt: new Date(),
        isValid: false,
        attempts: 0,
        lastSentAt: now,
      });

      await this.emailService.sendTokenLogin(toEmail, token);
      return { message: `Token enviado a ${toEmail}` };
    } catch (error) {
      if (error instanceof BadRequestException) throw error;
      console.error('Error al crear/enviar token', error);
      throw new InternalServerErrorException('Error al enviar el token.');
    }
  }
}
