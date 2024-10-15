import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { AdminAuthService } from './admin.auth.service';
import { AdminLocalStrategy } from './admin-local-strategy/admin.local.strategy'; 
import { AdminSerializer } from './admin-local-strategy/admin.sesion.serializer';
import { AdminModule } from '../admin/admin.module'; 

@Module({
  imports: [
    PassportModule.register({ session: true }), 
    AdminModule, 
  ],
  providers: [
    AdminAuthService, 
    AdminLocalStrategy, 
    AdminSerializer, 
    
  ],
  exports: [AdminAuthService], 
})
export class AdminAuthModule {}
