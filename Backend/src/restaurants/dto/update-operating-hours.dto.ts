import {
  IsBoolean,
  IsEnum,
  IsString,
  Matches,
} from 'class-validator';



export enum DayOfWeek {
    MONDAY = 'monday',
    TUESDAY = 'tuesday',
    WEDNESDAY = 'wednesday',
    THURSDAY = 'thursday',
    FRIDAY = 'friday',
    SATURDAY = 'saturday',
    SUNDAY = 'sunday',
}


export class OperatingDayDto {
    @IsEnum(DayOfWeek)
    day: DayOfWeek;

    @IsBoolean()
    isOpen: boolean;

    @IsString()
    @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/)
    openingTime: string;

    @IsString()
    @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/)
    closingTime: string;
}



export class UpdateOperatingHoursDto {
    days: OperatingDayDto[];
}