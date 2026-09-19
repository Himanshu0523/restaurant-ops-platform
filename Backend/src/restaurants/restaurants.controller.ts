import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { CurrentUser } from '../auth/decorators/current-user.decorator.js';
import type { JwtPayload } from '../auth/decorators/current-user.decorator.js';
import { UserService } from '../user/user.service.js';
import { Role } from '../user/user.types.js';
import { RestaurantsService } from './restaurants.service.js';
import { CreateRestaurantDto } from './dto/create-restaurant.dto.js';
import { UpdateRestaurantDto } from './dto/update-restaurant.dto.js';
import { RestaurantQueryDto } from './dto/restaurant-query.dto.js';

@UseGuards(AuthGuard, RolesGuard)
@Controller('restaurants')
export class RestaurantsController {
  constructor(
    private readonly restaurantsService: RestaurantsService,
    private readonly userService: UserService,
  ) {}

  private async getTenantId(userId: string): Promise<string | null> {
    const user = await this.userService.getUserById(userId);
    return user?.tenantId ? user.tenantId.toString() : null;
  }

  @Roles(Role.OWNER)
  @Post()
  async create(
    @CurrentUser() user: JwtPayload,
    @Body() dto: CreateRestaurantDto,
  ) {
    const tenantId = await this.getTenantId(user.sub);
    return this.restaurantsService.create(tenantId, user.sub, dto);
  }

  @Get()
  async findAll(
    @CurrentUser() user: JwtPayload,
    @Query() query: RestaurantQueryDto,
  ) {
    const tenantId = await this.getTenantId(user.sub);
    return this.restaurantsService.findAllForTenant(tenantId, query);
  }

  @Get(':id')
  async findOne(@CurrentUser() user: JwtPayload, @Param('id') id: string) {
    const tenantId = await this.getTenantId(user.sub);
    return this.restaurantsService.findOne(tenantId, id);
  }

  @Roles(Role.OWNER, Role.MANAGER)
  @Patch(':id')
  async update(
    @CurrentUser() user: JwtPayload,
    @Param('id') id: string,
    @Body() dto: UpdateRestaurantDto,
  ) {
    const tenantId = await this.getTenantId(user.sub);
    return this.restaurantsService.update(tenantId, id, dto);
  }

  @Roles(Role.OWNER)
  @HttpCode(HttpStatus.OK)
  @Delete(':id')
  async remove(@CurrentUser() user: JwtPayload, @Param('id') id: string) {
    const tenantId = await this.getTenantId(user.sub);
    return this.restaurantsService.softDelete(tenantId, id);
  }
}