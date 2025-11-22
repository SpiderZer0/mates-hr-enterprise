'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '../../../../packages/ui/src/index';
import {
  Users, Calendar, Clock, DollarSign, TrendingUp, Activity,
  Briefcase, Award, MessageSquare, Video, Brain, Bell,
  BarChart3, FileText, Settings, Home, ChevronRight,
  UserCheck, UserX, Coffee, AlertCircle, CheckCircle,
  PieChart, Target, Zap, Globe, Shield, Laptop,
  Mail, Phone, MapPin, Building, ArrowUp, ArrowDown,
  MoreVertical, Plus, Search, Filter, Download, LogOut,
  Monitor, Mic, Camera, Share2, Folder, BookOpen,
  HeartHandshake, Star, Send, Archive, Trash2,
  Layers, GitBranch, Database, Code, Cpu, HardDrive,
  Wifi, WifiOff, Lock, Unlock, Eye, EyeOff,
  ChevronLeft, ChevronDown, Menu, X, ArrowUpRight
} from 'lucide-react';
import EmployeesView from '../../components/employees/EmployeesView';
import AttendanceView from '../../components/attendance/AttendanceView';
import LeaveView from '../../components/leave/LeaveView';
import PayrollView from '../../components/payroll/PayrollView';
import AnalyticsView from '../../components/analytics/AnalyticsView';
import SettingsView from '../../components/settings/SettingsView';

export default function AdminDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeModule, setActiveModule] = useState('overview');

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
          <p className="mt-4 text-gray-600">Loading Admin Dashboard…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F6F7FA] flex">
      {/* LEFT ICON SIDEBAR */}
      <aside className="w-20 bg-white border-r border-gray-200 flex flex-col items-center py-6 space-y-6 z-20">
        {/* Logo */}
        <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-sky-400 to-blue-600 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-blue-200">
          M
        </div>

        {/* Nav icons */}
        <nav className="mt-6 flex flex-col space-y-4 w-full px-2">
          <NavButton
            active={activeModule === 'overview'}
            onClick={() => setActiveModule('overview')}
            icon={Home}
            title="Overview"
          />
          <NavButton
            active={activeModule === 'employees'}
            onClick={() => setActiveModule('employees')}
            icon={Users}
            title="Employees"
          />
          <NavButton
            active={activeModule === 'attendance'}
            onClick={() => setActiveModule('attendance')}
            icon={Clock}
            title="Attendance"
          />
          <NavButton
            active={activeModule === 'leave'}
            onClick={() => setActiveModule('leave')}
            icon={Calendar}
            title="Leave"
          />
          <NavButton
            active={activeModule === 'payroll'}
            onClick={() => setActiveModule('payroll')}
            icon={DollarSign}
            title="Payroll"
          />
          <NavButton
            active={activeModule === 'analytics'}
            onClick={() => setActiveModule('analytics')}
            icon={BarChart3}
            title="Analytics"
          />
          <div className="h-px bg-gray-200 w-full my-2" />
          <NavButton
            active={activeModule === 'notifications'}
            onClick={() => setActiveModule('notifications')}
            icon={Bell}
            title="Notifications"
          />
          <NavButton
            active={activeModule === 'settings'}
            onClick={() => setActiveModule('settings')}
            icon={Settings}
            title="Settings"
          />
        </nav>

        <div className="mt-auto">
          <button
            onClick={handleLogout}
            className="w-10 h-10 rounded-2xl text-red-500 hover:bg-red-50 flex items-center justify-center transition-all duration-200 hover:scale-110"
            title="Logout"
          >
            <LogOut className="h-5 w-5" />
          </button>
        </div>
      </aside>

      {/* MAIN AREA */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* TOP BAR */}
        <header className="h-20 bg-white border-b border-gray-200 flex items-center justify-between px-8 shrink-0">
          <div className="flex items-center space-x-4">
            <button className="md:hidden p-2 rounded-lg border border-gray-200">
              <Menu className="h-5 w-5 text-gray-600" />
            </button>
            {/* search */}
            <div className="relative w-96 max-w-md group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-primary-500 transition-colors" />
              <input
                type="text"
                placeholder="Search employees, modules, or actions..."
                className="w-full pl-9 pr-3 py-2.5 rounded-full border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-gray-50 transition-all duration-200"
              />
            </div>
          </div>

          <div className="flex items-center space-x-6">
            {/* date & time */}
            <div className="hidden md:flex items-center text-sm text-gray-500 space-x-4 bg-gray-50 px-4 py-2 rounded-full border border-gray-100">
              <span className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gray-400" />
                {new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
              </span>
              <div className="w-px h-4 bg-gray-300" />
              <span className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-gray-400" />
                {new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>

            {/* user mini card */}
            <div className="flex items-center space-x-3 pl-6 border-l border-gray-200">
              <div className="text-right hidden md:block">
                <p className="text-sm font-bold text-gray-900">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="text-xs text-primary-600 font-medium">{user?.roles?.[0] || 'Admin'}</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-sm font-bold text-white shadow-md ring-2 ring-white">
                {user?.firstName?.[0]}
              </div>
            </div>
          </div>
        </header>

        {/* CONTENT */}
        <main className="flex-1 overflow-y-auto px-8 py-6 bg-[#F6F7FA]">
          {activeModule === 'overview' && <OverviewDashboard setActiveModule={setActiveModule} />}
          {activeModule === 'employees' && <EmployeesView />}
          {activeModule === 'attendance' && <AttendanceView />}
          {activeModule === 'leave' && <LeaveView />}
          {activeModule === 'payroll' && <PayrollView />}
          {activeModule === 'analytics' && <AnalyticsView />}
          {activeModule === 'settings' && <SettingsView />}
          {activeModule === 'notifications' && <SettingsView />} {/* Reusing Settings for now as placeholder */}
        </main>
      </div>
    </div>
  );
}

function NavButton({ active, onClick, icon: Icon, title }: any) {
  return (
    <button
      onClick={onClick}
      className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-200 group relative mx-auto ${active
          ? 'bg-black text-white shadow-lg shadow-gray-300 scale-105'
          : 'text-gray-400 hover:text-gray-900 hover:bg-gray-100'
        }`}
      title={title}
    >
      <Icon className={`h-5 w-5 ${active ? 'stroke-[2.5px]' : 'stroke-[2px]'}`} />

      {/* Tooltip */}
      <span className="absolute left-full ml-4 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none">
        {title}
      </span>
    </button>
  );
}

// OVERVIEW DASHBOARD
function OverviewDashboard({ setActiveModule }: { setActiveModule: (module: string) => void }) {
  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      {/* Welcome Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Dashboard Overview</h1>
          <p className="text-gray-500 mt-1">Here's what's happening in your organization today.</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setActiveModule('analytics')}
            className="inline-flex items-center px-4 py-2 rounded-lg bg-white border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <BarChart3 className="h-4 w-4 mr-2" />
            View Analytics
          </button>
          <button className="inline-flex items-center px-4 py-2 rounded-lg bg-black text-white text-sm font-medium hover:bg-gray-800 transition-colors shadow-lg shadow-gray-200">
            <Plus className="h-4 w-4 mr-2" />
            Quick Action
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          label="Total Employees"
          value="254"
          change="+12%"
          icon={Users}
          color="blue"
          onClick={() => setActiveModule('employees')}
        />
        <StatCard
          label="Present Today"
          value="234"
          change="92%"
          icon={UserCheck}
          color="green"
          onClick={() => setActiveModule('attendance')}
        />
        <StatCard
          label="Monthly Payroll"
          value="$1.2M"
          change="+8%"
          icon={DollarSign}
          color="purple"
          onClick={() => setActiveModule('payroll')}
        />
        <StatCard
          label="Pending Requests"
          value="12"
          change="Action Needed"
          icon={Bell}
          color="orange"
          onClick={() => setActiveModule('leave')}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content Column */}
        <div className="lg:col-span-2 space-y-8">
          {/* Quick Access Modules */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900">Quick Access</h2>
              <button className="text-sm text-primary-600 font-medium hover:text-primary-700">Customize</button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <ModuleCard
                icon={Users}
                title="Employees"
                description="Manage Staff"
                onClick={() => setActiveModule('employees')}
                color="bg-blue-50 text-blue-600"
              />
              <ModuleCard
                icon={Clock}
                title="Attendance"
                description="Track Time"
                onClick={() => setActiveModule('attendance')}
                color="bg-green-50 text-green-600"
              />
              <ModuleCard
                icon={Calendar}
                title="Leave"
                description="Approve Offs"
                onClick={() => setActiveModule('leave')}
                color="bg-orange-50 text-orange-600"
              />
              <ModuleCard
                icon={DollarSign}
                title="Payroll"
                description="Process Pay"
                onClick={() => setActiveModule('payroll')}
                color="bg-purple-50 text-purple-600"
              />
            </div>
          </section>

          {/* Recent Activity */}
          <Card className="border-none shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg font-bold">Recent Activity</CardTitle>
              <button className="text-sm text-gray-500 hover:text-gray-900">View All</button>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {recentActivities.map((activity, idx) => (
                  <div key={idx} className="flex items-start space-x-4 group cursor-pointer">
                    <div className={`w-10 h-10 rounded-full ${activity.color} flex items-center justify-center flex-shrink-0 ring-4 ring-white group-hover:ring-gray-50 transition-all`}>
                      <activity.icon className="h-5 w-5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0 pt-1">
                      <p className="text-sm font-medium text-gray-900 group-hover:text-primary-600 transition-colors">{activity.title}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{activity.time}</p>
                    </div>
                    <button className="p-2 text-gray-400 hover:text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity">
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Side Column */}
        <div className="space-y-8">
          {/* AI Insights Widget */}
          <Card className="border-none shadow-lg bg-gradient-to-br from-gray-900 to-gray-800 text-white overflow-hidden relative">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Brain className="h-32 w-32" />
            </div>
            <CardContent className="p-6 relative z-10">
              <div className="flex items-center gap-2 mb-4">
                <Zap className="h-5 w-5 text-yellow-400" />
                <span className="text-sm font-bold text-yellow-400 uppercase tracking-wider">AI Insight</span>
              </div>
              <h3 className="text-xl font-bold mb-2">Unusual Absence Rate</h3>
              <p className="text-gray-300 text-sm mb-6">
                Attendance in the Engineering department is 15% lower than average this week.
              </p>
              <button className="w-full py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm font-medium transition-colors backdrop-blur-sm">
                View Analysis
              </button>
            </CardContent>
          </Card>

          {/* Pending Actions */}
          <Card className="border-none shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-bold">Action Required</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {pendingActions.map((action, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition cursor-pointer group border border-transparent hover:border-gray-200">
                    <div className="flex items-center space-x-3">
                      <div className={`w-2 h-2 rounded-full ${action.priority === 'high' ? 'bg-red-500' : action.priority === 'medium' ? 'bg-yellow-500' : 'bg-blue-500'}`} />
                      <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">{action.title}</span>
                    </div>
                    <ArrowUpRight className="h-4 w-4 text-gray-400 group-hover:text-gray-600" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

// Helper Components
function StatCard({ label, value, change, icon: Icon, color, onClick }: any) {
  const colorClasses: any = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    purple: 'bg-purple-50 text-purple-600',
    orange: 'bg-orange-50 text-orange-600',
  };

  return (
    <Card className="border-none shadow-sm hover:shadow-md transition-all cursor-pointer group" onClick={onClick}>
      <CardContent className="p-6 flex flex-col space-y-4">
        <div className="flex items-center justify-between">
          <div className={`w-12 h-12 rounded-2xl ${colorClasses[color]} flex items-center justify-center group-hover:scale-110 transition-transform`}>
            <Icon className="h-6 w-6" />
          </div>
          <span className={`px-2 py-1 rounded-full text-xs font-bold ${change.includes('+') || change.includes('%') ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-600'
            }`}>
            {change}
          </span>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500">{label}</p>
          <p className="mt-1 text-2xl font-bold text-gray-900 tracking-tight">{value}</p>
        </div>
      </CardContent>
    </Card>
  );
}

function ModuleCard({ icon: Icon, title, description, onClick, color }: any) {
  return (
    <div
      onClick={onClick}
      className="p-4 border border-gray-100 rounded-2xl hover:shadow-md transition-all cursor-pointer bg-white group hover:-translate-y-1"
    >
      <div className={`w-10 h-10 rounded-xl ${color || 'bg-gray-50 text-gray-600'} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
        <Icon className="h-5 w-5" />
      </div>
      <h3 className="text-sm font-bold text-gray-900">{title}</h3>
      <p className="text-xs text-gray-500 mt-1">{description}</p>
    </div>
  );
}

// Mock Data
const recentActivities = [
  { icon: UserCheck, title: 'Ahmed Hassan checked in', time: '2 mins ago', color: 'bg-green-500' },
  { icon: Calendar, title: 'Sarah requested leave', time: '15 mins ago', color: 'bg-blue-500' },
  { icon: DollarSign, title: 'Payroll processed', time: '1 hour ago', color: 'bg-purple-500' },
  { icon: AlertCircle, title: 'Late arrival alert', time: '2 hours ago', color: 'bg-orange-500' },
  { icon: FileText, title: 'Monthly report ready', time: '3 hours ago', color: 'bg-gray-500' },
];

const pendingActions = [
  { title: 'Approve 5 leave requests', priority: 'high' },
  { title: 'Review attendance anomalies', priority: 'medium' },
  { title: 'Update employee records', priority: 'low' },
  { title: 'Generate quarterly report', priority: 'medium' },
];
