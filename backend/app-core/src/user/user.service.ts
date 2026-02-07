import { Injectable, BadRequestException, NotFoundException, UnauthorizedException, InternalServerErrorException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { Model } from 'mongoose';
import { HashService } from './hash.service';
import { ChangePasswordDto } from './dto/change-password.dto';
import { UpdateProfileDto } from './dto/update-profile';
import { EmailService } from './email.service';

// Service to handle user-related operations such as registration, password management, and profile updates
@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private hashService: HashService,
    private emailService: EmailService
  ) {}

  async getUserByEmail(email: string) {
    return this.userModel.findOne({ email }).exec();
  }


  //Register a new user, hash the password, and save to the database
  async register(createUserDto: CreateUserDto) {
    const createUser = new this.userModel(createUserDto);
    const user = await this.getUserByEmail(createUserDto.email);
    if (user) {
      throw new BadRequestException();
    }

    createUser.password = await this.hashService.hashPassword(createUser.password);
    return createUser.save();
  }


// Check if the user's email is verified by looking at the isValid field in the database
  async isEmailVerified(email: string): Promise<{ isVerified: boolean; message: string }> {
    const user = await this.getUserByEmail(email);
    if (!user) {
        throw new BadRequestException('El usuario con el correo proporcionado no existe.');
    }
    
    if (user.isValid) {
        return { isVerified: true, message: 'Correo verificado con éxito.' };
    } else {
        return { isVerified: false, message: 'El correo aún no está verificado.' };
    }
}


// Verify the user's email by setting the isValid field to true in the database
async verifyEmail(email: string): Promise<boolean> {
  const user = await this.getUserByEmail(email);
  
  if (!user) {
      throw new BadRequestException('Usuario no existe.');
  }
  
  if (user.isValid) {
      throw new BadRequestException('Correo ya verificado.');
  }
  
  try {
      user.isValid = true;
      await user.save();
      return true;
  } catch {
      throw new BadRequestException('Error al verificar correo.');
  }
}



// Verify the user's email by setting the isValid field to true in the database
async sendVerificationEmail(email: string): Promise<boolean> {
  const user = await this.getUserByEmail(email);
  
  if (!user) {
      throw new BadRequestException('Usuario no existe.');
  }

  if (user.isValid) {
      throw new BadRequestException('Correo ya verificado. No se puede reenviar.');
  }
  
  try {
      await this.emailService.sendVerificationEmail(user.email);
      return true;
  } catch {
      throw new BadRequestException('Error al enviar correo.');
  }
}


// Update the user's token status (enable or disable) in the database
  async updateTokenStatus(email: string, isTokenEnabled: boolean) {
    const user = await this.getUserByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Usuario no encontrado.');
    }
    user.isTokenEnabled = isTokenEnabled;
    await user.save();
    return { msg: 'Seguridad de la cuenta actualizada con éxito.' };
  }


// Get the user's token status (enabled or disabled) from the database
  async getTokenStatus(email: string) {
    const user = await this.getUserByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Usuario no encontrado.');
    }
    return { isTokenEnabled: !!user.isTokenEnabled };
  }


// Change the user's password by verifying the current password and updating it with the new password in the database
  async changePassword(email: string, changePasswordDto: ChangePasswordDto) {
    const user = await this.getUserByEmail(email);
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    const isPasswordValid = await this.hashService.comparePassword(changePasswordDto.currentPassword, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Contraseña actual incorrecta');
    }

    // Prevent changing to the same password
    const isSameAsCurrent = await this.hashService.comparePassword(changePasswordDto.newPassword, user.password);
    if (isSameAsCurrent) {
      throw new BadRequestException('La nueva contraseña no puede ser igual a la anterior');
    }

    // Prevent password changes more than once within a 10-minute window
    const TEN_MINUTES_MS = 10 * 60 * 1000;
    if (user.lastPasswordChange) {
      const elapsed = Date.now() - user.lastPasswordChange;
      if (elapsed < TEN_MINUTES_MS) {
        const remainingMinutes = Math.ceil((TEN_MINUTES_MS - elapsed) / (60 * 1000));
        throw new BadRequestException(`No puedes cambiar la contraseña hasta pasados ${remainingMinutes} minuto(s) desde la última modificación.`);
      }
    }

    if (changePasswordDto.newPassword !== changePasswordDto.confirmNewPassword) {
      throw new BadRequestException('Las nuevas contraseñas no coinciden');
    }

    user.password = await this.hashService.hashPassword(changePasswordDto.newPassword);
    user.lastPasswordChange = Date.now();
    await user.save();
    return { message: 'Contraseña actualizada con éxito' };
  }


// Update the user's profile information (first name, last name, and email) in the database
  async updateProfile(email: string, updateProfileDto: UpdateProfileDto, req?: any) {
    const user = await this.getUserByEmail(email);
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    // Prevent profile updates more than once within a 10-minute window
    const TEN_MINUTES_MS = 10 * 60 * 1000;
    if (user.lastProfileUpdate) {
      const elapsed = Date.now() - user.lastProfileUpdate;
      if (elapsed < TEN_MINUTES_MS) {
        const remainingMinutes = Math.ceil((TEN_MINUTES_MS - elapsed) / (60 * 1000));
        throw new BadRequestException(`No puedes actualizar tu perfil hasta pasados ${remainingMinutes} minuto(s) desde la última modificación.`);
      }
    }

    const providedFirstName = updateProfileDto.firstName !== undefined && updateProfileDto.firstName !== null;
    const providedLastName = updateProfileDto.lastName !== undefined && updateProfileDto.lastName !== null;
    const providedEmail = updateProfileDto.email !== undefined && updateProfileDto.email !== null;

    const firstNameChanged = providedFirstName && updateProfileDto.firstName !== user.firstName;
    const lastNameChanged = providedLastName && updateProfileDto.lastName !== user.lastName;
    const emailChanged = providedEmail && updateProfileDto.email !== user.email;

    // If none of the provided fields actually change the stored values, reject the update
    if (!firstNameChanged && !lastNameChanged && !emailChanged) {
      if ((providedFirstName || providedLastName) && !providedEmail) {
        throw new BadRequestException('Debes usar nombres diferentes al anterior');
      } else if (providedEmail && !providedFirstName && !providedLastName) {
        throw new BadRequestException('Debes usar un correo diferente al anterior');
      } else {
        throw new BadRequestException('Debes proporcionar valores diferentes a los actuales');
      }
    }

    // If email is being changed, ensure it's not already used by another user
    if (providedEmail && emailChanged) {
      const existingUser = await this.userModel.findOne({ email: updateProfileDto.email });
      if (existingUser && existingUser.email !== email) {
        throw new BadRequestException('El correo electrónico ya está en uso');
      }
      user.email = updateProfileDto.email;
    }

    if (firstNameChanged) user.firstName = updateProfileDto.firstName;
    if (lastNameChanged) user.lastName = updateProfileDto.lastName;

    // update lastProfileUpdate timestamp
    user.lastProfileUpdate = Date.now();
    await user.save();

    const result = { message: 'Perfil actualizado con éxito' };

    if (req) {
      const updatedUser = await this.getUserByEmail(updateProfileDto.email || email);
      if (!updatedUser) {
        throw new BadRequestException('Error al actualizar sesión del usuario.');
      }

      return new Promise((resolve, reject) => {
        req.login(updatedUser, (err) => {
          if (err) {
            reject(new BadRequestException('Error al actualizar sesión del usuario.'));
          } else {
            resolve(result);
          }
        });
      });
    }

    return result;
  }
}
