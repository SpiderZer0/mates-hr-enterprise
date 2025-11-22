'use client';

import { useState } from 'react';
import {
    DollarSign, CheckCircle, Clock, XCircle, Download,
    Filter, Search, Eye, FileText, TrendingUp, Users,
    Calendar, AlertCircle, Send, CreditCard, Banknote,
    Wallet, PieChart, BarChart3, ArrowRight, X
} from 'lucide-react';
import { Card, CardContent } from '../../../../packages/ui/src/index';

// Mock Payroll Data
const PAYROLL_DATA = [
    {
        id: 'PAY001',
        employeeId: 'EMP001',
        employeeName: 'Ahmed Hassan',
        avatar: 'AH',
        color: 'bg-blue-500',
        department: 'Engineering',
        baseSalary: 15000,
        allowances: { housing: 3000, transport: 1000, food: 500 },
        deductions: { tax: 2340, insurance: 750, pension: 900 },
        overtime: 2000,
        netSalary: 17510,
        status: 'processed',
        paymentDate: '2024-01-25',
        month: 'January 2024'
    },
    {
        id: 'PAY002',
        employeeId: 'EMP002',
        employeeName: 'Sarah Mohamed',
        avatar: 'SM',
        color: 'bg-purple-500',
        department: 'Product',
        baseSalary: 18000,
        allowances: { housing: 3500, transport: 1200, food: 500 },
        deductions: { tax: 2925, insurance: 900, pension: 1080 },
        overtime: 0,
        netSalary: 18295,
        status: 'pending',
        paymentDate: null,
        month: 'January 2024'
    },
    {
        id: 'PAY003',
        employeeId: 'EMP004',
        employeeName: 'Layla Ahmed',
        avatar: 'LA',
        color: 'bg-pink-500',
        department: 'Human Resources',
        baseSalary: 14000,
        allowances: { housing: 2800, transport: 1000, food: 500 },
        deductions: { tax: 2145, insurance: 700, pension: 840 },
        overtime: 500,
        netSalary: 14315,
        status: 'processed',
        paymentDate: '2024-01-25',
        month: 'January 2024'
    },
    {
        id: 'PAY004',
        employeeId: 'EMP005',
        employeeName: 'Karim Mahmoud',
        avatar: 'KM',
        color: 'bg-indigo-500',
        department: 'Engineering',
        baseSalary: 16000,
        allowances: { housing: 3200, transport: 1100, food: 500 },
        deductions: { tax: 2535, insurance: 800, pension: 960 },
        overtime: 1500,
        netSalary: 17105,
        status: 'pending',
        paymentDate: null,
        month: 'January 2024'
    },
    {
        id: 'PAY005',
        employeeId: 'EMP007',
        employeeName: 'Youssef Ibrahim',
        avatar: 'YI',
        color: 'bg-orange-500',
        department: 'Sales',
        baseSalary: 12000,
        allowances: { housing: 2400, transport: 800, food: 500, commission: 3000 },
        deductions: { tax: 2205, insurance: 600, pension: 720 },
        overtime: 0,
        netSalary: 15175,
        status: 'processed',
        paymentDate: '2024-01-25',
        month: 'January 2024'
    }
];

export default function PayrollView() {
    const [filterStatus, setFilterStatus] = useState('all');
    const [selectedEmployee, setSelectedEmployee] = useState<any>(null);
    const [showBreakdown, setShowBreakdown] = useState(false);

    const filteredPayroll = filterStatus === 'all'
        ? PAYROLL_DATA
        : PAYROLL_DATA.filter(p => p.status === filterStatus);

    const totalPayroll = PAYROLL_DATA.reduce((sum, p) => sum + p.netSalary, 0);
    const processedCount = PAYROLL_DATA.filter(p => p.status === 'processed').length;
    const pendingCount = PAYROLL_DATA.filter(p => p.status === 'pending').length;
    const avgSalary = Math.round(totalPayroll / PAYROLL_DATA.length);

    const openBreakdown = (employee: any) => {
        setSelectedEmployee(employee);
        setShowBreakdown(true);
    };

    const getTotalAllowances = (allowances: any) => {
        return Object.values(allowances).reduce((sum: number, val: any) => sum + val, 0);
    };

    const getTotalDeductions = (deductions: any) => {
        return Object.values(deductions).reduce((sum: number, val: any) => sum + val, 0);
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Payroll Processing</h2>
                    <p className="text-gray-500">Manage salaries, deductions, and payments</p>
                </div>
                <div className="flex gap-3">
                    <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors">
                        <Download className="h-4 w-4 mr-2" />
                        Export CSV
                    </button>
                    <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 shadow-sm transition-colors">
                        <Send className="h-4 w-4 mr-2" />
                        Process All Pending
                    </button>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="border-none shadow-sm hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <p className="text-sm font-medium text-gray-500">Total Payroll</p>
                                <p className="text-2xl font-bold text-gray-900 mt-1">
                                    ${totalPayroll.toLocaleString()}
                                </p>
                            </div>
                            <div className="p-3 rounded-full bg-blue-50">
                                <DollarSign className="h-6 w-6 text-blue-600" />
                            </div>
                        </div>
                        <div className="text-sm text-gray-600">
                            <span className="text-green-600">+8%</span> from last month
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-none shadow-sm hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <p className="text-sm font-medium text-gray-500">Processed</p>
                                <p className="text-2xl font-bold text-gray-900 mt-1">{processedCount}</p>
                            </div>
                            <div className="p-3 rounded-full bg-green-50">
                                <CheckCircle className="h-6 w-6 text-green-600" />
                            </div>
                        </div>
                        <div className="text-sm text-gray-600">
                            Employees paid this month
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-none shadow-sm hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <p className="text-sm font-medium text-gray-500">Pending</p>
                                <p className="text-2xl font-bold text-gray-900 mt-1">{pendingCount}</p>
                            </div>
                            <div className="p-3 rounded-full bg-yellow-50">
                                <Clock className="h-6 w-6 text-yellow-600" />
                            </div>
                        </div>
                        <div className="text-sm text-gray-600">
                            Awaiting approval
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-none shadow-sm hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <p className="text-sm font-medium text-gray-500">Avg Salary</p>
                                <p className="text-2xl font-bold text-gray-900 mt-1">
                                    ${avgSalary.toLocaleString()}
                                </p>
                            </div>
                            <div className="p-3 rounded-full bg-purple-50">
                                <TrendingUp className="h-6 w-6 text-purple-600" />
                            </div>
                        </div>
                        <div className="text-sm text-gray-600">
                            Company average
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Filters */}
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
                                <option value="processed">Processed</option>
                                <option value="pending">Pending</option>
                            </select>
                            <select className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white">
                                <option>January 2024</option>
                                <option>December 2023</option>
                                <option>November 2023</option>
                            </select>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Payroll Table */}
            <Card className="border-none shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-100">
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Employee</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Base Salary</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Allowances</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Deductions</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Net Salary</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredPayroll.map((payroll) => (
                                <tr key={payroll.id} className="hover:bg-gray-50 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center">
                                            <div className={`h-10 w-10 rounded-full ${payroll.color} flex items-center justify-center text-white font-bold text-sm`}>
                                                {payroll.avatar}
                                            </div>
                                            <div className="ml-4">
                                                <div className="text-sm font-medium text-gray-900">{payroll.employeeName}</div>
                                                <div className="text-sm text-gray-500">{payroll.department}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm font-medium text-gray-900">${payroll.baseSalary.toLocaleString()}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm text-green-600 font-medium">+${getTotalAllowances(payroll.allowances).toLocaleString()}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm text-red-600 font-medium">-${getTotalDeductions(payroll.deductions).toLocaleString()}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm font-bold text-gray-900">${payroll.netSalary.toLocaleString()}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${payroll.status === 'processed' ? 'bg-green-100 text-green-800' :
                                                payroll.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                                    'bg-red-100 text-red-800'
                                            }`}>
                                            {payroll.status === 'processed' && <CheckCircle className="h-3 w-3 mr-1" />}
                                            {payroll.status === 'pending' && <Clock className="h-3 w-3 mr-1" />}
                                            {payroll.status.charAt(0).toUpperCase() + payroll.status.slice(1)}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={() => openBreakdown(payroll)}
                                                className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                title="View Breakdown"
                                            >
                                                <Eye className="h-4 w-4" />
                                            </button>
                                            <button className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors" title="Download Payslip">
                                                <Download className="h-4 w-4" />
                                            </button>
                                            {payroll.status === 'pending' && (
                                                <button className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors" title="Process Payment">
                                                    <Send className="h-4 w-4" />
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>

            {/* Salary Breakdown Modal */}
            {showBreakdown && selectedEmployee && (
                <div className="fixed inset-0 z-50 overflow-hidden">
                    <div className="absolute inset-0 bg-black bg-opacity-50 transition-opacity" onClick={() => setShowBreakdown(false)}></div>
                    <div className="fixed inset-y-0 right-0 max-w-2xl w-full bg-white shadow-2xl flex flex-col transform transition-transform duration-300 ease-in-out">
                        {/* Modal Header */}
                        <div className="px-6 py-4 bg-gradient-to-r from-primary-600 to-primary-700 text-white">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-xl font-bold">Salary Breakdown</h3>
                                    <p className="text-sm text-primary-100">{selectedEmployee.employeeName} - {selectedEmployee.month}</p>
                                </div>
                                <button onClick={() => setShowBreakdown(false)} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                                    <X className="h-5 w-5" />
                                </button>
                            </div>
                        </div>

                        {/* Modal Content */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-6">
                            {/* Base Salary */}
                            <div>
                                <h4 className="text-lg font-bold text-gray-900 mb-4">Base Salary</h4>
                                <Card className="bg-blue-50 border-blue-200">
                                    <CardContent className="p-4">
                                        <div className="flex justify-between items-center">
                                            <span className="text-gray-700">Monthly Base</span>
                                            <span className="text-xl font-bold text-blue-900">${selectedEmployee.baseSalary.toLocaleString()}</span>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Allowances */}
                            <div>
                                <h4 className="text-lg font-bold text-gray-900 mb-4">Allowances</h4>
                                <div className="space-y-3">
                                    {Object.entries(selectedEmployee.allowances).map(([key, value]: [string, any]) => (
                                        <div key={key} className="flex justify-between items-center py-2 border-b border-gray-100">
                                            <span className="text-gray-700 capitalize">{key}</span>
                                            <span className="text-green-600 font-medium">+${value.toLocaleString()}</span>
                                        </div>
                                    ))}
                                    {selectedEmployee.overtime > 0 && (
                                        <div className="flex justify-between items-center py-2 border-b border-gray-100">
                                            <span className="text-gray-700">Overtime</span>
                                            <span className="text-green-600 font-medium">+${selectedEmployee.overtime.toLocaleString()}</span>
                                        </div>
                                    )}
                                    <div className="flex justify-between items-center py-2 pt-4">
                                        <span className="font-bold text-gray-900">Total Allowances</span>
                                        <span className="font-bold text-green-600">+${(getTotalAllowances(selectedEmployee.allowances) + selectedEmployee.overtime).toLocaleString()}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Deductions */}
                            <div>
                                <h4 className="text-lg font-bold text-gray-900 mb-4">Deductions</h4>
                                <div className="space-y-3">
                                    {Object.entries(selectedEmployee.deductions).map(([key, value]: [string, any]) => (
                                        <div key={key} className="flex justify-between items-center py-2 border-b border-gray-100">
                                            <span className="text-gray-700 capitalize">{key}</span>
                                            <span className="text-red-600 font-medium">-${value.toLocaleString()}</span>
                                        </div>
                                    ))}
                                    <div className="flex justify-between items-center py-2 pt-4">
                                        <span className="font-bold text-gray-900">Total Deductions</span>
                                        <span className="font-bold text-red-600">-${getTotalDeductions(selectedEmployee.deductions).toLocaleString()}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Net Salary */}
                            <Card className="bg-gradient-to-r from-green-500 to-green-600 border-none">
                                <CardContent className="p-6">
                                    <div className="flex justify-between items-center text-white">
                                        <div>
                                            <p className="text-green-100 text-sm">Net Salary</p>
                                            <p className="text-3xl font-bold mt-1">${selectedEmployee.netSalary.toLocaleString()}</p>
                                        </div>
                                        <Wallet className="h-12 w-12 text-green-100" />
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Actions */}
                            <div className="flex gap-3">
                                <button className="flex-1 px-4 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center justify-center gap-2">
                                    <Download className="h-4 w-4" />
                                    Download Payslip
                                </button>
                                {selectedEmployee.status === 'pending' && (
                                    <button className="flex-1 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2">
                                        <Send className="h-4 w-4" />
                                        Process Payment
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
