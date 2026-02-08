# Email Setup Guide for Contact Form

Your contact form is now connected to the backend and ready to send emails to **thepushpaco@outlook.com**. However, you need to configure SMTP credentials for it to work.

## Option 1: Using Outlook/Hotmail (Recommended for you)

Since your email is `thepushpaco@outlook.com`, follow these steps:

### Step 1: Enable SMTP Access
1. Go to your Outlook account settings
2. Make sure SMTP is enabled (it usually is by default)

### Step 2: Create an App Password (Recommended for Security)
1. Go to: https://account.microsoft.com/security
2. Click on "Advanced security options"
3. Under "App passwords", click "Create a new app password"
4. Copy the generated password

### Step 3: Update Backend .env File
Edit `/app/backend/.env` and set:

```bash
SMTP_PASSWORD="your-app-password-here"
```

### Step 4: Restart Backend
```bash
sudo supervisorctl restart backend
```

---

## Option 2: Using Gmail (Alternative)

If you want to use a Gmail account instead:

### Step 1: Enable 2-Step Verification
1. Go to: https://myaccount.google.com/security
2. Enable 2-Step Verification

### Step 2: Create App Password
1. Go to: https://myaccount.google.com/apppasswords
2. Select "Mail" and "Other (Custom name)"
3. Name it "Portfolio Contact Form"
4. Copy the 16-character password

### Step 3: Update Backend .env File
```bash
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="your-gmail@gmail.com"
SMTP_PASSWORD="your-16-char-app-password"
SMTP_FROM="your-gmail@gmail.com"
ADMIN_EMAIL="thepushpaco@outlook.com"
```

---

## Testing Email Notifications

After setting up SMTP credentials:

1. **Restart backend:**
   ```bash
   sudo supervisorctl restart backend
   ```

2. **Test the contact form:**
   - Go to your website
   - Scroll to the contact section
   - Fill out and submit the form
   - Check your inbox at `thepushpaco@outlook.com`

3. **Check backend logs if emails aren't sent:**
   ```bash
   tail -f /var/log/supervisor/backend.err.log
   ```

---

## What Happens When Someone Submits the Contact Form?

1. ✅ Form data is saved to MongoDB database
2. ✅ Email notification is sent to `thepushpaco@outlook.com` **in the background**
3. ✅ User sees success message
4. ✅ You can view all messages in the admin panel at `/admin`

---

## Troubleshooting

### Email not received?
- Check spam/junk folder
- Verify SMTP credentials in `/app/backend/.env`
- Check backend logs for errors
- Make sure you restarted the backend after updating .env

### "Authentication failed" error?
- Use App Password instead of regular password
- Make sure 2FA is enabled for your email account
- Double-check the SMTP host and port

### Still not working?
You can check the backend logs:
```bash
tail -n 50 /var/log/supervisor/backend.err.log
```

---

## Current Configuration

**Backend .env location:** `/app/backend/.env`

**Current settings:**
- SMTP Host: `smtp-mail.outlook.com`
- SMTP Port: `587`
- From Email: `thepushpaco@outlook.com`
- Admin Email: `thepushpaco@outlook.com`
- **Password:** ⚠️ NOT SET - You need to add this!

---

## Quick Setup Commands

```bash
# 1. Edit the .env file
nano /app/backend/.env

# 2. Add your password to this line:
# SMTP_PASSWORD="your-password-here"

# 3. Save and exit (Ctrl+X, then Y, then Enter)

# 4. Restart backend
sudo supervisorctl restart backend

# 5. Test the contact form on your website
```

---

## Security Notes

- ✅ Never commit .env file to version control
- ✅ Use App Passwords instead of regular passwords
- ✅ Keep your SMTP credentials secure
- ✅ Email sending happens in the background (non-blocking)
