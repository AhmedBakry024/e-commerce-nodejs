export const verifyAccountTemplate = (verifyUrl, userName = "there") => {
    return `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" lang="en">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <title>Verify your email</title>
    <style>
        body { margin: 0; padding: 0; background-color: #f4f4f4; font-family: Arial, sans-serif; }
        .wrapper { width: 100%; background-color: #f4f4f4; padding: 40px 0; }
        .container { max-width: 560px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; border: 1px solid #e0e0e0; }
        .header { background-color: #0666EB; padding: 32px 40px; text-align: center; }
        .header h1 { margin: 0; color: #ffffff; font-size: 22px; letter-spacing: 1px; }
        .body { padding: 36px 40px; }
        .body p { color: #444444; font-size: 15px; line-height: 1.7; margin: 0 0 16px 0; }
        .btn-wrapper { text-align: center; margin: 28px 0; }
        .btn { display: inline-block; background-color: #0666EB; color: #ffffff; text-decoration: none; padding: 14px 36px; border-radius: 40px; font-size: 15px; font-weight: bold; }
        .note { font-size: 13px; color: #999999; text-align: center; margin-top: 8px; }
        .divider { border: none; border-top: 1px solid #eeeeee; margin: 28px 0; }
        .footer { padding: 20px 40px; text-align: center; }
        .footer p { font-size: 12px; color: #aaaaaa; margin: 0; }
        .url-fallback { word-break: break-all; font-size: 12px; color: #0666EB; }
    </style>
</head>
<body>
    <div class="wrapper">
        <div class="container">

            <div class="header">
                <h1>🛍️ MyShop</h1>
            </div>

            <div class="body">
                <p>Hi <strong>${userName}</strong>,</p>
                <p>Thanks for signing up! Please verify your email address to activate your account and start shopping.</p>

                <div class="btn-wrapper">
                    <a href="${verifyUrl}" class="btn">Verify My Email</a>
                </div>

                <hr class="divider" />

                <p>If the button doesn't work, copy and paste this link into your browser:</p>
                <p class="url-fallback">${verifyUrl}</p>

                <hr class="divider" />

                <p>If you didn't create an account, you can safely ignore this email.</p>
            </div>

            <div class="footer">
                <p>© ${new Date().getFullYear()} MyShop. All rights reserved.</p>
            </div>

        </div>
    </div>
</body>
</html>`;
};

export const passwordResetTemplate = (resetUrl, userName = "there") => {
    return `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" lang="en">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <title>Reset your password</title>
    <style>
        body { margin: 0; padding: 0; background-color: #f4f4f4; font-family: Arial, sans-serif; }
        .wrapper { width: 100%; background-color: #f4f4f4; padding: 40px 0; }
        .container { max-width: 560px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; border: 1px solid #e0e0e0; }
        .header { background-color: #D94F3D; padding: 32px 40px; text-align: center; }
        .header h1 { margin: 0; color: #ffffff; font-size: 22px; letter-spacing: 1px; }
        .body { padding: 36px 40px; }
        .body p { color: #444444; font-size: 15px; line-height: 1.7; margin: 0 0 16px 0; }
        .btn-wrapper { text-align: center; margin: 28px 0; }
        .btn { display: inline-block; background-color: #D94F3D; color: #ffffff; text-decoration: none; padding: 14px 36px; border-radius: 40px; font-size: 15px; font-weight: bold; }
        .note { font-size: 13px; color: #999999; text-align: center; margin-top: 8px; }
        .warning-box { background-color: #FFF8E1; border-left: 4px solid #FFC107; padding: 14px 18px; border-radius: 4px; margin: 20px 0; }
        .warning-box p { margin: 0; font-size: 13px; color: #7a6000; }
        .divider { border: none; border-top: 1px solid #eeeeee; margin: 28px 0; }
        .footer { padding: 20px 40px; text-align: center; }
        .footer p { font-size: 12px; color: #aaaaaa; margin: 0; }
        .url-fallback { word-break: break-all; font-size: 12px; color: #D94F3D; }
    </style>
</head>
<body>
    <div class="wrapper">
        <div class="container">

            <div class="header">
                <h1>🛍️ MyShop</h1>
            </div>

            <div class="body">
                <p>Hi <strong>${userName}</strong>,</p>
                <p>We received a request to reset the password for your account. Click the button below to choose a new password.</p>

                <div class="btn-wrapper">
                    <a href="${resetUrl}" class="btn">Reset My Password</a>
                </div>

                <p class="note">⏱ This link expires in <strong>1 hour</strong>.</p>

                <div class="warning-box">
                    <p>⚠️ If you didn't request a password reset, please ignore this email. Your password will remain unchanged. If you think someone is trying to access your account, consider securing it.</p>
                </div>

                <hr class="divider" />

                <p>If the button doesn't work, copy and paste this link into your browser:</p>
                <p class="url-fallback">${resetUrl}</p>

                <hr class="divider" />

                <p style="font-size: 13px; color: #999999;">For security, this link can only be used once and will expire after 1 hour.</p>
            </div>

            <div class="footer">
                <p>© ${new Date().getFullYear()} MyShop. All rights reserved.</p>
            </div>

        </div>
    </div>
</body>
</html>`;
};