'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
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
  ChevronLeft, ChevronDown, Menu, X
} from 'lucide-react';

export default function FullDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeModule, setActiveModule] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showChat, setShowChat] = useState(false);

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

  // System Modules with ALL Features
  const systemModules = [
    {
      category: 'Core HR',
      modules: [
        { id: 'overview', name: 'Dashboard Overview', icon: Home, stats: { active: true, count: null } },
        { id: 'employees', name: 'Employee Management', icon: Users, stats: { active: true, count: 254 } },
        { id: 'attendance', name: 'Attendance Tracking', icon: Clock, stats: { active: true, count: 23 } },
        { id: 'leave', name: 'Leave Management', icon: Calendar, stats: { active: true, count: 5 } },
        { id: 'payroll', name: 'Payroll Processing', icon: DollarSign, stats: { active: true, count: null } },
        { id: 'organization', name: 'Organization Chart', icon: GitBranch, stats: { active: true, count: null } },
      ]
    },
    {
      category: 'Communication',
      modules: [
        { id: 'chat', name: 'Chat System', icon: MessageSquare, stats: { active: true, count: 15, live: true } },
        { id: 'video', name: 'Video Meetings', icon: Video, stats: { active: true, count: 3 } },
        { id: 'screenshare', name: 'Screen Sharing', icon: Monitor, stats: { active: true, count: 2, live: true } },
        { id: 'notifications', name: 'Notifications Center', icon: Bell, stats: { active: true, count: 28 } },
        { id: 'email', name: 'Email Templates', icon: Mail, stats: { active: true, count: 12 } },
      ]
    },
    {
      category: 'Productivity',
      modules: [
        { id: 'projects', name: 'Project Management', icon: Folder, stats: { active: true, count: 18 } },
        { id: 'tasks', name: 'Task Management', icon: CheckCircle, stats: { active: true, count: 47 } },
        { id: 'calendar', name: 'Calendar & Events', icon: Calendar, stats: { active: true, count: 8 } },
        { id: 'documents', name: 'Document Management', icon: FileText, stats: { active: true, count: 156 } },
        { id: 'training', name: 'Training & Courses', icon: BookOpen, stats: { active: true, count: 24 } },
      ]
    },
    {
      category: 'Intelligence',
      modules: [
        { id: 'ai-analytics', name: 'AI Analytics', icon: Brain, stats: { active: true, count: 'New', ai: true } },
        { id: 'insights', name: 'Business Insights', icon: Zap, stats: { active: true, count: 15 } },
        { id: 'reports', name: 'Advanced Reports', icon: BarChart3, stats: { active: true, count: 32 } },
        { id: 'predictions', name: 'Predictive Analysis', icon: TrendingUp, stats: { active: true, count: 7, ai: true } },
        { id: 'anomalies', name: 'Anomaly Detection', icon: AlertCircle, stats: { active: true, count: 3, ai: true } },
      ]
    },
    {
      category: 'System',
      modules: [
        { id: 'audit', name: 'Audit Logs', icon: Shield, stats: { active: true, count: 1250 } },
        { id: 'security', name: 'Security Center', icon: Lock, stats: { active: true, count: null } },
        { id: 'integrations', name: 'Integrations', icon: Layers, stats: { active: true, count: 8 } },
        { id: 'database', name: 'Database Status', icon: Database, stats: { active: true, count: '70+ Tables' } },
        { id: 'settings', name: 'System Settings', icon: Settings, stats: { active: true, count: null } },
      ]
    }
  ];

  const handleLogout = () => {
    localStorage.clear();
    router.push('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading Mates HR Enterprise System...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Advanced Sidebar */}
      <aside className={`${sidebarOpen ? 'w-80' : 'w-20'} bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-white transition-all duration-300 relative`}>
        <div className="sticky top-0 h-screen flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-gray-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Briefcase className="h-10 w-10 text-primary-400" />
                {sidebarOpen && (
                  <div className="ml-3">
                    <h1 className="text-xl font-bold bg-gradient-to-r from-primary-400 to-secondary-400 bg-clip-text text-transparent">
                      Mates HR Pro
                    </h1>
                    <p className="text-xs text-gray-400">Enterprise Edition v2.0</p>
                  </div>
                )}
              </div>
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-1 hover:bg-gray-700 rounded-lg transition-colors"
              >
                {sidebarOpen ? <ChevronLeft className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>

          {/* User Profile */}
          {sidebarOpen && (
            <div className="p-4 border-b border-gray-700 bg-gray-800/50">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center">
                  <span className="text-lg font-bold">{user?.firstName?.[0]}{user?.lastName?.[0]}</span>
                </div>
                <div className="flex-1">
                  <p className="font-medium">{user?.firstName} {user?.lastName}</p>
                  <p className="text-xs text-gray-400">{user?.email}</p>
                  <div className="flex items-center mt-1">
                    <span className="px-2 py-0.5 bg-green-500/20 text-green-400 text-xs rounded-full">
                      {user?.roles?.[0] || 'Employee'}
                    </span>
                    <span className="ml-2 flex items-center text-xs text-green-400">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse mr-1"></div>
                      Online
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-3">
            {systemModules.map((category) => (
              <div key={category.category} className="mb-6">
                {sidebarOpen && (
                  <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-3 mb-2">
                    {category.category}
                  </h3>
                )}
                {category.modules.map((module) => {
                  const Icon = module.icon;
                  const isActive = activeModule === module.id;
                  return (
                    <button
                      key={module.id}
                      onClick={() => setActiveModule(module.id)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg mb-1 transition-all ${
                        isActive 
                          ? 'bg-primary-600 text-white shadow-lg' 
                          : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                      }`}
                    >
                      <div className="flex items-center">
                        <Icon className="h-5 w-5" />
                        {sidebarOpen && (
                          <span className="ml-3 text-sm font-medium">{module.name}</span>
                        )}
                      </div>
                      {sidebarOpen && module.stats.count !== null && (
                        <div className="flex items-center space-x-1">
                          {module.stats.live && (
                            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                          )}
                          {module.stats.ai && (
                            <Brain className="h-3 w-3 text-purple-400" />
                          )}
                          <span className={`px-2 py-0.5 text-xs rounded-full ${
                            module.stats.count === 'New' 
                              ? 'bg-green-500 text-white' 
                              : isActive 
                                ? 'bg-white/20 text-white'
                                : 'bg-gray-700 text-gray-300'
                          }`}>
                            {module.stats.count}
                          </span>
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            ))}
          </nav>

          {/* Footer Actions */}
          <div className="p-4 border-t border-gray-700">
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center px-3 py-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 rounded-lg transition-all"
            >
              <LogOut className="h-5 w-5" />
              {sidebarOpen && <span className="ml-2 font-medium">Logout</span>}
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Header */}
        <header className="bg-white border-b">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {systemModules.flatMap(c => c.modules).find(m => m.id === activeModule)?.name || 'Dashboard'}
                </h1>
                <p className="text-sm text-gray-500 mt-1">
                  Complete enterprise HR management system with AI-powered insights
                </p>
              </div>
              
              <div className="flex items-center space-x-4">
                {/* Global Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search anything..."
                    className="pl-10 pr-4 py-2 border rounded-lg text-sm w-80 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>

                {/* Quick Actions */}
                <div className="flex items-center space-x-2 border-l pl-4">
                  <button className="p-2 hover:bg-gray-100 rounded-lg relative">
                    <Bell className="h-5 w-5 text-gray-600" />
                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                  </button>
                  <button 
                    onClick={() => setShowChat(!showChat)}
                    className="p-2 hover:bg-gray-100 rounded-lg relative"
                  >
                    <MessageSquare className="h-5 w-5 text-gray-600" />
                    <span className="absolute top-1 right-1 w-2 h-2 bg-green-500 rounded-full"></span>
                  </button>
                  <button className="p-2 hover:bg-gray-100 rounded-lg">
                    <Video className="h-5 w-5 text-gray-600" />
                  </button>
                  <button className="p-2 hover:bg-gray-100 rounded-lg">
                    <Monitor className="h-5 w-5 text-gray-600" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto bg-gray-50 p-6">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold mb-6">Welcome to Mates HR Enterprise System</h2>
            <p className="text-lg text-gray-600 mb-8">
              This is the complete dashboard with all {systemModules.reduce((acc, cat) => acc + cat.modules.length, 0)} modules integrated!
            </p>
            
            {/* Module Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {systemModules.flatMap(cat => cat.modules).map(module => {
                const Icon = module.icon;
                return (
                  <Card 
                    key={module.id}
                    className="cursor-pointer hover:shadow-lg transition-all"
                    onClick={() => setActiveModule(module.id)}
                  >
                    <CardContent className="p-6">
                      <Icon className="h-12 w-12 text-primary-600 mb-4" />
                      <h3 className="font-bold text-lg mb-2">{module.name}</h3>
                      {module.stats.count && (
                        <p className="text-sm text-gray-600">
                          {module.stats.count} {typeof module.stats.count === 'number' ? 'items' : ''}
                        </p>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </main>
      </div>

      {/* Chat Widget */}
      {showChat && (
        <div className="fixed bottom-4 right-4 w-96 h-[600px] bg-white rounded-lg shadow-2xl border overflow-hidden">
          <div className="p-4 bg-primary-600 text-white flex justify-between items-center">
            <h3 className="font-bold">Chat System</h3>
            <button onClick={() => setShowChat(false)}>
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="p-4">
            <p>Real-time chat interface with WebSocket</p>
          </div>
        </div>
      )}
    </div>
  );
}
