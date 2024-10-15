import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AdminService } from './admin.service';
import { Admin, AdminSchema } from './schemas/admin.schema';
import { AdminHashService } from './admin.hash.service';
import { AdminController } from './admin.controller';
import { AdminAuthModule } from '../auth/admin.auth.module'; 

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Admin.name, schema: AdminSchema }]),
    forwardRef(() => AdminAuthModule),
  ],
  controllers: [AdminController],
  providers: [AdminService, AdminHashService],
  exports: [AdminService, AdminHashService],
})
export class AdminModule {}
