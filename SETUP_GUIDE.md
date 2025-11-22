# 🚀 Mates HR - Complete Setup & Deployment Guide

## 📋 Table of Contents
1. [Prerequisites](#prerequisites)
2. [Local Development Setup](#local-development-setup)
3. [Production Deployment](#production-deployment)
4. [Troubleshooting](#troubleshooting)
5. [API Documentation](#api-documentation)
6. [Security Checklist](#security-checklist)

---

## 🔧 Prerequisites

### Required Software
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher
- **Docker**: v20.10.0 or higher
- **Docker Compose**: v2.0.0 or higher
- **PostgreSQL**: v15 (via Docker)
- **Redis**: v7 (via Docker)
- **Git**: Latest version

### Recommended Development Tools
- **VS Code** with extensions:
  - ESLint
  - Prettier
  - Prisma
  - Tailwind CSS IntelliSense
  - Docker
- **Postman** or **Insomnia** for API testing
- **TablePlus** or **pgAdmin** for database management

---

## 🚀 Local Development Setup

### Step 1: Clone the Repository
```bash
git clone https://github.com/your-org/mates-hr.git
cd mates-hr
```

### Step 2: Install Dependencies
```bash
# Install all dependencies for the monorepo
npm install

# If you encounter issues, try:
npm install --legacy-peer-deps
```

### Step 3: Environment Configuration
```bash
# Copy the example environment file
cp .env.example .env

# Edit the .env file with your settings
nano .env  # or use your preferred editor
```

**Important Environment Variables to Configure:**
```env
# Database
DATABASE_URL="postgresql://postgres:password@localhost:5432/mates_hr?schema=public"

# JWT Secret (generate a secure random string)
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Frontend URLs
NEXT_PUBLIC_API_URL=http://localhost:3001/api
NEXT_PUBLIC_WS_URL=http://localhost:3001
```

### Step 4: Start Docker Services
```bash
# Start all required services
docker-compose up -d

# Verify services are running
docker-compose ps

# Expected output:
# mates_hr_postgres     running   0.0.0.0:5432->5432/tcp
# mates_hr_redis        running   0.0.0.0:6379->6379/tcp
# mates_hr_minio        running   0.0.0.0:9000-9001->9000-9001/tcp
# mates_hr_rabbitmq     running   0.0.0.0:5672,15672->5672,15672/tcp
# mates_hr_mailhog      running   0.0.0.0:1025,8025->1025,8025/tcp
```

### Step 5: Database Setup
```bash
# Generate Prisma client
npx prisma generate --schema=apps/backend/prisma/schema.prisma

# Push database schema
npx prisma db push --schema=apps/backend/prisma/schema.prisma

# Seed the database with sample data
npx prisma db seed --schema=apps/backend/prisma/schema.prisma

# Or run from the backend directory:
cd apps/backend
npm run db:push
npm run db:seed
cd ../..
```

### Step 6: Start Development Servers
```bash
# Start all applications in development mode
npm run dev

# Or start individually:
# Terminal 1 - Backend
cd apps/backend
npm run dev

# Terminal 2 - Frontend
cd apps/web
npm run dev
```

### Step 7: Access the Applications
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **API Documentation**: http://localhost:3001/api/docs
- **pgAdmin**: http://localhost:5050
  - Email: admin@mates-hr.com
  - Password: admin
- **MinIO Console**: http://localhost:9001
  - Username: minioadmin
  - Password: minioadmin123
- **RabbitMQ Management**: http://localhost:15672
  - Username: admin
  - Password: admin123
- **Mailhog**: http://localhost:8025

### Step 8: Default Login Credentials
After seeding the database, use these credentials:
- **Admin**: admin@mates-hr.com / Admin@123
- **HR Manager**: hr@mates-hr.com / Hr@123
- **Finance**: finance@mates-hr.com / Finance@123
- **Manager**: manager@mates-hr.com / Manager@123
- **Employee**: employee@mates-hr.com / Employee@123

---

## 🌐 Production Deployment

### Option 1: Docker Deployment

#### 1.1 Build Production Images
```bash
# Build all services
docker-compose -f docker-compose.prod.yml build

# Or build individually
docker build -t mates-hr-backend:latest -f apps/backend/Dockerfile .
docker build -t mates-hr-frontend:latest -f apps/web/Dockerfile .
```

#### 1.2 Deploy with Docker Compose
```bash
# Start production services
docker-compose -f docker-compose.prod.yml up -d

# Scale services
docker-compose -f docker-compose.prod.yml up -d --scale backend=3
```

### Option 2: Kubernetes Deployment

#### 2.1 Build and Push Images
```bash
# Tag and push to registry
docker tag mates-hr-backend:latest your-registry/mates-hr-backend:latest
docker push your-registry/mates-hr-backend:latest

docker tag mates-hr-frontend:latest your-registry/mates-hr-frontend:latest
docker push your-registry/mates-hr-frontend:latest
```

#### 2.2 Deploy to Kubernetes
```bash
# Create namespace
kubectl create namespace mates-hr

# Apply configurations
kubectl apply -f k8s/configmap.yaml
kubectl apply -f k8s/secrets.yaml
kubectl apply -f k8s/deployments.yaml
kubectl apply -f k8s/services.yaml
kubectl apply -f k8s/ingress.yaml
```

### Option 3: Cloud Platform Deployment

#### AWS Deployment
```bash
# Using AWS ECS
aws ecs create-cluster --cluster-name mates-hr-cluster
aws ecs register-task-definition --cli-input-json file://ecs-task-definition.json
aws ecs create-service --cluster mates-hr-cluster --service-name mates-hr-service --task-definition mates-hr-task

# Using Elastic Beanstalk
eb init -p node.js-18 mates-hr
eb create mates-hr-production
eb deploy
```

#### Azure Deployment
```bash
# Using Azure Container Instances
az container create --resource-group mates-hr-rg --name mates-hr-app --image your-registry/mates-hr:latest --dns-name-label mates-hr --ports 3000 3001

# Using Azure App Service
az webapp create --resource-group mates-hr-rg --plan mates-hr-plan --name mates-hr-app --deployment-container-image-name your-registry/mates-hr:latest
```

#### Google Cloud Platform
```bash
# Using Cloud Run
gcloud run deploy mates-hr --image gcr.io/your-project/mates-hr:latest --platform managed --region us-central1 --allow-unauthenticated

# Using GKE
gcloud container clusters create mates-hr-cluster --num-nodes=3
kubectl apply -f k8s/
```

---

## 🛠️ Configuration

### Database Configuration
```env
# PostgreSQL Configuration
DATABASE_URL="postgresql://user:password@host:5432/database?schema=public"
DB_POOL_MIN=2
DB_POOL_MAX=10
```

### Redis Configuration
```env
REDIS_URL="redis://user:password@host:6379"
REDIS_TTL=3600
REDIS_MAX_RETRIES=3
```

### Email Configuration
```env
# SMTP Settings
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASS=your-sendgrid-api-key
SMTP_FROM=noreply@mates-hr.com

# Or use a service
EMAIL_PROVIDER=sendgrid  # sendgrid, ses, mailgun
SENDGRID_API_KEY=your-api-key
```

### Storage Configuration
```env
# MinIO / S3
STORAGE_TYPE=s3  # local, s3, minio
S3_ENDPOINT=https://s3.amazonaws.com
S3_REGION=us-east-1
S3_ACCESS_KEY=your-access-key
S3_SECRET_KEY=your-secret-key
S3_BUCKET=mates-hr-production
```

---

## 🔍 Troubleshooting

### Common Issues and Solutions

#### 1. Database Connection Error
```bash
# Check if PostgreSQL is running
docker-compose ps postgres

# Check logs
docker-compose logs postgres

# Reset database
docker-compose down -v
docker-compose up -d postgres
npm run db:push
```

#### 2. Port Already in Use
```bash
# Find process using port
lsof -i :3000  # or :3001

# Kill process
kill -9 [PID]

# Or change port in .env
BACKEND_PORT=3002
```

#### 3. Module Not Found Errors
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
rm -rf apps/*/node_modules
rm -rf packages/*/node_modules
npm install

# Clear Next.js cache
rm -rf apps/web/.next
```

#### 4. Prisma Issues
```bash
# Regenerate Prisma client
npx prisma generate --schema=apps/backend/prisma/schema.prisma

# Reset database
npx prisma migrate reset --schema=apps/backend/prisma/schema.prisma
```

#### 5. Docker Issues
```bash
# Clean up Docker
docker system prune -a
docker-compose down -v
docker-compose build --no-cache
docker-compose up -d
```

---

## 📖 API Documentation

### Swagger Documentation
Access the interactive API documentation at:
- Development: http://localhost:3001/api/docs
- Production: https://api.mates-hr.com/docs

### API Endpoints Overview

#### Authentication
- `POST /api/v1/auth/login` - User login
- `POST /api/v1/auth/register` - User registration
- `POST /api/v1/auth/refresh` - Refresh token
- `POST /api/v1/auth/logout` - User logout

#### Employees
- `GET /api/v1/employees` - List employees
- `GET /api/v1/employees/:id` - Get employee details
- `POST /api/v1/employees` - Create employee
- `PUT /api/v1/employees/:id` - Update employee
- `DELETE /api/v1/employees/:id` - Delete employee

#### Projects
- `GET /api/v1/projects` - List projects
- `POST /api/v1/projects` - Create project
- `GET /api/v1/projects/:id` - Get project details
- `POST /api/v1/projects/:id/tasks` - Create task

#### Chat
- `GET /api/v1/chat/threads` - List chat threads
- `POST /api/v1/chat/threads` - Create thread
- `POST /api/v1/chat/threads/:id/messages` - Send message

#### Calendar
- `GET /api/v1/calendar/events` - List events
- `POST /api/v1/calendar/events` - Create event
- `POST /api/v1/calendar/availability` - Check availability

### WebSocket Events

#### Connection
```javascript
const socket = io('http://localhost:3001/ws', {
  auth: {
    token: 'your-jwt-token'
  }
});
```

#### Events
- `notification` - Real-time notifications
- `chat:message` - New chat message
- `chat:typing` - Typing indicator
- `screenshare:request` - Screen share request
- `screenshare:signal` - WebRTC signaling

---

## 🔒 Security Checklist

### Pre-Deployment Security Tasks

#### Environment Variables
- [ ] Change all default passwords
- [ ] Generate secure JWT secret (min 32 characters)
- [ ] Set secure cookie secret
- [ ] Configure CORS origins properly
- [ ] Disable debug mode in production

#### Database Security
- [ ] Use strong database passwords
- [ ] Enable SSL for database connections
- [ ] Configure database backups
- [ ] Set up read replicas
- [ ] Enable query logging for auditing

#### API Security
- [ ] Enable rate limiting
- [ ] Configure request size limits
- [ ] Implement API versioning
- [ ] Set up API key management
- [ ] Enable request/response logging

#### Authentication & Authorization
- [ ] Implement MFA (Multi-Factor Authentication)
- [ ] Configure session timeout
- [ ] Set up password policies
- [ ] Enable account lockout after failed attempts
- [ ] Implement refresh token rotation

#### Data Protection
- [ ] Enable encryption at rest
- [ ] Use HTTPS everywhere
- [ ] Implement field-level encryption for PII
- [ ] Configure data retention policies
- [ ] Set up data anonymization

#### Infrastructure Security
- [ ] Configure firewall rules
- [ ] Set up VPN for admin access
- [ ] Enable DDoS protection
- [ ] Configure security headers (CSP, HSTS, etc.)
- [ ] Set up intrusion detection

#### Monitoring & Logging
- [ ] Set up error tracking (Sentry)
- [ ] Configure application monitoring (New Relic, DataDog)
- [ ] Enable audit logging
- [ ] Set up security alerts
- [ ] Configure backup monitoring

#### Compliance
- [ ] GDPR compliance check
- [ ] Data processing agreements
- [ ] Privacy policy update
- [ ] Terms of service update
- [ ] Cookie consent implementation

---

## 📞 Support

### Getting Help
- **Documentation**: https://docs.mates-hr.com
- **Community Forum**: https://forum.mates-hr.com
- **GitHub Issues**: https://github.com/your-org/mates-hr/issues
- **Email Support**: support@mates-hr.com
- **Slack Community**: https://mates-hr.slack.com

### Contributing
Please read our [Contributing Guide](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

### License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🎉 Quick Commands Reference

```bash
# Development
npm run dev                    # Start all services in dev mode
npm run build                  # Build all packages
npm run test                   # Run all tests
npm run lint                   # Lint all code
npm run format                 # Format all code

# Database
npm run db:migrate             # Run migrations
npm run db:push                # Push schema changes
npm run db:seed                # Seed database
npm run db:reset               # Reset database

# Docker
docker-compose up -d           # Start services
docker-compose down            # Stop services
docker-compose logs -f         # View logs
docker-compose ps              # Check status

# Production
npm run build:prod             # Build for production
npm run start:prod             # Start production server
```

---

**Last Updated**: November 2024
**Version**: 1.0.0
**Status**: Production Ready 🚀
