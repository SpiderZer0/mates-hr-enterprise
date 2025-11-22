import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { AttendanceService } from './attendance.service';
import { CheckInDto } from './dto/check-in.dto';
import { CheckOutDto } from './dto/check-out.dto';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Attendance')
@Controller('attendance')
export class AttendanceController {
    constructor(private readonly attendanceService: AttendanceService) { }

    @Post('check-in')
    @ApiOperation({ summary: 'Check in an employee' })
    checkIn(@Body() checkInDto: CheckInDto) {
        return this.attendanceService.checkIn(checkInDto);
    }

    @Post('check-out')
    @ApiOperation({ summary: 'Check out an employee' })
    checkOut(@Body() checkOutDto: CheckOutDto) {
        return this.attendanceService.checkOut(checkOutDto);
    }

    @Get()
    @ApiOperation({ summary: 'Get all attendance records' })
    findAll() {
        return this.attendanceService.findAll();
    }

    @Get('stats')
    @ApiOperation({ summary: 'Get attendance statistics' })
    getStats() {
        return this.attendanceService.getStats();
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get attendance record by ID' })
    findOne(@Param('id') id: string) {
        return this.attendanceService.findOne(id);
    }
}
