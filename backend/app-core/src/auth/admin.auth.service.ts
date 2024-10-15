import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AdminService } from '../admin/admin.service';
import { AdminHashService } from '../admin/admin.hash.service';

@Injectable()
export class AdminAuthService {
  constructor(
    private adminService: AdminService,
    private adminHashService: AdminHashService,
  ) {}

  async validateAdmin(username: string, password: string): Promise<any> {
    const admin = await this.adminService.findAdminByUsername(username);
    if (admin && await this.adminHashService.comparePassword(password, admin.password)) {
      return admin; // Devuelve el administrador si la validación es exitosa
    }
    return null; // Devuelve null si la validación falla
  }
}
