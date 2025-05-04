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
        subject: "Your OTP for Expense Tracker",
        html: `
            <div>
                <h2>Hi ${username},</h2>
                <p>Your OTP for Expense Tracker is <strong>${otp}</strong>.</p>
                <p>This OTP is valid for 10 minutes.</p>
            </div>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('OTP sent successfully!');
    } catch (error) {
        console.error('Error sending email:', error);
    }
};

module.exports = { sendWelcomeEmail, sendOTPEmail };
