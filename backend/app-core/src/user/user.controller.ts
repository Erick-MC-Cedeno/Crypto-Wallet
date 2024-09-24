import {
  Controller,
  Post,
  Get,
  Body,
  Request,
  UnauthorizedException,
  UseGuards,
  BadRequestException
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
  async loginUser(@Body() loginUserDto: LoginUserDto) {
    const { email, password } = loginUserDto;
    const user = await this.authService.validateUser(email, password);
    if (!user) {
      throw new UnauthorizedException('Credenciales incorrectas.');
    }
    return { msg: 'Código de verificación enviado a tu correo electrónico.' };
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
        throw new UnauthorizedException('Código de verificación inválido.');
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
