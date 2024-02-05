import 'dotenv/config'
import { BadRequestException, Injectable } from '@nestjs/common';
import { UsersService } from './users.service';
import { PasswordService } from './password.service';

@Injectable()
export class PrivilegesService {
  constructor(
    private usersService: UsersService,
    private passwordSerivce: PasswordService
  ) {}

  async setAdmin(userId: number, adminKey: string, value: boolean) {
    const storedAdminKey = process.env.ADMIN_KEY;

    const passwordsMatch = await this.passwordSerivce.verify(adminKey, storedAdminKey);
    if (!passwordsMatch) {
      throw new BadRequestException('access blocked');
    }

    return await this.usersService.update(userId, {isAdmin: value});
  }
}
