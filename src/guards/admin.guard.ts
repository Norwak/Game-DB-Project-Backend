import { CanActivate, ExecutionContext, Inject } from "@nestjs/common"
import { UsersService } from "../modules/users/users.service";

export class AdminGuard implements CanActivate {
  constructor(
    @Inject(UsersService) private readonly usersService: UsersService
  ){}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    if (!request.session.userId) {
      return false;
    }

    const currentUser = await this.usersService.findOne(request.session.userId);
    return currentUser.isAdmin;
  }
}