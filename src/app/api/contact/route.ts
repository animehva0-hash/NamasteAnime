import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { name, email, subject, message } = await request.json();

    if (!name || !email || !subject || !message) {
      return NextResponse.json({ error: "All fields required" }, { status: 400 });
    }

    const TO_EMAIL = "inrelam@gmail.com";

    // Send via mailto link fallback — open email client
    // For production: integrate with Resend, SendGrid, or Nodemailer
    // Here we store the message and provide a direct email option

    // Store contact message in a simple way
    const timestamp = new Date().toISOString();
    console.log(`[CONTACT] ${timestamp} | From: ${name} <${email}> | Subject: ${subject} | Message: ${message}`);

    // Try sending via a free email API (formsubmit.co)
    try {
      await fetch(`https://formsubmit.co/ajax/${TO_EMAIL}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          name,
          email,
          _subject: `[Namaste Anime] ${subject}`,
          message: `From: ${name}\nEmail: ${email}\nSubject: ${subject}\n\n${message}`,
        }),
      });
    } catch {
      // Fallback — message is logged server-side
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to send" }, { status: 500 });
  }
}
