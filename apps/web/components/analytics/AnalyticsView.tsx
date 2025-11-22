'use client';

import { Card, CardContent, CardHeader, CardTitle } from '../../../../packages/ui/src/index';
import {
    LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
    XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
    AreaChart, Area
} from 'recharts';
import {
    TrendingUp, Users, DollarSign, Calendar,
    ArrowUpRight, ArrowDownRight, Activity
} from 'lucide-react';

// Mock Data
const WORKFORCE_DATA = [
    { month: 'Jan', employees: 210, turnover: 2 },
    { month: 'Feb', employees: 215, turnover: 1 },
    { month: 'Mar', employees: 222, turnover: 3 },
    { month: 'Apr', employees: 228, turnover: 2 },
    { month: 'May', employees: 235, turnover: 1 },
    { month: 'Jun', employees: 242, turnover: 2 },
    { month: 'Jul', employees: 254, turnover: 1 },
];

const PAYROLL_DATA = [
    { month: 'Jan', amount: 98000 },
    { month: 'Feb', amount: 102000 },
    { month: 'Mar', amount: 105000 },
    { month: 'Apr', amount: 108000 },
    { month: 'May', amount: 112000 },
    { month: 'Jun', amount: 115000 },
    { month: 'Jul', amount: 120000 },
];

const DEPARTMENT_DATA = [
    { name: 'Engineering', value: 85, color: '#3b82f6' }, // blue-500
    { name: 'Sales', value: 45, color: '#10b981' }, // green-500
    { name: 'Marketing', value: 35, color: '#f59e0b' }, // amber-500
    { name: 'HR', value: 15, color: '#ef4444' }, // red-500
    { name: 'Product', value: 25, color: '#8b5cf6' }, // violet-500
    { name: 'Support', value: 49, color: '#ec4899' }, // pink-500
];

const ATTENDANCE_DATA = [
    { day: 'Mon', present: 98, late: 2, absent: 0 },
    { day: 'Tue', present: 95, late: 4, absent: 1 },
    { day: 'Wed', present: 97, late: 2, absent: 1 },
    { day: 'Thu', present: 92, late: 6, absent: 2 },
    { day: 'Fri', present: 88, late: 8, absent: 4 },
];

export default function AnalyticsView() {
    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h2>
                    <p className="text-gray-500">Real-time insights and performance metrics</p>
                </div>
                <div className="flex gap-3">
                    <select className="px-4 py-2 border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-primary-500">
                        <option>Last 7 Days</option>
                        <option>Last 30 Days</option>
                        <option>Last Quarter</option>
                        <option>Year to Date</option>
                    </select>
                    <button className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors flex items-center gap-2">
                        <ArrowDownRight className="h-4 w-4" />
                        Export Report
                    </button>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <KPICard
                    title="Total Workforce"
                    value="254"
                    trend="+12%"
                    trendUp={true}
                    icon={Users}
                    color="blue"
                />
                <KPICard
                    title="Avg. Attendance"
                    value="96.5%"
                    trend="+2.1%"
                    trendUp={true}
                    icon={Activity}
                    color="green"
                />
                <KPICard
                    title="Payroll Cost"
                    value="$120k"
                    trend="+5.4%"
                    trendUp={false}
                    icon={DollarSign}
                    color="purple"
                />
                <KPICard
                    title="Leave Utilization"
                    value="12%"
                    trend="-1.2%"
                    trendUp={true}
                    icon={Calendar}
                    color="orange"
                />
            </div>

            {/* Main Charts Row 1 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Workforce Trends */}
                <Card className="border-none shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-lg font-semibold text-gray-900">Workforce Growth</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={WORKFORCE_DATA}>
                                    <defs>
                                        <linearGradient id="colorEmployees" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#6b7280' }} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6b7280' }} />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                    />
                                    <Area type="monotone" dataKey="employees" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorEmployees)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                {/* Payroll Trends */}
                <Card className="border-none shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-lg font-semibold text-gray-900">Payroll Expenses</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={PAYROLL_DATA}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#6b7280' }} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6b7280' }} />
                                    <Tooltip
                                        cursor={{ fill: '#f3f4f6' }}
                                        contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                    />
                                    <Bar dataKey="amount" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Main Charts Row 2 */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Department Distribution */}
                <Card className="border-none shadow-sm lg:col-span-1">
                    <CardHeader>
                        <CardTitle className="text-lg font-semibold text-gray-900">Department Distribution</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[300px] w-full relative">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={DEPARTMENT_DATA}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={80}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {DEPARTMENT_DATA.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                    <Legend verticalAlign="bottom" height={36} />
                                </PieChart>
                            </ResponsiveContainer>
                            {/* Center Text */}
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none pb-8">
                                <div className="text-center">
                                    <p className="text-3xl font-bold text-gray-900">254</p>
                                    <p className="text-xs text-gray-500">Employees</p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Attendance Heatmap */}
                <Card className="border-none shadow-sm lg:col-span-2">
                    <CardHeader>
                        <CardTitle className="text-lg font-semibold text-gray-900">Weekly Attendance Patterns</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={ATTENDANCE_DATA} layout="vertical" barSize={20}>
                                    <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f3f4f6" />
                                    <XAxis type="number" axisLine={false} tickLine={false} tick={{ fill: '#6b7280' }} />
                                    <YAxis dataKey="day" type="category" axisLine={false} tickLine={false} tick={{ fill: '#6b7280' }} width={40} />
                                    <Tooltip
                                        cursor={{ fill: 'transparent' }}
                                        contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                    />
                                    <Legend />
                                    <Bar dataKey="present" name="Present" stackId="a" fill="#10b981" radius={[0, 4, 4, 0]} />
                                    <Bar dataKey="late" name="Late" stackId="a" fill="#f59e0b" />
                                    <Bar dataKey="absent" name="Absent" stackId="a" fill="#ef4444" radius={[0, 4, 4, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

function KPICard({ title, value, trend, trendUp, icon: Icon, color }: any) {
    const colorClasses: any = {
        blue: 'bg-blue-50 text-blue-600',
        green: 'bg-green-50 text-green-600',
        purple: 'bg-purple-50 text-purple-600',
        orange: 'bg-orange-50 text-orange-600',
    };

    return (
        <Card className="border-none shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
                <div className="flex justify-between items-start">
                    <div>
                        <p className="text-sm font-medium text-gray-500">{title}</p>
                        <h3 className="text-2xl font-bold text-gray-900 mt-2">{value}</h3>
                    </div>
                    <div className={`p-3 rounded-xl ${colorClasses[color]}`}>
                        <Icon className="h-6 w-6" />
                    </div>
                </div>
                <div className="mt-4 flex items-center">
                    <span className={`flex items-center text-sm font-medium ${trendUp ? 'text-green-600' : 'text-red-600'}`}>
                        {trendUp ? <ArrowUpRight className="h-4 w-4 mr-1" /> : <ArrowDownRight className="h-4 w-4 mr-1" />}
                        {trend}
                    </span>
                    <span className="text-sm text-gray-400 ml-2">vs last month</span>
                </div>
            </CardContent>
        </Card>
    );
}
