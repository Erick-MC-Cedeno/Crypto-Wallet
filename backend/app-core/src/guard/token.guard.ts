import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class TokenVerificationGuard implements CanActivate {
  constructor(private readonly authService: AuthService, private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const { userId, token } = request.body;

   
    if (!userId || !token) {
      throw new UnauthorizedException('Faltan credenciales.');
    }

    
    const isValid = await this.authService.validateToken(userId, token);
    if (!isValid) {
      throw new UnauthorizedException('Código de verificación inválido.');
    }

    
    return true;
  }
}
