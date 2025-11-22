# Mates HR - Enterprise Human Resources Management System

<div align="center">
  <h1>🚀 Mates HR</h1>
  <p>نظام إدارة الموارد البشرية المؤسسي الشامل</p>
  <p>Comprehensive Enterprise HR Management System</p>
</div>

---

## 📋 Overview

Mates HR is a production-grade, enterprise-level Human Resources Management System built with modern technologies and best practices. The system supports both Arabic and English languages with full RTL support.

## ✨ Core Features

### 🏢 HR Management
- **Multi-language Support**: Full Arabic/English interface with RTL support
- **Employee Management**: Complete employee lifecycle management
- **Attendance Tracking**: Real-time attendance monitoring with biometric support
- **Leave Management**: Automated leave request and approval workflows
- **Payroll Processing**: Multi-country payroll with tax calculations
- **Organization Structure**: Hierarchical organization management
- **Role-Based Access Control**: Advanced RBAC and ABAC permissions

### 💬 Real-time Communications
- **Notifications System**: Cross-dashboard real-time notifications with rule engine
- **Chat System**: 1:1, group chats, department channels with file sharing
- **Screen Sharing**: Admin-to-employee screen share with consent management
- **Email System**: Transactional emails with branded templates (Welcome, etc.)

### 📊 Projects & Productivity
- **Projects Module**: Kanban boards, tasks, milestones, time tracking
- **Worklogs**: Time tracking with optional screenshots (consent-based)
- **Achievements & Badges**: Gamification with automatic badge awards
- **AI Analytics**: Activity telemetry, focus scores, anomaly detection

### 📅 Calendar & Planning
- **Integrated Calendar**: Unified view of shifts, leaves, meetings, tasks
- **Smart Scheduling**: AI-powered scheduling assistant
- **Google/Microsoft Integration**: Calendar sync with external services
- **Resource Booking**: Meeting rooms and equipment management

### 🤖 AI & Analytics
- **Predictive Analytics**: Attrition risk, performance forecasting
- **Anomaly Detection**: Automatic detection of unusual patterns
- **Custom Dashboards**: Drag-and-drop dashboard builder
- **Workforce Insights**: Real-time team productivity metrics

## 🛠️ Technology Stack

### Backend
- **NestJS** - Progressive Node.js framework
- **TypeScript** - Type-safe development
- **Prisma** - Next-generation ORM
- **PostgreSQL** - Relational database
- **Redis** - Caching and session management
- **BullMQ** - Job queue processing
- **JWT** - Authentication
- **Swagger** - API documentation

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS
- **TanStack Query** - Data fetching and caching
- **Zustand** - State management
- **Chart.js** - Data visualization
- **i18next** - Internationalization

### DevOps
- **Docker** - Containerization
- **Docker Compose** - Multi-container orchestration
- **Turborepo** - Monorepo management
- **GitHub Actions** - CI/CD
- **ESLint & Prettier** - Code quality

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- Docker & Docker Compose
- PostgreSQL 15+
- Redis 7+

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/your-org/mates-hr.git
cd mates-hr
```

2. **Copy environment variables**
```bash
cp .env.example .env
```

3. **Install dependencies**
```bash
npm install
```

4. **Setup database**
```bash
npm run db:push
npm run db:seed
```

5. **Start development servers**
```bash
npm run dev
```

### Using Docker

1. **Start all services**
```bash
docker-compose up -d
```

2. **Run database migrations**
```bash
docker-compose exec backend npm run db:migrate
```

3. **Seed the database**
```bash
docker-compose exec backend npm run db:seed
```

## 📁 Project Structure

```
mates-hr/
├── apps/
│   ├── backend/         # NestJS API server
│   │   ├── src/
│   │   │   ├── modules/ # Feature modules
│   │   │   ├── common/  # Shared utilities
│   │   │   ├── config/  # Configuration
│   │   │   └── main.ts  # Entry point
│   │   └── prisma/      # Database schema
│   │
│   └── web/            # Next.js frontend
│       ├── app/        # App router pages
│       ├── components/ # React components
│       ├── lib/        # Utilities
│       └── public/     # Static assets
│
├── packages/
│   ├── ui/            # Shared UI components
│   ├── database/      # Database utilities
│   ├── shared/        # Shared types & utils
│   └── config/        # Shared configuration
│
├── docker-compose.yml # Docker orchestration
├── turbo.json        # Turborepo config
└── package.json      # Root package file
```

## 🔧 Available Scripts

### Root Level
- `npm run dev` - Start all apps in development mode
- `npm run build` - Build all apps for production
- `npm run test` - Run all tests
- `npm run lint` - Lint all code
- `npm run format` - Format code with Prettier

### Database
- `npm run db:migrate` - Run database migrations
- `npm run db:push` - Push schema changes
- `npm run db:seed` - Seed database with sample data

## 📱 Application URLs

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **API Documentation**: http://localhost:3001/api/docs
- **Health Check**: http://localhost:3001/health
- **pgAdmin**: http://localhost:5050
- **MinIO Console**: http://localhost:9001
- **RabbitMQ Management**: http://localhost:15672
- **Mailhog Web UI**: http://localhost:8025

## 🔐 Default Credentials

### pgAdmin
- Email: admin@mates-hr.com
- Password: admin

### Application (after seeding)
- Admin: admin@mates-hr.com / Admin@123
- HR Manager: hr@mates-hr.com / Hr@123
- Finance: finance@mates-hr.com / Finance@123
- Manager: manager@mates-hr.com / Manager@123
- Employee: employee@mates-hr.com / Employee@123

### MinIO (Object Storage)
- Username: minioadmin
- Password: minioadmin123

### RabbitMQ
- Username: admin
- Password: admin123

## 🌐 API Documentation

The API documentation is automatically generated using Swagger and is available at:
```
http://localhost:3001/api/docs
```

## 🧪 Testing

### Unit Tests
```bash
npm run test
```

### E2E Tests
```bash
npm run test:e2e
```

## 📈 Database Schema

The system uses a comprehensive database schema including:
- User management and authentication
- Employee records and hierarchy
- Attendance tracking
- Leave management
- Payroll processing
- Document management
- Audit logging

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is proprietary and confidential.

## 👥 Team

- **Engineering Team** - Full-stack development
- **Design Team** - UI/UX design
- **Product Team** - Product management

## 📞 Support

For support, email support@mates-hr.com or join our Slack channel.

---

<div align="center">
  <p>Built with ❤️ by the Mates HR Team</p>
</div>
