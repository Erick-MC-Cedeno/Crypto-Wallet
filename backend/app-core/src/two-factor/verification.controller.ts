import { Controller, Post, Body, BadRequestException } from '@nestjs/common';
import { TwoFactorAuthService } from './verification.service';
import { VerifyTokenDto } from './dto/verification.dto';

@Controller('two-factor-auth')
export class TwoFactorAuthController {
  constructor(private readonly twoFactorAuthService: TwoFactorAuthService) {}

  @Post('send-token')
  async sendToken(@Body() { userId, email }: { userId: string; email: string }): Promise<{ message: string }> {
    const response = await this.twoFactorAuthService.sendToken(userId, email);
    return response;
  }

  @Post('verify-token')
  async verifyToken(@Body() verifyTokenDto: VerifyTokenDto): Promise<{ message: string }> {
    const { userId, token } = verifyTokenDto;
    const { isValid, message } = await this.twoFactorAuthService.verifyToken(userId, token);

    if (isValid) {
      return { message: 'Código verificado correctamente' };
    } else {
      throw new BadRequestException(message);
    }
  }
}
