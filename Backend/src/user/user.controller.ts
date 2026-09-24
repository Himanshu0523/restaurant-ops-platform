import {
  Body,
  Controller,
  Get,
  Patch,
  UseGuards,
  NotFoundException,
} from '@nestjs/common';

import { UserService } from './user.service.js';
import { UpdateProfileDto } from './dto/update-profile.dto.js';
import { UpdatePreferencesDto } from './dto/update-preferences.dto.js';
import { AuthGuard } from '../auth/auth.guard.js';
import { CurrentUser } from '../auth/decorators/current-user.decorator.js';
import type { JwtPayload } from '../auth/decorators/current-user.decorator.js';

@Controller('users')
@UseGuards(AuthGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('me')
  async getMe(@CurrentUser() user: JwtPayload) {
    const doc = await this.userService.getUserById(user.sub);
    if (!doc) throw new NotFoundException('User not found');
    return this.userService.toSafeUser(doc);
  }

  @Patch('profile')
  async updateProfile(
    @CurrentUser() user: JwtPayload,
    @Body() dto: UpdateProfileDto,
  ) {
    return await this.userService.updateProfile(user.sub, dto);
  }

  @Patch('me')
  async updateMe(
    @CurrentUser() user: JwtPayload,
    @Body() dto: UpdateProfileDto,
  ) {
    return await this.userService.updateProfile(user.sub, dto);
  }

  @Patch('preferences')
  async updatePreferences(
    @CurrentUser() user: JwtPayload,
    @Body() dto: UpdatePreferencesDto,
  ) {
    return await this.userService.updatePreferences(user.sub, dto);
  }
}

// Backward compatibility export aliases
export const UsersController = UserController;
export type UsersController = UserController;