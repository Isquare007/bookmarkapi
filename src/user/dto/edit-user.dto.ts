import { IsEmail, IsOptional } from 'class-validator';

export class EditDto {
    
    @IsOptional()
    firstName?: string

    @IsOptional()
    lastName: string

    @IsOptional()
    @IsEmail()
    email: string
}