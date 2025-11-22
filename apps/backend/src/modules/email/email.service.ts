import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../database/prisma.service';
import * as nodemailer from 'nodemailer';
import * as mjml2html from 'mjml';
import * as handlebars from 'handlebars';
import { readFileSync } from 'fs';
import { join } from 'path';

export interface EmailPayload {
  to: string | string[];
  cc?: string | string[];
  bcc?: string | string[];
  subject: string;
  template: string;
  data?: any;
  attachments?: any[];
}

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private transporter: nodemailer.Transporter;
  private templates = new Map<string, handlebars.TemplateDelegate>();

  constructor(
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
  ) {
    this.initializeTransporter();
    this.loadTemplates();
  }

  private initializeTransporter() {
    const emailConfig = this.configService.get('email');

    // For development, use Mailhog
    if (process.env.NODE_ENV === 'development') {
      this.transporter = nodemailer.createTransport({
        host: 'localhost',
        port: 1025,
        ignoreTLS: true,
      });
    } else {
      // Production configuration (SendGrid, SES, etc.)
      this.transporter = nodemailer.createTransport({
        host: emailConfig?.smtp?.host || 'smtp.gmail.com',
        port: emailConfig?.smtp?.port || 587,
        secure: false,
        auth: {
          user: emailConfig?.smtp?.user || process.env.SMTP_USER,
          pass: emailConfig?.smtp?.pass || process.env.SMTP_PASS,
        },
      });
    }
  }

  private loadTemplates() {
    // Load and compile email templates
    const templatesDir = join(__dirname, 'templates');

    // Register Handlebars helpers
    handlebars.registerHelper('eq', (a, b) => a === b);
    handlebars.registerHelper('formatDate', (date) => {
      return new Date(date).toLocaleDateString();
    });
    handlebars.registerHelper('formatCurrency', (amount, currency = 'USD') => {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency,
      }).format(amount);
    });

    // Load templates
    const templates = [
      'welcome',
      'password-reset',
      'notification',
      'daily-digest',
      'leave-request',
      'leave-approved',
      'payroll-ready',
      'attendance-reminder',
    ];

    templates.forEach((templateName) => {
      try {
        const mjmlTemplate = this.getMjmlTemplate(templateName);
        this.templates.set(templateName, handlebars.compile(mjmlTemplate));
      } catch (error) {
        this.logger.warn(`Failed to load template ${templateName}:`, error);
      }
    });
  }

  private getMjmlTemplate(name: string): string {
    // Welcome email template in MJML
    if (name === 'welcome') {
      return `
        <mjml>
          <mj-head>
            <mj-title>Welcome to Mates HR</mj-title>
            <mj-font name="Cairo" href="https://fonts.googleapis.com/css?family=Cairo:400,600,700" />
            <mj-font name="Inter" href="https://fonts.googleapis.com/css?family=Inter:400,500,600,700" />
            <mj-attributes>
              <mj-all font-family="Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif" />
              <mj-text font-size="14px" line-height="1.6" color="#111827" />
              <mj-section background-color="#F6F7FA" padding="0" />
            </mj-attributes>
          </mj-head>
          <mj-body background-color="#F6F7FA">
            <!-- Header -->
            <mj-section background-color="#FFFFFF" padding="20px 0">
              <mj-column>
                <mj-image 
                  src="{{logoUrl}}"
                  alt="Mates HR"
                  width="150px"
                  align="center"
                  padding="10px 0"
                />
              </mj-column>
            </mj-section>

            <!-- Hero Section -->
            <mj-section background-url="linear-gradient(135deg, #36C4F1 0%, #2D6DF6 100%)" padding="60px 20px">
              <mj-column>
                <mj-text align="center" color="#FFFFFF" font-size="32px" font-weight="700">
                  Welcome to Mates HR! 🎉
                </mj-text>
                <mj-text align="center" color="#FFFFFF" font-size="18px" padding-top="10px">
                  {{firstName}}, your journey starts here
                </mj-text>
              </mj-column>
            </mj-section>

            <!-- Content Section -->
            <mj-section background-color="#FFFFFF" padding="40px 20px">
              <mj-column>
                <mj-text font-size="16px" padding-bottom="20px">
                  Hi {{firstName}} {{lastName}},
                </mj-text>
                <mj-text padding-bottom="20px">
                  We're excited to have you join <strong>{{company}}</strong> on Mates HR, your complete HR management platform.
                </mj-text>
                <mj-text padding-bottom="20px">
                  Here's what you can do with Mates HR:
                </mj-text>
                
                <!-- Features List -->
                <mj-text padding-left="20px" padding-bottom="10px">
                  ✅ Track your attendance and working hours
                </mj-text>
                <mj-text padding-left="20px" padding-bottom="10px">
                  📝 Submit and manage leave requests
                </mj-text>
                <mj-text padding-left="20px" padding-bottom="10px">
                  💰 Access your payslips and compensation details
                </mj-text>
                <mj-text padding-left="20px" padding-bottom="10px">
                  📊 View your performance and goals
                </mj-text>
                <mj-text padding-left="20px" padding-bottom="10px">
                  💬 Communicate with your team
                </mj-text>
                
                <!-- CTA Button -->
                <mj-button 
                  background-color="#2D6DF6"
                  color="#FFFFFF"
                  font-size="16px"
                  font-weight="600"
                  padding="30px 0 20px 0"
                  inner-padding="15px 40px"
                  border-radius="8px"
                  href="{{loginUrl}}"
                >
                  Get Started →
                </mj-button>

                <!-- Login Details -->
                <mj-section background-color="#F6F7FA" border-radius="8px" padding="20px">
                  <mj-column>
                    <mj-text font-weight="600" padding-bottom="10px">
                      Your Login Details:
                    </mj-text>
                    <mj-text>
                      <strong>Email:</strong> {{email}}<br/>
                      <strong>Temporary Password:</strong> {{temporaryPassword}}<br/>
                      <small style="color: #6B7280;">Please change your password after first login</small>
                    </mj-text>
                  </mj-column>
                </mj-section>
              </mj-column>
            </mj-section>

            <!-- Help Section -->
            <mj-section padding="30px 20px" background-color="#FFFFFF">
              <mj-column>
                <mj-text align="center" font-size="16px" font-weight="600" padding-bottom="10px">
                  Need Help?
                </mj-text>
                <mj-text align="center">
                  Check out our <a href="{{helpUrl}}" style="color: #2D6DF6;">Help Center</a> or 
                  contact your HR team at <a href="mailto:{{hrEmail}}" style="color: #2D6DF6;">{{hrEmail}}</a>
                </mj-text>
              </mj-column>
            </mj-section>

            <!-- Footer -->
            <mj-section padding="20px">
              <mj-column>
                <mj-text align="center" color="#6B7280" font-size="12px">
                  © 2024 Mates HR. All rights reserved.<br/>
                  {{companyAddress}}
                </mj-text>
                <mj-social font-size="15px" icon-size="30px" mode="horizontal" align="center" padding-top="20px">
                  <mj-social-element 
                    name="facebook" 
                    href="https://facebook.com/mateshr"
                    background-color="#2D6DF6"
                  />
                  <mj-social-element 
                    name="twitter" 
                    href="https://twitter.com/mateshr"
                    background-color="#2D6DF6"
                  />
                  <mj-social-element 
                    name="linkedin" 
                    href="https://linkedin.com/company/mateshr"
                    background-color="#2D6DF6"
                  />
                </mj-social>
              </mj-column>
            </mj-section>
          </mj-body>
        </mjml>
      `;
    }

    // Return a basic template for others
    return `
      <mjml>
        <mj-body>
          <mj-section>
            <mj-column>
              <mj-text>{{content}}</mj-text>
            </mj-column>
          </mj-section>
        </mj-body>
      </mjml>
    `;
  }

  async sendEmail(payload: EmailPayload) {
    try {
      // Get template
      let htmlContent = '';
      let textContent = '';

      if (this.templates.has(payload.template)) {
        const template = this.templates.get(payload.template);
        const mjmlContent = template(payload.data);
        const { html } = mjml2html(mjmlContent);
        htmlContent = html;
      } else {
        // Fallback to database template
        // const dbTemplate = await this.prisma.emailTemplate.findFirst({
        //   where: {
        //     key: payload.template,
        //     isActive: true,
        //   },
        // });

        // if (dbTemplate) {
        //   const compiledTemplate = handlebars.compile(dbTemplate.mjmlContent);
        //   const mjmlContent = compiledTemplate(payload.data);
        //   const { html } = mjml2html(mjmlContent);
        //   htmlContent = html;
        //   textContent = dbTemplate.textContent || '';
        // }
      }

      // Prepare recipients
      const to = Array.isArray(payload.to) ? payload.to : [payload.to];
      const cc = payload.cc ? (Array.isArray(payload.cc) ? payload.cc : [payload.cc]) : [];
      const bcc = payload.bcc ? (Array.isArray(payload.bcc) ? payload.bcc : [payload.bcc]) : [];

      // Send email
      const info = await this.transporter.sendMail({
        from: `"Mates HR" <${this.configService.get('email.from', 'noreply@mates-hr.com')}>`,
        to: to.join(', '),
        cc: cc.join(', '),
        bcc: bcc.join(', '),
        subject: payload.subject,
        html: htmlContent,
        text: textContent,
        attachments: payload.attachments,
      });

      // Log email
      await this.prisma.emailLog.create({
        data: {
          to: to.join(','),
          from: this.configService.get('email.from', 'noreply@mates-hr.com'),
          // cc: cc.join(','),
          // bcc: bcc.join(','),
          subject: payload.subject,
          // templateKey: payload.template,
          body: htmlContent,
          status: 'SENT',
          provider: 'nodemailer',
          messageId: info.messageId,
          sentAt: new Date(),
        },
      });

      this.logger.log(`Email sent: ${info.messageId}`);
      return info;
    } catch (error) {
      this.logger.error('Failed to send email:', error);

      // Log failed email
      await this.prisma.emailLog.create({
        data: {
          to: Array.isArray(payload.to) ? payload.to.join(',') : payload.to,
          from: this.configService.get('email.from', 'noreply@mates-hr.com'),
          subject: payload.subject,
          // templateKey: payload.template,
          body: 'Failed to send',
          status: 'FAILED',
          error: error.message,
        },
      });

      throw error;
    }
  }

  async sendWelcomeEmail(user: any) {
    const company = await this.prisma.company.findUnique({
      where: { id: user.companyId },
    });

    await this.sendEmail({
      to: user.email,
      subject: 'Welcome to Mates HR! 🎉',
      template: 'welcome',
      data: {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        company: company?.name || 'Your Company',
        temporaryPassword: 'ChangeMe123!',
        loginUrl: `${this.configService.get('app.url')}/login`,
        helpUrl: `${this.configService.get('app.url')}/help`,
        hrEmail: company?.email || 'hr@mates-hr.com',
        companyAddress: company?.address || '',
        logoUrl: `${this.configService.get('app.url')}/logo.png`,
      },
    });
  }

  async sendPasswordResetEmail(user: any, resetToken: string) {
    await this.sendEmail({
      to: user.email,
      subject: 'Reset Your Password - Mates HR',
      template: 'password-reset',
      data: {
        firstName: user.firstName,
        resetUrl: `${this.configService.get('app.url')}/reset-password?token=${resetToken}`,
      },
    });
  }

  async verifyConnection(): Promise<boolean> {
    try {
      await this.transporter.verify();
      this.logger.log('Email service connection verified');
      return true;
    } catch (error) {
      this.logger.error('Email service connection failed:', error);
      return false;
    }
  }
}
