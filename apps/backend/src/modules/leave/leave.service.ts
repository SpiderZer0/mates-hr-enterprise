import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreateLeaveDto } from './dto/create-leave.dto';
import { ApproveLeaveDto } from './dto/approve-leave.dto';

@Injectable()
export class LeaveService {
    constructor(private prisma: PrismaService) { }

    async create(createLeaveDto: CreateLeaveDto) {
        const { employeeId, leaveTypeId, startDate, endDate, reason, documentUrl } = createLeaveDto;

        const start = new Date(startDate);
        const end = new Date(endDate);
        const totalDays = (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24) + 1;

        if (totalDays <= 0) {
            throw new BadRequestException('End date must be after start date');
        }

        // Check leave balance (simplified logic for now)
        const leaveType = await this.prisma.leaveType.findUnique({ where: { id: leaveTypeId } });
        if (!leaveType) {
            throw new NotFoundException('Leave type not found');
        }

        // TODO: Check actual balance against used leaves

        return this.prisma.leave.create({
            data: {
                employeeId,
                leaveTypeId,
                startDate: start,
                endDate: end,
                totalDays,
                reason,
                documentUrl,
                status: 'PENDING',
            },
        });
    }

    async findAll() {
        return this.prisma.leave.findMany({
            include: {
                employee: {
                    include: { user: true },
                },
                leaveType: true,
            },
            orderBy: { createdAt: 'desc' },
        });
    }

    async findOne(id: string) {
        const leave = await this.prisma.leave.findUnique({
            where: { id },
            include: {
                employee: {
                    include: { user: true },
                },
                leaveType: true,
            },
        });
        if (!leave) {
            throw new NotFoundException(`Leave request with ID ${id} not found`);
        }
        return leave;
    }

    async approve(id: string, approveLeaveDto: ApproveLeaveDto) {
        const { approved, approverId, rejectionReason } = approveLeaveDto;

        const leave = await this.prisma.leave.findUnique({ where: { id } });
        if (!leave) {
            throw new NotFoundException(`Leave request with ID ${id} not found`);
        }

        if (leave.status !== 'PENDING') {
            throw new BadRequestException('Leave request is already processed');
        }

        return this.prisma.leave.update({
            where: { id },
            data: {
                status: approved ? 'APPROVED' : 'REJECTED',
                approvedById: approved ? approverId : null,
                approvalDate: new Date(),
                rejectionReason: approved ? null : rejectionReason,
            },
        });
    }

    async getBalances(employeeId: string) {
        const leaveTypes = await this.prisma.leaveType.findMany();
        const leaves = await this.prisma.leave.findMany({
            where: {
                employeeId,
                status: 'APPROVED',
                startDate: {
                    gte: new Date(new Date().getFullYear(), 0, 1), // Current year
                },
            },
        });

        return leaveTypes.map((type) => {
            const used = leaves
                .filter((l) => l.leaveTypeId === type.id)
                .reduce((sum, l) => sum + l.totalDays, 0);
            return {
                leaveType: type,
                allowed: type.daysAllowed,
                used,
                remaining: type.daysAllowed - used,
            };
        });
    }
}
