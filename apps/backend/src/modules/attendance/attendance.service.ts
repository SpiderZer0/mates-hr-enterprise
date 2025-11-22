import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CheckInDto } from './dto/check-in.dto';
import { CheckOutDto } from './dto/check-out.dto';

@Injectable()
export class AttendanceService {
    constructor(private prisma: PrismaService) { }

    async checkIn(checkInDto: CheckInDto) {
        const { employeeId, notes } = checkInDto;
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const existingAttendance = await this.prisma.attendance.findFirst({
            where: {
                employeeId,
                date: today,
            },
        });

        if (existingAttendance) {
            throw new BadRequestException('Employee already checked in for today');
        }

        return this.prisma.attendance.create({
            data: {
                employeeId,
                date: today,
                checkIn: new Date(),
                status: 'PRESENT',
                notes,
            },
        });
    }

    async checkOut(checkOutDto: CheckOutDto) {
        const { employeeId, notes } = checkOutDto;
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const attendance = await this.prisma.attendance.findFirst({
            where: {
                employeeId,
                date: today,
            },
        });

        if (!attendance) {
            throw new BadRequestException('Employee has not checked in today');
        }

        if (attendance.checkOut) {
            throw new BadRequestException('Employee already checked out');
        }

        const checkOutTime = new Date();
        const checkInTime = new Date(attendance.checkIn!);
        const workingHours = (checkOutTime.getTime() - checkInTime.getTime()) / (1000 * 60 * 60);

        return this.prisma.attendance.update({
            where: { id: attendance.id },
            data: {
                checkOut: checkOutTime,
                workingHours,
                notes: notes ? `${attendance.notes ? attendance.notes + '\n' : ''}${notes}` : attendance.notes,
            },
        });
    }

    async findAll() {
        return this.prisma.attendance.findMany({
            include: {
                employee: {
                    include: {
                        user: true,
                    },
                },
            },
            orderBy: {
                date: 'desc',
            },
        });
    }

    async findOne(id: string) {
        const attendance = await this.prisma.attendance.findUnique({
            where: { id },
            include: {
                employee: true,
            },
        });
        if (!attendance) {
            throw new NotFoundException(`Attendance record with ID ${id} not found`);
        }
        return attendance;
    }

    async getStats() {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const totalEmployees = await this.prisma.employee.count();
        const presentToday = await this.prisma.attendance.count({
            where: {
                date: today,
                status: 'PRESENT',
            },
        });

        return {
            totalEmployees,
            presentToday,
            absentToday: totalEmployees - presentToday,
            attendanceRate: totalEmployees > 0 ? (presentToday / totalEmployees) * 100 : 0,
        };
    }
}
