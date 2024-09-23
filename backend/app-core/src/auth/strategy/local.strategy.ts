import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from 'passport-local';
import { AuthService } from "../auth.service";
import { TwoFactorAuthService } from "../../two-factor/verification.service";
import { EmailService } from "../../user/email.service"; 

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
    constructor(
        private authService: AuthService,
        private twoFactorAuthService: TwoFactorAuthService,
        private emailService: EmailService 
    ) {
        super({
            usernameField: 'email'
        });
    }

    async validate(email: string, password: string): Promise<any> {
        const user = await this.authService.validateUser(email, password);
        if (!user) {
            throw new UnauthorizedException("Credenciales incorrectas!");
        }
        await this.twoFactorAuthService.sendToken(user.id, email);
        await this.emailService.sendLoginNotificationEmail(user.id, email);

        return {
            message: "Código de verificación enviado a tu correo electrónico."
        };
    }
}
