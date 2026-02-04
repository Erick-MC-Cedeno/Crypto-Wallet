import {
  Controller,
  Post,
  Get,
  Body,
  Request,
  UnauthorizedException,
  UseGuards,
  BadRequestException,
  Patch
} from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import { TwoFactorAuthService } from '../two-factor/verification.service';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { VerifyTokenDto } from '../two-factor/dto/verification.dto';
import { LocalAuthGuard } from '../guard/auth/local-auth.guard';
import { AuthenticatedGuard } from '../guard/auth/authenticated.guard';
import { ChangePasswordDto } from './dto/change-password.dto';
import { UpdateProfileDto } from './dto/update-profile';
import { ForgotPasswordService } from './forgot.password.service';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
    private readonly twoFactorAuthService: TwoFactorAuthService,
    private readonly forgotPasswordService: ForgotPasswordService,
  ) {}

  @Post('register')
  registerUser(@Body() createUserDto: CreateUserDto) {
    return this.userService.register(createUserDto);
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async loginUser(@Body() loginUserDto: LoginUserDto, @Request() req) {
    return this.authService.login(loginUserDto, req);
  }

  @Post('verify-token')
  async verifyToken(@Body() verifyTokenDto: VerifyTokenDto, @Request() req) {
    return this.authService.verifyAndLogin(verifyTokenDto, req);
  }

  @Post('resend-token')
  async resendToken(@Body() { email }: { email: string }) {
    await this.twoFactorAuthService.resendToken(email);
    return { message: 'Código de verificación reenviado a tu correo electrónico.' };
  }

  @UseGuards(AuthenticatedGuard)
  @Patch('update-token-status')
  async updateTokenStatus(@Body() updateTokenStatusDto: { email: string; isTokenEnabled: boolean }) {
    const { email, isTokenEnabled } = updateTokenStatusDto;
    return this.userService.updateTokenStatus(email, isTokenEnabled);
  }

  @UseGuards(AuthenticatedGuard)
  @Get('token-status')
  async getTokenStatus(@Request() req) {
    const email = req.user.email;
    return this.userService.getTokenStatus(email);
  }

  @UseGuards(AuthenticatedGuard)
  @Get('info')
  getUsers(@Request() req) {
    return {
      data: req.user
    };
  }

  @UseGuards(AuthenticatedGuard)
  @Post('logout')
  logout(@Request() req) {
    req.logout(() => {});
  }

  @UseGuards(AuthenticatedGuard)
  @Post('change-password')
  async changePassword(@Request() req, @Body() changePasswordDto: ChangePasswordDto) {
    const email = req.user.email; 
    return this.userService.changePassword(email, changePasswordDto);
  }

  @UseGuards(AuthenticatedGuard)
  @Post('update-profile')
  async updateProfile(@Request() req, @Body() updateProfileDto: UpdateProfileDto) {
    const email = req.user.email; 
    return this.userService.updateProfile(email, updateProfileDto);
  }

  @UseGuards(AuthenticatedGuard)
@Post('verify-email')
async verifyEmail(@Body() { email }: { email: string }): Promise<{ message: string }> {
    try {
        const result = await this.userService.verifyEmail(email);
        return { message: 'Correo electrónico verificado con éxito.' };
    } catch (error) {
        throw new BadRequestException(error.message || 'El correo electrónico no pudo ser verificado.');
    }
}

@UseGuards(AuthenticatedGuard)
@Post('send-verification-email')
async sendVerificationEmail(@Body() { email }: { email: string }): Promise<{ message: string }> {
    try {
        const result = await this.userService.sendVerificationEmail(email);
        return { message: 'Correo de verificación enviado con éxito.' };
    } catch (error) {
        throw new BadRequestException(error.message || 'No se pudo enviar el correo de verificación.');
    }
}

@UseGuards(AuthenticatedGuard)
@Get('is-email-verified')
async isEmailVerified(@Request() req): Promise<{ isVerified: boolean; message: string }> {
    const email = req.user.email; 
    return this.userService.isEmailVerified(email); 
}
  @Post('forgot-password')
  async forgotPassword(@Body() body: { email: string }) {
    const { email } = body;
    try {
      await this.forgotPasswordService.requestPasswordReset(email);
      return { message: 'Correo de restablecimiento enviado si el usuario existe.' };
    } catch (error) {
      throw new BadRequestException(error.message || 'No se pudo procesar la solicitud.');
    }
  }

  @Post('reset-password')
  async resetPassword(@Body() body: { email: string; token: string; newPassword: string; confirmNewPassword: string }) {
    const { email, token, newPassword, confirmNewPassword } = body;
    try {
      return await this.forgotPasswordService.resetPassword(email, token, newPassword, confirmNewPassword);
    } catch (error) {
      throw new BadRequestException(error.message || 'No se pudo restablecer la contraseña.');
    }
  }
}