# 🏢 Mates HR Enterprise

<div align="center">

![Mates HR](https://img.shields.io/badge/Mates-HR-Enterprise-blue?style=for-the-badge)

**Complete Enterprise HR Management System with AI Analytics, Real-time Chat, Video Conferencing & Screen Sharing**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-000000?logo=next.js&logoColor=white)](https://nextjs.org/)
[![NestJS](https://img.shields.io/badge/NestJS-E0234E?logo=nestjs&logoColor=white)](https://nestjs.com/)
[![Prisma](https://img.shields.io/badge/Prisma-2D3748?logo=prisma&logoColor=white)](https://www.prisma.io/)

[▶️ Live Demo](#demo) • [📚 Documentation](#documentation) • [🚀 Quick Start](#quick-start) • [✨ Features](#features)

</div>

## 🎯 Overview

Mates HR Enterprise is a **production-ready** comprehensive HR management system designed for modern organizations. Built with cutting-edge technologies and featuring **25+ integrated modules**, this system provides everything needed for complete human resource management.

### 🚀 Key Highlights

- 🤖 **AI-Powered Analytics** - Predictive insights and anomaly detection
- 💬 **Real-time Communication** - WebSocket chat, video conferencing, screen sharing
- 📊 **70+ Database Tables** - Complete enterprise data model
- 🔐 **Enterprise Security** - JWT auth, role-based access control
- 📱 **Modern UI/UX** - Responsive design with Tailwind CSS
- 🗄️ **Scalable Architecture** - Turbo monorepo with microservices

## ✨ Features

### 🏢 Core HR Modules
- 👥 **Employee Management** - Complete CRUD with profiles, documents, and history
- ⏰ **Attendance Tracking** - Check-in/out, timesheets, and attendance analytics
- 📅 **Leave Management** - Request, approve, and track employee leaves
- 💰 **Payroll Processing** - Salary calculation, deductions, and payslips
- 🏗️ **Organization Chart** - Visual hierarchy and department management
- 📈 **Performance Reviews** - Employee evaluation and goal tracking

### 🤖 AI & Analytics
- 🧠 **AI Analytics** - Machine learning insights and predictions
- 📊 **Business Intelligence** - Advanced reporting and dashboards
- 🔍 **Anomaly Detection** - Automated pattern recognition
- 📈 **Predictive Analysis** - Forecasting and trend analysis
- 🎯 **Performance Insights** - Employee productivity analytics

### 💬 Communication & Collaboration
- 💬 **Real-time Chat** - WebSocket-based messaging system
- 📹 **Video Conferencing** - Integrated video meetings
- 🖥️ **Screen Sharing** - Remote collaboration tool
- 📧 **Email Templates** - Automated notifications
- 🔔 **Smart Notifications** - Real-time alerts system
- 📅 **Calendar Integration** - Meeting scheduling and events

### 📋 Project Management
- 📁 **Project Management** - Task tracking and milestones
- ✅ **Task Management** - Assignment and progress tracking
- 📊 **Resource Planning** - Team allocation and capacity planning
- 📈 **Time Tracking** - Project hours and productivity

### 🔧 System Administration
- 🛡️ **Security Center** - User authentication and authorization
- 📝 **Audit Logging** - Complete activity tracking
- 🔗 **Integrations** - Third-party service connections
- ⚙️ **System Settings** - Configuration and customization
- 📊 **Database Management** - 70+ tables with relationships

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS with custom design system
- **UI Components**: Custom component library
- **State Management**: React Context & Hooks
- **Forms**: React Hook Form with Zod validation

### Backend
- **Framework**: NestJS (Node.js)
- **Language**: TypeScript
- **Database**: Prisma ORM with SQLite (development) / PostgreSQL (production)
- **Authentication**: JWT with bcrypt password hashing
- **Real-time**: Socket.io for WebSocket connections
- **Validation**: Class-validator and class-transformer

### Development
- **Monorepo**: Turborepo for efficient builds
- **Package Manager**: npm
- **Code Quality**: ESLint, Prettier, TypeScript strict mode
- **Testing**: Jest and Supertest
- **Containerization**: Docker with docker-compose

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Git

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/SpiderZer0/mates-hr-enterprise.git
cd mates-hr-enterprise
```

2. **Install dependencies**
```bash
# Install all dependencies for all packages
npm install
```

3. **Environment setup**
```bash
# Copy environment file
cp .env.example .env

# Edit .env with your configuration
nano .env
```

4. **Database setup**
```bash
# Generate Prisma client
cd apps/backend
npx prisma generate

# Create database schema
npx prisma db push

# Seed with sample data
npx prisma db seed
```

5. **Start development servers**
```bash
# From root directory
./start-dev.sh

# Or manually:
# Terminal 1 - Backend
cd apps/backend && npm run dev

# Terminal 2 - Frontend  
cd apps/web && npm run dev
```

6. **Access the application**
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001
- API Documentation: http://localhost:3001/api/docs

### 🔑 Default Login Credentials

```
Admin Account:
Email: admin@mates-hr.com
Password: Admin@123

HR Account:
Email: hr@mates-hr.com
Password: Hr@123

Employee Account:
Email: employee@mates-hr.com
Password: Employee@123
```

## 📊 Database Schema

The system includes **70+ database tables** with complete relationships:

### Core Tables
- `users`, `employees`, `companies`, `departments`
- `attendance`, `leaves`, `payroll`, `salaries`
- `projects`, `tasks`, `milestones`, `time_entries`

### Communication Tables
- `chat_threads`, `messages`, `notifications`
- `video_sessions`, `screen_share_sessions`
- `email_templates`, `audit_logs`

### Analytics Tables
- `ai_insights`, `predictions`, `anomalies`
- `performance_metrics`, `productivity_data`

### System Tables
- `roles`, `permissions`, `settings`, `integrations`

## 🏗️ Project Structure

```
mates-hr-enterprise/
├── apps/
│   ├── backend/                 # NestJS API server
│   │   ├── src/
│   │   │   ├── modules/         # 25+ feature modules
│   │   │   ├── common/          # Shared components
│   │   │   ├── config/          # Configuration
│   │   │   └── database/        # Database setup
│   │   ├── prisma/              # Database schema & migrations
│   │   └── package.json
│   └── web/                     # Next.js frontend
│       ├── app/                 # App Router pages
│       ├── components/          # React components
│       ├── hooks/               # Custom hooks
│       └── package.json
├── packages/
│   └── ui/                      # Shared UI component library
├── docs/                        # Documentation
├── docker-compose.yml           # Development environment
├── turbo.json                   # Turborepo configuration
└── package.json                 # Root package.json
```

## 🎯 Modules Overview

### 1️⃣ Authentication Module
- JWT-based authentication
- Role-based access control
- Password reset functionality
- Multi-factor authentication support

### 2️⃣ Employee Management
- Complete employee profiles
- Document management
- Employment history tracking
- Performance records

### 3️⃣ Attendance System
- Check-in/check-out functionality
- Timesheet management
- Attendance analytics
- Leave balance tracking

### 4️⃣ Payroll Processing
- Salary calculation engine
- Deduction management
- Payslip generation
- Tax calculations

### 5️⃣ AI Analytics
- Machine learning insights
- Predictive analytics
- Anomaly detection
- Performance metrics

### 6️⃣ Communication Hub
- Real-time messaging
- Video conferencing
- Screen sharing
- Notification system

## 🔧 Development

### Scripts

```bash
# Development
npm run dev              # Start all services in development mode
npm run dev:backend      # Start backend only
npm run dev:frontend     # Start frontend only

# Building
npm run build            # Build all packages
npm run build:backend    # Build backend
npm run build:frontend   # Build frontend

# Testing
npm run test             # Run all tests
npm run test:e2e         # End-to-end tests
npm run test:coverage    # Test coverage report

# Database
npm run db:generate      # Generate Prisma client
npm run db:push          # Push schema to database
npm run db:seed          # Seed database
npm run db:studio        # Open Prisma Studio

# Linting
npm run lint             # Run ESLint
npm run format           # Format code with Prettier
```

### Environment Variables

```env
# Database
DATABASE_URL="file:./dev.db"

# JWT
JWT_SECRET="your-super-secret-jwt-key"
JWT_EXPIRES_IN="1d"

# Email
EMAIL_HOST="smtp.gmail.com"
EMAIL_PORT=587
EMAIL_USER="your-email@gmail.com"
EMAIL_PASS="your-app-password"

# Application
NODE_ENV="development"
BACKEND_PORT=3001
FRONTEND_PORT=3000

# Redis (optional)
REDIS_URL="redis://localhost:6379"
```

## 🐳 Docker Setup

### Development with Docker

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Production Docker

```bash
# Build production images
docker-compose -f docker-compose.prod.yml build

# Run production
docker-compose -f docker-compose.prod.yml up -d
```

## 📚 API Documentation

### Authentication Endpoints

```http
POST /api/v1/auth/login     # User login
POST /api/v1/auth/register  # User registration
POST /api/v1/auth/refresh   # Refresh token
POST /api/v1/auth/logout    # User logout
GET  /api/v1/auth/profile   # Get user profile
```

### Employee Endpoints

```http
GET    /api/v1/employees           # List all employees
POST   /api/v1/employees           # Create new employee
GET    /api/v1/employees/:id        # Get employee details
PUT    /api/v1/employees/:id        # Update employee
DELETE /api/v1/employees/:id        # Delete employee
```

### Full API Documentation

Visit http://localhost:3001/api/docs for interactive API documentation.

## 🧪 Testing

### Unit Tests
```bash
# Run unit tests
npm run test:unit

# Run with coverage
npm run test:unit --coverage
```

### Integration Tests
```bash
# Run integration tests
npm run test:integration
```

### E2E Tests
```bash
# Run end-to-end tests
npm run test:e2e

# Run with Playwright UI
npm run test:e2e --ui
```

## 🚀 Deployment

### Production Deployment

#### 1. Backend Deployment
```bash
# Build backend
cd apps/backend
npm run build

# Start production server
npm run start:prod
```

#### 2. Frontend Deployment
```bash
# Build frontend
cd apps/web
npm run build

# Start production server
npm run start
```

#### 3. Docker Production
```bash
# Build and deploy with Docker
docker-compose -f docker-compose.prod.yml up -d
```

### Environment Configuration

- **Development**: SQLite database with hot reload
- **Staging**: PostgreSQL with sample data
- **Production**: PostgreSQL with optimized settings

## 🤝 Contributing

We welcome contributions! Please read our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Workflow

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass: `npm run test`
6. Commit your changes: `git commit -m 'Add amazing feature'`
7. Push to branch: `git push origin feature/amazing-feature`
8. Open a Pull Request

### Code Standards

- Use TypeScript for all new code
- Follow ESLint and Prettier configurations
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [NestJS](https://nestjs.com/) - Progressive Node.js framework
- [Next.js](https://nextjs.org/) - React framework
- [Prisma](https://www.prisma.io/) - Next-generation ORM
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [Socket.io](https://socket.io/) - Real-time engine

## 📞 Support

- 📧 Email: support@mates-hr.com
- 💬 Discord: [Join our community](https://discord.gg/mates-hr)
- 📖 Documentation: [docs.mates-hr.com](https://docs.mates-hr.com)
- 🐛 Issues: [GitHub Issues](https://github.com/SpiderZer0/mates-hr-enterprise/issues)

## 🎉 Show Your Support

If you find this project useful, please give it a ⭐ on GitHub!

---

<div align="center">

**Built with ❤️ by SpiderZer0**

[![GitHub stars](https://img.shields.io/github/stars/SpiderZer0/mates-hr-enterprise?style=social)](https://github.com/SpiderZer0/mates-hr-enterprise)
[![GitHub forks](https://img.shields.io/github/forks/SpiderZer0/mates-hr-enterprise?style=social)](https://github.com/SpiderZer0/mates-hr-enterprise)
[![GitHub issues](https://img.shields.io/github/issues/SpiderZer0/mates-hr-enterprise)](https://github.com/SpiderZer0/mates-hr-enterprise/issues)

</div>
