import { IsString, IsNumber, IsDateString } from 'class-validator';

export class GeneratePayrollDto {
    @IsString()
    employeeId: string;

    @IsNumber()
    month: number; // 1-12

    @IsNumber()
    year: number;
}
