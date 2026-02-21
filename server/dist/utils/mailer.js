import nodemailer from 'nodemailer';
export const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: Number(process.env.SMTP_PORT) === 465,
    auth: {
        user: process.env.SMTP_USERNAME,
        pass: process.env.SMTP_PASSWORD,
    },
});
export const sendVerifyEmailMail = async (email, verifyUrl) => {
    const mail = await transporter.sendMail({
        from: `"Your App Name" <${process.env.SMTP_FROM_EMAIL}>`,
        to: email,
        subject: "Verify your email address",
        text: `
                Hello,

                Thanks for registering!

                Please verify your email by clicking the link below:
                ${verifyUrl}

                If you did not create an account, you can safely ignore this email.

                — Your App Team
              `,
        html: `
                <div style="font-family: Arial, sans-serif; line-height: 1.6;">
                <h2>Welcome👋</h2>
                <p>Thanks for registering with us.</p>
                <p>Please verify your email address by clicking the button below:</p>

                <a 
                    href="${verifyUrl}" 
                    style="
                    display: inline-block;
                    padding: 12px 20px;
                    background-color: #4f46e5;
                    color: #ffffff;
                    text-decoration: none;
                    border-radius: 6px;
                    font-weight: bold;
                    "
                >
                Verify Email
                </a>

                <p style="margin-top: 20px;">
                Or copy and paste this link into your browser:
                </p>
                <p>${verifyUrl}</p>

                <p style="margin-top: 30px; font-size: 12px; color: #555;">
                If you did not create an account, please ignore this email.
                </p>
                </div>
                `,
    });
    if (!mail) {
        throw new Error(`Error sending verification mail!`);
    }
};
export const sendForgotPasswordEmail = async (email, name, resetUrl) => {
    await transporter.sendMail({
        from: `"Your App Name" <${process.env.SMTP_FROM_EMAIL}>`,
        to: email,
        subject: "Reset your password",
        text: `
    Hello ${name ?? ""},

    You requested a password reset.

    Click the link below to reset your password:
    ${resetUrl}

    This link will expire in 15 minutes.

    If you didn't request this, ignore this email.
    `,
        html: `
    <div style="font-family: Arial; line-height: 1.6">
      <h2>Password Reset 🔐</h2>
      <p>You requested a password reset.</p>
      <a href="${resetUrl}"
        style="padding:12px 18px;background:#ef4444;color:#fff;text-decoration:none;border-radius:6px">
        Reset Password
      </a>
      <p style="margin-top:20px;font-size:12px;color:#555">
        This link expires in 15 minutes.
      </p>
    </div>
  `,
    });
};
export const sendRegistrationVerifyEmail = async (email, name, verifyUrl) => {
    const mail = await transporter.sendMail({
        from: `"Your App Name" <${process.env.SMTP_FROM_EMAIL}>`,
        to: email,
        subject: "Verify your email address",
        text: `
                Hello ${name},

                Thanks for registering!

                Please verify your email by clicking the link below:
                ${verifyUrl}

                If you did not create an account, you can safely ignore this email.

                — Your App Team
              `,
        html: `
                <div style="font-family: Arial, sans-serif; line-height: 1.6;">
                <h2>Welcome, ${name} 👋</h2>
                <p>Thanks for registering with us.</p>
                <p>Please verify your email address by clicking the button below:</p>

                <a 
                    href="${verifyUrl}" 
                    style="
                    display: inline-block;
                    padding: 12px 20px;
                    background-color: #4f46e5;
                    color: #ffffff;
                    text-decoration: none;
                    border-radius: 6px;
                    font-weight: bold;
                    "
                >
                Verify Email
                </a>

                <p style="margin-top: 20px;">
                Or copy and paste this link into your browser:
                </p>
                <p>${verifyUrl}</p>

                <p style="margin-top: 30px; font-size: 12px; color: #555;">
                If you did not create an account, please ignore this email.
                </p>
                </div>
                `,
    });
};
