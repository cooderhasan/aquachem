import nodemailer from 'nodemailer';

interface MailOptions {
    to: string | string[];
    subject: string;
    text: string;
    html?: string;
    attachments?: { filename: string; content: Buffer; contentType?: string }[];
}

export async function sendMail({ to, subject, text, html, attachments }: MailOptions) {
    const resendApiKey = process.env.RESEND_API_KEY;

    if (resendApiKey) {
        try {
            console.log('Sending email using Resend API...');
            
            // Format recipients as an array of strings
            const toArray = Array.isArray(to) ? to : [to];
            
            // Format attachments if present
            const formattedAttachments = attachments?.map(att => ({
                filename: att.filename,
                content: att.content.toString('base64'),
            }));

            const response = await fetch('https://api.resend.com/emails', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${resendApiKey}`,
                },
                body: JSON.stringify({
                    from: process.env.RESEND_FROM || 'Aquachems <onboarding@resend.dev>',
                    to: toArray,
                    subject,
                    text,
                    html,
                    attachments: formattedAttachments,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error('Resend API response error:', errorData);
                throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log('Email sent successfully via Resend:', data);
            return { success: true, data };
        } catch (error) {
            console.error('Error sending email via Resend API:', error);
            // Fallback to nodemailer if configured
            if (process.env.SMTP_HOST) {
                console.log('Falling back to Nodemailer...');
                return sendMailNodemailer({ to, subject, text, html, attachments });
            }
            return { success: false, error };
        }
    } else {
        // Nodemailer default/fallback
        return sendMailNodemailer({ to, subject, text, html, attachments });
    }
}

async function sendMailNodemailer({ to, subject, text, html, attachments }: MailOptions) {
    if (!process.env.SMTP_HOST) {
        console.warn('Neither RESEND_API_KEY nor SMTP_HOST is configured. Email not sent.');
        return { success: false, error: 'No mail service configured' };
    }

    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT),
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
        connectionTimeout: 10000,
        socketTimeout: 10000,
        tls: {
            rejectUnauthorized: false
        }
    });

    try {
        const info = await transporter.sendMail({
            from: process.env.SMTP_FROM,
            to: Array.isArray(to) ? to.join(', ') : to,
            subject,
            text,
            html,
            attachments,
        });
        console.log('Message sent via Nodemailer: %s', info.messageId);
        return { success: true };
    } catch (error) {
        console.error('Error sending email via Nodemailer:', error);
        return { success: false, error };
    }
}
