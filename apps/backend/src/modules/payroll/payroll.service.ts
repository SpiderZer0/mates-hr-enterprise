import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { GeneratePayrollDto } from './dto/generate-payroll.dto';

@Injectable()
export class PayrollService {
    constructor(private prisma: PrismaService) { }

    async generate(generatePayrollDto: GeneratePayrollDto) {
        const { employeeId, month, year } = generatePayrollDto;

        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 0);

        // Check if payroll already exists
        const existingPayroll = await this.prisma.payroll.findFirst({
            where: {
                employeeId,
                month: startDate,
            },
        });

        if (existingPayroll) {
            throw new BadRequestException('Payroll already generated for this month');
        }

        // Fetch employee details
        const employee = await this.prisma.employee.findUnique({
            where: { id: employeeId },
            include: {
                attendances: {
                    where: {
                        date: {
                            gte: startDate,
                            lte: endDate,
                        },
                    },
                },
                leaves: {
                    where: {
                        status: 'APPROVED',
                        startDate: {
                            gte: startDate,
                            lte: endDate,
                        },
                    },
                },
            },
        });

        if (!employee) {
            throw new NotFoundException('Employee not found');
        }

        // Simplified calculation logic
        // In a real app, this would be much more complex (tax, insurance, etc.)
        const baseSalary = 5000; // Mock base salary, should be in Employee model
        const dailyRate = baseSalary / 30;

        // Calculate deductions based on absences
        // This is a placeholder logic
        const workingDays = 22; // Mock working days
        const presentDays = employee.attendances.filter(a => a.status === 'PRESENT').length;
        const leaveDays = employee.leaves.reduce((sum, l) => sum + l.totalDays, 0);

        const absentDays = Math.max(0, workingDays - presentDays - leaveDays);
        const deductions = absentDays * dailyRate;

        const netSalary = baseSalary - deductions;

        return this.prisma.payroll.create({
            data: {
                employeeId,
                month: startDate,
                baseSalary,
                netSalary,
                totalDeductions: deductions,
                status: 'PENDING',
                items: {
                    create: [
                        {
                            type: 'DEDUCTION',
                            name: 'Absence Deduction',
                            amount: deductions,
                            description: `${absentDays} days absent`,
                        },
                    ],
                },
            },
            include: {
                items: true,
            },
        });
    }

    async findAll() {
        return this.prisma.payroll.findMany({
            include: {
                employee: {
                    include: { user: true },
                },
                items: true,
            },
            orderBy: { month: 'desc' },
        });
    }

    async findOne(id: string) {
        const payroll = await this.prisma.payroll.findUnique({
            where: { id },
            include: {
                employee: {
                    include: { user: true },
                },
                items: true,
            },
        });
        if (!payroll) {
            throw new NotFoundException(`Payroll record with ID ${id} not found`);
        }
        return payroll;
    }

    async getSlips(employeeId: string) {
        return this.prisma.payroll.findMany({
            where: { employeeId },
            include: {
                items: true,
            },
            orderBy: { month: 'desc' },
        });
    }
}
