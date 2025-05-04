const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

const sendWelcomeEmail = async (toEmail, username) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: toEmail,
        subject: "Welcome to Expense Tracker!",
        html: `
            <div style="font-family: Arial, sans-serif; padding: 20px;">
                <h2>Welcome, ${username}!</h2>
                <p>Thank you for signing up for Expense Tracker. 🚀</p>
                <p>We’re glad to have you with us. Get started by logging into your dashboard.</p>
                <p style="color: #888; font-size: 0.9rem;">This is an automated email. Please do not reply.</p>
            </div>
        `
    };

    await transporter.sendMail(mailOptions);
};

const sendOTPEmail = async (toEmail, username, otp) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: toEmail,
        subject: "Verify Your Email for Expense Tracker",
        html: `
            <div style="font-family: Arial, sans-serif; padding: 20px;">
                <h2>Hello ${username},</h2>
                <p>Use the OTP below to verify your email and complete your signup:</p>
                <h1 style="letter-spacing: 2px;">${otp}</h1>
                <p>This OTP is valid for 10 minutes.</p>
                <p>If you did not initiate this request, please ignore this email.</p>
                <p style="color: #888; font-size: 0.9rem;">This is an automated message. Please do not reply.</p>
            </div>
        `
    };

    await transporter.sendMail(mailOptions);
};

module.exports = { sendWelcomeEmail, sendOTPEmail };
