import { Injectable, UnauthorizedException } from '@nestjs/common';
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

  async sendVerificationToken(userId: string, email: string): Promise<void> {
    try {
      await this.twoFactorAuthService.sendToken(userId, email);
    } catch (error) {
      throw new Error('Failed to send verification token.');
    }
  }

  async validateToken(userId: string, token: string): Promise<any> {
    try {
      const { isValid, message } = await this.twoFactorAuthService.verifyToken(userId, token);
      if (isValid) {
        return { isValid: true, userId };
      } else {
        return { isValid: false, message };
      }
    } catch (error) {
      throw new UnauthorizedException('Token validation failed.');
    }
  }
}
