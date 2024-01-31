import { BadRequestException, Injectable, Session } from '@nestjs/common';
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

  async signin({nickname, password}, @Session() session: Record<string, any>) {
    if (!password) {
      throw new BadRequestException('password shouldn\'t be empty');
    }

    const [user] = await this.usersService.find(nickname);
    const result = await this.passwordService.verify(password, user.password);

    if (result) {
      session.userId = user.id;
      return user;
    } else {
      throw new BadRequestException('wrong password');
    }
  }
}
