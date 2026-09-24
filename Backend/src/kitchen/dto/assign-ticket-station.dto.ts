import {
  IsEnum,
  IsMongoId,
} from 'class-validator';

import {
  KitchenStationType,
} from '../kitchen.types.js';

export class AssignTicketStationDto {
  @IsEnum(KitchenStationType)
  station: KitchenStationType;

  @IsMongoId()
  itemId: string;
}
