import {
  Controller,
  Post,
  Get,
  Body,
  Request,
  UnauthorizedException,
  UseGuards,
  BadRequestException,
  Patch
} from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import { TwoFactorAuthService } from '../two-factor/verification.service';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { VerifyTokenDto } from '../two-factor/dto/verification.dto';
import { LocalAuthGuard } from '../guard/auth/local-auth.guard';
import { AuthenticatedGuard } from '../guard/auth/authenticated.guard';
import { ChangePasswordDto } from './dto/change-password.dto';
import { UpdateProfileDto } from './dto/update-profile';
import { ForgotPasswordService } from './forgot.password.service';

// User controller for handling user-related routes such as registration, login, profile updates, and password management. It uses guards to protect certain routes and interacts with the UserService, AuthService, TwoFactorAuthService, and ForgotPasswordService to perform its operations.
@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
    private readonly twoFactorAuthService: TwoFactorAuthService,
    private readonly forgotPasswordService: ForgotPasswordService,
  ) {}

  // Route for user registration. It accepts a CreateUserDto object in the request body and calls the register method of the UserService to create a new user.
  @Post('register')
  registerUser(@Body() createUserDto: CreateUserDto) {
    return this.userService.register(createUserDto);
  }


  // Route for user login. It uses the LocalAuthGuard to authenticate the user based on the provided credentials in the LoginUserDto. If authentication is successful, it calls the login method of the AuthService to generate a JWT token and handle two-factor authentication if enabled.
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async loginUser(@Body() loginUserDto: LoginUserDto, @Request() req) {
    return this.authService.login(loginUserDto, req);
  }


  // Route for verifying the two-factor authentication token. It accepts a VerifyTokenDto object in the request body and calls the verifyAndLogin method of the AuthService to validate the token and complete the login process.
  @Post('verify-token')
  async verifyToken(@Body() verifyTokenDto: VerifyTokenDto, @Request() req) {
    return this.authService.verifyAndLogin(verifyTokenDto, req);
  }


  // Route for resending the two-factor authentication token. It accepts an email address in the request body and calls the resendToken method of the TwoFactorAuthService to send a new token to the user's email.
  @Post('resend-token')
  async resendToken(@Body() { email }: { email: string }) {
    await this.twoFactorAuthService.resendToken(email);
    return { message: 'Código de verificación reenviado a tu correo electrónico.' };
  }


  // Route for updating the status of two-factor authentication. It accepts an email address and a boolean indicating whether the token is enabled in the request body, and calls the updateTokenStatus method of the UserService to update the user's token status.
  @UseGuards(AuthenticatedGuard)
  @Patch('update-token-status')
  async updateTokenStatus(@Body() updateTokenStatusDto: { email: string; isTokenEnabled: boolean }) {
    const { email, isTokenEnabled } = updateTokenStatusDto;
    return this.userService.updateTokenStatus(email, isTokenEnabled);
  }

  // Route for retrieving the current status of the two-factor authentication token for the authenticated user. It calls the getTokenStatus method of the UserService to fetch the token status based on the user's email.
  @UseGuards(AuthenticatedGuard)
  @Get('token-status')
  async getTokenStatus(@Request() req) {
    const email = req.user.email;
    return this.userService.getTokenStatus(email);
  }


  // Route for retrieving the authenticated user's information. It uses the AuthenticatedGuard to ensure that only authenticated users can access this route, and returns the user's data from the request object.
  @UseGuards(AuthenticatedGuard)
  @Get('info')
  getUsers(@Request() req) {
    return {
      data: req.user
    };
  }


  // Route for logging out the authenticated user. It uses the AuthenticatedGuard to ensure that only authenticated users can access this route, and calls the logout method on the request object to end the user's session.
  @UseGuards(AuthenticatedGuard)
  @Post('logout')
  logout(@Request() req) {
    req.logout(() => {});
  }


  // Route for changing the authenticated user's password. It accepts a ChangePasswordDto object in the request body and calls the changePassword method of the UserService to update the user's password based on their email.
  @UseGuards(AuthenticatedGuard)
  @Post('change-password')
  async changePassword(@Request() req, @Body() changePasswordDto: ChangePasswordDto) {
    const email = req.user.email; 
    return this.userService.changePassword(email, changePasswordDto);
  }


  // Route for updating the authenticated user's profile information. It accepts an UpdateProfileDto object in the request body and calls the updateProfile method of the UserService to update the user's profile based on their email.
  @UseGuards(AuthenticatedGuard)
  @Post('update-profile')
  async updateProfile(@Request() req, @Body() updateProfileDto: UpdateProfileDto) {
    const email = req.user.email;
    return this.userService.updateProfile(email, updateProfileDto, req);
  }


  // Route for verifying the authenticated user's email address. It accepts an email address in the request body and calls the verifyEmail method of the UserService to verify the email. If successful, it returns a success message; otherwise, it throws a BadRequestException with an error message.
  @UseGuards(AuthenticatedGuard)
@Post('verify-email')
async verifyEmail(@Body() { email }: { email: string }): Promise<{ message: string }> {
    try {
        const result = await this.userService.verifyEmail(email);
        return { message: 'Correo electrónico verificado con éxito.' };
    } catch (error) {
        throw new BadRequestException(error.message || 'El correo electrónico no pudo ser verificado.');
    }
}

// Route for sending a verification email to the authenticated user. It accepts an email address in the request body and calls the sendVerificationEmail method of the UserService to send a verification email. If successful, it returns a success message; otherwise, it throws a BadRequestException with an error message.
@UseGuards(AuthenticatedGuard)
@Post('send-verification-email')
async sendVerificationEmail(@Body() { email }: { email: string }): Promise<{ message: string }> {
    try {
        const result = await this.userService.sendVerificationEmail(email);
        return { message: 'Correo de verificación enviado con éxito.' };
    } catch (error) {
        throw new BadRequestException(error.message || 'No se pudo enviar el correo de verificación.');
    }
}


// Route for checking if the authenticated user's email address is verified. It retrieves the user's email from the request object and calls the isEmailVerified method of the UserService to check the verification status. It returns an object containing a boolean indicating whether the email is verified and a message.
@UseGuards(AuthenticatedGuard)
@Get('is-email-verified')
async isEmailVerified(@Request() req): Promise<{ isVerified: boolean; message: string }> {
    const email = req.user.email; 
    return this.userService.isEmailVerified(email); 
}


// Route for handling the forgot password functionality. It accepts an email address in the request body and calls the requestPasswordReset method of the ForgotPasswordService to initiate the password reset process. If successful, it returns a message indicating that a reset email has been sent; otherwise, it throws a BadRequestException with an error message.
  @Post('forgot-password')
  async forgotPassword(@Body() body: { email: string }) {
    const { email } = body;
    try {
      await this.forgotPasswordService.requestPasswordReset(email);
      return { message: 'Correo de restablecimiento enviado si el usuario existe.' };
    } catch (error) {
      throw new BadRequestException(error.message || 'No se pudo procesar la solicitud.');
    }
  }


  // Route for resetting the user's password. It accepts an email address, a reset token, a new password, and a confirmation of the new password in the request body. It calls the resetPassword method of the ForgotPasswordService to update the user's password. If successful, it returns a success message; otherwise, it throws a BadRequestException with an error message.
  @Post('reset-password')
  async resetPassword(@Body() body: { email: string; token: string; newPassword: string; confirmNewPassword: string }) {
    const { email, token, newPassword, confirmNewPassword } = body;
    try {
      return await this.forgotPasswordService.resetPassword(email, token, newPassword, confirmNewPassword);
    } catch (error) {
      throw new BadRequestException(error.message || 'No se pudo restablecer la contraseña.');
    }
  }
}