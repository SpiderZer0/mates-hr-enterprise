import { IsString, IsBoolean, IsOptional } from 'class-validator';

export class ApproveLeaveDto {
    @IsBoolean()
    approved: boolean;

    @IsString()
    approverId: string;

    @IsOptional()
    @IsString()
    rejectionReason?: string;
}
