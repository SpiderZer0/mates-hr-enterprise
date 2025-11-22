import { IsString, IsEmail, IsOptional, IsDateString, IsEnum } from 'class-validator';

export class CreateEmployeeDto {
    @IsString()
    firstName: string;

    @IsString()
    lastName: string;

    @IsEmail()
    email: string;

    @IsString()
    employeeCode: string;

    @IsOptional()
    @IsString()
    departmentId?: string;

    @IsOptional()
    @IsString()
    position?: string;

    @IsDateString()
    joinDate: string;

    @IsOptional()
    @IsString()
    managerId?: string;

    @IsOptional()
    @IsEnum(['FULL_TIME', 'PART_TIME', 'CONTRACT', 'INTERN'])
    employmentType?: string;

    @IsOptional()
    @IsString()
    phoneNumber?: string;
}
