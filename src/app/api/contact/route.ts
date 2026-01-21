import { getResendClient } from "@/libs/email/resend";
import { ClientConfirmationEmail } from "@/libs/email/template/client-confirmation";
import { OwnerNotificationEmail } from "@/libs/email/template/owner-notification";
import { NextRequest, NextResponse } from "next/server";

interface ContactFormData {
  fullname: string;
  email: string;
  challenge: string;
  locale: "it" | "en";
}

export async function POST(request: NextRequest) {
  try {
    const body: ContactFormData = await request.json();
    const { fullname, email, challenge, locale } = body;

    // Validate required fields
    if (!fullname || !email || !challenge) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    const ownerEmail = process.env.OWNER_EMAIL;
    const fromEmail = process.env.FROM_EMAIL || "noreply@andrealosavio.com";

    if (!ownerEmail) {
      console.error("OWNER_EMAIL environment variable is not set");
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 }
      );
    }

    const resend = getResendClient();

    // Send confirmation email to client
    const clientEmailSubject =
      locale === "it"
        ? "Grazie per avermi contattato!"
        : "Thank you for reaching out!";

    const { error: clientError } = await resend.emails.send({
      from: `Andrea Losavio <${fromEmail}>`,
      to: email,
      subject: clientEmailSubject,
      react: ClientConfirmationEmail({ fullname, locale }),
    });

    if (clientError) {
      console.error("Error sending client confirmation email:", clientError);
      return NextResponse.json(
        { error: "Failed to send confirmation email" },
        { status: 500 }
      );
    }

    // Send notification email to owner
    const { error: ownerError } = await resend.emails.send({
      from: `Contact Form <${fromEmail}>`,
      to: ownerEmail,
      replyTo: email,
      subject: `New Contact: ${fullname}`,
      react: OwnerNotificationEmail({ fullname, email, challenge }),
    });

    if (ownerError) {
      console.error("Error sending owner notification email:", ownerError);
      // Don't return error to client since their confirmation was sent
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
