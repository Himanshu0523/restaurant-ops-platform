import { Body, Controller, Get, NotFoundException, Patch, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard.js';
import { CurrentUser } from '../auth/decorators/current-user.decorator.js';
import { UserService } from './user.service.js';
import { UpdateProfileDto } from './dto/update-profile.dto.js';
import type { JwtPayload } from '../auth/decorators/current-user.decorator.js';

@UseGuards(AuthGuard)
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('me')
  async getMe(@CurrentUser() user: JwtPayload) {
    const doc = await this.userService.getUserById(user.sub);
    if (!doc) throw new NotFoundException('User not found');
    return this.userService.toSafeUser(doc);
  }

  @Patch('me')
  async updateMe(@CurrentUser() user: JwtPayload, @Body() dto: UpdateProfileDto) {
    const updated = await this.userService.updateProfile(user.sub, dto);
    if (!updated) throw new NotFoundException('User not found');
    return updated;
  }
}