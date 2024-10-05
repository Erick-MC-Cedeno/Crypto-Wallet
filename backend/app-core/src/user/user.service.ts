import { Injectable, BadRequestException, NotFoundException, UnauthorizedException, InternalServerErrorException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { Model } from 'mongoose';
import { HashService } from './hash.service';
import { ChangePasswordDto } from './dto/change-password.dto';
import { TwoFactorAuthService } from '../two-factor/verification.service';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private hashService: HashService,
    private twoFactorAuthService: TwoFactorAuthService
  ) {}

  async getUserByEmail(email: string) {
    return this.userModel.findOne({ email }).exec();
  }

  async getUserById(userId: string) {
    return this.userModel.findById(userId).exec();
  }

  async register(createUserDto: CreateUserDto) {
    const createUser = new this.userModel(createUserDto);
    const user = await this.getUserByEmail(createUserDto.email);
    if (user) {
      throw new BadRequestException();
    }

    createUser.password = await this.hashService.hashPassword(createUser.password);
    return createUser.save();
  }

  async updateUserToken(userId: string, token: string) {
    return this.userModel.findByIdAndUpdate(userId, { token, isValid: false }).exec();
  }

  async validateUserToken(userId: string, token: string) {
    const user = await this.getUserById(userId);
    if (user && user.token === token && !user.isValid) {
      user.isValid = true;
      await user.save();
      return true;
    }
    return false;
  }

  async sendVerificationToken(userId: string, email: string): Promise<void> {
    const user = await this.getUserById(userId);
    if (user.isTokenEnabled) {
      try {
        await this.twoFactorAuthService.sendToken(userId, email);
      } catch (error) {
        throw new InternalServerErrorException('Failed to send verification token.');
      }
    }
  }

  async resendVerificationToken(userId: string, email: string): Promise<void> {
    const user = await this.getUserById(userId);
    if (user.isTokenEnabled) {
      try {
        await this.twoFactorAuthService.resendToken(userId, email);
      } catch (error) {
        throw new InternalServerErrorException('Failed to resend verification token.');
      }
    }
  }

  async changePassword(userId: string, changePasswordDto: ChangePasswordDto) {
    const user = await this.getUserById(userId);
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    const isPasswordValid = await this.hashService.comparePassword(changePasswordDto.currentPassword, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Contraseña actual incorrecta');
    }

    if (changePasswordDto.newPassword !== changePasswordDto.confirmNewPassword) {
      throw new BadRequestException('Las nuevas contraseñas no coinciden');
    }

    user.password = await this.hashService.hashPassword(changePasswordDto.newPassword);
    await user.save();
    return { message: 'Contraseña actualizada con éxito' };
  }
}
