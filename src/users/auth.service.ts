import { BadRequestException, Injectable } from '@nestjs/common';
import { UsersService } from './users.service';
import { PasswordService } from './password.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private passwordService: PasswordService
  ) {}

  async signup({nickname, password}) {
    if (!password) {
      throw new BadRequestException('password shouldn\'t be empty');
    }

    const encryptedPassword = await this.passwordService.encrypt(password);
    
    return await this.usersService.create({nickname, password: encryptedPassword});
  }
}
