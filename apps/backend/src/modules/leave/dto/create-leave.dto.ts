import { IsString, IsDateString, IsNumber, IsOptional } from 'class-validator';

export class CreateLeaveDto {
    @IsString()
    employeeId: string;

    @IsString()
    leaveTypeId: string;

    @IsDateString()
    startDate: string;

    @IsDateString()
    endDate: string;

    @IsString()
    reason: string;

    @IsOptional()
    @IsString()
    documentUrl?: string;
}
