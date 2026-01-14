import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "resend";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface AuthEmailRequest {
  user: {
    email: string;
    user_metadata?: {
      full_name?: string;
    };
  };
  email_data: {
    token: string;
    token_hash: string;
    redirect_to: string;
    email_action_type: string;
    site_url: string;
  };
}

const getEmailTemplate = (
  type: string,
  userName: string,
  confirmationUrl: string
) => {
  const journalName = "Journal of Plastic & Reconstructive Surgery";
  const primaryColor = "#1e3a5f";
  const accentColor = "#2563eb";

  const baseStyles = `
    body { 
      font-family: 'Georgia', 'Times New Roman', serif; 
      line-height: 1.7; 
      color: #1a1a1a; 
      background-color: #f8fafc;
      margin: 0;
      padding: 0;
    }
    .container { 
      max-width: 600px; 
      margin: 0 auto; 
      background-color: #ffffff;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
    }
    .header { 
      background: linear-gradient(135deg, ${primaryColor} 0%, #2d4a6f 100%);
      padding: 40px 30px;
      text-align: center;
    }
    .logo-circle {
      width: 60px;
      height: 60px;
      background-color: rgba(255, 255, 255, 0.15);
      border-radius: 50%;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 16px;
    }
    .logo-text {
      color: #ffffff;
      font-size: 28px;
      font-weight: bold;
      font-family: 'Georgia', serif;
    }
    .header h1 { 
      color: #ffffff; 
      margin: 0;
      font-size: 22px;
      font-weight: 600;
      letter-spacing: -0.5px;
    }
    .content { 
      padding: 40px 30px;
    }
    .greeting {
      font-size: 18px;
      color: ${primaryColor};
      margin-bottom: 20px;
    }
    .message {
      color: #4a5568;
      font-size: 16px;
      margin-bottom: 30px;
    }
    .button-container {
      text-align: center;
      margin: 35px 0;
    }
    .button { 
      display: inline-block;
      background: linear-gradient(135deg, ${accentColor} 0%, #1d4ed8 100%);
      color: #ffffff !important; 
      padding: 16px 40px;
      text-decoration: none;
      border-radius: 8px;
      font-weight: 600;
      font-size: 16px;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      box-shadow: 0 4px 14px rgba(37, 99, 235, 0.35);
      transition: all 0.2s ease;
    }
    .button:hover {
      box-shadow: 0 6px 20px rgba(37, 99, 235, 0.45);
    }
    .divider {
      height: 1px;
      background: linear-gradient(90deg, transparent, #e2e8f0, transparent);
      margin: 30px 0;
    }
    .info-box {
      background-color: #f1f5f9;
      border-left: 4px solid ${accentColor};
      padding: 16px 20px;
      border-radius: 0 8px 8px 0;
      margin: 25px 0;
    }
    .info-box p {
      margin: 0;
      color: #475569;
      font-size: 14px;
    }
    .link-text {
      word-break: break-all;
      font-size: 12px;
      color: #64748b;
      background-color: #f8fafc;
      padding: 12px;
      border-radius: 6px;
      margin-top: 20px;
    }
    .footer { 
      background-color: #f8fafc;
      padding: 30px;
      text-align: center;
      border-top: 1px solid #e2e8f0;
    }
    .footer p { 
      color: #64748b; 
      font-size: 13px;
      margin: 5px 0;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    }
    .footer-brand {
      color: ${primaryColor};
      font-weight: 600;
      font-size: 14px;
      margin-bottom: 10px !important;
    }
  `;

  const templates: Record<string, { subject: string; body: string }> = {
    signup: {
      subject: `Verify Your Email - ${journalName}`,
      body: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>${baseStyles}</style>
        </head>
        <body>
          <div style="padding: 20px; background-color: #f8fafc;">
            <div class="container">
              <div class="header">
                <div class="logo-circle">
                  <span class="logo-text">J</span>
                </div>
                <h1>${journalName}</h1>
              </div>
              <div class="content">
                <p class="greeting">Welcome${userName ? `, ${userName}` : ""}!</p>
                <p class="message">
                  Thank you for joining our academic community. To complete your registration and access 
                  the latest research in plastic and reconstructive surgery, please verify your email address.
                </p>
                
                <div class="button-container">
                  <a href="${confirmationUrl}" class="button">Verify Email Address</a>
                </div>
                
                <div class="info-box">
                  <p><strong>Why verify?</strong> Email verification helps us protect your account and ensures 
                  you receive important updates about new publications and submissions.</p>
                </div>
                
                <div class="divider"></div>
                
                <p style="font-size: 14px; color: #64748b;">
                  If the button above doesn't work, copy and paste this link into your browser:
                </p>
                <p class="link-text">${confirmationUrl}</p>
              </div>
              <div class="footer">
                <p class="footer-brand">${journalName}</p>
                <p>Advancing knowledge in plastic and reconstructive surgery</p>
                <p style="margin-top: 15px;">This link will expire in 24 hours.</p>
              </div>
            </div>
          </div>
        </body>
        </html>
      `,
    },
    recovery: {
      subject: `Reset Your Password - ${journalName}`,
      body: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>${baseStyles}</style>
        </head>
        <body>
          <div style="padding: 20px; background-color: #f8fafc;">
            <div class="container">
              <div class="header">
                <div class="logo-circle">
                  <span class="logo-text">J</span>
                </div>
                <h1>${journalName}</h1>
              </div>
              <div class="content">
                <p class="greeting">Hello${userName ? `, ${userName}` : ""},</p>
                <p class="message">
                  We received a request to reset your password. Click the button below to create a new password 
                  for your account.
                </p>
                
                <div class="button-container">
                  <a href="${confirmationUrl}" class="button">Reset Password</a>
                </div>
                
                <div class="info-box">
                  <p><strong>Didn't request this?</strong> If you didn't request a password reset, 
                  you can safely ignore this email. Your password will remain unchanged.</p>
                </div>
                
                <div class="divider"></div>
                
                <p style="font-size: 14px; color: #64748b;">
                  If the button above doesn't work, copy and paste this link into your browser:
                </p>
                <p class="link-text">${confirmationUrl}</p>
              </div>
              <div class="footer">
                <p class="footer-brand">${journalName}</p>
                <p>Advancing knowledge in plastic and reconstructive surgery</p>
                <p style="margin-top: 15px;">This link will expire in 1 hour for security.</p>
              </div>
            </div>
          </div>
        </body>
        </html>
      `,
    },
    email_change: {
      subject: `Confirm Email Change - ${journalName}`,
      body: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>${baseStyles}</style>
        </head>
        <body>
          <div style="padding: 20px; background-color: #f8fafc;">
            <div class="container">
              <div class="header">
                <div class="logo-circle">
                  <span class="logo-text">J</span>
                </div>
                <h1>${journalName}</h1>
              </div>
              <div class="content">
                <p class="greeting">Hello${userName ? `, ${userName}` : ""},</p>
                <p class="message">
                  You've requested to change your email address. Please confirm this change by clicking 
                  the button below.
                </p>
                
                <div class="button-container">
                  <a href="${confirmationUrl}" class="button">Confirm Email Change</a>
                </div>
                
                <div class="info-box">
                  <p><strong>Security notice:</strong> If you didn't request this change, 
                  please secure your account immediately by resetting your password.</p>
                </div>
                
                <div class="divider"></div>
                
                <p style="font-size: 14px; color: #64748b;">
                  If the button above doesn't work, copy and paste this link into your browser:
                </p>
                <p class="link-text">${confirmationUrl}</p>
              </div>
              <div class="footer">
                <p class="footer-brand">${journalName}</p>
                <p>Advancing knowledge in plastic and reconstructive surgery</p>
              </div>
            </div>
          </div>
        </body>
        </html>
      `,
    },
  };

  return templates[type] || templates.signup;
};

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const payload: AuthEmailRequest = await req.json();
    console.log("Received auth email request:", JSON.stringify(payload, null, 2));

    const { user, email_data } = payload;
    const { token_hash, redirect_to, email_action_type, site_url } = email_data;

    // Construct the confirmation URL
    const confirmationUrl = `${site_url}/auth/confirm?token_hash=${token_hash}&type=${email_action_type}&redirect_to=${encodeURIComponent(redirect_to || site_url)}`;

    const userName = user.user_metadata?.full_name || "";
    const template = getEmailTemplate(email_action_type, userName, confirmationUrl);

    const emailResponse = await resend.emails.send({
      from: "Journal of Plastic & Reconstructive Surgery <onboarding@resend.dev>",
      to: [user.email],
      subject: template.subject,
      html: template.body,
    });

    console.log("Email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Error in custom-auth-email function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
