import nodemailer from 'nodemailer';

interface MailOptions {
    to: string | string[];
    subject: string;
    text: string;
    html?: string;
}

export async function sendMail({ to, subject, text, html }: MailOptions) {
    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT),
        secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASSWORD,
        },
    });

    try {
        const info = await transporter.sendMail({
            from: process.env.SMTP_FROM_EMAIL,
            to: Array.isArray(to) ? to.join(', ') : to,
            subject,
            text,
            html,
        });
        console.log('Message sent: %s', info.messageId);
        return { success: true };
    } catch (error) {
        console.error('Error sending email:', error);
        return { success: false, error };
    }
}
