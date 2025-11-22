import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class EmployeesService {
    constructor(private prisma: PrismaService) { }

    async create(createEmployeeDto: CreateEmployeeDto) {
        const {
            firstName,
            lastName,
            email,
            employeeCode,
            departmentId,
            position,
            joinDate,
            managerId,
            employmentType,
            phoneNumber,
        } = createEmployeeDto;

        // Create User and Employee in a transaction
        return this.prisma.$transaction(async (prisma) => {
            // 1. Create User
            const hashedPassword = await bcrypt.hash('Password@123', 10); // Default password
            const user = await prisma.user.create({
                data: {
                    email,
                    username: email, // Use email as username initially
                    password: hashedPassword,
                    firstName,
                    lastName,
                    phoneNumber,
                    userRoles: {
                        create: {
                            role: {
                                connectOrCreate: {
                                    where: { name_companyId: { name: 'Employee', companyId: 'default-company' } }, // Assuming default company for now
                                    create: { name: 'Employee', companyId: 'default-company' },
                                },
                            },
                        },
                    },
                },
            });

            // 2. Create Employee
            const employee = await prisma.employee.create({
                data: {
                    userId: user.id,
                    employeeCode,
                    departmentId,
                    position,
                    joinDate: new Date(joinDate),
                    managerId,
                    employmentType,
                    companyId: 'default-company', // Hardcoded for now, should come from context
                },
                include: {
                    user: true,
                    department: true,
                },
            });

            return employee;
        });
    }

    async findAll() {
        return this.prisma.employee.findMany({
            include: {
                user: true,
                department: true,
            },
        });
    }

    async findOne(id: string) {
        const employee = await this.prisma.employee.findUnique({
            where: { id },
            include: {
                user: true,
                department: true,
                attendances: {
                    take: 5,
                    orderBy: { date: 'desc' },
                },
                leaves: {
                    take: 5,
                    orderBy: { createdAt: 'desc' }
                }
            },
        });

        if (!employee) {
            throw new NotFoundException(`Employee with ID ${id} not found`);
        }

        return employee;
    }

    async update(id: string, updateEmployeeDto: UpdateEmployeeDto) {
        const employee = await this.prisma.employee.findUnique({ where: { id } });
        if (!employee) {
            throw new NotFoundException(`Employee with ID ${id} not found`);
        }

        const { firstName, lastName, email, ...employeeData } = updateEmployeeDto;

        // Update User if needed
        if (firstName || lastName || email) {
            await this.prisma.user.update({
                where: { id: employee.userId },
                data: {
                    firstName,
                    lastName,
                    email,
                },
            });
        }

        // Update Employee
        return this.prisma.employee.update({
            where: { id },
            data: {
                ...employeeData,
                joinDate: employeeData.joinDate ? new Date(employeeData.joinDate) : undefined,
            },
            include: {
                user: true,
                department: true,
            },
        });
    }

    async remove(id: string) {
        return this.prisma.employee.delete({
            where: { id },
        });
    }
}
