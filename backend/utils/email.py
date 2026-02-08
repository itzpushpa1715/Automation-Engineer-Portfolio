import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import os
from typing import Optional
import logging

logger = logging.getLogger(__name__)

SMTP_HOST = os.environ.get('SMTP_HOST', 'smtp.gmail.com')
SMTP_PORT = int(os.environ.get('SMTP_PORT', 587))
SMTP_USER = os.environ.get('SMTP_USER', '')
SMTP_PASSWORD = os.environ.get('SMTP_PASSWORD', '')
SMTP_FROM = os.environ.get('SMTP_FROM', 'noreply@portfolio.com')
ADMIN_EMAIL = os.environ.get('ADMIN_EMAIL', 'thepushpaco@outlook.com')

def send_contact_notification(name: str, email: str, message: str):
    """Send email notification when contact form is submitted"""
    try:
        # Create message
        msg = MIMEMultipart('alternative')
        msg['Subject'] = f'New Portfolio Contact Message from {name}'
        msg['From'] = SMTP_FROM
        msg['To'] = ADMIN_EMAIL

        # Email body
        text = f"""
        New Contact Form Submission
        
        From: {name}
        Email: {email}
        
        Message:
        {message}
        
        ---
        Received: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}
        """
        
        html = f"""
        <html>
          <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <div style="max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 5px;">
              <h2 style="color: #C778DD; border-bottom: 2px solid #C778DD; padding-bottom: 10px;">New Contact Form Submission</h2>
              
              <div style="margin: 20px 0;">
                <p><strong>From:</strong> {name}</p>
                <p><strong>Email:</strong> <a href="mailto:{email}">{email}</a></p>
              </div>
              
              <div style="background-color: #f5f5f5; padding: 15px; border-left: 4px solid #C778DD; margin: 20px 0;">
                <h3 style="margin-top: 0;">Message:</h3>
                <p>{message}</p>
              </div>
              
              <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 12px; color: #777;">
                <p>Received: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}</p>
              </div>
            </div>
          </body>
        </html>
        """

        # Attach both text and HTML versions
        part1 = MIMEText(text, 'plain')
        part2 = MIMEText(html, 'html')
        msg.attach(part1)
        msg.attach(part2)

        # Send email
        if SMTP_USER and SMTP_PASSWORD:
            with smtplib.SMTP(SMTP_HOST, SMTP_PORT) as server:
                server.starttls()
                server.login(SMTP_USER, SMTP_PASSWORD)
                server.send_message(msg)
                logger.info(f"Contact notification email sent to {ADMIN_EMAIL}")
                return True
        else:
            logger.warning("SMTP credentials not configured. Email not sent.")
            return False
            
    except Exception as e:
        logger.error(f"Failed to send email notification: {str(e)}")
        return False

from datetime import datetime
