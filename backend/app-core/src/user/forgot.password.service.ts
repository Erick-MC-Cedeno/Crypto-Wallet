import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { randomBytes } from 'crypto';
import { User, UserDocument } from './schemas/user.schema';
import { HashService } from './hash.service';
import { EmailService } from './email.service';

@Injectable()
export class ForgotPasswordService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private hashService: HashService,
    private emailService: EmailService,
  ) {}

  async requestPasswordReset(email: string): Promise<boolean> {
    const user = await this.userModel.findOne({ email }).exec();
    if (!user) {
      throw new BadRequestException('Usuario no encontrado');
    }

    const token = randomBytes(20).toString('hex');
    const expires = new Date(Date.now() + 2 * 60 * 1000); // 2 minutos

    user.resetPasswordToken = token;
    user.resetPasswordExpires = expires;

    await user.save();

    await this.emailService.sendForgotPasswordEmail(user.email, token);
    return true;
  }

  async resetPassword(email: string, token: string, newPassword: string, confirmNewPassword: string) {
    const user = await this.userModel.findOne({ email }).exec();
    if (!user) {
      throw new BadRequestException('Usuario no encontrado');
    }

    if (!user.resetPasswordToken || !user.resetPasswordExpires) {
      throw new BadRequestException('No hay solicitud de restablecimiento válida');
    }

    if (user.resetPasswordToken !== token) {
      throw new BadRequestException('Token inválido');
    }

    if (user.resetPasswordExpires.getTime() < Date.now()) {
      throw new BadRequestException('Token expirado');
    }

    if (newPassword !== confirmNewPassword) {
      throw new BadRequestException('Las contraseñas no coinciden');
    }

    user.password = await this.hashService.hashPassword(newPassword);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    return { message: 'Contraseña restablecida con éxito' };
  }

}
