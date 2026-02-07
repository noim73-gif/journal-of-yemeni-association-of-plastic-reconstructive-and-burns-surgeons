import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@2.0.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface SubmissionNotificationRequest {
  submissionId: string;
  adminEmail?: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Validate authentication
    const authHeader = req.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      console.error("Missing or invalid authorization header");
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Create Supabase client with user's auth context
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      { global: { headers: { Authorization: authHeader } } }
    );

    // Verify user is authenticated using getClaims
    const token = authHeader.replace("Bearer ", "");
    const { data: claimsData, error: claimsError } = await supabaseClient.auth.getClaims(token);
    
    if (claimsError || !claimsData?.claims) {
      console.error("Failed to verify user:", claimsError);
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const userId = claimsData.claims.sub;
    const userEmail = claimsData.claims.email as string;

    const { submissionId, adminEmail }: SubmissionNotificationRequest = await req.json();

    if (!submissionId) {
      return new Response(
        JSON.stringify({ error: "submissionId is required" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Verify the user owns this submission (RLS will also enforce this, but let's be explicit)
    const { data: submission, error: submissionError } = await supabaseClient
      .from("submissions")
      .select("id, user_id, title, authors, category")
      .eq("id", submissionId)
      .single();

    if (submissionError || !submission) {
      console.error("Submission not found:", submissionError);
      return new Response(
        JSON.stringify({ error: "Submission not found" }),
        { status: 404, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Verify ownership
    if (submission.user_id !== userId) {
      console.error("User does not own this submission");
      return new Response(
        JSON.stringify({ error: "Forbidden" }),
        { status: 403, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Get user's name from profile
    const { data: profile } = await supabaseClient
      .from("profiles")
      .select("full_name")
      .eq("user_id", userId)
      .single();

    const submitterName = profile?.full_name || "Author";

    console.log("Sending submission notification for:", submission.title);

    // Send confirmation email to submitter (using verified email from JWT)
    const submitterResponse = await resend.emails.send({
      from: "Journal Submissions <onboarding@resend.dev>",
      to: [userEmail],
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
              <p>Dear ${submitterName},</p>
              <p>Thank you for submitting your manuscript to our journal. We have successfully received your submission.</p>
              
              <div class="highlight">
                <p><strong>Title:</strong> ${submission.title}</p>
                <p><strong>Authors:</strong> ${submission.authors}</p>
                ${submission.category ? `<p><strong>Category:</strong> ${submission.category}</p>` : ''}
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
        subject: `New Manuscript Submission: ${submission.title.slice(0, 50)}${submission.title.length > 50 ? '...' : ''}`,
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
                  <p><strong>Title:</strong> ${submission.title}</p>
                  <p><strong>Authors:</strong> ${submission.authors}</p>
                  ${submission.category ? `<p><strong>Category:</strong> ${submission.category}</p>` : ''}
                  <p><strong>Submitted by:</strong> ${userEmail}</p>
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
      JSON.stringify({ error: "Internal server error" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
