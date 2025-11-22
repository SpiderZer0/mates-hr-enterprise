'use client';

import { useState } from 'react';
import {
    Clock, CheckCircle, XCircle, AlertCircle, Calendar,
    Download, Filter, Search, Users, TrendingUp, Award,
    Activity, Timer, Coffee, Briefcase, MapPin, Phone,
    Mail, BarChart3, Target, Zap, Brain, Bell, ArrowRight
} from 'lucide-react';
import { Card, CardContent } from '../../../../packages/ui/src/index';

// Mock Attendance Data
const TODAY_ATTENDANCE = [
    { id: 'EMP001', name: 'Ahmed Hassan', avatar: 'AH', color: 'bg-blue-500', status: 'present', checkIn: '08:45', checkOut: null, hours: 0, department: 'Engineering' },
    { id: 'EMP002', name: 'Sarah Mohamed', avatar: 'SM', color: 'bg-purple-500', status: 'present', checkIn: '08:30', checkOut: null, hours: 0, department: 'Product' },
    { id: 'EMP003', name: 'Omar Farouk', avatar: 'OF', color: 'bg-green-500', status: 'leave', checkIn: null, checkOut: null, hours: 0, department: 'Design' },
    { id: 'EMP004', name: 'Layla Ahmed', avatar: 'LA', color: 'bg-pink-500', status: 'present', checkIn: '09:15', checkOut: null, hours: 0, department: 'Human Resources' },
    { id: 'EMP005', name: 'Karim Mahmoud', avatar: 'KM', color: 'bg-indigo-500', status: 'late', checkIn: '09:30', checkOut: null, hours: 0, department: 'Engineering' },
    { id: 'EMP006', name: 'Nour Ali', avatar: 'NA', color: 'bg-red-500', status: 'absent', checkIn: null, checkOut: null, hours: 0, department: 'Marketing' },
    { id: 'EMP007', name: 'Youssef Ibrahim', avatar: 'YI', color: 'bg-orange-500', status: 'present', checkIn: '08:50', checkOut: null, hours: 0, department: 'Sales' },
    { id: 'EMP008', name: 'Hana Mostafa', avatar: 'HM', color: 'bg-teal-500', status: 'leave', checkIn: null, checkOut: null, hours: 0, department: 'Engineering' },
];

// Mock weekly pattern data
const WEEKLY_PATTERN = [
    { day: 'Mon', present: 23, late: 2, absent: 0 },
    { day: 'Tue', present: 22, late: 1, absent: 2 },
    { day: 'Wed', present: 24, late: 1, absent: 0 },
    { day: 'Thu', present: 23, late: 2, absent: 0 },
    { day: 'Fri', present: 21, late: 3, absent: 1 },
];

export default function AttendanceView() {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [viewMode, setViewMode] = useState<'today' | 'calendar'>('today');
    const [filterStatus, setFilterStatus] = useState('all');

    const presentCount = TODAY_ATTENDANCE.filter(e => e.status === 'present' || e.status === 'late').length;
    const lateCount = TODAY_ATTENDANCE.filter(e => e.status === 'late').length;
    const absentCount = TODAY_ATTENDANCE.filter(e => e.status === 'absent').length;
    const leaveCount = TODAY_ATTENDANCE.filter(e => e.status === 'leave').length;
    const totalEmployees = TODAY_ATTENDANCE.length;
    const attendanceRate = Math.round((presentCount / (totalEmployees - leaveCount)) * 100);

    const filteredAttendance = filterStatus === 'all'
        ? TODAY_ATTENDANCE
        : TODAY_ATTENDANCE.filter(e => e.status === filterStatus);

    const stats = [
        { label: 'Present Today', value: presentCount, total: totalEmployees, icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50', percentage: attendanceRate },
        { label: 'Late Arrivals', value: lateCount, total: totalEmployees, icon: Clock, color: 'text-yellow-600', bg: 'bg-yellow-50', percentage: Math.round((lateCount / totalEmployees) * 100) },
        { label: 'Absent', value: absentCount, total: totalEmployees, icon: XCircle, color: 'text-red-600', bg: 'bg-red-50', percentage: Math.round((absentCount / totalEmployees) * 100) },
        { label: 'On Leave', value: leaveCount, total: totalEmployees, icon: Coffee, color: 'text-blue-600', bg: 'bg-blue-50', percentage: Math.round((leaveCount / totalEmployees) * 100) },
    ];

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Attendance Tracking</h2>
                    <p className="text-gray-500">Real-time workforce monitoring & analytics</p>
                </div>
                <div className="flex gap-3">
                    <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors">
                        <Download className="h-4 w-4 mr-2" />
                        Export Report
                    </button>
                </div>
            </div>

            {/* AI Insights */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <Card className="border-l-4 border-l-green-500 bg-gradient-to-r from-green-50 to-white">
                    <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-3 bg-green-100 rounded-lg">
                                    <TrendingUp className="h-6 w-6 text-green-600" />
                                </div>
                                <div>
                                    <p className="text-xs font-medium text-green-600 uppercase tracking-wide">📊 Attendance Rate</p>
                                    <p className="text-2xl font-bold text-gray-900 mt-1">{attendanceRate}%</p>
                                    <p className="text-sm text-gray-600 mt-1">{presentCount}/{totalEmployees - leaveCount} present today</p>
                                </div>
                            </div>
                            <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">View →</button>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-l-4 border-l-yellow-500 bg-gradient-to-r from-yellow-50 to-white">
                    <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-3 bg-yellow-100 rounded-lg">
                                    <Clock className="h-6 w-6 text-yellow-600" />
                                </div>
                                <div>
                                    <p className="text-xs font-medium text-yellow-600 uppercase tracking-wide">⏰ Late Arrivals</p>
                                    <p className="text-2xl font-bold text-gray-900 mt-1">{lateCount}</p>
                                    <p className="text-sm text-gray-600 mt-1">Checked in after 9:00 AM</p>
                                </div>
                            </div>
                            <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">View →</button>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-l-4 border-l-red-500 bg-gradient-to-r from-red-50 to-white">
                    <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-3 bg-red-100 rounded-lg">
                                    <Brain className="h-6 w-6 text-red-600" />
                                </div>
                                <div>
                                    <p className="text-xs font-medium text-red-600 uppercase tracking-wide">🚨 At Risk</p>
                                    <p className="text-2xl font-bold text-gray-900 mt-1">2</p>
                                    <p className="text-sm text-gray-600 mt-1">High absenteeism pattern</p>
                                </div>
                            </div>
                            <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">View →</button>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                        <Card key={index} className="border-none shadow-sm hover:shadow-md transition-shadow">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">{stat.label}</p>
                                        <div className="flex items-baseline gap-2 mt-1">
                                            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                                            <p className="text-sm text-gray-500">/{stat.total}</p>
                                        </div>
                                    </div>
                                    <div className={`p-3 rounded-full ${stat.bg}`}>
                                        <Icon className={`h-6 w-6 ${stat.color}`} />
                                    </div>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div
                                        className={`h-2 rounded-full ${stat.color.replace('text-', 'bg-')}`}
                                        style={{ width: `${stat.percentage}%` }}
                                    ></div>
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            {/* Weekly Pattern Chart */}
            <Card className="border-none shadow-sm">
                <CardContent className="p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-6">Weekly Attendance Pattern</h3>
                    <div className="flex items-end justify-between gap-4 h-48">
                        {WEEKLY_PATTERN.map((day) => {
                            const maxValue = 25;
                            const presentHeight = (day.present / maxValue) * 100;
                            const lateHeight = (day.late / maxValue) * 100;
                            const absentHeight = (day.absent / maxValue) * 100;

                            return (
                                <div key={day.day} className="flex-1 flex flex-col items-center gap-2">
                                    <div className="w-full flex flex-col-reverse gap-1">
                                        {day.absent > 0 && (
                                            <div
                                                className="w-full bg-red-500 rounded-t transition-all hover:opacity-80 cursor-pointer"
                                                style={{ height: `${absentHeight * 1.5}px` }}
                                                title={`${day.absent} absent`}
                                            ></div>
                                        )}
                                        {day.late > 0 && (
                                            <div
                                                className="w-full bg-yellow-500 rounded-t transition-all hover:opacity-80 cursor-pointer"
                                                style={{ height: `${lateHeight * 1.5}px` }}
                                                title={`${day.late} late`}
                                            ></div>
                                        )}
                                        <div
                                            className="w-full bg-green-500 rounded-t transition-all hover:opacity-80 cursor-pointer"
                                            style={{ height: `${presentHeight * 1.5}px` }}
                                            title={`${day.present} present`}
                                        ></div>
                                    </div>
                                    <span className="text-sm font-medium text-gray-700">{day.day}</span>
                                </div>
                            );
                        })}
                    </div>
                    <div className="flex items-center justify-center gap-6 mt-6 text-sm">
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-green-500 rounded"></div>
                            <span className="text-gray-600">Present</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-yellow-500 rounded"></div>
                            <span className="text-gray-600">Late</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-red-500 rounded"></div>
                            <span className="text-gray-600">Absent</span>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* View Controls */}
            <Card className="border-none shadow-sm">
                <CardContent className="p-4">
                    <div className="flex flex-col md:flex-row gap-4 items-center">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search employees..."
                                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            />
                        </div>
                        <div className="flex gap-2">
                            <select
                                className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white"
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                            >
                                <option value="all">All Status</option>
                                <option value="present">Present</option>
                                <option value="late">Late</option>
                                <option value="absent">Absent</option>
                                <option value="leave">On Leave</option>
                            </select>

                            <div className="flex border border-gray-200 rounded-lg overflow-hidden">
                                <button
                                    onClick={() => setViewMode('today')}
                                    className={`px-4 py-2 text-sm font-medium ${viewMode === 'today' ? 'bg-primary-50 text-primary-600' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
                                >
                                    Today
                                </button>
                                <button
                                    onClick={() => setViewMode('calendar')}
                                    className={`px-4 py-2 text-sm font-medium ${viewMode === 'calendar' ? 'bg-primary-50 text-primary-600' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
                                >
                                    Calendar
                                </button>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Attendance Grid */}
            {viewMode === 'today' && (
                <Card className="border-none shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-100">
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Employee</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Department</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Check-In</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Check-Out</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {filteredAttendance.map((employee) => (
                                    <tr key={employee.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center">
                                                <div className={`h-10 w-10 rounded-full ${employee.color} flex items-center justify-center text-white font-bold text-sm`}>
                                                    {employee.avatar}
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-gray-900">{employee.name}</div>
                                                    <div className="text-sm text-gray-500">{employee.id}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm text-gray-900">{employee.department}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm text-gray-900 font-medium">
                                                {employee.checkIn || '-'}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm text-gray-900 font-medium">
                                                {employee.checkOut || '-'}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${employee.status === 'present' ? 'bg-green-100 text-green-800' :
                                                    employee.status === 'late' ? 'bg-yellow-100 text-yellow-800' :
                                                        employee.status === 'absent' ? 'bg-red-100 text-red-800' :
                                                            'bg-blue-100 text-blue-800'
                                                }`}>
                                                {employee.status === 'present' && <CheckCircle className="h-3 w-3 mr-1" />}
                                                {employee.status === 'late' && <Clock className="h-3 w-3 mr-1" />}
                                                {employee.status === 'absent' && <XCircle className="h-3 w-3 mr-1" />}
                                                {employee.status === 'leave' && <Coffee className="h-3 w-3 mr-1" />}
                                                {employee.status.charAt(0).toUpperCase() + employee.status.slice(1)}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Card>
            )}

            {viewMode === 'calendar' && (
                <Card className="border-none shadow-sm">
                    <CardContent className="p-6">
                        <div className="text-center py-12">
                            <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">Calendar View</h3>
                            <p className="text-gray-600">Interactive monthly calendar with color-coded attendance coming soon</p>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
