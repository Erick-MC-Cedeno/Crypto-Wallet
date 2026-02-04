import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from 'passport-local';
import { AuthService } from "../auth.service";


// This strategy is used for local authentication, where users provide their email and password to log in. It validates the user's credentials by calling the AuthService's validateUser method and returns a message indicating that a verification code has been sent to the user's email if the credentials are correct. If the credentials are incorrect, it throws an UnauthorizedException.
@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
    constructor(
        private authService: AuthService,
    ) {
        super({
            usernameField: 'email'
        });
    }


    // This method is called by Passport to validate the user's credentials. It takes the email and password as parameters, calls the AuthService's validateUser method to check if the credentials are correct, and returns a message indicating that a verification code has been sent to the user's email if the credentials are valid. If the credentials are invalid, it throws an UnauthorizedException with a message indicating that the credentials are incorrect.
    async validate(email: string, password: string): Promise<any> {
        const user = await this.authService.validateUser(email, password);
        if (!user) {
            throw new UnauthorizedException("Credenciales incorrectas!");
        }
        return {
            message: "Código de verificación enviado a tu correo electrónico."
        };
    }
}
