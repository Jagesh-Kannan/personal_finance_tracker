export const verifyEmail_template = (verificationLink) => 
    `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
                body {
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                    line-height: 1.6;
                    color: #333;
                    background-color: #f4f4f4;
                    margin: 0;
                    padding: 0;
                }
                .email-container {
                    max-width: 600px;
                    margin: 20px auto;
                    background-color: #ffffff;
                    border-radius: 8px;
                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
                    overflow: hidden;
                }
                .header {
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: #ffffff;
                    padding: 30px 20px;
                    text-align: center;
                }
                .header h1 {
                    margin: 0;
                    font-size: 28px;
                    font-weight: 600;
                }
                .content {
                    padding: 30px 20px;
                    text-align: center;
                }
                .content p {
                    font-size: 16px;
                    margin: 15px 0;
                    color: #555;
                }
                .verify-button {
                    display: inline-block;
                    background-color: #22c55e;
                    color: #ffffff;
                    padding: 14px 32px;
                    text-decoration: none;
                    border-radius: 6px;
                    font-weight: 600;
                    font-size: 16px;
                    margin: 20px 0;
                    transition: background-color 0.3s ease;
                    border: none;
                    cursor: pointer;
                }
                .verify-button:hover {
                    background-color: #16a34a;
                }
                .footer {
                    background-color: #f9fafb;
                    padding: 20px;
                    text-align: center;
                    font-size: 12px;
                    color: #999;
                    border-top: 1px solid #e5e7eb;
                }
                .footer p {
                    margin: 5px 0;
                }
                .link-text {
                    word-break: break-all;
                    color: #667eea;
                    font-size: 12px;
                }
            </style>
        </head>
        <body>
            <div class="email-container">
                <div class="header">
                    <h1>Email Verification</h1>
                </div>
                
                <div class="content">
                    <p>Hello,</p>
                    
                    <p>Thank you for signing up! To complete your registration and verify your email address, please click the button below:</p>
                    
                    <a href="${verificationLink}" class="verify-button">Verify Email</a>
                    
                    <p style="margin-top: 30px;font-size: 9px;color: #999;">
                        If the button doesn't work, you can also copy and paste this link in your browser:
                    </p>
                    <p class="link-text">${verificationLink}</p>
                </div>
                
                <div class="footer">
                    <p>This link will expire in 24 hours.</p>
                    <p>If you did not create this account, please ignore this email.</p>
                    <p>© 2026 Personal Finance Tracker. All rights reserved.</p>
                </div>
            </div>
        </body>
        </html>
    `


export const resetPassword_template = (resetLink) => 
  `
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <style>
      body {
        font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
        line-height: 1.6;
        color: #333;
        background-color: #f4f4f4;
        margin: 0;
        padding: 0;
      }
      .email-container {
        max-width: 600px;
        margin: 20px auto;
        background-color: #ffffff;
        border-radius: 8px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        overflow: hidden;
      }
      .header {
        background: linear-gradient(135deg, #f97316 0%, #ea580c 100%);
        color: #ffffff;
        padding: 30px 20px;
        text-align: center;
      }
      .header h1 {
        margin: 0;
        font-size: 28px;
        font-weight: 600;
      }
      .alert-box {
        background-color: #fef2f2;
        border-left: 4px solid #f97316;
        padding: 15px 20px;
        margin: 20px 0;
        border-radius: 4px;
      }
      .alert-box p {
        margin: 0;
        color: #dc2626;
        font-size: 14px;
        font-weight: 500;
      }
      .content {
        padding: 30px 20px;
        text-align: center;
      }
      .content p {
        font-size: 16px;
        margin: 15px 0;
        color: #555;
      }
      .reset-button {
        display: inline-block;
        background-color: #f97316;
        color: #ffffff;
        padding: 14px 32px;
        text-decoration: none;
        border-radius: 6px;
        font-weight: 600;
        font-size: 16px;
        margin: 20px 0;
        transition: background-color 0.3s ease;
        border: none;
        cursor: pointer;
      }
      .reset-button:hover {
        background-color: #ea580c;
      }
      .security-note {
        background-color: #fef3c7;
        border-left: 4px solid #eab308;
        padding: 15px 20px;
        margin: 20px 0;
        border-radius: 4px;
      }
      .security-note p {
        margin: 0;
        color: #92400e;
        font-size: 13px;
      }
      .footer {
        background-color: #f9fafb;
        padding: 20px;
        text-align: center;
        font-size: 12px;
        color: #999;
        border-top: 1px solid #e5e7eb;
      }
      .footer p {
        margin: 5px 0;
      }
      .link-text {
        word-break: break-all;
        color: #f97316;
        font-size: 12px;
      }
    </style>
  </head>
  <body>
    <div class="email-container">
      <div class="header">
        <h1>Password Reset Request</h1>
      </div>

      <div class="content">
        <p>Hello,</p>

        <div class="alert-box">
          <p>
            We received a request to reset your password. If you made this
            request, click the button below to reset it.
          </p>
        </div>

        <p>Click the button below to create a new password:</p>

        <a href="${resetLink}" class="reset-button">Reset Password</a>

        <div class="security-note">
          <p>
            <strong>Security Note:</strong> This link will expire in 1 hour for
            security reasons. If you didn't request a password reset, you can
            safely ignore this email.
          </p>
        </div>

        <p style="margin-top: 30px; font-size: 9px; color: #999">
          If the button doesn't work, you can also copy and paste this link in
          your browser:
        </p>
        <p class="link-text">${resetLink}</p>
      </div>

      <div class="footer">
        <p>This reset link will expire in 1 hour.</p>
        <p>
          If you did not request a password reset, please ignore this email and
          your password will remain unchanged.
        </p>
        <p>© 2026 Personal Finance Tracker. All rights reserved.</p>
      </div>
    </div>
  </body>
</html>   `