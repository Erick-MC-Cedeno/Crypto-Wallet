import { Injectable, UnauthorizedException, InternalServerErrorException, BadRequestException } from '@nestjs/common';
import { LoginUserDto } from '../user/dto/login-user.dto';
import { VerifyTokenDto } from '../two-factor/dto/verification.dto';
import { UserService } from '../user/user.service';
import { HashService } from '../user/hash.service';
import { TwoFactorAuthService } from '../two-factor/verification.service';
import { EmailService } from '../user/email.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private hashService: HashService,
    private twoFactorAuthService: TwoFactorAuthService,
    private emailService: EmailService,
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
        if (error instanceof BadRequestException) {
          throw error;
        }
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
        if (error instanceof BadRequestException) {
          throw error;
        }
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

  async login(loginUserDto: LoginUserDto, req: any): Promise<any> {
    const { email, password } = loginUserDto;
    const user = await this.validateUser(email, password);
    if (!user) {
      throw new UnauthorizedException('Credenciales incorrectas.');
    }

    if (user.isTokenEnabled) {
      await this.sendVerificationToken(email);
      return { msg: 'Código de verificación enviado a tu correo electrónico.' };
    } else {
      return new Promise((resolve, reject) => {
        req.login(user, (err) => {
          if (err) {
            reject(new UnauthorizedException('Error al iniciar sesión.'));
          } else {
            // send login notification asynchronously, but don't block the response
            this.emailService.sendLoginNotificationEmail(email).catch((e) => {
              console.error('Error sending login notification email', e);
            });
            resolve({ msg: 'Logged in!' });
          }
        });
      });
    }
  }

  async verifyAndLogin(verifyTokenDto: VerifyTokenDto, req: any): Promise<any> {
    const { email, token } = verifyTokenDto;
    try {
      const tokenData = await this.validateToken(email, token);
      if (tokenData && tokenData.isValid) {
        const user = await this.userService.getUserByEmail(email);
        if (!user) {
          throw new UnauthorizedException('Usuario no encontrado.');
        }
        if (!user.isTokenEnabled) {
          throw new UnauthorizedException('La verificación de token está desactivada.');
        }
        return new Promise((resolve, reject) => {
          req.login(user, (err) => {
            if (err) {
              reject(new UnauthorizedException('Error al iniciar sesión.'));
            } else {
              this.emailService.sendLoginNotificationEmail(email).catch((e) => {
                console.error('Error sending login notification email', e);
              });
              resolve({ msg: 'Logged in!' });
            }
          });
        });
      } else {
        throw new UnauthorizedException(tokenData.message || 'Código de verificación inválido.');
      }
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      } else {
        throw new BadRequestException('Token o correo electrónico incorrectos.');
      }
    }
  }
}
