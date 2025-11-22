'use client';

import { useState } from 'react';
import {
    Search, Filter, Plus, MoreVertical, Mail, Phone,
    MapPin, Building, Calendar, Download, Trash2, Edit2,
    Eye, CheckCircle, XCircle, AlertCircle, UserPlus,
    List, Grid3x3, GitBranch, Brain, TrendingUp, Activity,
    Users, Award, Clock, X, FileText, BarChart3, Zap,
    Send, UserMinus, UserCog, Star, Target, ArrowRight
} from 'lucide-react';
import { Card, CardContent } from '../../../../packages/ui/src/index';

// Enhanced Mock Data with more details
const MOCK_EMPLOYEES = [
    {
        id: 'EMP001',
        firstName: 'Ahmed',
        lastName: 'Hassan',
        email: 'ahmed.hassan@mates.com',
        role: 'Senior Software Engineer',
        department: 'Engineering',
        status: 'Active',
        joinDate: '2023-01-15',
        avatar: 'AH',
        color: 'bg-blue-500',
        phone: '+20 123 456 7890',
        performance: 95,
        tasksCompleted: 142,
        manager: 'Sarah Mohamed',
        atRisk: false
    },
    {
        id: 'EMP002',
        firstName: 'Sarah',
        lastName: 'Mohamed',
        email: 'sarah.m@mates.com',
        role: 'Product Manager',
        department: 'Product',
        status: 'Active',
        joinDate: '2023-02-01',
        avatar: 'SM',
        color: 'bg-purple-500',
        phone: '+20 123 456 7891',
        performance: 98,
        tasksCompleted: 156,
        manager: 'CEO',
        atRisk: false
    },
    {
        id: 'EMP003',
        firstName: 'Omar',
        lastName: 'Farouk',
        email: 'omar.f@mates.com',
        role: 'UI/UX Designer',
        department: 'Design',
        status: 'On Leave',
        joinDate: '2023-03-10',
        avatar: 'OF',
        color: 'bg-green-500',
        phone: '+20 123 456 7892',
        performance: 88,
        tasksCompleted: 98,
        manager: 'Sarah Mohamed',
        atRisk: true
    },
    {
        id: 'EMP004',
        firstName: 'Layla',
        lastName: 'Ahmed',
        email: 'layla.a@mates.com',
        role: 'HR Specialist',
        department: 'Human Resources',
        status: 'Active',
        joinDate: '2022-11-05',
        avatar: 'LA',
        color: 'bg-pink-500',
        phone: '+20 123 456 7893',
        performance: 92,
        tasksCompleted: 127,
        manager: 'CEO',
        atRisk: false
    },
    {
        id: 'EMP005',
        firstName: 'Karim',
        lastName: 'Mahmoud',
        email: 'karim.m@mates.com',
        role: 'DevOps Engineer',
        department: 'Engineering',
        status: 'Active',
        joinDate: '2023-04-20',
        avatar: 'KM',
        color: 'bg-indigo-500',
        phone: '+20 123 456 7894',
        performance: 90,
        tasksCompleted: 113,
        manager: 'Ahmed Hassan',
        atRisk: false
    },
    {
        id: 'EMP006',
        firstName: 'Nour',
        lastName: 'Ali',
        email: 'nour.ali@mates.com',
        role: 'Marketing Manager',
        department: 'Marketing',
        status: 'Terminated',
        joinDate: '2022-08-15',
        avatar: 'NA',
        color: 'bg-red-500',
        phone: '+20 123 456 7895',
        performance: 72,
        tasksCompleted: 45,
        manager: 'CEO',
        atRisk: true
    },
    {
        id: 'EMP007',
        firstName: 'Youssef',
        lastName: 'Ibrahim',
        email: 'youssef.i@mates.com',
        role: 'Sales Executive',
        department: 'Sales',
        status: 'Active',
        joinDate: '2023-05-12',
        avatar: 'YI',
        color: 'bg-orange-500',
        phone: '+20 123 456 7896',
        performance: 85,
        tasksCompleted: 78,
        manager: 'Sarah Mohamed',
        atRisk: false
    },
    {
        id: 'EMP008',
        firstName: 'Hana',
        lastName: 'Mostafa',
        email: 'hana.m@mates.com',
        role: 'Frontend Developer',
        department: 'Engineering',
        status: 'On Leave',
        joinDate: '2023-06-01',
        avatar: 'HM',
        color: 'bg-teal-500',
        phone: '+20 123 456 7897',
        performance: 81,
        tasksCompleted: 67,
        manager: 'Ahmed Hassan',
        atRisk: true
    }
];

export default function EmployeesView() {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedDepartment, setSelectedDepartment] = useState('All');
    const [viewMode, setViewMode] = useState<'list' | 'grid' | 'org'>('list');
    const [selectedEmployee, setSelectedEmployee] = useState<any>(null);
    const [drawerOpen, setDrawerOpen] = useState(false);

    const filteredEmployees = MOCK_EMPLOYEES.filter(emp => {
        const matchesSearch =
            emp.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            emp.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            emp.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            emp.role.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesDept = selectedDepartment === 'All' || emp.department === selectedDepartment;

        return matchesSearch && matchesDept;
    });

    const atRiskEmployees = MOCK_EMPLOYEES.filter(e => e.atRisk);
    const topPerformers = MOCK_EMPLOYEES.filter(e => e.performance >= 95).slice(0, 2);

    const stats = [
        { label: 'Total Employees', value: '254', change: '+12%', icon: UserPlus, color: 'text-blue-600', bg: 'bg-blue-50' },
        { label: 'Active Now', value: '218', change: '+5%', icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50' },
        { label: 'On Leave', value: '12', change: '-2%', icon: Calendar, color: 'text-orange-600', bg: 'bg-orange-50' },
        { label: 'Departments', value: '8', change: '0%', icon: Building, color: 'text-purple-600', bg: 'bg-purple-50' },
    ];

    const openDrawer = (employee: any) => {
        setSelectedEmployee(employee);
        setDrawerOpen(true);
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Employee Management</h2>
                    <p className="text-gray-500">AI-powered workforce management & analytics</p>
                </div>
                <div className="flex gap-3">
                    <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors">
                        <Download className="h-4 w-4 mr-2" />
                        Export
                    </button>
                    <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 shadow-sm transition-colors">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Employee
                    </button>
                </div>
            </div>

            {/* AI Insights Panel */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <Card className="border-l-4 border-l-red-500 bg-gradient-to-r from-red-50 to-white">
                    <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-3 bg-red-100 rounded-lg">
                                    <Brain className="h-6 w-6 text-red-600" />
                                </div>
                                <div>
                                    <p className="text-xs font-medium text-red-600 uppercase tracking-wide">⚠️ Burnout Alert</p>
                                    <p className="text-2xl font-bold text-gray-900 mt-1">{atRiskEmployees.length}</p>
                                    <p className="text-sm text-gray-600 mt-1">Employees at risk</p>
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
                                    <Award className="h-6 w-6 text-green-600" />
                                </div>
                                <div>
                                    <p className="text-xs font-medium text-green-600 uppercase tracking-wide">🚀 Top Performers</p>
                                    <p className="text-sm text-gray-900 font-medium mt-1">
                                        {topPerformers.map(e => e.firstName).join(' & ')}
                                    </p>
                                    <p className="text-sm text-gray-600 mt-1">This month's stars</p>
                                </div>
                            </div>
                            <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">View →</button>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-l-4 border-l-blue-500 bg-gradient-to-r from-blue-50 to-white">
                    <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-3 bg-blue-100 rounded-lg">
                                    <TrendingUp className="h-6 w-6 text-blue-600" />
                                </div>
                                <div>
                                    <p className="text-xs font-medium text-blue-600 uppercase tracking-wide">📊 Dept Health</p>
                                    <p className="text-2xl font-bold text-gray-900 mt-1">95%</p>
                                    <p className="text-sm text-gray-600 mt-1">Engineering wellness</p>
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
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">{stat.label}</p>
                                        <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                                    </div>
                                    <div className={`p-3 rounded-full ${stat.bg}`}>
                                        <Icon className={`h-6 w-6 ${stat.color}`} />
                                    </div>
                                </div>
                                <div className="mt-4 flex items-center text-sm">
                                    <span className={stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}>
                                        {stat.change}
                                    </span>
                                    <span className="text-gray-500 ml-2">from last month</span>
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            {/* View Controls & Filters */}
            <Card className="border-none shadow-sm">
                <CardContent className="p-4">
                    <div className="flex flex-col md:flex-row gap-4 items-center">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search employees by name, role, or ID..."
                                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="flex gap-2">
                            <div className="relative">
                                <select
                                    className="appearance-none pl-4 pr-10 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white"
                                    value={selectedDepartment}
                                    onChange={(e) => setSelectedDepartment(e.target.value)}
                                >
                                    <option value="All">All Departments</option>
                                    <option value="Engineering">Engineering</option>
                                    <option value="Product">Product</option>
                                    <option value="Design">Design</option>
                                    <option value="Marketing">Marketing</option>
                                    <option value="Sales">Sales</option>
                                    <option value="Human Resources">Human Resources</option>
                                </select>
                                <Filter className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                            </div>

                            {/* View Switcher */}
                            <div className="flex border border-gray-200 rounded-lg overflow-hidden">
                                <button
                                    onClick={() => setViewMode('list')}
                                    className={`p-2 ${viewMode === 'list' ? 'bg-primary-50 text-primary-600' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
                                    title="List View"
                                >
                                    <List className="h-5 w-5" />
                                </button>
                                <button
                                    onClick={() => setViewMode('grid')}
                                    className={`p-2 ${viewMode === 'grid' ? 'bg-primary-50 text-primary-600' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
                                    title="Grid View"
                                >
                                    <Grid3x3 className="h-5 w-5" />
                                </button>
                                <button
                                    onClick={() => setViewMode('org')}
                                    className={`p-2 ${viewMode === 'org' ? 'bg-primary-50 text-primary-600' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
                                    title="Org Chart"
                                >
                                    <GitBranch className="h-5 w-5" />
                                </button>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Conditional Rendering Based on View Mode */}
            {viewMode === 'list' && (
                <Card className="border-none shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-100">
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Employee</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Role & Dept</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Performance</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Join Date</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {filteredEmployees.map((employee) => (
                                    <tr key={employee.id} className="hover:bg-gray-50 transition-colors group cursor-pointer" onClick={() => openDrawer(employee)}>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center">
                                                <div className={`h-10 w-10 rounded-full ${employee.color} flex items-center justify-center text-white font-bold text-sm relative`}>
                                                    {employee.avatar}
                                                    {employee.atRisk && <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white" />}
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-gray-900">{employee.firstName} {employee.lastName}</div>
                                                    <div className="text-sm text-gray-500">{employee.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm text-gray-900">{employee.role}</div>
                                            <div className="text-xs text-gray-500">{employee.department}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <div className="flex-1 bg-gray-200 rounded-full h-2 max-w-[80px]">
                                                    <div className={`h-2 rounded-full ${employee.performance >= 90 ? 'bg-green-500' : employee.performance >= 75 ? 'bg-blue-500' : 'bg-orange-500'}`} style={{ width: `${employee.performance}%` }}></div>
                                                </div>
                                                <span className="text-sm font-medium text-gray-700">{employee.performance}%</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${employee.status === 'Active' ? 'bg-green-100 text-green-800' :
                                                    employee.status === 'On Leave' ? 'bg-yellow-100 text-yellow-800' :
                                                        'bg-red-100 text-red-800'
                                                }`}>
                                                {employee.status === 'Active' && <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1.5" />}
                                                {employee.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500">
                                            {new Date(employee.joinDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity" onClick={(e) => e.stopPropagation()}>
                                                <button className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors" onClick={() => openDrawer(employee)}>
                                                    <Eye className="h-4 w-4" />
                                                </button>
                                                <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                                                    <Edit2 className="h-4 w-4" />
                                                </button>
                                                <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {filteredEmployees.length === 0 && (
                        <div className="p-12 text-center">
                            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                                <Search className="h-8 w-8 text-gray-400" />
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 mb-1">No employees found</h3>
                            <p className="text-gray-500">Try adjusting your search or filters.</p>
                        </div>
                    )}
                </Card>
            )}

            {viewMode === 'grid' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredEmployees.map((employee) => (
                        <Card key={employee.id} className="border-none shadow-sm hover:shadow-lg transition-all cursor-pointer group" onClick={() => openDrawer(employee)}>
                            <CardContent className="p-6">
                                <div className="flex flex-col items-center text-center">
                                    <div className={`h-20 w-20 rounded-full ${employee.color} flex items-center justify-center text-white font-bold text-2xl mb-4 relative`}>
                                        {employee.avatar}
                                        {employee.atRisk && <div className="absolute top-0 right-0 w-4 h-4 bg-red-500 rounded-full border-2 border-white" />}
                                    </div>
                                    <h3 className="text-lg font-bold text-gray-900">{employee.firstName} {employee.lastName}</h3>
                                    <p className="text-sm text-gray-600 mb-2">{employee.role}</p>
                                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium mb-4 ${employee.status === 'Active' ? 'bg-green-100 text-green-800' :
                                            employee.status === 'On Leave' ? 'bg-yellow-100 text-yellow-800' :
                                                'bg-red-100 text-red-800'
                                        }`}>
                                        {employee.status}
                                    </span>
                                    <div className="w-full space-y-2">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-600">Performance</span>
                                            <span className="font-bold text-gray-900">{employee.performance}%</span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                            <div className={`h-2 rounded-full ${employee.performance >= 90 ? 'bg-green-500' : employee.performance >= 75 ? 'bg-blue-500' : 'bg-orange-500'}`} style={{ width: `${employee.performance}%` }}></div>
                                        </div>
                                        <div className="flex justify-between text-sm pt-2">
                                            <span className="text-gray-600">Tasks</span>
                                            <span className="font-medium text-gray-900">{employee.tasksCompleted}</span>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            {viewMode === 'org' && (
                <Card className="border-none shadow-sm">
                    <CardContent className="p-8">
                        <div className="flex flex-col items-center">
                            <h3 className="text-xl font-bold text-gray-900 mb-8">Organization Hierarchy</h3>

                            {/* CEO */}
                            <div className="relative mb-12">
                                <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-6 text-white shadow-lg">
                                    <div className="flex items-center gap-4">
                                        <div className="h-16 w-16 bg-white rounded-full flex items-center justify-center text-purple-600 font-bold text-xl">
                                            CEO
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-lg">CEO / Founder</h4>
                                            <p className="text-sm text-purple-100">Executive Leadership</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="absolute left-1/2 transform -translate-x-1/2 h-8 w-0.5 bg-gray-300"></div>
                            </div>

                            {/* Managers */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl">
                                <div className="flex flex-col items-center">
                                    <Card className="border-2 border-blue-200 bg-blue-50 cursor-pointer hover:shadow-lg transition-shadow" onClick={() => openDrawer(MOCK_EMPLOYEES[1])}>
                                        <CardContent className="p-4 text-center">
                                            <div className="h-12 w-12 rounded-full bg-purple-500 flex items-center justify-center text-white font-bold mx-auto mb-2">
                                                SM
                                            </div>
                                            <h5 className="font-bold text-gray-900">Sarah Mohamed</h5>
                                            <p className="text-xs text-gray-600">Product Manager</p>
                                            <div className="mt-2 flex justify-center gap-1">
                                                <Star className="h-4 w-4 text-yellow-500 fill-current" />
                                                <span className="text-xs font-medium">98%</span>
                                            </div>
                                        </CardContent>
                                    </Card>
                                    <div className="h-6 w-0.5 bg-gray-300"></div>

                                    {/* Direct Reports */}
                                    <div className="space-y-2 w-full">
                                        {MOCK_EMPLOYEES.filter(e => ['EMP003', 'EMP007'].includes(e.id)).map((emp) => (
                                            <Card key={emp.id} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => openDrawer(emp)}>
                                                <CardContent className="p-3">
                                                    <div className="flex items-center gap-2">
                                                        <div className={`h-8 w-8 rounded-full ${emp.color} flex items-center justify-center text-white text-xs font-bold`}>
                                                            {emp.avatar}
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <p className="text-xs font-medium text-gray-900 truncate">{emp.firstName}</p>
                                                            <p className="text-xs text-gray-500 truncate">{emp.department}</p>
                                                        </div>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        ))}
                                    </div>
                                </div>

                                <div className="flex flex-col items-center">
                                    <Card className="border-2 border-green-200 bg-green-50 cursor-pointer hover:shadow-lg transition-shadow" onClick={() => openDrawer(MOCK_EMPLOYEES[0])}>
                                        <CardContent className="p-4 text-center">
                                            <div className="h-12 w-12 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold mx-auto mb-2">
                                                AH
                                            </div>
                                            <h5 className="font-bold text-gray-900">Ahmed Hassan</h5>
                                            <p className="text-xs text-gray-600">Senior Engineer</p>
                                            <div className="mt-2 flex justify-center gap-1">
                                                <Star className="h-4 w-4 text-yellow-500 fill-current" />
                                                <span className="text-xs font-medium">95%</span>
                                            </div>
                                        </CardContent>
                                    </Card>
                                    <div className="h-6 w-0.5 bg-gray-300"></div>

                                    <div className="space-y-2 w-full">
                                        {MOCK_EMPLOYEES.filter(e => ['EMP005', 'EMP008'].includes(e.id)).map((emp) => (
                                            <Card key={emp.id} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => openDrawer(emp)}>
                                                <CardContent className="p-3">
                                                    <div className="flex items-center gap-2">
                                                        <div className={`h-8 w-8 rounded-full ${emp.color} flex items-center justify-center text-white text-xs font-bold`}>
                                                            {emp.avatar}
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <p className="text-xs font-medium text-gray-900 truncate">{emp.firstName}</p>
                                                            <p className="text-xs text-gray-500 truncate">{emp.department}</p>
                                                        </div>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        ))}
                                    </div>
                                </div>

                                <div className="flex flex-col items-center">
                                    <Card className="border-2 border-pink-200 bg-pink-50 cursor-pointer hover:shadow-lg transition-shadow" onClick={() => openDrawer(MOCK_EMPLOYEES[3])}>
                                        <CardContent className="p-4 text-center">
                                            <div className="h-12 w-12 rounded-full bg-pink-500 flex items-center justify-center text-white font-bold mx-auto mb-2">
                                                LA
                                            </div>
                                            <h5 className="font-bold text-gray-900">Layla Ahmed</h5>
                                            <p className="text-xs text-gray-600">HR Specialist</p>
                                            <div className="mt-2 flex justify-center gap-1">
                                                <Star className="h-4 w-4 text-yellow-500 fill-current" />
                                                <span className="text-xs font-medium">92%</span>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Employee Details Drawer */}
            {drawerOpen && selectedEmployee && (
                <div className="fixed inset-0 z-50 overflow-hidden">
                    <div className="absolute inset-0 bg-black bg-opacity-50 transition-opacity" onClick={() => setDrawerOpen(false)}></div>
                    <div className="fixed inset-y-0 right-0 max-w-2xl w-full bg-white shadow-2xl flex flex-col transform transition-transform duration-300 ease-in-out">
                        {/* Drawer Header */}
                        <div className="px-6 py-4 bg-gradient-to-r from-primary-600 to-primary-700 text-white">
                            <div className="flex items-center justify-between">
                                <h3 className="text-xl font-bold">Employee Details</h3>
                                <button onClick={() => setDrawerOpen(false)} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                                    <X className="h-5 w-5" />
                                </button>
                            </div>
                        </div>

                        {/* Drawer Content */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-6">
                            {/* Profile Section */}
                            <div className="text-center pb-6 border-b">
                                <div className={`h-24 w-24 rounded-full ${selectedEmployee.color} flex items-center justify-center text-white font-bold text-3xl mx-auto mb-4 relative`}>
                                    {selectedEmployee.avatar}
                                    {selectedEmployee.atRisk && <div className="absolute top-0 right-0 w-5 h-5 bg-red-500 rounded-full border-2 border-white" />}
                                </div>
                                <h2 className="text-2xl font-bold text-gray-900">{selectedEmployee.firstName} {selectedEmployee.lastName}</h2>
                                <p className="text-gray-600">{selectedEmployee.role}</p>
                                <div className="flex items-center justify-center gap-4 mt-4">
                                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${selectedEmployee.status === 'Active' ? 'bg-green-100 text-green-800' :
                                            selectedEmployee.status === 'On Leave' ? 'bg-yellow-100 text-yellow-800' :
                                                'bg-red-100 text-red-800'
                                        }`}>
                                        {selectedEmployee.status}
                                    </span>
                                    {selectedEmployee.performance >= 90 && (
                                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
                                            <Star className="h-4 w-4 mr-1" />
                                            Top Performer
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Contact Information */}
                            <div>
                                <h4 className="text-lg font-bold text-gray-900 mb-4">Contact Information</h4>
                                <div className="space-y-3">
                                    <div className="flex items-center gap-3 text-gray-700">
                                        <Mail className="h-5 w-5 text-gray-400" />
                                        <span>{selectedEmployee.email}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-gray-700">
                                        <Phone className="h-5 w-5 text-gray-400" />
                                        <span>{selectedEmployee.phone}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-gray-700">
                                        <Building className="h-5 w-5 text-gray-400" />
                                        <span>{selectedEmployee.department}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Performance Metrics */}
                            <div>
                                <h4 className="text-lg font-bold text-gray-900 mb-4">Performance Metrics</h4>
                                <div className="grid grid-cols-2 gap-4">
                                    <Card className="bg-blue-50">
                                        <CardContent className="p-4">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p className="text-sm text-gray-600">Performance</p>
                                                    <p className="text-2xl font-bold text-gray-900">{selectedEmployee.performance}%</p>
                                                </div>
                                                <BarChart3 className="h-8 w-8 text-blue-600" />
                                            </div>
                                        </CardContent>
                                    </Card>
                                    <Card className="bg-green-50">
                                        <CardContent className="p-4">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p className="text-sm text-gray-600">Tasks Done</p>
                                                    <p className="text-2xl font-bold text-gray-900">{selectedEmployee.tasksCompleted}</p>
                                                </div>
                                                <CheckCircle className="h-8 w-8 text-green-600" />
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>
                            </div>

                            {/* Activity Timeline */}
                            <div>
                                <h4 className="text-lg font-bold text-gray-900 mb-4">Recent Activity</h4>
                                <div className="space-y-4">
                                    <div className="flex gap-4">
                                        <div className="flex flex-col items-center">
                                            <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                                                <CheckCircle className="h-4 w-4 text-green-600" />
                                            </div>
                                            <div className="w-0.5 h-full bg-gray-200"></div>
                                        </div>
                                        <div className="flex-1 pb-4">
                                            <p className="font-medium text-gray-900">Completed "User Dashboard" task</p>
                                            <p className="text-sm text-gray-500">2 hours ago</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-4">
                                        <div className="flex flex-col items-center">
                                            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                                                <Clock className="h-4 w-4 text-blue-600" />
                                            </div>
                                            <div className="w-0.5 h-full bg-gray-200"></div>
                                        </div>
                                        <div className="flex-1 pb-4">
                                            <p className="font-medium text-gray-900">Checked in at 9:00 AM</p>
                                            <p className="text-sm text-gray-500">Today</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-4">
                                        <div className="flex flex-col items-center">
                                            <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
                                                <FileText className="h-4 w-4 text-purple-600" />
                                            </div>
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-medium text-gray-900">Submitted monthly report</p>
                                            <p className="text-sm text-gray-500">Yesterday</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Quick Actions */}
                            <div>
                                <h4 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h4>
                                <div className="grid grid-cols-2 gap-3">
                                    <button className="flex items-center justify-center gap-2 px-4 py-3 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors">
                                        <Send className="h-4 w-4" />
                                        Send Message
                                    </button>
                                    <button className="flex items-center justify-center gap-2 px-4 py-3 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors">
                                        <UserCog className="h-4 w-4" />
                                        Edit Profile
                                    </button>
                                    <button className="flex items-center justify-center gap-2 px-4 py-3 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors">
                                        <Award className="h-4 w-4" />
                                        Give Award
                                    </button>
                                    <button className="flex items-center justify-center gap-2 px-4 py-3 bg-orange-50 text-orange-700 rounded-lg hover:bg-orange-100 transition-colors">
                                        <Target className="h-4 w-4" />
                                        Set Goals
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
