import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from 'passport-local';
import { AuthService } from "../auth.service";
import { EmailService } from "../../user/email.service"; 

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
    constructor(
        private authService: AuthService,
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
        await this.emailService.sendLoginNotificationEmail( email);

        return {
            message: "Código de verificación enviado a tu correo electrónico."
        };
    }
}
