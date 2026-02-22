# Email Setup Guide for Portfolio Backend 📧

This guide will help you set up email notifications for your contact form.

## Quick Setup Options

### Option 1: Gmail (Recommended for Testing) ✅

1. **Enable 2-Factor Authentication on your Gmail account**
   - Go to: https://myaccount.google.com/security
   - Enable 2-Step Verification

2. **Create an App Password**
   - Go to: https://myaccount.google.com/apppasswords
   - Select app: "Mail"
   - Select device: "Other" (enter "Portfolio Backend")
   - Click "Generate"
   - Copy the 16-character password

3. **Update your `.env` file:**

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-16-char-app-password
CONTACT_EMAIL_TO=your-email@gmail.com
```

### Option 2: Outlook/Hotmail

1. **Update your `.env` file:**

```env
SMTP_HOST=smtp-mail.outlook.com
SMTP_PORT=587
SMTP_USER=your-email@outlook.com
SMTP_PASSWORD=your-outlook-password
CONTACT_EMAIL_TO=your-email@outlook.com
```

**Note:** If you have 2FA enabled, create an app password in Outlook settings.

### Option 3: SendGrid (Best for Production) 🚀

1. **Sign up for SendGrid:** https://sendgrid.com/
2. **Create an API Key:**
   - Go to Settings → API Keys
   - Create API Key
   - Give it "Mail Send" permissions
   - Copy the API key

3. **Update your `.env` file:**

```env
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASSWORD=your-sendgrid-api-key
CONTACT_EMAIL_TO=your-email@example.com
```

### Option 4: Resend (Modern Alternative)

1. **Sign up:** https://resend.com/
2. Get your API key
3. Install: `npm install resend`
4. Use Resend SDK instead of Nodemailer (see Resend docs)

## Installation

1. **Install dependencies:**

```bash
cd portfolio-backend
npm install
```

This will install `nodemailer` and `@types/nodemailer`.

2. **Update your `.env` file** with email credentials (see options above)

3. **Test the configuration:**

Create a test route in your backend:

```typescript
// Add to src/routes/test.routes.ts or create new file
import { Router } from "express";
import { testEmailConfig, sendContactEmail } from "../config/email";

const router = Router();

router.get("/email-config", async (req, res) => {
  const isValid = await testEmailConfig();
  res.json({
    valid: isValid,
    message: isValid ? "Email config is working!" : "Email config has errors",
  });
});

router.post("/test-email", async (req, res) => {
  try {
    await sendContactEmail({
      name: "Test User",
      email: "test@example.com",
      subject: "Test Email",
      message: "This is a test email from your portfolio!",
    });
    res.json({ success: true, message: "Test email sent!" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
```

## Environment Variables Explanation

| Variable           | Description                           | Example               |
| ------------------ | ------------------------------------- | --------------------- |
| `SMTP_HOST`        | SMTP server hostname                  | `smtp.gmail.com`      |
| `SMTP_PORT`        | SMTP server port (usually 587 or 465) | `587`                 |
| `SMTP_USER`        | Your email address                    | `nadi@gmail.com`      |
| `SMTP_PASSWORD`    | Your email password or app password   | `abcd efgh ijkl mnop` |
| `CONTACT_EMAIL_TO` | Where contact form emails are sent    | `nadi@gmail.com`      |

## How It Works

1. **User submits contact form** on your portfolio website
2. **Form data saved** to Supabase database
3. **Email notification sent** to your email (CONTACT_EMAIL_TO)
4. **Confirmation email sent** to the user (optional)

## Email Features

✅ **HTML formatted emails** with dark theme matching your portfolio  
✅ **Reply-To header** - Reply directly from your email client  
✅ **Confirmation emails** - User gets auto-reply  
✅ **Error handling** - Form still works if email fails  
✅ **Logging** - Console logs for debugging

## Troubleshooting

### "Invalid login" error with Gmail

- Make sure 2FA is enabled
- Use App Password, not your regular password
- Check SMTP_USER matches the Gmail account

### "Connection timeout"

- Check SMTP_HOST and SMTP_PORT are correct
- Try port 465 if 587 doesn't work
- Check firewall settings

### Emails not arriving

- Check spam folder
- Verify CONTACT_EMAIL_TO is correct
- Check server logs for errors
- Test with the test route above

### "self signed certificate" error

- Add `tls: { rejectUnauthorized: false }` to transporter config
- Only for development - not recommended for production

## Production Tips

🔒 **Security:**

- Never commit `.env` file to Git
- Use environment variables in deployment platforms
- Consider using SendGrid/AWS SES for production
- Rate limit the contact endpoint to prevent spam

🚀 **Performance:**

- Email sending is asynchronous (doesn't block response)
- Uses try-catch to prevent email errors from breaking the API
- Messages are saved even if email fails

## Alternative Services

Instead of SMTP, you can use these services:

1. **Resend** - Modern, developer-friendly (recommended)
2. **SendGrid** - Reliable, free tier available
3. **AWS SES** - Cheap, scalable
4. **Mailgun** - Good for transactional emails
5. **Postmark** - Fast, reliable

## Support

If you need help:

1. Check the logs: `npm run dev` and submit a test form
2. Review the email config: `src/config/email.ts`
3. Test SMTP credentials separately

## Example Complete .env

```env
# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=nadi.portfolio@gmail.com
SMTP_PASSWORD=abcd efgh ijkl mnop
CONTACT_EMAIL_TO=nadi@gmail.com
```

---

**Ready to test?**

1. Install dependencies: `npm install`
2. Update `.env` with your email settings
3. Restart the server: `npm run dev`
4. Submit a test form on your portfolio!

🎉 You're all set!
