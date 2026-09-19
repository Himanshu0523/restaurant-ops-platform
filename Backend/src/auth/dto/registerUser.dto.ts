import { IsEmail, isNotEmpty, IsNotEmpty, IsString } from 'class-validator';


export class RegisterDto {
    @IsString()
    fname: string;

    @IsString()
    lname: string;

    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    password: string;
}