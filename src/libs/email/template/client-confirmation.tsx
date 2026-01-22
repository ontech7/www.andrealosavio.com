interface ClientConfirmationEmailProps {
  fullname: string;
  locale: "it" | "en";
}

const SITE_URL = "https://andrealosavio.com";

const content = {
  en: {
    subject: "Thank you for reaching out!",
    greeting: (name: string) => `Hi ${name},`,
    thanks:
      "Thank you for reaching out! I've received your message and I'm excited to learn more about your project.",
    response:
      "I'll review your request carefully and get back to you within 24-48 hours with my thoughts.",
    meanwhile: "In the meantime, you might find these helpful:",
    services: "Check out my services",
    projects: "Browse my projects",
    about: "Learn more about me",
    closing: "Talk soon,",
    signature: "Andrea Losavio",
    role: "Software Engineer & Tech Consultant",
  },
  it: {
    subject: "Grazie per avermi contattato!",
    greeting: (name: string) => `Ciao ${name},`,
    thanks:
      "Grazie per avermi contattato! Ho ricevuto il tuo messaggio e sono curioso di saperne di più sul tuo progetto.",
    response:
      "Esaminerò attentamente la tua richiesta e ti risponderò entro 24-48 ore con le mie considerazioni.",
    meanwhile: "Nel frattempo, potresti trovare utili questi link:",
    services: "Scopri i miei servizi",
    projects: "Esplora i miei progetti",
    about: "Scopri di più su di me",
    closing: "A presto,",
    signature: "Andrea Losavio",
    role: "Software Engineer & Tech Consultant",
  },
};

// Brand colors
const colors = {
  background: "#111111",
  cardBackground: "#1f1f1f",
  text: "#ffffff",
  textMuted: "#bfbfbf",
  accent: "#0d7ef2",
  border: "#333333",
};

export function ClientConfirmationEmail({
  fullname,
  locale,
}: ClientConfirmationEmailProps) {
  const t = content[locale];

  return (
    <div
      style={{
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
        backgroundColor: colors.background,
        padding: "40px 20px",
      }}
    >
      <div
        style={{
          maxWidth: "600px",
          margin: "0 auto",
          backgroundColor: colors.cardBackground,
          borderRadius: "16px",
          overflow: "hidden",
        }}
      >
        {/* Header with Logo */}
        <div
          style={{
            background: `linear-gradient(135deg, ${colors.background} 0%, #1a1a2e 100%)`,
            padding: "32px",
            textAlign: "center" as const,
            borderBottom: `1px solid ${colors.border}`,
          }}
        >
          <img
            src={`${SITE_URL}/icons/android-chrome-192x192.png`}
            alt="Andrea Losavio"
            width="64"
            height="64"
            style={{
              marginBottom: "16px",
            }}
          />
          <h1
            style={{
              color: colors.text,
              fontSize: "24px",
              fontWeight: "700",
              margin: "0 0 4px 0",
            }}
          >
            Andrea Losavio
          </h1>
          <p
            style={{
              color: colors.textMuted,
              fontSize: "14px",
              margin: 0,
            }}
          >
            {t.role}
          </p>
        </div>

        {/* Main Content */}
        <div style={{ padding: "32px" }}>
          <p
            style={{
              color: colors.text,
              fontSize: "18px",
              fontWeight: "600",
              marginTop: 0,
              marginBottom: "20px",
            }}
          >
            {t.greeting(fullname)}
          </p>

          <p
            style={{
              color: colors.textMuted,
              fontSize: "16px",
              lineHeight: "1.6",
              marginBottom: "16px",
            }}
          >
            {t.thanks}
          </p>

          <p
            style={{
              color: colors.textMuted,
              fontSize: "16px",
              lineHeight: "1.6",
              marginBottom: "28px",
            }}
          >
            {t.response}
          </p>

          {/* Links Section */}
          <div
            style={{
              backgroundColor: colors.background,
              borderRadius: "12px",
              padding: "20px",
              marginBottom: "28px",
            }}
          >
            <p
              style={{
                color: colors.text,
                fontSize: "14px",
                fontWeight: "600",
                marginTop: 0,
                marginBottom: "16px",
              }}
            >
              {t.meanwhile}
            </p>

            <table
              cellPadding="0"
              cellSpacing="0"
              border={0}
              style={{ width: "100%" }}
            >
              <tbody>
                <tr>
                  <td style={{ paddingBottom: "12px" }}>
                    <a
                      href={`${SITE_URL}/${locale}/services`}
                      style={{
                        color: colors.accent,
                        textDecoration: "none",
                        fontSize: "14px",
                        display: "inline-flex",
                        alignItems: "center",
                      }}
                    >
                      → {t.services}
                    </a>
                  </td>
                </tr>
                <tr>
                  <td style={{ paddingBottom: "12px" }}>
                    <a
                      href={`${SITE_URL}/${locale}/projects`}
                      style={{
                        color: colors.accent,
                        textDecoration: "none",
                        fontSize: "14px",
                        display: "inline-flex",
                        alignItems: "center",
                      }}
                    >
                      → {t.projects}
                    </a>
                  </td>
                </tr>
                <tr>
                  <td>
                    <a
                      href={`${SITE_URL}/${locale}/about`}
                      style={{
                        color: colors.accent,
                        textDecoration: "none",
                        fontSize: "14px",
                        display: "inline-flex",
                        alignItems: "center",
                      }}
                    >
                      → {t.about}
                    </a>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Signature */}
          <p
            style={{
              color: colors.textMuted,
              fontSize: "16px",
              marginBottom: "4px",
            }}
          >
            {t.closing}
          </p>
          <p
            style={{
              color: colors.text,
              fontSize: "16px",
              fontWeight: "600",
              margin: 0,
            }}
          >
            {t.signature}
          </p>
        </div>

        {/* Footer */}
        <div
          style={{
            borderTop: `1px solid ${colors.border}`,
            padding: "24px 32px",
            textAlign: "center" as const,
          }}
        >
          {/* Social Links */}
          <table
            cellPadding="0"
            cellSpacing="0"
            border={0}
            style={{ margin: "0 auto 16px auto" }}
          >
            <tbody>
              <tr>
                <td style={{ paddingRight: "16px" }}>
                  <a
                    href="https://github.com/ontech7"
                    style={{
                      color: colors.textMuted,
                      textDecoration: "none",
                      fontSize: "13px",
                    }}
                  >
                    GitHub
                  </a>
                </td>
                <td style={{ paddingRight: "16px" }}>
                  <a
                    href="https://www.linkedin.com/in/andrea-losavio/"
                    style={{
                      color: colors.textMuted,
                      textDecoration: "none",
                      fontSize: "13px",
                    }}
                  >
                    LinkedIn
                  </a>
                </td>
                <td>
                  <a
                    href={SITE_URL}
                    style={{
                      color: colors.textMuted,
                      textDecoration: "none",
                      fontSize: "13px",
                    }}
                  >
                    Website
                  </a>
                </td>
              </tr>
            </tbody>
          </table>

          <p
            style={{
              color: colors.textMuted,
              opacity: 0.8,
              fontSize: "12px",
              margin: 0,
            }}
          >
            © 2018 - {new Date().getFullYear()} Andrea Losavio. All rights
            reserved.
          </p>
        </div>
      </div>
    </div>
  );
}
