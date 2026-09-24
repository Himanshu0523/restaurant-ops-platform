import { IsEnum } from 'class-validator';

import {
  KitchenTicketItemStatus,
} from '../kitchen.types.js';

export class UpdateTicketItemStatusDto {
  @IsEnum(KitchenTicketItemStatus)
  status: KitchenTicketItemStatus;
}
