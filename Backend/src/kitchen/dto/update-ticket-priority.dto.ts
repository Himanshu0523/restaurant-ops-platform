import { IsEnum } from 'class-validator';

import {
  KitchenPriority,
} from '../kitchen.types.js';

export class UpdateTicketPriorityDto {
  @IsEnum(KitchenPriority)
  priority: KitchenPriority;
}
