"""Email utility functions."""

import smtplib
import ssl
from datetime import date
from decimal import Decimal
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

from app.config.config import settings
from app.config.logger import get_logger

logger = get_logger(__name__)


def send_budget_alert_email(
    manager_email: str,
    manager_name: str,
    project_name: str,
    month_spent: Decimal,
    monthly_budget: Decimal,
    total_spent: Decimal,
    total_budget: Decimal,
    threshold: Decimal,
    bill_date: date,
):
    """Send budget threshold alert to project manager."""
    smtp_server = settings.SMTP_SERVER
    smtp_port = settings.SMTP_PORT
    username = settings.SMTP_USERNAME
    password = settings.SMTP_APP_PASSWORD
    context = ssl.create_default_context()

    monthly_percent = (
        (month_spent / monthly_budget) * 100 if monthly_budget > 0 else Decimal(0)
    )

    total_percent = (
        (total_spent / total_budget) * 100 if total_budget > 0 else Decimal(0)
    )

    exceeded = []

    if monthly_percent >= threshold:
        bill_month_year = bill_date.strftime("%B %Y")
        exceeded.append(f"Monthly Budget for <b>{bill_month_year}</b>")

    if total_percent >= threshold:
        exceeded.append("Total Project Budget")

    exceeded_text = " and ".join(exceeded)

    subject = f"Budget Alert ({threshold:.0f}%): {project_name}"

    html = f"""<!DOCTYPE html>
        <html>
            <head>
                <meta charset="UTF-8">
                <title>Budget Alert</title>
            </head>

            <body style="margin:0; padding:0; background:#f4f4f5;">

                <center style="width:100%; background:#f4f4f5;">
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                        <tr>
                            <td align="center" style="padding:40px 0;">

                                <table
                                    role="presentation"
                                    width="600"
                                    cellpadding="0"
                                    cellspacing="0"
                                    border="0"
                                    style="background:#ffffff; font-family:Arial, sans-serif;"
                                >

                                    <!-- Header -->
                                    <tr>
                                        <td style="background:#7C3AED; padding:24px; color:#ffffff;">
                                            <p style="margin:0; font-size:12px;">Budget Alert</p>

                                            <p style="margin-top:8px; font-size:24px; font-weight:bold;">
                                                {threshold:.0f}% of budget reached
                                            </p>
                                        </td>
                                    </tr>

                                    <!-- Content -->
                                    <tr>
                                        <td style="padding:24px; color:#424242; font-size:14px; line-height:22px;">

                                            <p style="margin-bottom:12px;">Hi {manager_name},</p>

                                            <p style="margin-bottom:16px;">
                                                Your project <b>{project_name}</b> has exceeded
                                                <b>{exceeded_text}</b>.
                                            </p>

                                            <!-- Summary Box -->
                                            <table
                                                role="presentation"
                                                width="100%"
                                                cellpadding="0"
                                                cellspacing="0"
                                                border="0"
                                                style="border:1px solid #e0e0e0; margin-bottom:18px;"
                                            >
                                                <tr>
                                                    <td width="50%" style="padding:12px; border-right:1px solid #e0e0e0;">
                                                        <b>Monthly Spend</b>

                                                        {month_spent} / {monthly_budget}

                                                        ({monthly_percent:.2f}%)
                                                    </td>

                                                    <td width="50%" style="padding:12px;">
                                                        <b>Total Spend</b>

                                                        {total_spent} / {total_budget}

                                                        ({total_percent:.2f}%)
                                                    </td>
                                                </tr>
                                            </table>

                                            <p style="margin-bottom:18px;">
                                                Please review project expenses.
                                            </p>

                                            <p style="margin:0;">
                                                Regards,

                                                Z-Platforms Team
                                            </p>

                                        </td>
                                    </tr>

                                </table>

                            </td>
                        </tr>
                    </table>
                </center>

            </body>
        </html>
        """

    msg = MIMEMultipart()
    msg["From"] = username
    msg["To"] = manager_email
    msg["Subject"] = subject
    msg.attach(MIMEText(html, "html"))

    try:
        with smtplib.SMTP(smtp_server, smtp_port) as server:
            server.ehlo()
            server.starttls(context=context)
            server.ehlo()
            server.login(username, password)
            server.sendmail(username, manager_email, msg.as_string())

    except Exception as e:
        logger.error(f"Failed to send budget alert email: {str(e)}")
