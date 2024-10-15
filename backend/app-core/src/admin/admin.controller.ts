import {
  Controller,
  Post,
  Body,
  Request,
  UseGuards,
  UnauthorizedException,
} from '@nestjs/common';
import { AdminAuthService } from '../auth/admin.auth.service';
import { AdminService } from './admin.service';
import { AdminLocalGuard } from '../guard/auth/admin.local.auth.guard';
import { CreateAdminDto } from '../admin/dto/create.admin.dto';
import { AdminLoginDto } from '../admin/dto/admin.login.dto';
import { AdminGuard } from 'src/guard/auth/admin.auth.guard';

@Controller('admin')
export class AdminController {
  constructor(
    private readonly adminService: AdminService,
    private readonly adminAuthService: AdminAuthService
  ) {}

  @Post('register')
  async registerAdmin(@Body() createAdminDto: CreateAdminDto) {
    return this.adminService.register(createAdminDto);
  }
  
@Post('login')
async loginAdmin(@Body() adminLoginDto: AdminLoginDto, @Request() req) {
  if (req.isAuthenticated()) {
    throw new UnauthorizedException('Ya estás autenticado.');
  }

  const { username, password } = adminLoginDto;
  const admin = await this.adminAuthService.validateAdmin(username, password);
  
  if (!admin) {
    throw new UnauthorizedException('Credenciales incorrectas.');
  }

  return new Promise((resolve, reject) => {
    req.login(admin, (err) => {
      if (err) {
        reject(new UnauthorizedException('Error al iniciar sesión.'));
      } else {
        resolve({ msg: 'Logged in!' });  // Solo devuelve el mensaje
      }
    });
  });
}



@UseGuards(AdminGuard)
@Post('logout')
logout(@Request() req) {
  req.logout((err) => {
    if (err) {
      throw new UnauthorizedException('Error al cerrar sesión.');
    }
  });
  return { msg: 'Logged out!' };
}
}