'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from '../../../../packages/ui/src/index';

import {
    Bell,
    Calendar,
    Clock,
    Coffee,
    AlertCircle,
    CheckCircle,
    Menu,
    LogOut,
    User,
    ChevronRight,
    Plus,
    Search,
    FileText,
    DollarSign,
} from 'lucide-react';

export default function EmployeeDashboard() {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('general');
    const [activeView, setActiveView] = useState('profile'); // profile, payroll, attendance

    useEffect(() => {
        const accessToken = localStorage.getItem('accessToken');
        const userData = localStorage.getItem('user');

        if (!accessToken || !userData) {
            router.push('/login');
            return;
        }

        try {
            setUser(JSON.parse(userData));
        } catch (error) {
            console.error('Error:', error);
            router.push('/login');
        }

        setLoading(false);
    }, [router]);

    const handleLogout = () => {
        localStorage.clear();
        router.push('/login');
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#F6F7FA]">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto" />
                    <p className="mt-4 text-gray-600">Loading Mates dashboard…</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#F6F7FA] flex">
            {/* LEFT ICON SIDEBAR */}
            <aside className="w-20 bg-white border-r border-gray-200 flex flex-col items-center py-6 space-y-6">
                {/* Logo */}
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-sky-400 to-blue-600 flex items-center justify-center text-white font-bold">
                    M
                </div>

                {/* Nav icons */}
                <nav className="mt-6 flex flex-col space-y-4">
                    <button
                        onClick={() => setActiveView('profile')}
                        className={`w-10 h-10 rounded-2xl flex items-center justify-center shadow-sm transition ${activeView === 'profile' ? 'bg-black text-white' : 'text-gray-400 hover:text-gray-700 hover:bg-gray-100'
                            }`}
                    >
                        <User className="h-5 w-5" />
                    </button>
                    <button
                        onClick={() => setActiveView('payroll')}
                        className={`w-10 h-10 rounded-2xl flex items-center justify-center transition ${activeView === 'payroll' ? 'bg-black text-white' : 'text-gray-400 hover:text-gray-700 hover:bg-gray-100'
                            }`}
                    >
                        <DollarSign className="h-5 w-5" />
                    </button>
                    <button
                        onClick={() => setActiveView('attendance')}
                        className={`w-10 h-10 rounded-2xl flex items-center justify-center transition ${activeView === 'attendance' ? 'bg-black text-white' : 'text-gray-400 hover:text-gray-700 hover:bg-gray-100'
                            }`}
                    >
                        <Clock className="h-5 w-5" />
                    </button>
                    <button className="w-10 h-10 rounded-2xl text-gray-400 hover:text-gray-700 hover:bg-gray-100 flex items-center justify-center transition">
                        <Bell className="h-5 w-5" />
                    </button>
                </nav>

                <div className="mt-auto">
                    <button
                        onClick={handleLogout}
                        className="w-10 h-10 rounded-2xl text-red-500 hover:bg-red-50 flex items-center justify-center"
                    >
                        <LogOut className="h-5 w-5" />
                    </button>
                </div>
            </aside>

            {/* MAIN AREA */}
            <div className="flex-1 flex flex-col">
                {/* TOP BAR */}
                <header className="h-20 bg-white border-b border-gray-200 flex items-center justify-between px-8">
                    <div className="flex items-center space-x-4">
                        <button className="md:hidden p-2 rounded-lg border border-gray-200">
                            <Menu className="h-5 w-5 text-gray-600" />
                        </button>
                        {/* search */}
                        <div className="relative w-64 max-w-xs">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search"
                                className="w-full pl-9 pr-3 py-2 rounded-full border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
                            />
                        </div>
                    </div>

                    <div className="flex items-center space-x-4">
                        {/* date & time */}
                        <div className="hidden md:flex items-center text-sm text-gray-500 space-x-4">
                            <span>29 Oct 2024</span>
                            <span>04:56:30 PM</span>
                            <span className="flex items-center space-x-1">
                                <span className="w-5 h-5 rounded-full bg-gradient-to-r from-red-500 to-blue-500 border border-gray-200" />
                                <span>En</span>
                            </span>
                        </div>

                        {/* user mini card */}
                        <div className="flex items-center space-x-3">
                            <div className="text-right hidden md:block">
                                <p className="text-sm font-semibold text-gray-900">
                                    {user?.firstName} {user?.lastName}
                                </p>
                                <p className="text-xs text-gray-500">{user?.roles?.[0] || 'Employee'}</p>
                            </div>
                            <div className="w-10 h-10 rounded-full bg-yellow-400 flex items-center justify-center text-sm font-bold">
                                {user?.firstName?.[0]}
                            </div>
                        </div>
                    </div>
                </header>

                {/* CONTENT */}
                <main className="flex-1 overflow-y-auto px-8 py-6">
                    {activeView === 'profile' && <ProfileView user={user} activeTab={activeTab} setActiveTab={setActiveTab} />}
                    {activeView === 'payroll' && <PayrollView user={user} />}
                    {activeView === 'attendance' && <AttendanceView user={user} />}
                </main>
            </div>
        </div>
    );
}

// PROFILE VIEW COMPONENT
function ProfileView({ user, activeTab, setActiveTab }: any) {
    return (
        <div className="max-w-7xl mx-auto space-y-6">
            {/* PROFILE HEADER CARD */}
            <Card className="shadow-sm rounded-2xl border border-gray-100">
                <CardContent className="py-6 px-6 flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                    <div className="flex items-center space-x-4">
                        <div className="w-16 h-16 rounded-full bg-yellow-400 flex items-center justify-center text-2xl font-bold text-white">
                            {user?.firstName?.[0]}
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold text-gray-900">
                                {user?.firstName} {user?.lastName}
                            </h2>
                            <p className="text-sm text-gray-500">UI/UX Designer · Web Development</p>
                        </div>
                    </div>

                    {/* sign in/out */}
                    <div className="flex flex-col md:flex-row md:space-x-10 text-sm text-gray-600">
                        <div>
                            <p className="font-semibold text-gray-700 mb-1">1st Sign in / Sign out</p>
                            <p>09:00 AM  /  05:00 PM</p>
                            <p className="text-xs text-gray-400 mt-1">Office — HQ</p>
                        </div>
                        <div className="mt-3 md:mt-0">
                            <p className="font-semibibold text-gray-700 mb-1">2nd Sign in / Sign out</p>
                            <p>— / —</p>
                            <p className="text-xs text-gray-400 mt-1">Office — HQ</p>
                        </div>
                    </div>

                    {/* new request */}
                    <div className="flex flex-col items-end">
                        <button className="inline-flex items-center px-4 py-2 rounded-full bg-black text-white text-sm font-medium hover:bg-gray-900">
                            <Plus className="h-4 w-4 mr-2" />
                            New request
                        </button>
                        <div className="flex space-x-2 mt-3">
                            <button className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50">
                                <Calendar className="h-4 w-4 text-gray-600" />
                            </button>
                            <button className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50">
                                <FileText className="h-4 w-4 text-gray-600" />
                            </button>
                            <button className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50">
                                <Bell className="h-4 w-4 text-gray-600" />
                            </button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* STAT CARDS ROW */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                <StatCard label="Used Permission" value="3.5 / 4 Hours" icon={Clock} />
                <StatCard label="Used Annual Leaves" value="23 / 31 Days" icon={Calendar} />
                <StatCard label="Used Remote Days" value="10 / 12 Days" icon={User} />
                <StatCard label="Emergency" value="3 Days" icon={AlertCircle} />
                <StatCard label="Used Grace Minutes" value="48 / 60 Mins" icon={Coffee} />
                <StatCard label="Absent" value="2 Days" icon={User} />
            </div>

            {/* MAIN PANEL: LEFT TABS + REQUESTS TABLE */}
            <div className="grid grid-cols-12 gap-6">
                {/* LEFT TABS */}
                <div className="col-span-12 md:col-span-3">
                    <Card className="shadow-sm rounded-2xl border border-gray-100">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm text-gray-500 font-semibold">
                                Profile settings
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-1">
                            {[
                                'general',
                                'history',
                                'attendance-type',
                                'grace-minutes',
                                'work-calendar',
                                'leave-break',
                                'salary-config',
                                'documents',
                                'petty-cash',
                                'assets',
                            ].map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm capitalize ${activeTab === tab
                                            ? 'bg-gray-900 text-white'
                                            : 'text-gray-600 hover:bg-gray-100'
                                        }`}
                                >
                                    <span className="truncate">
                                        {tab.replace('-', ' ').replace(/\b\w/g, (c) => c.toUpperCase())}
                                    </span>
                                    <ChevronRight className="h-4 w-4 opacity-60" />
                                </button>
                            ))}
                        </CardContent>
                    </Card>
                </div>

                {/* REQUESTS TABLE */}
                <div className="col-span-12 md:col-span-9">
                    <Card className="shadow-sm rounded-2xl border border-gray-100">
                        <CardHeader className="flex flex-row items-center justify-between pb-4">
                            <div>
                                <CardTitle className="text-base font-semibold text-gray-900">
                                    Requests
                                </CardTitle>
                                <p className="text-xs text-gray-500 mt-1">
                                    Latest leave, permission and remote work requests
                                </p>
                            </div>
                            <div className="flex items-center space-x-2">
                                <select className="text-xs border border-gray-200 rounded-full px-3 py-1 bg-gray-50">
                                    <option>Approved</option>
                                    <option>Pending</option>
                                    <option>Rejected</option>
                                </select>
                                <div className="flex items-center text-xs text-gray-500 border border-gray-200 rounded-full px-3 py-1 bg-gray-50">
                                    <Calendar className="h-3 w-3 mr-1" />
                                    01 Oct 2024 - 31 Oct 2024
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="pt-0 pb-4">
                            <div className="overflow-x-auto">
                                <table className="min-w-full text-sm">
                                    <thead>
                                        <tr className="text-xs text-gray-400 border-b">
                                            <th className="py-2 text-left font-medium">Type</th>
                                            <th className="py-2 text-left font-medium">Request for</th>
                                            <th className="py-2 text-left font-medium">Reviewed by</th>
                                            <th className="py-2 text-left font-medium">Request on</th>
                                            <th className="py-2 text-left font-medium">Status</th>
                                            <th className="py-2 text-left font-medium">Comments</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y text-gray-700">
                                        {dummyRequests.map((req) => (
                                            <tr key={req.id} className="hover:bg-gray-50">
                                                <td className="py-2">{req.type}</td>
                                                <td className="py-2">{req.for}</td>
                                                <td className="py-2">{req.reviewer}</td>
                                                <td className="py-2">{req.date}</td>
                                                <td className="py-2">
                                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-50 text-green-600 border border-green-100">
                                                        <CheckCircle className="h-3 w-3 mr-1" />
                                                        Approved
                                                    </span>
                                                </td>
                                                <td className="py-2 text-gray-500">{req.comment}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}

// PAYROLL VIEW COMPONENT
function PayrollView({ user }: any) {
    const [activePayrollTab, setActivePayrollTab] = useState('payroll');

    return (
        <div className="max-w-7xl mx-auto space-y-6">
            {/* Tabs */}
            <div className="flex items-center space-x-2 border-b border-gray-200">
                {['Payroll', 'Bonus', 'Deductions', 'Deductions policy', 'Loans', 'Expenses', 'Cost centers'].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActivePayrollTab(tab.toLowerCase())}
                        className={`px-4 py-2 text-sm font-medium border-b-2 transition ${activePayrollTab === tab.toLowerCase()
                                ? 'border-black text-black'
                                : 'border-transparent text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card className="rounded-2xl border border-gray-100">
                    <CardContent className="p-4">
                        <div className="flex items-center space-x-2 mb-2">
                            <DollarSign className="h-4 w-4 text-green-500" />
                            <span className="text-xs text-gray-500">Total net pay</span>
                        </div>
                        <p className="text-xl font-bold text-green-600">32,450.00 <span className="text-sm">EGP</span></p>
                    </CardContent>
                </Card>
                <Card className="rounded-2xl border border-gray-100">
                    <CardContent className="p-4">
                        <div className="flex items-center space-x-2 mb-2">
                            <DollarSign className="h-4 w-4 text-blue-500" />
                            <span className="text-xs text-gray-500">Total paid</span>
                        </div>
                        <p className="text-xl font-bold text-blue-600">0.00 <span className="text-sm">EGP</span></p>
                    </CardContent>
                </Card>
                <Card className="rounded-2xl border border-gray-100">
                    <CardContent className="p-4">
                        <div className="flex items-center space-x-2 mb-2">
                            <AlertCircle className="h-4 w-4 text-orange-500" />
                            <span className="text-xs text-gray-500">Pending payments</span>
                        </div>
                        <p className="text-xl font-bold text-orange-600">32,450.00 <span className="text-sm">EGP</span></p>
                    </CardContent>
                </Card>
                <Card className="rounded-2xl border border-gray-100">
                    <CardContent className="p-4">
                        <div className="flex items-center space-x-2 mb-2">
                            <DollarSign className="h-4 w-4 text-gray-500" />
                            <span className="text-xs text-gray-500">Salary configurations</span>
                        </div>
                        <p className="text-xl font-bold text-gray-900">1,850.00 <span className="text-sm">EGP</span></p>
                    </CardContent>
                </Card>
            </div>

            {/* Payroll Table */}
            <Card className="shadow-sm rounded-2xl border border-gray-100">
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <CardTitle className="text-base font-semibold">Employee Payroll Details</CardTitle>
                        <div className="flex items-center space-x-2">
                            <select className="text-xs border border-gray-200 rounded-lg px-3 py-2 bg-gray-50">
                                <option>Monthly</option>
                                <option>Weekly</option>
                            </select>
                            <select className="text-xs border border-gray-200 rounded-lg px-3 py-2 bg-gray-50">
                                <option>May 2024</option>
                                <option>April 2024</option>
                            </select>
                            <button className="px-4 py-2 bg-cyan-500 text-white text-xs rounded-lg hover:bg-cyan-600">Add New</button>
                            <button className="px-4 py-2 bg-gray-900 text-white text-xs rounded-lg hover:bg-gray-800">Export</button>
                            <button className="px-4 py-2 bg-cyan-500 text-white text-xs rounded-lg hover:bg-cyan-600">Submit Payment</button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <table className="min-w-full text-xs">
                            <thead>
                                <tr className="text-xs text-gray-400 border-b">
                                    <th className="py-2 px-3 text-left">Employee Name</th>
                                    <th className="py-2 px-3 text-center">Gross</th>
                                    <th className="py-2 px-3 text-center">Allowance</th>
                                    <th className="py-2 px-3 text-center">Extra</th>
                                    <th className="py-2 px-3 text-center">Others</th>
                                    <th className="py-2 px-3 text-center">Gross +</th>
                                    <th className="py-2 px-3 text-center">Penalties</th>
                                    <th className="py-2 px-3 text-center">Deduct</th>
                                    <th className="py-2 px-3 text-center">Others</th>
                                    <th className="py-2 px-3 text-center">Gross -</th>
                                    <th className="py-2 px-3 text-center">Total</th>
                                    <th className="py-2 px-3 text-center">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y text-gray-700">
                                {payrollData.map((employee, idx) => (
                                    <tr key={idx} className="hover:bg-gray-50">
                                        <td className="py-3 px-3">{employee.name}</td>
                                        <td className="py-3 px-3 text-center">{employee.gross}</td>
                                        <td className="py-3 px-3 text-center">{employee.allowance}</td>
                                        <td className="py-3 px-3 text-center">{employee.extra}</td>
                                        <td className="py-3 px-3 text-center">{employee.others}</td>
                                        <td className="py-3 px-3 text-center">{employee.grossPlus}</td>
                                        <td className="py-3 px-3 text-center">{employee.penalties}</td>
                                        <td className="py-3 px-3 text-center">{employee.deduct}</td>
                                        <td className="py-3 px-3 text-center">{employee.otherDeduct}</td>
                                        <td className="py-3 px-3 text-center">{employee.grossMinus}</td>
                                        <td className="py-3 px-3 text-center font-semibold">{employee.total}</td>
                                        <td className="py-3 px-3 text-center">
                                            <span className="px-2 py-1 rounded-full bg-cyan-50 text-cyan-600 text-xs">Pending</span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

// ATTENDANCE VIEW COMPONENT
function AttendanceView({ user }: any) {
    const [activeAttendanceTab, setActiveAttendanceTab] = useState('history');

    return (
        <div className="max-w-7xl mx-auto space-y-6">
            {/* Tabs */}
            <div className="flex items-center space-x-2 border-b border-gray-200">
                {['Work Calendar', 'Attendance History', 'Penalties', 'Assignments', 'Reports'].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveAttendanceTab(tab.toLowerCase().replace(' ', '-'))}
                        className={`px-4 py-2 text-sm font-medium border-b-2 transition ${activeAttendanceTab === tab.toLowerCase().replace(' ', '-')
                                ? 'border-black text-black'
                                : 'border-transparent text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* Attendance History Table */}
            <Card className="shadow-sm rounded-2xl border border-gray-100">
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <CardTitle className="text-base font-semibold">Attendance Records</CardTitle>
                        <div className="flex items-center space-x-2">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3 w-3 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search"
                                    className="pl-8 pr-3 py-2 text-xs border border-gray-200 rounded-lg bg-gray-50"
                                />
                            </div>
                            <select className="text-xs border border-gray-200 rounded-lg px-3 py-2 bg-gray-50">
                                <option>23 May 2024</option>
                                <option>22 May 2024</option>
                            </select>
                            <select className="text-xs border border-gray-200 rounded-lg px-3 py-2 bg-gray-50">
                                <option>23 May 2024</option>
                                <option>22 May 2024</option>
                            </select>
                            <select className="text-xs border border-gray-200 rounded-lg px-3 py-2 bg-gray-50">
                                <option>Status</option>
                                <option>Present</option>
                                <option>Absent</option>
                            </select>
                            <select className="text-xs border border-gray-200 rounded-lg px-3 py-2 bg-gray-50">
                                <option>Office</option>
                                <option>Remote</option>
                            </select>
                            <select className="text-xs border border-gray-200 rounded-lg px-3 py-2 bg-gray-50">
                                <option>Department</option>
                            </select>
                            <button className="px-4 py-2 bg-cyan-500 text-white text-xs rounded-lg hover:bg-cyan-600">Add Filter</button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <table className="min-w-full text-xs">
                            <thead>
                                <tr className="text-xs text-gray-400 border-b">
                                    <th className="py-2 px-3 text-left">
                                        <input type="checkbox" className="rounded" />
                                    </th>
                                    <th className="py-2 px-3 text-left">Employee Name</th>
                                    <th className="py-2 px-3 text-center">1st Sign in / Sign out</th>
                                    <th className="py-2 px-3 text-center">2nd Sign in / Sign out</th>
                                    <th className="py-2 px-3 text-center">01 May 13</th>
                                    <th className="py-2 px-3 text-center">Total hours (day)</th>
                                    <th className="py-2 px-3 text-center">Last update</th>
                                    <th className="py-2 px-3 text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y text-gray-700">
                                {attendanceData.map((record, idx) => (
                                    <tr key={idx} className="hover:bg-gray-50">
                                        <td className="py-3 px-3">
                                            <input type="checkbox" className="rounded" />
                                        </td>
                                        <td className="py-3 px-3">{record.name}</td>
                                        <td className="py-3 px-3 text-center">
                                            <div className="text-xs">
                                                <span className={`px-2 py-1 rounded ${record.firstSignIn.status === 'On time' ? 'bg-cyan-50 text-cyan-600' : 'bg-red-50 text-red-600'}`}>
                                                    {record.firstSignIn.status}
                                                </span>
                                                <div className="mt-1 text-gray-500">{record.firstSignIn.time}</div>
                                                <div className="text-gray-400">{record.firstSignOut.time}</div>
                                            </div>
                                        </td>
                                        <td className="py-3 px-3 text-center text-gray-400">—</td>
                                        <td className="py-3 px-3 text-center text-gray-500">{record.date}</td>
                                        <td className="py-3 px-3 text-center">
                                            <span className={`px-2 py-1 rounded ${record.totalHours.status === 'On time' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                                                {record.totalHours.hours}
                                            </span>
                                        </td>
                                        <td className="py-3 px-3 text-center text-gray-500">{record.lastUpdate}</td>
                                        <td className="py-3 px-3 text-center">
                                            <button className="text-blue-500 hover:text-blue-700">⋮</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

// Helper Components
function StatCard({ label, value, icon: Icon }: { label: string; value: string; icon: any }) {
    return (
        <Card className="rounded-2xl border border-gray-100 shadow-sm">
            <CardContent className="p-4 flex flex-col space-y-3">
                <div className="w-9 h-9 rounded-full bg-blue-50 flex items-center justify-center">
                    <Icon className="h-4 w-4 text-blue-500" />
                </div>
                <div>
                    <p className="text-xs uppercase tracking-wide text-gray-400">{label}</p>
                    <p className="mt-1 text-sm font-semibold text-gray-900">{value}</p>
                </div>
            </CardContent>
        </Card>
    );
}

// Mock Data
const dummyRequests = [
    {
        id: 1,
        type: 'Annual leave',
        for: '12 Oct 2024',
        reviewer: 'Deyaa Kassem',
        date: '12 Oct 2024 – 16:14:42',
        comment: 'I have wedding party',
    },
    {
        id: 2,
        type: 'Permission',
        for: '12 Oct 2024',
        reviewer: 'Deyaa Kassem',
        date: '12 Oct 2024 – 16:14:42',
        comment: 'Doctor appointment',
    },
    {
        id: 3,
        type: 'Work remotely',
        for: '15 Oct 2024',
        reviewer: 'Deyaa Kassem',
        date: '10 Oct 2024 – 10:07:30',
        comment: 'Remote day for focus',
    },
];

const payrollData = [
    { name: 'Ahmed Fahmy', gross: '4,000.00 $', allowance: '4,000.00 $', extra: '4,000.00 $', others: '4,000.00 $', grossPlus: '4,000.00 $', penalties: '4,000.00 $', deduct: '4,000.00 $', otherDeduct: '4,000.00 $', grossMinus: '4,000.00 $', total: '4,000.00 $' },
    { name: 'Ahmed Nader', gross: '4,000.00 $', allowance: '4,000.00 $', extra: '4,000.00 $', others: '4,000.00 $', grossPlus: '4,000.00 $', penalties: '4,000.00 $', deduct: '4,000.00 $', otherDeduct: '4,000.00 $', grossMinus: '4,000.00 $', total: '4,000.00 $' },
    { name: 'Naure Emad', gross: '4,000.00 $', allowance: '4,000.00 $', extra: '4,000.00 $', others: '4,000.00 $', grossPlus: '4,000.00 $', penalties: '4,000.00 $', deduct: '4,000.00 $', otherDeduct: '4,000.00 $', grossMinus: '4,000.00 $', total: '4,000.00 $' },
];

const attendanceData = [
    { name: 'Deyaa Kassem', firstSignIn: { status: 'On time', time: '09:00:00 AM' }, firstSignOut: { time: '05:00:00 PM' }, date: '01 May 13', totalHours: { hours: '08:00:15', status: 'On time' }, lastUpdate: '09:06:13' },
    { name: 'Ali Mohamed El-Shafey', firstSignIn: { status: 'Late Soin-In', time: '09:00:00 AM' }, firstSignOut: { time: '05:00:00 PM' }, date: '01 May 13', totalHours: { hours: '07:45:31', status: 'Late' }, lastUpdate: '09:06:13' },
    { name: 'Sarah Ibrahim', firstSignIn: { status: 'On time', time: '08:00:00 AM' }, firstSignOut: { time: '04:00:00 PM' }, date: '01 May 13', totalHours: { hours: '08:15:23', status: 'On time' }, lastUpdate: '08:47:12' },
];
