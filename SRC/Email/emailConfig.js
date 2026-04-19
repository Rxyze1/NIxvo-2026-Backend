// services/emailConfig.js

export const emailConfig = {
    useHttpApi: false,
    
    host: process.env.MAILTRAP_HOST || 'send.smtp.mailtrap.io',
    port: parseInt(process.env.MAILTRAP_PORT) || 587,
    auth: {
        user: process.env.MAILTRAP_USER,
        pass: process.env.MAILTRAP_PASS,
    },
    options: {
        secure: false,
        tls: {
            rejectUnauthorized: true,
        },
    },
    
    from: {
        email: process.env.FROM_EMAIL || 'noreply@nixvo.in',
        name: process.env.FROM_NAME || 'Nixvo',
    },
};

export const appConfig = {
    appName: 'Nixvo',
    appUrl: 'nixvo://',
    supportEmail: 'support@nixvo.in',
    logoUrl: 'https://www.nixvo.in/logo.png',
};