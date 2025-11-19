import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const { userEmail, userName, loginTime } = await req.json();

    const adminEmail = Deno.env.get("ADMIN_EMAIL") || "rithikvarma003@gmail.com";
    const resendApiKey = Deno.env.get("RESEND_API_KEY");

    if (!resendApiKey) {
      throw new Error("RESEND_API_KEY not configured");
    }

    const emailContent = `
    <h2>Login Notification</h2>
    <p>A user has successfully logged into your website.</p>
    <hr />
    <p><strong>User Email:</strong> ${userEmail}</p>
    <p><strong>User Name:</strong> ${userName || "Not provided"}</p>
    <p><strong>Login Time:</strong> ${loginTime}</p>
    <hr />
    <p>This is an automated notification. Please do not reply to this email.</p>
    `;

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${resendApiKey}`,
      },
      body: JSON.stringify({
        from: "noreply@rlipkart.com",
        to: adminEmail,
        subject: "Login Successful – A user has logged into your website",
        html: emailContent,
      }),
    });

    if (!response.ok) {
      throw new Error(`Email sending failed: ${response.statusText}`);
    }

    const result = await response.json();

    return new Response(
      JSON.stringify({ success: true, message: "Email sent successfully", id: result.id }),
      {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      },
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("Error:", errorMessage);

    return new Response(
      JSON.stringify({ success: false, error: errorMessage }),
      {
        status: 400,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      },
    );
  }
});
