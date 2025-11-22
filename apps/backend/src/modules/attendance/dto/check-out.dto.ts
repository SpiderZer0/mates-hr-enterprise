import { IsString, IsOptional, IsNumber, IsLatitude, IsLongitude } from 'class-validator';

export class CheckOutDto {
    @IsString()
    employeeId: string;

    @IsOptional()
    @IsLatitude()
    latitude?: number;

    @IsOptional()
    @IsLongitude()
    longitude?: number;

    @IsOptional()
    @IsString()
    notes?: string;
}
