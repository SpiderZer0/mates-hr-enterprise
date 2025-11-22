import Link from 'next/link';
import { Button, Card, CardContent, CardHeader, CardTitle } from '../../../packages/ui/src/index';
import { 
  Users, 
  Calendar, 
  DollarSign, 
  BarChart3, 
  Shield, 
  Globe2,
  Clock,
  FileText,
  Award,
  Briefcase
} from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-neutral-200">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Briefcase className="h-8 w-8 text-primary-500" />
              <h1 className="text-2xl font-bold text-primary-900">Mates HR</h1>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="ghost" asChild>
                <Link href="/features">Features</Link>
              </Button>
              <Button variant="ghost" asChild>
                <Link href="/about">About</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/login">Sign In</Link>
              </Button>
              <Button asChild>
                <Link href="/register">Get Started</Link>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-6 py-20">
        <div className="text-center max-w-4xl mx-auto">
          <h2 className="text-5xl font-bold text-neutral-900 mb-6">
            Enterprise HR Management
            <span className="text-primary-500"> Made Simple</span>
          </h2>
          <p className="text-xl text-neutral-600 mb-8">
            Streamline your HR operations with our comprehensive, multi-language platform. 
            Built for modern enterprises with advanced features and intuitive design.
          </p>
          <div className="flex gap-4 justify-center">
            <Button size="lg" asChild>
              <Link href="/demo">Request Demo</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/login">Sign In</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="container mx-auto px-6 py-16">
        <h3 className="text-3xl font-bold text-center text-neutral-900 mb-12">
          Comprehensive HR Solutions
        </h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <Users className="h-10 w-10 text-primary-500 mb-2" />
              <CardTitle>Employee Management</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-neutral-600">
                Complete employee lifecycle management from onboarding to offboarding
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <Clock className="h-10 w-10 text-success-500 mb-2" />
              <CardTitle>Attendance Tracking</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-neutral-600">
                Real-time attendance monitoring with advanced reporting capabilities
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <Calendar className="h-10 w-10 text-warning-500 mb-2" />
              <CardTitle>Leave Management</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-neutral-600">
                Automated leave requests, approvals, and balance tracking
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <DollarSign className="h-10 w-10 text-primary-500 mb-2" />
              <CardTitle>Payroll Processing</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-neutral-600">
                Comprehensive payroll calculation with tax and deduction management
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <BarChart3 className="h-10 w-10 text-secondary-500 mb-2" />
              <CardTitle>Analytics & Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-neutral-600">
                Detailed insights and customizable reports for data-driven decisions
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <Shield className="h-10 w-10 text-error-500 mb-2" />
              <CardTitle>Security & Compliance</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-neutral-600">
                Enterprise-grade security with RBAC and compliance management
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Key Features */}
      <section className="bg-neutral-50 py-16">
        <div className="container mx-auto px-6">
          <h3 className="text-3xl font-bold text-center text-neutral-900 mb-12">
            Why Choose Mates HR?
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <Globe2 className="h-12 w-12 text-primary-500 mx-auto mb-4" />
              <h4 className="font-semibold text-lg mb-2">Multi-Language</h4>
              <p className="text-neutral-600">Full Arabic and English support with RTL interface</p>
            </div>
            <div className="text-center">
              <Award className="h-12 w-12 text-success-500 mx-auto mb-4" />
              <h4 className="font-semibold text-lg mb-2">Enterprise Ready</h4>
              <p className="text-neutral-600">Scalable solution for organizations of all sizes</p>
            </div>
            <div className="text-center">
              <FileText className="h-12 w-12 text-warning-500 mx-auto mb-4" />
              <h4 className="font-semibold text-lg mb-2">Comprehensive</h4>
              <p className="text-neutral-600">All HR functions in one integrated platform</p>
            </div>
            <div className="text-center">
              <Shield className="h-12 w-12 text-secondary-500 mx-auto mb-4" />
              <h4 className="font-semibold text-lg mb-2">Secure</h4>
              <p className="text-neutral-600">Bank-level security with role-based access</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-6 py-20">
        <div className="bg-primary-500 rounded-2xl p-12 text-center text-white">
          <h3 className="text-3xl font-bold mb-4">
            Ready to Transform Your HR Operations?
          </h3>
          <p className="text-xl mb-8 text-primary-100">
            Join thousands of companies using Mates HR to streamline their workforce management
          </p>
          <div className="flex gap-4 justify-center">
            <Button size="lg" variant="secondary" asChild>
              <Link href="/register">Start Free Trial</Link>
            </Button>
            <Button size="lg" variant="outline" className="bg-white text-primary-500 hover:bg-primary-50" asChild>
              <Link href="/contact">Contact Sales</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-neutral-900 text-white py-12">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Briefcase className="h-6 w-6" />
                <h4 className="text-xl font-bold">Mates HR</h4>
              </div>
              <p className="text-neutral-400">
                Enterprise HR Management System
              </p>
            </div>
            <div>
              <h5 className="font-semibold mb-4">Product</h5>
              <ul className="space-y-2 text-neutral-400">
                <li><Link href="/features" className="hover:text-white">Features</Link></li>
                <li><Link href="/pricing" className="hover:text-white">Pricing</Link></li>
                <li><Link href="/demo" className="hover:text-white">Demo</Link></li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold mb-4">Company</h5>
              <ul className="space-y-2 text-neutral-400">
                <li><Link href="/about" className="hover:text-white">About</Link></li>
                <li><Link href="/contact" className="hover:text-white">Contact</Link></li>
                <li><Link href="/careers" className="hover:text-white">Careers</Link></li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold mb-4">Support</h5>
              <ul className="space-y-2 text-neutral-400">
                <li><Link href="/docs" className="hover:text-white">Documentation</Link></li>
                <li><Link href="/help" className="hover:text-white">Help Center</Link></li>
                <li><Link href="/api" className="hover:text-white">API Docs</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-neutral-800 mt-8 pt-8 text-center text-neutral-400">
            <p>&copy; 2024 Mates HR. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
