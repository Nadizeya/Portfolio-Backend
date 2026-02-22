import nodemailer from "nodemailer";
import { env } from "./env";

/**
 * Email Service using Nodemailer
 * Supports Gmail, Outlook, SendGrid, and custom SMTP
 */

// Create reusable transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    host: env.SMTP_HOST,
    port: env.SMTP_PORT,
    secure: env.SMTP_PORT === 465, // true for 465, false for other ports
    auth: {
      user: env.SMTP_USER,
      pass: env.SMTP_PASSWORD,
    },
  });
};

export interface SendEmailOptions {
  to: string;
  subject: string;
  text: string;
  html?: string;
}

export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

/**
 * Send email notification when someone submits contact form
 */
export const sendContactEmail = async (formData: ContactFormData) => {
  const transporter = createTransporter();

  const emailHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body {
          font-family: 'Arial', sans-serif;
          background-color: #0f172a;
          color: #e2e8f0;
          margin: 0;
          padding: 0;
        }
        .container {
          max-width: 600px;
          margin: 40px auto;
          background-color: #1e293b;
          border-radius: 16px;
          border: 1px solid #334155;
          overflow: hidden;
        }
        .header {
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          padding: 32px;
          text-align: center;
        }
        .header h1 {
          margin: 0;
          color: #fff;
          font-size: 24px;
          font-weight: bold;
        }
        .content {
          padding: 32px;
        }
        .field {
          margin-bottom: 24px;
        }
        .label {
          display: block;
          font-size: 12px;
          font-weight: bold;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: #10b981;
          margin-bottom: 8px;
        }
        .value {
          color: #f1f5f9;
          font-size: 16px;
          line-height: 1.6;
        }
        .message-box {
          background-color: #0f172a;
          border: 1px solid #334155;
          border-radius: 8px;
          padding: 20px;
          margin-top: 8px;
        }
        .footer {
          background-color: #0f172a;
          padding: 24px;
          text-align: center;
          border-top: 1px solid #334155;
        }
        .footer p {
          margin: 0;
          font-size: 12px;
          color: #64748b;
        }
        a {
          color: #10b981;
          text-decoration: none;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🚀 New Contact Form Submission</h1>
        </div>
        <div class="content">
          <div class="field">
            <span class="label">From</span>
            <div class="value">${formData.name}</div>
          </div>
          <div class="field">
            <span class="label">Email</span>
            <div class="value">
              <a href="mailto:${formData.email}">${formData.email}</a>
            </div>
          </div>
          <div class="field">
            <span class="label">Subject</span>
            <div class="value">${formData.subject}</div>
          </div>
          <div class="field">
            <span class="label">Message</span>
            <div class="message-box value">${formData.message.replace(/\n/g, "<br>")}</div>
          </div>
        </div>
        <div class="footer">
          <p>Received from Nadi.dev Portfolio Contact Form</p>
          <p style="margin-top: 8px;">
            Reply directly to <a href="mailto:${formData.email}">${formData.email}</a>
          </p>
        </div>
      </div>
    </body>
    </html>
  `;

  const emailText = `
New Contact Form Submission

From: ${formData.name}
Email: ${formData.email}
Subject: ${formData.subject}

Message:
${formData.message}

---
Reply to: ${formData.email}
  `;

  try {
    const info = await transporter.sendMail({
      from: `"Nadi.dev Portfolio" <${env.SMTP_USER}>`,
      to: env.CONTACT_EMAIL_TO, // Your email where you want to receive messages
      subject: `Portfolio Contact: ${formData.subject}`,
      text: emailText,
      html: emailHtml,
      replyTo: formData.email, // Allow you to reply directly to the sender
    });

    console.log("Email sent successfully:", info.messageId);
    return info;
  } catch (error) {
    console.error("Failed to send email:", error);
    throw new Error("Failed to send email notification");
  }
};

/**
 * Send confirmation email to the person who submitted the form (optional)
 */
export const sendConfirmationEmail = async (formData: ContactFormData) => {
  const transporter = createTransporter();

  const emailHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body {
          font-family: 'Arial', sans-serif;
          background-color: #0f172a;
          color: #e2e8f0;
          margin: 0;
          padding: 0;
        }
        .container {
          max-width: 600px;
          margin: 40px auto;
          background-color: #1e293b;
          border-radius: 16px;
          border: 1px solid #334155;
          overflow: hidden;
        }
        .header {
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          padding: 32px;
          text-align: center;
        }
        .header h1 {
          margin: 0;
          color: #fff;
          font-size: 24px;
          font-weight: bold;
        }
        .content {
          padding: 32px;
          line-height: 1.8;
        }
        .content p {
          color: #cbd5e1;
          margin: 16px 0;
        }
        .highlight {
          color: #10b981;
          font-weight: bold;
        }
        .footer {
          background-color: #0f172a;
          padding: 24px;
          text-align: center;
          border-top: 1px solid #334155;
        }
        .footer p {
          margin: 0;
          font-size: 12px;
          color: #64748b;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>✅ Message Received!</h1>
        </div>
        <div class="content">
          <p>Hi <span class="highlight">${formData.name}</span>,</p>
          <p>
            Thank you for reaching out! I've received your message and will get back to you 
            as soon as possible, usually within 24-48 hours.
          </p>
          <p>
            In the meantime, feel free to check out my latest projects on my portfolio.
          </p>
          <p>Best regards,<br><span class="highlight">Nadi.dev</span></p>
        </div>
        <div class="footer">
          <p>Nadi.dev | Full Stack Developer</p>
          <p style="margin-top: 8px;">
            <a href="mailto:hello@nadi.dev" style="color: #10b981; text-decoration: none;">
              hello@nadi.dev
            </a>
          </p>
        </div>
      </div>
    </body>
    </html>
  `;

  try {
    const info = await transporter.sendMail({
      from: `"Nadi.dev" <${env.SMTP_USER}>`,
      to: formData.email,
      subject: "Thanks for reaching out!",
      html: emailHtml,
    });

    console.log("Confirmation email sent:", info.messageId);
    return info;
  } catch (error) {
    console.error("Failed to send confirmation email:", error);
    // Don't throw error here - confirmation email is optional
  }
};

/**
 * Test email configuration
 */
export const testEmailConfig = async () => {
  try {
    const transporter = createTransporter();
    await transporter.verify();
    console.log("✅ Email configuration is valid");
    return true;
  } catch (error) {
    console.error("❌ Email configuration error:", error);
    return false;
  }
};
