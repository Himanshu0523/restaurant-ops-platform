import {
  IsBoolean,
  IsInt,
  IsOptional,
  IsString,
  Max,
  min,
  Min,
} from 'class-validator';



export class UpdateRestaurantSettingsDto {
    // Order settings
    @IsOptional()
    @IsBoolean()
    autoAcceptOrders?: boolean;

    @IsOptional()
    @IsInt()
    @Min(1)
    defaultPreparationTimeMinutes?: number;

    @IsOptional()
    @IsInt()
    @Min(1)
    @Max(120)
    maxPreparationTimeMinutes?: number;

    // Reservation settings
    @IsOptional()
    @IsBoolean()
    autoConfirmReservation?: boolean;

    @IsOptional()
    @IsInt()
    @Min(0)
    @Max(120)
    reservationGracePeriodMinutes?: Number;

    // Delivery
    @IsOptional()
    @IsBoolean()
    enableDelivery?: boolean;

    @IsOptional()
    @IsInt()
    @Min(0)
    @Max(100)
    deliveryRadiusKm?: number;

    // Inventory
    @IsOptional()
    @IsBoolean()
    enableLowStockAlerts?: boolean;

    @IsOptional()
    @IsBoolean()
    enableAutoInventoryDeduction?: boolean;

    // Ai
    @IsOptional()
    @IsBoolean()
    enableAtRecommendation?: boolean;

    @IsOptional()
    @IsBoolean()
    enableDemandForecasting?: boolean;

    @IsOptional()
    @IsBoolean()
    enableAIManager?: boolean;

    // Custormer
    @IsOptional()
    @IsBoolean()
    enableCustomerReviews?: boolean;
    
    @IsOptional()
    @IsBoolean()
    enableLoyaltyProgram?: boolean;
    
    // Notification
    @IsOptional()
    @IsBoolean()
    enableCustomerNotifications?: boolean;

    @IsOptional()
    @IsBoolean()
    enableStaffNotifications?: boolean;
}