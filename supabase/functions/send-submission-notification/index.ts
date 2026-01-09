import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface SubmissionNotificationRequest {
  submissionId: string;
  title: string;
  authors: string;
  category: string | null;
  submitterEmail: string;
  submitterName: string | null;
  adminEmail?: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { 
      submissionId, 
      title, 
      authors, 
      category, 
      submitterEmail,
      submitterName,
      adminEmail 
    }: SubmissionNotificationRequest = await req.json();

    console.log("Sending submission notification for:", title);

    // Send confirmation email to submitter
    const submitterResponse = await resend.emails.send({
      from: "Journal Submissions <onboarding@resend.dev>",
      to: [submitterEmail],
      subject: "Manuscript Submission Received",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: 'Georgia', serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #1a365d; color: white; padding: 30px; text-align: center; }
            .content { padding: 30px; background: #f8f9fa; }
            .footer { padding: 20px; text-align: center; font-size: 12px; color: #666; }
            .highlight { background: #e2e8f0; padding: 15px; border-radius: 5px; margin: 15px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 style="margin: 0;">Submission Received</h1>
            </div>
            <div class="content">
              <p>Dear ${submitterName || 'Author'},</p>
              <p>Thank you for submitting your manuscript to our journal. We have successfully received your submission.</p>
              
              <div class="highlight">
                <p><strong>Title:</strong> ${title}</p>
                <p><strong>Authors:</strong> ${authors}</p>
                ${category ? `<p><strong>Category:</strong> ${category}</p>` : ''}
                <p><strong>Submission ID:</strong> ${submissionId.slice(0, 8)}</p>
              </div>
              
              <p>Your manuscript will undergo an initial review by our editorial team. You will be notified of any updates regarding the status of your submission.</p>
              
              <p>You can track the status of your submission by logging into your account dashboard.</p>
              
              <p>Best regards,<br>The Editorial Team</p>
            </div>
            <div class="footer">
              <p>This is an automated message. Please do not reply directly to this email.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    console.log("Submitter email sent:", submitterResponse);

    // If admin email is provided, notify admin too
    if (adminEmail) {
      const adminResponse = await resend.emails.send({
        from: "Journal Submissions <onboarding@resend.dev>",
        to: [adminEmail],
        subject: `New Manuscript Submission: ${title.slice(0, 50)}${title.length > 50 ? '...' : ''}`,
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <style>
              body { font-family: 'Georgia', serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: #744210; color: white; padding: 30px; text-align: center; }
              .content { padding: 30px; background: #f8f9fa; }
              .footer { padding: 20px; text-align: center; font-size: 12px; color: #666; }
              .highlight { background: #fef3c7; padding: 15px; border-radius: 5px; margin: 15px 0; }
              .btn { display: inline-block; padding: 10px 20px; background: #744210; color: white; text-decoration: none; border-radius: 5px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1 style="margin: 0;">New Submission</h1>
              </div>
              <div class="content">
                <p>A new manuscript has been submitted for review.</p>
                
                <div class="highlight">
                  <p><strong>Title:</strong> ${title}</p>
                  <p><strong>Authors:</strong> ${authors}</p>
                  ${category ? `<p><strong>Category:</strong> ${category}</p>` : ''}
                  <p><strong>Submitted by:</strong> ${submitterEmail}</p>
                  <p><strong>Submission ID:</strong> ${submissionId}</p>
                </div>
                
                <p>Please log in to the admin dashboard to review this submission and assign reviewers.</p>
                
                <p>Best regards,<br>Automated Notification System</p>
              </div>
              <div class="footer">
                <p>This is an automated notification from the journal management system.</p>
              </div>
            </div>
          </body>
          </html>
        `,
      });

      console.log("Admin email sent:", adminResponse);
    }

    return new Response(
      JSON.stringify({ success: true, message: "Notifications sent successfully" }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Error in send-submission-notification function:", error);
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
