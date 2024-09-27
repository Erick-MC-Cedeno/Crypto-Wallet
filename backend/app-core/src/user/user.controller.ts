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
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { VerifyTokenDto } from '../two-factor/dto/verification.dto';
import { LocalAuthGuard } from '../guard/auth/local-auth.guard';
import { AuthenticatedGuard } from '../guard/auth/authenticated.guard';
import { ChangePasswordDto } from './dto/change-password.dto';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService
  ) {}

  @Post('register')
  registerUser(@Body() createUserDto: CreateUserDto) {
    return this.userService.register(createUserDto);
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async loginUser(@Body() loginUserDto: LoginUserDto, @Request() req) {
    const { email, password } = loginUserDto;
    const user = await this.authService.validateUser(email, password);
    if (!user) {
      throw new UnauthorizedException('Credenciales incorrectas.');
    }

    if (user.isTokenEnabled) {
      await this.authService.sendVerificationToken(user._id, email);
      return { msg: 'Código de verificación enviado a tu correo electrónico.' };
    } else {
      return new Promise((resolve, reject) => {
        req.login(user, (err) => {
          if (err) {
            reject(new UnauthorizedException('Error al iniciar sesión.'));
          } else {
            resolve({ msg: 'Logged in!' });
          }
        });
      });
    }
  }

  @Post('verify-token')
async verifyToken(@Body() verifyTokenDto: VerifyTokenDto, @Request() req) {
  const { userId, token } = verifyTokenDto;
  try {
    const tokenData = await this.authService.validateToken(userId, token);
    if (tokenData && tokenData.isValid) {
      const user = await this.userService.getUserById(userId);
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
      throw new BadRequestException('Token o User-Key incorrectos.');
    }
  }
}

  @UseGuards(AuthenticatedGuard)
  @Patch('update-token-status')
  async updateTokenStatus(@Body() updateTokenStatusDto: { userId: string, isTokenEnabled: boolean }) {
    const { userId, isTokenEnabled } = updateTokenStatusDto;
    const user = await this.userService.getUserById(userId);
    if (!user) {
      throw new UnauthorizedException('Usuario no encontrado.');
    }
    user.isTokenEnabled = isTokenEnabled;
    await user.save();
    return { msg: 'seguridad de la cuenta actualizada con éxito.' };
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
    const userId = req.user._id;
    return this.userService.changePassword(userId, changePasswordDto);
  }
}
