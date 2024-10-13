import { Injectable, UnauthorizedException, InternalServerErrorException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { HashService } from '../user/hash.service';
import { TwoFactorAuthService } from '../two-factor/verification.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private hashService: HashService,
    private twoFactorAuthService: TwoFactorAuthService
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userService.getUserByEmail(email);
    if (user && await this.hashService.comparePassword(password, user.password)) {
      return user;
    }
    return null;
  }

  async sendVerificationToken(email: string): Promise<void> {
    const user = await this.userService.getUserByEmail(email);
    if (user?.isTokenEnabled) {
      try {
        await this.twoFactorAuthService.sendToken(email);
      } catch (error) {
        throw new InternalServerErrorException('Failed to send verification token.');
      }
    }
  }

  async resendVerificationToken(email: string): Promise<void> {
    const user = await this.userService.getUserByEmail(email);
    if (user?.isTokenEnabled) {
      try {
        await this.twoFactorAuthService.resendToken(email);
      } catch (error) {
        throw new InternalServerErrorException('Failed to resend verification token.');
      }
    }
  }

  async validateToken(email: string, token: string): Promise<any> {
    const user = await this.userService.getUserByEmail(email);
    if (!user?.isTokenEnabled) {
      return { isValid: true, email };
    }

    try {
      const { isValid, message } = await this.twoFactorAuthService.verifyToken(email, token);
      if (isValid) {
        return { isValid: true, email };
      } else {
        return { isValid: false, message };
      }
    } catch (error) {
      throw new UnauthorizedException('Token validation failed.');
    }
  }
}
