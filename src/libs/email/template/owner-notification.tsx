interface OwnerNotificationEmailProps {
  fullname: string;
  email: string;
  challenge: string;
}

export function OwnerNotificationEmail({
  fullname,
  email,
  challenge,
}: OwnerNotificationEmailProps) {
  return (
    <div
      style={{
        fontFamily: "Arial, sans-serif",
        maxWidth: "600px",
        margin: "0 auto",
        padding: "20px",
        backgroundColor: "#0a0a0a",
        color: "#ffffff",
      }}
    >
      <div
        style={{
          borderBottom: "2px solid #333",
          paddingBottom: "20px",
          marginBottom: "20px",
        }}
      >
        <h1 style={{ color: "#ffffff", margin: 0 }}>New Contact Request</h1>
      </div>

      <div style={{ lineHeight: "1.6" }}>
        <div style={{ marginBottom: "20px" }}>
          <p
            style={{
              color: "#888",
              margin: "0 0 4px 0",
              fontSize: "12px",
              textTransform: "uppercase",
            }}
          >
            Full Name
          </p>
          <p style={{ margin: 0, fontSize: "16px" }}>{fullname}</p>
        </div>

        <div style={{ marginBottom: "20px" }}>
          <p
            style={{
              color: "#888",
              margin: "0 0 4px 0",
              fontSize: "12px",
              textTransform: "uppercase",
            }}
          >
            Email
          </p>
          <a
            href={`mailto:${email}`}
            style={{
              color: "#60a5fa",
              textDecoration: "none",
              fontSize: "16px",
            }}
          >
            {email}
          </a>
        </div>

        <div style={{ marginBottom: "20px" }}>
          <p
            style={{
              color: "#888",
              margin: "0 0 4px 0",
              fontSize: "12px",
              textTransform: "uppercase",
            }}
          >
            Message
          </p>
          <div
            style={{
              backgroundColor: "#1a1a1a",
              padding: "16px",
              borderRadius: "8px",
              whiteSpace: "pre-wrap",
            }}
          >
            {challenge}
          </div>
        </div>
      </div>

      <div
        style={{
          borderTop: "2px solid #333",
          paddingTop: "20px",
          marginTop: "30px",
          fontSize: "12px",
          color: "#888",
          textAlign: "center" as const,
        }}
      >
        Sent from andrealosavio.com
      </div>
    </div>
  );
}
