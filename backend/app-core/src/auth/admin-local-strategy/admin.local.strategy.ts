import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AdminService } from '../../admin/admin.service'; 

@Injectable()
export class AdminLocalStrategy extends PassportStrategy(Strategy) {
  constructor(private adminService: AdminService) {
    super({ usernameField: 'username' });
  }

  async validate(username: string, password: string): Promise<any> {
    const admin = await this.adminService.findAdminByUsername(username);
    if (!admin) {
      throw new UnauthorizedException('Credenciales incorrectas');
    }

    const isPasswordValid = await this.adminService.validatePassword(password, admin.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciales incorrectas');
    }

    return admin; 
  }
}
