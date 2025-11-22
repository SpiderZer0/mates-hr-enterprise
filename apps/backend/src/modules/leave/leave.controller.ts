import { Controller, Get, Post, Body, Patch, Param } from '@nestjs/common';
import { LeaveService } from './leave.service';
import { CreateLeaveDto } from './dto/create-leave.dto';
import { ApproveLeaveDto } from './dto/approve-leave.dto';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Leaves')
@Controller('leaves')
export class LeaveController {
    constructor(private readonly leaveService: LeaveService) { }

    @Post()
    @ApiOperation({ summary: 'Create a leave request' })
    create(@Body() createLeaveDto: CreateLeaveDto) {
        return this.leaveService.create(createLeaveDto);
    }

    @Get()
    @ApiOperation({ summary: 'Get all leave requests' })
    findAll() {
        return this.leaveService.findAll();
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get a leave request by ID' })
    findOne(@Param('id') id: string) {
        return this.leaveService.findOne(id);
    }

    @Patch(':id/approve')
    @ApiOperation({ summary: 'Approve or reject a leave request' })
    approve(@Param('id') id: string, @Body() approveLeaveDto: ApproveLeaveDto) {
        return this.leaveService.approve(id, approveLeaveDto);
    }

    @Get('balances/:employeeId')
    @ApiOperation({ summary: 'Get leave balances for an employee' })
    getBalances(@Param('employeeId') employeeId: string) {
        return this.leaveService.getBalances(employeeId);
    }
}
