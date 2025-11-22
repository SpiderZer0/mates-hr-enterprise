import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting complete database seed...');

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
      settings: JSON.stringify({
        workingDays: ['MON', 'TUE', 'WED', 'THU', 'FRI'],
        workingHours: { start: '09:00', end: '18:00' },
        timezone: 'UTC',
        currency: 'USD',
      }),
    },
  });

  console.log('✅ Company created');

  // Create roles
  const roles = [
    { name: 'ADMIN', description: 'System Administrator', permissions: ['*'] },
    { name: 'HR', description: 'Human Resources Manager', permissions: ['hr:*'] },
    { name: 'MANAGER', description: 'Department Manager', permissions: ['team:*'] },
    { name: 'EMPLOYEE', description: 'Regular Employee', permissions: ['self:*'] },
  ];

  for (const role of roles) {
    await prisma.role.upsert({
      where: { 
        name_companyId: { 
          name: role.name, 
          companyId: company.id 
        } 
      },
      update: {},
      create: {
        name: role.name,
        description: role.description,
        companyId: company.id,
        permissions: JSON.stringify(role.permissions),
      },
    });
  }

  console.log('✅ Roles created');

  // Create departments
  const departments = [
    { name: 'Engineering', nameAr: 'الهندسة', code: 'ENG', description: 'Software Development' },
    { name: 'Human Resources', nameAr: 'الموارد البشرية', code: 'HR', description: 'HR Department' },
    { name: 'Marketing', nameAr: 'التسويق', code: 'MKT', description: 'Marketing & Sales' },
  ];

  const createdDepartments = [];
  for (const dept of departments) {
    const department = await prisma.department.upsert({
      where: { 
        code_companyId: { 
          code: dept.code, 
          companyId: company.id 
        } 
      },
      update: {},
      create: {
        ...dept,
        companyId: company.id,
      },
    });
    createdDepartments.push(department);
  }

  console.log('✅ Departments created');

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
      password: 'Admin@123',
    },
    {
      email: 'hr@mates-hr.com',
      username: 'hr.manager',
      firstName: 'Sarah',
      lastName: 'Johnson',
      role: 'HR',
      department: 'Human Resources',
      position: 'HR Manager',
      password: 'Hr@123',
    },
    {
      email: 'employee@mates-hr.com',
      username: 'john.doe',
      firstName: 'John',
      lastName: 'Doe',
      role: 'EMPLOYEE',
      department: 'Engineering',
      position: 'Software Developer',
      password: 'Employee@123',
    },
  ];

  const createdUsers = [];
  for (const userData of users) {
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const dept = createdDepartments.find(d => d.name === userData.department);
    const role = await prisma.role.findFirst({
      where: { 
        name: userData.role, 
        companyId: company.id 
      },
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
        phoneNumber: '+1234567890',
        isActive: true,
        emailVerified: true,
        preferredLanguage: 'EN',
        companyId: company.id,
      },
    });

    createdUsers.push(user);

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

  console.log('✅ Users and employees created');

  // Create sample projects
  const projects = [
    {
      name: 'Website Redesign',
      code: 'PRJ-001',
      description: 'Complete redesign of company website',
      status: 'ACTIVE',
      startDate: new Date('2024-01-01'),
      endDate: new Date('2024-06-30'),
      budget: 50000,
      budgetCurrency: 'USD',
      companyId: company.id,
    },
    {
      name: 'Mobile App Development',
      code: 'PRJ-002',
      description: 'Native mobile app for iOS and Android',
      status: 'ACTIVE',
      startDate: new Date('2024-02-01'),
      endDate: new Date('2024-08-31'),
      budget: 100000,
      budgetCurrency: 'USD',
      companyId: company.id,
    },
  ];

  for (const projectData of projects) {
    const project = await prisma.project.create({
      data: projectData,
    });

    // Add tasks
    await prisma.task.create({
      data: {
        projectId: project.id,
        title: 'Requirements Analysis',
        description: 'Gather and analyze project requirements',
        status: 'DONE',
        priority: 'HIGH',
      },
    });

    await prisma.task.create({
      data: {
        projectId: project.id,
        title: 'Design',
        description: 'Create design mockups',
        status: 'IN_PROGRESS',
        priority: 'HIGH',
      },
    });
  }

  console.log('✅ Projects created');

  // Create calendars
  const adminUser = createdUsers[0];
  await prisma.calendar.create({
    data: {
      name: 'Company Calendar',
      description: 'Official company calendar',
      scope: 'COMPANY',
      ownerId: adminUser.id,
      companyId: company.id,
      color: '#2D6DF6',
      isDefault: true,
      isPublic: true,
    },
  });

  console.log('✅ Calendar created');

  // Create chat threads
  const thread = await prisma.chatThread.create({
    data: {
      type: 'GROUP',
      title: 'General',
      description: 'General discussion channel',
      createdById: adminUser.id,
      companyId: company.id,
    },
  });

  // Add all users as participants
  for (const user of createdUsers) {
    await prisma.chatParticipant.create({
      data: {
        threadId: thread.id,
        userId: user.id,
        role: user.id === adminUser.id ? 'admin' : 'member',
      },
    });
  }

  // Add welcome message
  await prisma.chatMessage.create({
    data: {
      threadId: thread.id,
      senderId: adminUser.id,
      content: 'Welcome to Mates HR Chat! 🎉',
      contentType: 'TEXT',
    },
  });

  console.log('✅ Chat thread created');

  // Create notifications
  for (const user of createdUsers) {
    await prisma.notification.create({
      data: {
        userId: user.id,
        type: 'INFO',
        priority: 'NORMAL',
        title: 'Welcome to Mates HR!',
        body: 'Your account has been successfully created. Start exploring all the amazing features!',
        isRead: false,
        metadata: JSON.stringify({ welcome: true }),
      },
    });
  }

  console.log('✅ Notifications created');

  // Create sample email templates
  await prisma.emailTemplate.create({
    data: {
      name: 'welcome',
      subject: 'Welcome to Mates HR!',
      body: '<h1>Welcome {{firstName}}!</h1><p>We are excited to have you on board.</p>',
      category: 'onboarding',
      variables: JSON.stringify(['firstName', 'lastName', 'company']),
      isActive: true,
      companyId: company.id,
    },
  });

  console.log('✅ Email templates created');

  console.log('');
  console.log('✨ Database seed completed successfully!');
  console.log('');
  console.log('📝 Login Credentials:');
  console.log('------------------------');
  console.log('Admin: admin@mates-hr.com / Admin@123');
  console.log('HR: hr@mates-hr.com / Hr@123');
  console.log('Employee: employee@mates-hr.com / Employee@123');
  console.log('');
  console.log('🚀 System Features:');
  console.log('------------------------');
  console.log('✅ WebSocket Real-time Communication');
  console.log('✅ Notifications System');
  console.log('✅ Email Service');
  console.log('✅ Chat System with Group Channel');
  console.log('✅ Projects Management');
  console.log('✅ Calendar Integration');
  console.log('✅ Screen Sharing');
  console.log('✅ AI Analytics');
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
