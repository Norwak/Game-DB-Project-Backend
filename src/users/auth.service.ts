import { BadRequestException, Injectable, NotFoundException, Session } from '@nestjs/common';
import { UsersService } from './users.service';
import { PasswordService } from './password.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private passwordService: PasswordService
  ) {}

  async signup({nickname, password}) {
    const encryptedPassword = await this.passwordService.encrypt(password);
    return await this.usersService.create({nickname, password: encryptedPassword});
  }

  async signin({nickname, password}, @Session() session: Record<string, any>) {
    let [user] = await this.usersService.find(nickname);
    if (!user) {
      throw new NotFoundException('user with this nickname doesn\'t exist');
    }

    const passwordsMatch = await this.passwordService.verify(password, user.password);
    if (passwordsMatch) {
      session.userId = user.id;
      user = await this.usersService.update(user.id, {lastLogin: new Date()}, session);
      return user;
    } else {
      throw new BadRequestException('wrong password');
    }
  }

  signout(@Session() session: Record<string, any>) {
    if (session.userId) {
      delete session.userId;
      return {};
    } else {
      throw new BadRequestException('nobody is signed in');
    }
  }
}
