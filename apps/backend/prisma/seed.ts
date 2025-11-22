import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Create default company
  const company = await prisma.company.upsert({
    where: { code: 'MATES001' },
    update: {},
    create: {
      name: 'Mates Corporation',
      nameAr: 'شركة ميتس',
      code: 'MATES001',
      email: 'info@mates-hr.com',
      phone: '+1234567890',
      address: '123 Business Street, Tech City',
      website: 'https://mates-hr.com',
      logoUrl: '/logo.png',
      isActive: true,
      industry: 'Technology',
      size: 'MEDIUM',
      foundedYear: 2020,
      taxNumber: 'TAX123456',
      registrationNumber: 'REG123456',
      settings: {
        workingDays: ['MON', 'TUE', 'WED', 'THU', 'FRI'],
        workingHours: { start: '09:00', end: '18:00' },
        timezone: 'UTC',
        currency: 'USD',
        dateFormat: 'MM/DD/YYYY',
        language: 'en',
      },
    },
  });

  // Create roles
  const roles = [
    { name: 'ADMIN', description: 'System Administrator' },
    { name: 'HR', description: 'Human Resources Manager' },
    { name: 'FINANCE', description: 'Finance Manager' },
    { name: 'MANAGER', description: 'Department Manager' },
    { name: 'EMPLOYEE', description: 'Regular Employee' },
  ];

  for (const role of roles) {
    await prisma.role.upsert({
      where: { name_companyId: { name: role.name, companyId: company.id } },
      update: {},
      create: {
        ...role,
        companyId: company.id,
      },
    });
  }

  // Create departments
  const departments = [
    { name: 'Engineering', code: 'ENG', description: 'Software Development' },
    { name: 'Human Resources', code: 'HR', description: 'HR Department' },
    { name: 'Finance', code: 'FIN', description: 'Finance & Accounting' },
    { name: 'Marketing', code: 'MKT', description: 'Marketing & Sales' },
    { name: 'Operations', code: 'OPS', description: 'Operations & Support' },
  ];

  const createdDepartments = [];
  for (const dept of departments) {
    const department = await prisma.department.upsert({
      where: { code_companyId: { code: dept.code, companyId: company.id } },
      update: {},
      create: {
        ...dept,
        companyId: company.id,
      },
    });
    createdDepartments.push(department);
  }

  // Create users and employees
  const users = [
    {
      email: 'admin@mates-hr.com',
      username: 'admin',
      firstName: 'Admin',
      lastName: 'User',
      role: 'ADMIN',
      department: 'Engineering',
      position: 'System Administrator',
    },
    {
      email: 'hr@mates-hr.com',
      username: 'hr.manager',
      firstName: 'Sarah',
      lastName: 'Johnson',
      role: 'HR',
      department: 'Human Resources',
      position: 'HR Manager',
    },
    {
      email: 'finance@mates-hr.com',
      username: 'finance.manager',
      firstName: 'Michael',
      lastName: 'Chen',
      role: 'FINANCE',
      department: 'Finance',
      position: 'Finance Manager',
    },
    {
      email: 'manager@mates-hr.com',
      username: 'eng.manager',
      firstName: 'David',
      lastName: 'Williams',
      role: 'MANAGER',
      department: 'Engineering',
      position: 'Engineering Manager',
    },
    {
      email: 'employee@mates-hr.com',
      username: 'john.doe',
      firstName: 'John',
      lastName: 'Doe',
      role: 'EMPLOYEE',
      department: 'Engineering',
      position: 'Software Developer',
    },
    {
      email: 'alice@mates-hr.com',
      username: 'alice.smith',
      firstName: 'Alice',
      lastName: 'Smith',
      role: 'EMPLOYEE',
      department: 'Marketing',
      position: 'Marketing Specialist',
    },
    {
      email: 'bob@mates-hr.com',
      username: 'bob.brown',
      firstName: 'Bob',
      lastName: 'Brown',
      role: 'EMPLOYEE',
      department: 'Engineering',
      position: 'Senior Developer',
    },
    {
      email: 'emma@mates-hr.com',
      username: 'emma.davis',
      firstName: 'Emma',
      lastName: 'Davis',
      role: 'EMPLOYEE',
      department: 'Operations',
      position: 'Operations Coordinator',
    },
  ];

  for (const userData of users) {
    const hashedPassword = await bcrypt.hash('Password123!', 10);
    const dept = createdDepartments.find(d => d.name === userData.department);
    const role = await prisma.role.findFirst({
      where: { name: userData.role, companyId: company.id },
    });

    const user = await prisma.user.upsert({
      where: { email: userData.email },
      update: {},
      create: {
        email: userData.email,
        username: userData.username,
        password: hashedPassword,
        firstName: userData.firstName,
        lastName: userData.lastName,
        firstNameAr: userData.firstName,
        lastNameAr: userData.lastName,
        phoneNumber: '+1234567890',
        isActive: true,
        emailVerified: true,
        preferredLanguage: 'EN',
        companyId: company.id,
      },
    });

    // Assign role
    if (role) {
      await prisma.userRole.upsert({
        where: {
          userId_roleId: {
            userId: user.id,
            roleId: role.id,
          },
        },
        update: {},
        create: {
          userId: user.id,
          roleId: role.id,
        },
      });
    }

    // Create employee record
    const employeeCode = `EMP${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}`;
    
    await prisma.employee.upsert({
      where: { userId: user.id },
      update: {},
      create: {
        userId: user.id,
        employeeCode,
        departmentId: dept?.id,
        position: userData.position,
        joinDate: new Date('2023-01-01'),
        employmentType: 'FULL_TIME',
        status: 'ACTIVE',
        companyId: company.id,
      },
    });
  }

  // Create some sample projects
  const projects = [
    {
      name: 'Website Redesign',
      code: 'PRJ-001',
      description: 'Complete redesign of company website',
      status: 'ACTIVE',
      startDate: new Date('2024-01-01'),
      endDate: new Date('2024-06-30'),
      budget: 50000,
    },
    {
      name: 'Mobile App Development',
      code: 'PRJ-002',
      description: 'Native mobile app for iOS and Android',
      status: 'ACTIVE',
      startDate: new Date('2024-02-01'),
      endDate: new Date('2024-08-31'),
      budget: 100000,
    },
    {
      name: 'HR System Implementation',
      code: 'PRJ-003',
      description: 'Implementation of new HR management system',
      status: 'COMPLETED',
      startDate: new Date('2023-06-01'),
      endDate: new Date('2023-12-31'),
      budget: 75000,
    },
  ];

  for (const projectData of projects) {
    const project = await prisma.project.create({
      data: {
        ...projectData,
        companyId: company.id,
        budgetCurrency: 'USD',
      },
    });

    // Add some tasks
    const tasks = [
      { title: 'Requirements Analysis', status: 'DONE', priority: 'HIGH' },
      { title: 'Design Mockups', status: 'IN_PROGRESS', priority: 'HIGH' },
      { title: 'Development', status: 'TODO', priority: 'MEDIUM' },
      { title: 'Testing', status: 'TODO', priority: 'MEDIUM' },
      { title: 'Deployment', status: 'TODO', priority: 'LOW' },
    ];

    for (const taskData of tasks) {
      await prisma.task.create({
        data: {
          ...taskData,
          projectId: project.id,
          description: `${taskData.title} for ${project.name}`,
        },
      });
    }
  }

  // Create sample leave types
  const leaveTypes = [
    { name: 'Annual Leave', code: 'ANNUAL', daysAllowed: 21, isPaid: true },
    { name: 'Sick Leave', code: 'SICK', daysAllowed: 10, isPaid: true },
    { name: 'Emergency Leave', code: 'EMERGENCY', daysAllowed: 3, isPaid: true },
    { name: 'Unpaid Leave', code: 'UNPAID', daysAllowed: 30, isPaid: false },
    { name: 'Maternity Leave', code: 'MATERNITY', daysAllowed: 90, isPaid: true },
    { name: 'Paternity Leave', code: 'PATERNITY', daysAllowed: 10, isPaid: true },
  ];

  for (const leaveType of leaveTypes) {
    await prisma.leaveType.create({
      data: {
        ...leaveType,
        requiresApproval: true,
        requiresDocument: leaveType.code === 'SICK' || leaveType.code === 'MATERNITY',
        companyId: company.id,
      },
    });
  }

  // Create sample calendars
  await prisma.calendar.create({
    data: {
      name: 'Company Calendar',
      description: 'Official company calendar',
      scope: 'COMPANY',
      ownerId: (await prisma.user.findFirst({ where: { email: 'admin@mates-hr.com' } }))?.id!,
      companyId: company.id,
      color: '#2D6DF6',
      isDefault: true,
      isPublic: true,
    },
  });

  // Create sample notifications
  const allUsers = await prisma.user.findMany({ where: { companyId: company.id } });
  
  for (const user of allUsers.slice(0, 3)) {
    await prisma.notification.create({
      data: {
        userId: user.id,
        type: 'INFO',
        priority: 'NORMAL',
        title: 'Welcome to Mates HR!',
        body: 'Your account has been successfully created. Start exploring the features.',
        isRead: false,
      },
    });
  }

  console.log('✅ Database seed completed successfully!');
  console.log('');
  console.log('📝 Login Credentials:');
  console.log('------------------------');
  console.log('Admin: admin@mates-hr.com / Password123!');
  console.log('HR: hr@mates-hr.com / Password123!');
  console.log('Finance: finance@mates-hr.com / Password123!');
  console.log('Manager: manager@mates-hr.com / Password123!');
  console.log('Employee: employee@mates-hr.com / Password123!');
  console.log('');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
