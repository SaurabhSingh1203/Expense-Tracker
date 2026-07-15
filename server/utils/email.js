const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
    host: "smtp-relay.brevo.com",
    port: 587,
    secure: false,
    auth: {
        user: process.env.BREVO_SMTP_USER,
        pass: process.env.BREVO_SMTP_PASS,
    },
});

// Booking Confirmation Email
const sendBookingEmail = async (userEmail, userName, eventTitle) => {
    try {
        await transporter.sendMail({
            from: `"${process.env.FROM_NAME}" <${process.env.FROM_EMAIL}>`,
            to: userEmail,
            subject: `🎉 Booking Confirmed: ${eventTitle}`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width:600px; margin:auto; padding:30px;">
                    <h2 style="color:#4F46E5;">🎉 Booking Confirmed</h2>

                    <p>Hello <strong>${userName}</strong>,</p>

                    <p>Your booking for the event
                    <strong>${eventTitle}</strong>
                    has been successfully confirmed.</p>

                    <p>Thank you for choosing
                    <strong>OurEvents</strong>.</p>

                    <hr>

                    <small>This is an automated email.
                    Please do not reply.</small>
                </div>
            `,
        });

        console.log("Booking Email Sent");
    } catch (error) {
        console.error("Booking Email Error:", error);
    }
};

// OTP Email
const sendOTPEmail = async (userEmail, otp, type) => {
    try {
        const title =
            type === "account_verification"
                ? "Verify your OurEvents Account"
                : "Event Booking Verification";

        const msg =
            type === "account_verification"
                ? "Please use the following OTP to verify your OurEvents account."
                : "Please use the following OTP to verify your event booking.";

        await transporter.sendMail({
            from: `"${process.env.FROM_NAME}" <${process.env.FROM_EMAIL}>`,
            to: userEmail,
            subject: title,
            html: `
                <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;padding:30px;background:#fff;border-radius:10px;">

                    <h2 style="text-align:center;color:#4F46E5;">
                        ${title}
                    </h2>

                    <p style="font-size:16px;color:#555;">
                        ${msg}
                    </p>

                    <div style="
                        margin:30px auto;
                        width:220px;
                        background:#4F46E5;
                        color:#fff;
                        padding:18px;
                        text-align:center;
                        font-size:32px;
                        font-weight:bold;
                        letter-spacing:8px;
                        border-radius:8px;
                    ">
                        ${otp}
                    </div>

                    <p style="text-align:center;">
                        This OTP is valid for <strong>5 minutes</strong>.
                    </p>

                    <hr>

                    <p style="font-size:12px;color:#888;text-align:center;">
                        If you didn't request this email,
                        you can safely ignore it.
                    </p>

                </div>
            `,
        });

        console.log("OTP Email Sent");
    } catch (error) {
        console.error("OTP Email Error:", error);
    }
};

module.exports = {
    sendBookingEmail,
    sendOTPEmail,
};