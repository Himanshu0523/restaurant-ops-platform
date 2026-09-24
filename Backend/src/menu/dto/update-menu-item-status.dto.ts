import { IsEnum } from 'class-validator';
import { MenuItemStatus } from '../menu.types.js';

export class UpdateMenuItemStatusDto {
  @IsEnum(MenuItemStatus)
  status: MenuItemStatus;
}
