import { Injectable, BadRequestException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Admin, AdminDocument } from './schemas/admin.schema';
import { AdminHashService } from './admin.hash.service'; 
import { CreateAdminDto } from './dto/create.admin.dto'; 

@Injectable()
export class AdminService {
  constructor(
    @InjectModel(Admin.name) private adminModel: Model<AdminDocument>,
    private adminHashService: AdminHashService, 
  ) {}

  async register(createAdminDto: CreateAdminDto) {
    const { username, password } = createAdminDto; 
    const existingAdmin = await this.adminModel.findOne({ username });
    if (existingAdmin) {
      throw new ConflictException('El nombre de usuario ya está en uso');
    }

    const hashedPassword = await this.adminHashService.hashPassword(password);
    const createAdmin = new this.adminModel({ username, password: hashedPassword });
    
    return createAdmin.save();
  }

  async findAdminByUsername(username: string): Promise<Admin | null> {
    return this.adminModel.findOne({ username }).exec();
  }

  async validatePassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
    return this.adminHashService.comparePassword(plainPassword, hashedPassword);
  }
}
