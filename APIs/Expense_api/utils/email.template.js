export const verifyEmail_template = (verificationLink) => 
    `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
                body {
                    font-family: 'Segoe UI', Roboto, sans-serif;
                    line-height: 1.6;
                    color: #4a4a4a;
                    background: linear-gradient(135deg, #fff5e6 0%, #ffdfba 100%);
                    margin: 0;
                    padding: 20px;
                }
                .email-container {
                    max-width: 600px;
                    margin: 0 auto;
                    background-color: rgba(255, 255, 255, 0.95);
                    border-radius: 24px;
                    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
                    overflow: hidden;
                    backdrop-filter: blur(10px);
                }
                .header {
                    background: linear-gradient(135deg, #ff9a44 0%, #fc6076 100%);
                    color: #ffffff;
                    padding: 40px 30px;
                    text-align: center;
                    box-shadow: 0 4px 15px rgba(255, 106, 0, 0.2);
                }
                .header h1 {
                    margin: 0;
                    font-size: 32px;
                    font-weight: 700;
                    letter-spacing: 0.5px;
                }
                .content {
                    padding: 40px 30px;
                    text-align: center;
                }
                .content p {
                    font-size: 15px;
                    margin: 15px 0;
                    color: #4a4a4a;
                    line-height: 1.7;
                }
                .content p:first-of-type {
                    font-size: 16px;
                    font-weight: 500;
                    color: #4a4a4a;
                }
                .verify-button {
                    display: inline-block;
                    background: linear-gradient(135deg, #ff9a44, #fc6076);
                    color: #ffffff;
                    padding: 16px 40px;
                    text-decoration: none;
                    border-radius: 12px;
                    font-weight: 700;
                    font-size: 16px;
                    margin: 28px 0;
                    transition: all 0.3s ease;
                    border: none;
                    cursor: pointer;
                    box-shadow: 0 4px 15px rgba(255, 106, 0, 0.3);
                    letter-spacing: 0.5px;
                }
                .verify-button:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 6px 20px rgba(255, 106, 0, 0.4);
                }
                .footer {
                    background-color: rgba(255, 250, 243, 0.8);
                    padding: 25px 30px;
                    text-align: center;
                    font-size: 13px;
                    color: #7a7a7a;
                    border-top: 1px solid rgba(255, 154, 68, 0.1);
                }
                .footer p {
                    margin: 8px 0;
                    line-height: 1.6;
                }
                .link-text {
                    word-break: break-all;
                    color: #ff9a44;
                    font-size: 12px;
                    background-color: rgba(255, 154, 68, 0.08);
                    padding: 12px;
                    border-radius: 8px;
                    margin: 15px 0;
                    border-left: 3px solid #ff9a44;
                }
                .note-text {
                    font-size: 12px;
                    color: #999;
                    margin-top: 25px;
                }
            </style>
        </head>
        <body>
            <div class="email-container">
                <div class="header">
                    <h1>✓ Email Verification</h1>
                </div>
                
                <div class="content">
                    <p>Hello,</p>
                    
                    <p>Thank you for signing up! To complete your registration and verify your email address, please click the button below:</p>
                    
                    <a href="${verificationLink}" class="verify-button">Verify Email Address</a>
                    
                    <p class="note-text">
                        If the button doesn't work, you can also copy and paste this link in your browser:
                    </p>
                    <p class="link-text">${verificationLink}</p>
                </div>
                
                <div class="footer">
                    <p><strong>This verification link will expire in 24 hours.</strong></p>
                    <p>If you did not create this account, please ignore this email and your account will remain inactive.</p>
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
        font-family: "Segoe UI", Roboto, sans-serif;
        line-height: 1.6;
        color: #4a4a4a;
        background: linear-gradient(135deg, #fff5e6 0%, #ffdfba 100%);
        margin: 0;
        padding: 20px;
      }
      .email-container {
        max-width: 600px;
        margin: 0 auto;
        background-color: rgba(255, 255, 255, 0.95);
        border-radius: 24px;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
        overflow: hidden;
        backdrop-filter: blur(10px);
      }
      .header {
        background: linear-gradient(135deg, #ff9a44 0%, #fc6076 100%);
        color: #ffffff;
        padding: 40px 30px;
        text-align: center;
        box-shadow: 0 4px 15px rgba(255, 106, 0, 0.2);
      }
      .header h1 {
        margin: 0;
        font-size: 32px;
        font-weight: 700;
        letter-spacing: 0.5px;
      }
      .alert-box {
        background-color: rgba(255, 154, 68, 0.12);
        border-left: 4px solid #ff9a44;
        padding: 18px 20px;
        margin: 20px 30px 0 30px;
        border-radius: 8px;
      }
      .alert-box p {
        margin: 0;
        color: #ff6a00;
        font-size: 15px;
        font-weight: 600;
        line-height: 1.6;
      }
      .content {
        padding: 30px 30px 25px 30px;
        text-align: center;
      }
      .content p {
        font-size: 15px;
        margin: 15px 0;
        color: #4a4a4a;
        line-height: 1.7;
      }
      .content p:first-of-type {
        font-size: 16px;
        font-weight: 500;
        margin-top: 20px;
      }
      .reset-button {
        display: inline-block;
        background: linear-gradient(135deg, #ff9a44, #fc6076);
        color: #ffffff;
        padding: 16px 40px;
        text-decoration: none;
        border-radius: 12px;
        font-weight: 700;
        font-size: 16px;
        margin: 28px 0 20px 0;
        transition: all 0.3s ease;
        border: none;
        cursor: pointer;
        box-shadow: 0 4px 15px rgba(255, 106, 0, 0.3);
        letter-spacing: 0.5px;
      }
      .reset-button:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 20px rgba(255, 106, 0, 0.4);
      }
      .security-note {
        background-color: rgba(255, 193, 7, 0.12);
        border-left: 4px solid #ffc107;
        padding: 18px 20px;
        margin: 20px 30px 0 30px;
        border-radius: 8px;
      }
      .security-note p {
        margin: 0;
        color: #b8860b;
        font-size: 13px;
        font-weight: 500;
        line-height: 1.6;
      }
      .footer {
        background-color: rgba(255, 250, 243, 0.8);
        padding: 25px 30px;
        text-align: center;
        font-size: 13px;
        color: #7a7a7a;
        border-top: 1px solid rgba(255, 154, 68, 0.1);
      }
      .footer p {
        margin: 8px 0;
        line-height: 1.6;
      }
      .link-text {
        word-break: break-all;
        color: #ff9a44;
        font-size: 12px;
        background-color: rgba(255, 154, 68, 0.08);
        padding: 12px;
        border-radius: 8px;
        margin: 15px 0;
        border-left: 3px solid #ff9a44;
      }
      .note-text {
        font-size: 12px;
        color: #999;
        margin: 25px 0 0 0;
      }
    </style>
  </head>
  <body>
    <div class="email-container">
      <div class="header">
        <h1>🔒 Password Reset Request</h1>
      </div>

      <div class="alert-box">
        <p>We received a request to reset your password. If you made this request, click the button below to reset it.</p>
      </div>

      <div class="content">
        <p>Click the button below to create a new password:</p>

        <a href="${resetLink}" class="reset-button">Reset Password</a>

        <div class="security-note">
          <p>
            <strong>⚠️ Security Note:</strong> This link will expire in 1 hour for your security. If you didn't request a password reset, you can safely ignore this email and your password will remain unchanged.
          </p>
        </div>

        <p class="note-text">
          If the button doesn't work, you can also copy and paste this link in your browser:
        </p>
        <p class="link-text">${resetLink}</p>
      </div>

      <div class="footer">
        <p><strong>This reset link will expire in 1 hour.</strong></p>
        <p>
          If you did not request a password reset, please ignore this email and your password will remain unchanged.
        </p>
        <p>© 2026 Personal Finance Tracker. All rights reserved.</p>
      </div>
    </div>
  </body>
</html>   `


export const emailVerificationResponse_template = (login_url, message, type) =>
  `
<html lang="en" data-beasties-container="">
  <head>
    <meta charset="utf-8" />
    <title>Personal Finance TrackeR</title>
    <base href="/" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <link rel="icon" type="image/x-icon" href="favicon.ico" />
    <script type="module" src="https://esm.sh/ionicons@latest/loader"></script>
    <script nomodule="" src="https://esm.sh/ionicons@latest/loader"></script>
    <style>
      :root {
        --bg-color: #fffaf3;
        --text-color: #4a4a4a;
        --accent-color: #ff914d;
        --primary-orange: #ff9a44;
        --secondary-orange: #ff6a00;
        --bg-gradient: linear-gradient(135deg, #fff5e6 0%, #ffdfba 100%);
        --glass-bg: rgba(255, 255, 255, 0.4);
        --input-bg: rgba(255, 255, 255, 0.6);
        --border-color: #e0e0e0;
        --shadow-color: rgba(0, 0, 0, 0.1);
        --error-color: #ff6b6b;
        --success-color: #51cf66;
        --warning-color: #ffd43b;
        --skeleton-bg: #e2e2e2;
        --skeleton-shimmer: rgba(255, 255, 255, 0.6);
      }
      body {
        margin: 0;
        padding: 0;
        background-color: var(--bg-color);
        color: var(--text-color);
        font-family:
          Segoe UI,
          Roboto,
          sans-serif;
        transition:
          background-color 0.3s ease,
          color 0.3s ease;
      }
    </style>
    <link
      rel="stylesheet"
      href="styles-7L7OWYWO.css"
      media="all"
      onload="this.media = 'all'"
    />
    <noscript><link rel="stylesheet" href="styles-7L7OWYWO.css" /></noscript>
    <style>
      .login-page[_ngcontent-ng-c807141042] {
        height: 100vh;
        display: flex;
        justify-content: center;
        align-items: center;
        background: var(--bg-gradient);
        font-family:
          Segoe UI,
          Roboto,
          sans-serif;
        overflow: auto;
        position: relative;
        transition: all 0.5s ease;
      }
      .theme-switch[_ngcontent-ng-c807141042] {
        position: absolute;
        top: 20px;
        right: 20px;
        cursor: pointer;
        padding: 10px 40px;
        background: var(--glass-bg);
        -webkit-backdrop-filter: blur(10px);
        backdrop-filter: blur(10px);
        border-radius: 30px;
        color: var(--text-color);
        border: 1px solid rgba(255, 255, 255, 0.2);
        z-index: 10;
      }
      .flip-container[_ngcontent-ng-c807141042] {
        z-index: 2;
        width: 90%;
        max-width: 400px;
      }
      .glass-container[_ngcontent-ng-c807141042] {
        margin: 0 20px;
        padding: 23px;
        text-align: center;
        background: var(--glass-bg);
        -webkit-backdrop-filter: blur(20px);
        backdrop-filter: blur(20px);
        border-radius: 24px;
        border: 1px solid rgba(255, 255, 255, 0.3);
        box-shadow: 0 8px 32px #0000001a;
      }
      .logo-section[_ngcontent-ng-c807141042] h1[_ngcontent-ng-c807141042] {
        color: var(--text-color);
        margin-top: 15px;
        font-weight: 300;
        letter-spacing: 2px;
      }
      .logo-section[_ngcontent-ng-c807141042] span[_ngcontent-ng-c807141042] {
        font-weight: 800;
        color: var(--secondary-orange);
      }
      .logo-section[_ngcontent-ng-c807141042] p[_ngcontent-ng-c807141042] {
        color: var(--text-color);
        opacity: 0.7;
        font-size: 0.9rem;
      }
      .input-group[_ngcontent-ng-c807141042] input[_ngcontent-ng-c807141042] {
        width: 100%;
        padding: 15px;
        margin: 10px 0 3px;
        border-radius: 12px;
        border: 1px solid rgba(255, 255, 255, 0.2);
        background: var(--input-bg);
        color: var(--text-color);
        box-sizing: border-box;
        outline: none;
      }
      .login-btn[_ngcontent-ng-c807141042] {
        width: calc(100% + 10px);
        padding: 4px;
        margin-top: 20px;
        border: none;
        border-radius: 12px;
        background: linear-gradient(
          90deg,
          var(--primary-orange),
          var(--secondary-orange)
        );
        color: #fff;
        font-weight: 700;
        letter-spacing: 1px;
        line-height: 28px;
        cursor: pointer;
        transition: transform 0.2s ease;
      }
      .login-btn[_ngcontent-ng-c807141042]:hover {
        transform: translateY(-2px);
        box-shadow: 0 5px 15px #ff6a0066;
      }
      .footer-links[_ngcontent-ng-c807141042] {
        margin-top: 20px;
        display: flex;
        justify-content: space-between;
      }
      .footer-links[_ngcontent-ng-c807141042] label[_ngcontent-ng-c807141042] {
        cursor: pointer;
        font-size: 0.8rem;
        color: var(--text-color);
        text-decoration: none;
        opacity: 0.6;
      }
      .blob[_ngcontent-ng-c807141042] {
        position: absolute;
        border-radius: 50%;
        filter: blur(60px);
        z-index: 1;
      }
      .blob-1[_ngcontent-ng-c807141042] {
        width: 300px;
        height: 300px;
        background: var(--primary-orange);
        top: -50px;
        left: -50px;
        opacity: 0.4;
      }
      .blob-2[_ngcontent-ng-c807141042] {
        width: 250px;
        height: 250px;
        background: var(--secondary-orange);
        bottom: 0;
        right: 0;
        opacity: 0.3;
      }
      .input-group[_ngcontent-ng-c807141042]
        input.ng-invalid.ng-touched[_ngcontent-ng-c807141042] {
        border: 1.5px solid rgba(255, 71, 71, 0.8);
        box-shadow: 0 0 10px #ff474733;
      }
      .login-btn[_ngcontent-ng-c807141042] {
        background: linear-gradient(135deg, #ff9a44, #fc6076);
        color: #fff;
        border: none;
        cursor: pointer;
        box-shadow: 0 4px 15px #fc607666;
      }
      .login-box[_ngcontent-ng-c807141042],
      .register-box[_ngcontent-ng-c807141042] {
        width: 88%;
      }
      .login-btn[_ngcontent-ng-c807141042]:not(:disabled) {
        background: linear-gradient(135deg, #ff9a44, #fc6076);
        color: #fff;
        border: none;
        cursor: pointer;
        box-shadow: 0 4px 15px #fc607666;
      }
      .login-btn[_ngcontent-ng-c807141042]:not(:disabled):hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 20px #fc607699;
      }
      .input-group[_ngcontent-ng-c807141042] {
        position: relative;
      }
      .input-group[_ngcontent-ng-c807141042]:last-of-type {
        margin-bottom: 20px;
      }
      .icon-eye[_ngcontent-ng-c807141042] {
        position: relative;
        top: -32px;
        float: right;
        padding-right: 18px;
        height: 0px;
      }
      .error-msg[_ngcontent-ng-c807141042] {
        color: #ff4747;
        font-size: 0.75rem;
        margin-top: 5px;
        padding-left: 5px;
        font-weight: 500;
        text-shadow: 0 0 8px rgba(255, 71, 71, 0.3);
        animation: _ngcontent-ng-c807141042_fadeIn 0.3s ease-in-out;
        margin-bottom: 20px;
      }
      .invalid-border[_ngcontent-ng-c807141042] {
        border: 1px solid rgba(255, 71, 71, 0.6) !important;
        box-shadow: 0 0 10px #ff47471a inset !important;
      }
      @keyframes _ngcontent-ng-c807141042_fadeIn {
        0% {
          opacity: 0;
          transform: translateY(-5px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
      .footer-links.signin-link[_ngcontent-ng-c807141042] {
        float: right;
      }
      .flip-container[_ngcontent-ng-c807141042] {
        perspective: 1000px;
        width: 100%;
        max-width: 400px;
        margin: auto;
      }
      .flip-wrapper[_ngcontent-ng-c807141042] {
        position: relative;
        width: 100%;
        height: auto;
        transform-style: preserve-3d;
        transition: transform 0.6s;
      }
      .flip-container.flipped[_ngcontent-ng-c807141042]
        .flip-wrapper[_ngcontent-ng-c807141042] {
        transform: rotateY(180deg);
      }
      .flip-box[_ngcontent-ng-c807141042] {
        position: absolute;
        top: -35vh;
        left: 16px;
        width: 100%;
        min-height: 100%;
        backface-visibility: hidden;
        display: flex;
        justify-content: center;
        align-items: center;
      }
      .flip-box.front[_ngcontent-ng-c807141042],
      .flip-box.back[_ngcontent-ng-c807141042] {
        height: auto;
      }
      .flip-box.back[_ngcontent-ng-c807141042] {
        transform: rotateY(180deg);
      }
      .glass-container[_ngcontent-ng-c807141042] {
        width: 100%;
        max-width: 400px;
        margin: 0 auto;
        padding: 25px;
        text-align: center;
        background: var(--glass-bg);
        -webkit-backdrop-filter: blur(20px);
        backdrop-filter: blur(20px);
        border-radius: 24px;
        border: 1px solid rgba(255, 255, 255, 0.3);
        box-shadow: 0 8px 32px #0000001a;
      }
      .registration.verify-email[_ngcontent-ng-c807141042] {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        min-height: 161px;
        padding: 30px 20px;
      }
      .registration.verify-email[_ngcontent-ng-c807141042]
        h2[_ngcontent-ng-c807141042] {
        font-size: 1.8rem;
        color: #27ae60;
        font-weight: 700;
        margin-bottom: 20px;
        letter-spacing: 1px;
        text-shadow: 0 2px 4px rgba(39, 174, 96, 0.2);
        animation: _ngcontent-ng-c807141042_slideDown 0.5s ease-out;
      }
      .registration.verify-email[_ngcontent-ng-c807141042]
        p[_ngcontent-ng-c807141042] {
        color: var(--text-color);
        font-size: 0.9rem;
        line-height: 1.6;
        margin: 10px 0;
        opacity: 0.8;
      }
      .registration.verify-email[_ngcontent-ng-c807141042]
        p[_ngcontent-ng-c807141042]
        span[_ngcontent-ng-c807141042] {
        display: inline;
      }
      .registration.verify-email[_ngcontent-ng-c807141042]
        p[_ngcontent-ng-c807141042]
        span[_ngcontent-ng-c807141042]:first-child {
        font-size: 0.85rem;
        opacity: 0.7;
      }
      .registration.verify-email[_ngcontent-ng-c807141042]
        p[_ngcontent-ng-c807141042]
        a[_ngcontent-ng-c807141042]{
        font-weight: 700;
        color: var(--primary-orange);
        cursor: pointer;
        padding: 0 8px;
        border-radius: 6px;
        transition: all 0.3s ease;
        background: #ff9a441a;
        border-bottom: 2px solid var(--primary-orange);
      }
      .registration.verify-email[_ngcontent-ng-c807141042]
        p[_ngcontent-ng-c807141042]
        a[_ngcontent-ng-c807141042]:hover {
        background: #ff9a4433;
        transform: scale(1.05);
        text-decoration: underline;
        box-shadow: 0 4px 12px #ff9a444d;
      }
      @keyframes _ngcontent-ng-c807141042_slideDown {
        0% {
          opacity: 0;
          transform: translateY(-20px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
      .glass-container[_ngcontent-ng-c807141042] {
        width: 100%;
        max-width: 400px;
        margin: 0 auto;
        padding: 25px;
      }
      @media (max-width: 1024px) {
        .glass-container[_ngcontent-ng-c807141042] {
          max-width: 70%;
        }
      }
      @media (max-width: 600px) {
        .glass-container[_ngcontent-ng-c807141042] {
          max-width: 80%;
          padding: 20px;
        }
        .input-group[_ngcontent-ng-c807141042] input[_ngcontent-ng-c807141042] {
          padding: 12px;
          font-size: 0.9rem;
        }
        .login-btn[_ngcontent-ng-c807141042] {
          padding: 4px;
          font-size: 0.9rem;
        }
      }
    </style>
    <style>
      .error-banner[_ngcontent-ng-c2151674835] {
        display: flex;
        align-items: center;
        justify-content: space-between;
        color: #fff;
        padding: 12px 16px;
        border-radius: 6px;
        margin-bottom: 16px;
        box-shadow: 0 2px 8px #00000026;
        animation: _ngcontent-ng-c2151674835_slideDown 0.3s ease-in-out;
        transition: background-color 0.3s ease;
      }
      .error-banner.error[_ngcontent-ng-c2151674835] {
        background-color: #e23035;
      }
      .error-banner.success[_ngcontent-ng-c2151674835] {
        background-color: #2e7d32;
      }
      .error-banner.info[_ngcontent-ng-c2151674835] {
        background-color: #f9a825;
      }
      .error-content[_ngcontent-ng-c2151674835] {
        display: flex;
        align-items: center;
        gap: 12px;
        flex: 1;
      }
      .error-icon[_ngcontent-ng-c2151674835] {
        flex-shrink: 0;
        color: #fff;
      }
      .error-message[_ngcontent-ng-c2151674835] {
        font-size: 14px;
        font-weight: 500;
        line-height: 1.5;
      }
        .error{
        color: #e23035 !important;
        }
      .close-btn[_ngcontent-ng-c2151674835] {
        background: none;
        border: none;
        color: #fff;
        font-size: 24px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        height: 24px;
        width: 24px;
        transition: opacity 0.2s;
      }
      .close-btn[_ngcontent-ng-c2151674835]:hover {
        opacity: 0.8;
      }
      @keyframes _ngcontent-ng-c2151674835_slideDown {
        0% {
          opacity: 0;
          transform: translateY(-10px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
    </style>
  </head>
  <body ngcm="">
    <div ng-version="21.2.7">
      <div _nghost-ng-c807141042="">
        <div _ngcontent-ng-c807141042="" class="login-page dark-theme">
          <div _ngcontent-ng-c807141042="" class="flip-container flipped">
            <div _ngcontent-ng-c807141042="" class="flip-wrapper">
         
              <div
                _ngcontent-ng-c807141042=""
                class="flip-box back glass-container"
              >
                <div _ngcontent-ng-c807141042="" class="register-box">
      
                  <div _ngcontent-ng-c807141042="" class="logo-section">
                    <div _ngcontent-ng-c807141042="" class="icon-circle">
                      💰
                    </div>
                    <h1 _ngcontent-ng-c807141042="">
                      Finance<span _ngcontent-ng-c807141042="">Flow</span>
                    </h1>
                    <p _ngcontent-ng-c807141042="">
                      Your futuristic wealth tracker
                    </p>
                  </div>
                  <div
                    _ngcontent-ng-c807141042=""
                    class="registration verify-email"
                  >
                    <h2 _ngcontent-ng-c807141042="" class="${type}">${message}</h2>
                    <p _ngcontent-ng-c807141042="">
                     You can proceed to login to the application.
                    </p>
                    <p _ngcontent-ng-c807141042="">
                      <span _ngcontent-ng-c807141042=""
                        >Please click here to </span
                      ><a _ngcontent-ng-c807141042="" href="${login_url}">Log In</a>
                    </p>
                  </div>
                  <!----><!---->
                </div>
              </div>
            </div>
          </div>
          <div _ngcontent-ng-c807141042="" class="blob blob-1"></div>
          <div _ngcontent-ng-c807141042="" class="blob blob-2"></div>
        </div>
      </div>
      <!---->
    </div>
  </body>
</html>

    `