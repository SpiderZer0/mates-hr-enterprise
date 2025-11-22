import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { PayrollService } from './payroll.service';
import { GeneratePayrollDto } from './dto/generate-payroll.dto';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Payroll')
@Controller('payroll')
export class PayrollController {
    constructor(private readonly payrollService: PayrollService) { }

    @Post('generate')
    @ApiOperation({ summary: 'Generate payroll for an employee' })
    generate(@Body() generatePayrollDto: GeneratePayrollDto) {
        return this.payrollService.generate(generatePayrollDto);
    }

    @Get()
    @ApiOperation({ summary: 'Get all payroll records' })
    findAll() {
        return this.payrollService.findAll();
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get a payroll record by ID' })
    findOne(@Param('id') id: string) {
        return this.payrollService.findOne(id);
    }

    @Get('slips/:employeeId')
    @ApiOperation({ summary: 'Get payslips for an employee' })
    getSlips(@Param('employeeId') employeeId: string) {
        return this.payrollService.getSlips(employeeId);
    }
}
