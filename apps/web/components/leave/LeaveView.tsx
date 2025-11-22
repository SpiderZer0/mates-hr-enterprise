'use client';

import { useState } from 'react';
import {
    Calendar, CheckCircle, XCircle, Clock, AlertCircle,
    Plus, Download, Filter, Search, Users, TrendingUp,
    FileText, Edit2, Trash2, Eye, Send, User, Mail,
    Phone, Building, Award, Target, Coffee, Heart,
    Plane, Umbrella, Home, Baby, GraduationCap, Brain
} from 'lucide-react';
import { Card, CardContent } from '../../../../packages/ui/src/index';

// Mock Leave Data
const LEAVE_REQUESTS = [
    {
        id: 'LR001',
        employeeId: 'EMP001',
        employeeName: 'Ahmed Hassan',
        avatar: 'AH',
        color: 'bg-blue-500',
        type: 'Annual',
        startDate: '2024-01-15',
        endDate: '2024-01-19',
        days: 5,
        reason: 'Family vacation',
        status: 'pending',
        appliedDate: '2024-01-05',
        department: 'Engineering'
    },
    {
        id: 'LR002',
        employeeId: 'EMP003',
        employeeName: 'Omar Farouk',
        avatar: 'OF',
        color: 'bg-green-500',
        type: 'Sick',
        startDate: '2024-01-10',
        endDate: '2024-01-11',
        days: 2,
        reason: 'Medical appointment',
        status: 'approved',
        appliedDate: '2024-01-08',
        department: 'Design'
    },
    {
        id: 'LR003',
        employeeId: 'EMP005',
        employeeName: 'Karim Mahmoud',
        avatar: 'KM',
        color: 'bg-indigo-500',
        type: 'Annual',
        startDate: '2024-01-20',
        endDate: '2024-01-22',
        days: 3,
        reason: 'Personal matters',
        status: 'pending',
        appliedDate: '2024-01-06',
        department: 'Engineering'
    },
    {
        id: 'LR004',
        employeeId: 'EMP008',
        employeeName: 'Hana Mostafa',
        avatar: 'HM',
        color: 'bg-teal-500',
        type: 'Annual',
        startDate: '2024-01-12',
        endDate: '2024-01-14',
        days: 3,
        reason: 'Wedding attendance',
        status: 'approved',
        appliedDate: '2024-01-02',
        department: 'Engineering'
    },
    {
        id: 'LR005',
        employeeId: 'EMP007',
        employeeName: 'Youssef Ibrahim',
        avatar: 'YI',
        color: 'bg-orange-500',
        type: 'Personal',
        startDate: '2024-01-25',
        endDate: '2024-01-25',
        days: 1,
        reason: 'Home repair',
        status: 'rejected',
        appliedDate: '2024-01-07',
        department: 'Sales'
    }
];

const LEAVE_BALANCES = [
    { type: 'Annual', used: 5, total: 20, icon: Plane, color: 'bg-blue-500', textColor: 'text-blue-600', bgLight: 'bg-blue-50' },
    { type: 'Sick', used: 3, total: 10, icon: Heart, color: 'bg-red-500', textColor: 'text-red-600', bgLight: 'bg-red-50' },
    { type: 'Personal', used: 2, total: 5, icon: Home, color: 'bg-purple-500', textColor: 'text-purple-600', bgLight: 'bg-purple-50' },
    { type: 'Unpaid', used: 0, total: '∞', icon: Coffee, color: 'bg-gray-500', textColor: 'text-gray-600', bgLight: 'bg-gray-50' },
];

export default function LeaveView() {
    const [filterStatus, setFilterStatus] = useState('all');
    const [showRequestForm, setShowRequestForm] = useState(false);

    const filteredRequests = filterStatus === 'all'
        ? LEAVE_REQUESTS
        : LEAVE_REQUESTS.filter(r => r.status === filterStatus);

    const pendingCount = LEAVE_REQUESTS.filter(r => r.status === 'pending').length;
    const approvedCount = LEAVE_REQUESTS.filter(r => r.status === 'approved').length;
    const upcomingLeaves = LEAVE_REQUESTS.filter(r => r.status === 'approved' && new Date(r.startDate) > new Date()).length;

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Leave Management</h2>
                    <p className="text-gray-500">Request, track, and manage employee leaves</p>
                </div>
                <div className="flex gap-3">
                    <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors">
                        <Download className="h-4 w-4 mr-2" />
                        Export Report
                    </button>
                    <button
                        onClick={() => setShowRequestForm(!showRequestForm)}
                        className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 shadow-sm transition-colors"
                    >
                        <Plus className="h-4 w-4 mr-2" />
                        Request Leave
                    </button>
                </div>
            </div>

            {/* AI Insights */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <Card className="border-l-4 border-l-blue-500 bg-gradient-to-r from-blue-50 to-white">
                    <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-3 bg-blue-100 rounded-lg">
                                    <Calendar className="h-6 w-6 text-blue-600" />
                                </div>
                                <div>
                                    <p className="text-xs font-medium text-blue-600 uppercase tracking-wide">📊 Upcoming Absences</p>
                                    <p className="text-2xl font-bold text-gray-900 mt-1">{upcomingLeaves}</p>
                                    <p className="text-sm text-gray-600 mt-1">Planned leaves next week</p>
                                </div>
                            </div>
                            <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">View →</button>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-l-4 border-l-orange-500 bg-gradient-to-r from-orange-50 to-white">
                    <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-3 bg-orange-100 rounded-lg">
                                    <AlertCircle className="h-6 w-6 text-orange-600" />
                                </div>
                                <div>
                                    <p className="text-xs font-medium text-orange-600 uppercase tracking-wide">⚠️ Conflict Alert</p>
                                    <p className="text-2xl font-bold text-gray-900 mt-1">1</p>
                                    <p className="text-sm text-gray-600 mt-1">Team overlap detected</p>
                                </div>
                            </div>
                            <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">View →</button>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-l-4 border-l-green-500 bg-gradient-to-r from-green-50 to-white">
                    <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-3 bg-green-100 rounded-lg">
                                    <TrendingUp className="h-6 w-6 text-green-600" />
                                </div>
                                <div>
                                    <p className="text-xs font-medium text-green-600 uppercase tracking-wide">🎯 Utilization</p>
                                    <p className="text-2xl font-bold text-gray-900 mt-1">35%</p>
                                    <p className="text-sm text-gray-600 mt-1">Average leave usage</p>
                                </div>
                            </div>
                            <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">View →</button>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Leave Balance Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {LEAVE_BALANCES.map((balance, index) => {
                    const Icon = balance.icon;
                    const remaining = typeof balance.total === 'number' ? balance.total - balance.used : balance.total;
                    const percentage = typeof balance.total === 'number' ? (balance.used / balance.total) * 100 : 0;

                    return (
                        <Card key={index} className="border-none shadow-sm hover:shadow-md transition-shadow">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">{balance.type} Leave</p>
                                        <div className="flex items-baseline gap-2 mt-1">
                                            <p className="text-2xl font-bold text-gray-900">{remaining}</p>
                                            <p className="text-sm text-gray-500">days left</p>
                                        </div>
                                    </div>
                                    <div className={`p-3 rounded-full ${balance.bgLight}`}>
                                        <Icon className={`h-6 w-6 ${balance.textColor}`} />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm text-gray-600">
                                        <span>Used: {balance.used}</span>
                                        <span>Total: {balance.total}</span>
                                    </div>
                                    {typeof balance.total === 'number' && (
                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                            <div
                                                className={`h-2 rounded-full ${balance.color}`}
                                                style={{ width: `${percentage}%` }}
                                            ></div>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            {/* Request Form Modal */}
            {showRequestForm && (
                <Card className="border-2 border-primary-200 shadow-lg">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-bold text-gray-900">Submit Leave Request</h3>
                            <button onClick={() => setShowRequestForm(false)} className="text-gray-400 hover:text-gray-600">
                                <XCircle className="h-5 w-5" />
                            </button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Leave Type</label>
                                <select className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white">
                                    <option>Annual Leave</option>
                                    <option>Sick Leave</option>
                                    <option>Personal Leave</option>
                                    <option>Unpaid Leave</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Duration</label>
                                <select className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white">
                                    <option>Full Day</option>
                                    <option>Half Day - Morning</option>
                                    <option>Half Day - Afternoon</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                                <input type="date" className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                                <input type="date" className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500" />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Reason</label>
                                <textarea
                                    rows={3}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                                    placeholder="Please provide a brief reason for your leave request..."
                                ></textarea>
                            </div>
                        </div>
                        <div className="flex justify-end gap-3 mt-6">
                            <button
                                onClick={() => setShowRequestForm(false)}
                                className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button className="px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors">
                                Submit Request
                            </button>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Filters */}
            <Card className="border-none shadow-sm">
                <CardContent className="p-4">
                    <div className="flex flex-col md:flex-row gap-4 items-center">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search leave requests..."
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
                                <option value="pending">Pending</option>
                                <option value="approved">Approved</option>
                                <option value="rejected">Rejected</option>
                            </select>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Leave Requests Table */}
            <Card className="border-none shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-100">
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Employee</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Leave Type</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Duration</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Dates</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredRequests.map((request) => (
                                <tr key={request.id} className="hover:bg-gray-50 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center">
                                            <div className={`h-10 w-10 rounded-full ${request.color} flex items-center justify-center text-white font-bold text-sm`}>
                                                {request.avatar}
                                            </div>
                                            <div className="ml-4">
                                                <div className="text-sm font-medium text-gray-900">{request.employeeName}</div>
                                                <div className="text-sm text-gray-500">{request.department}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm text-gray-900">{request.type}</div>
                                        <div className="text-xs text-gray-500">Applied {new Date(request.appliedDate).toLocaleDateString()}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm font-medium text-gray-900">{request.days} {request.days === 1 ? 'day' : 'days'}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm text-gray-900">{new Date(request.startDate).toLocaleDateString()}</div>
                                        <div className="text-xs text-gray-500">to {new Date(request.endDate).toLocaleDateString()}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${request.status === 'approved' ? 'bg-green-100 text-green-800' :
                                                request.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                                    'bg-red-100 text-red-800'
                                            }`}>
                                            {request.status === 'approved' && <CheckCircle className="h-3 w-3 mr-1" />}
                                            {request.status === 'pending' && <Clock className="h-3 w-3 mr-1" />}
                                            {request.status === 'rejected' && <XCircle className="h-3 w-3 mr-1" />}
                                            {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            {request.status === 'pending' && (
                                                <>
                                                    <button className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors" title="Approve">
                                                        <CheckCircle className="h-4 w-4" />
                                                    </button>
                                                    <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Reject">
                                                        <XCircle className="h-4 w-4" />
                                                    </button>
                                                </>
                                            )}
                                            <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="View Details">
                                                <Eye className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {filteredRequests.length === 0 && (
                    <div className="p-12 text-center">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                            <FileText className="h-8 w-8 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-1">No leave requests found</h3>
                        <p className="text-gray-500">Try adjusting your filters or submit a new request.</p>
                    </div>
                )}
            </Card>
        </div>
    );
}
