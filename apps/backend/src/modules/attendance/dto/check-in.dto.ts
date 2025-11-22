import { IsString, IsOptional, IsNumber, IsLatitude, IsLongitude } from 'class-validator';

export class CheckInDto {
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
