import { IsEmail, IsOptional, IsString } from "class-validator";



export class UpdateContactDto {
    @IsOptional()
    @IsEmail()
    email ?: string;

    @IsOptional()
    @IsString()
    phone?: string;

    @IsOptional()
    @IsString()
    alternatePhone?: string;


    @IsOptional()
    @IsString()
    website?: string;
}