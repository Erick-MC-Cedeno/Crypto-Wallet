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
      const { password: _p, ...safeUser } = (user as any).toObject ? user.toObject() : user;
      return safeUser;
    }
    return null;
  }
  // Token sending/validation handled exclusively by TwoFactorAuthService now.

  async login(loginUserDto: LoginUserDto, req: any): Promise<any> {
    const { email, password } = loginUserDto;
    const user = await this.validateUser(email, password);
    if (!user) {
      throw new UnauthorizedException('Credenciales incorrectas.');
    }
    if ((user as any).isTokenEnabled) {
      await this.twoFactorAuthService.sendToken(email);
      return { requires2FA: true, msg: 'Código de verificación enviado a tu correo electrónico.' };
    }

    return this.performLogin(user, req);
  }

  async verifyAndLogin(verifyTokenDto: VerifyTokenDto, req: any): Promise<any> {
    const { email, token } = verifyTokenDto;
    const user = await this.userService.getUserByEmail(email);
    if (!user) throw new UnauthorizedException('Usuario no encontrado.');
    if (!user.isTokenEnabled) throw new UnauthorizedException('2FA no está activado.');

    const { isValid, message } = await this.twoFactorAuthService.verifyToken(email, token);
    if (!isValid) {
      throw new UnauthorizedException(message || 'Código inválido o expirado.');
    }

    return this.performLogin(user, req);
  }

  private performLogin(user: any, req: any) {
    return new Promise((resolve, reject) => {
      req.login(user, async (err) => {
        if (err) return reject(new UnauthorizedException('Error al iniciar sesión.'));

        this.emailService.sendLoginNotificationEmail((user as any).email).catch(console.error);

        resolve({ msg: 'Logged in!' });
      });
    });
  }
}
