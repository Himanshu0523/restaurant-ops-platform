import { IsEnum, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';
import { TenantPlan, TenantStatus } from '../tenant.types.js';

export class UpdateTenantDto {
    @IsOptional()
    @IsString()
    @MinLength(2)
    @MaxLength(80)
    name?: string;

    @IsOptional()
    @IsEnum(TenantPlan)
    plan?: TenantPlan;

    @IsOptional()
    @IsEnum(TenantStatus)
    status?: TenantStatus;
}