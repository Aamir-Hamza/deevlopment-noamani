import React from "react";
import Link from "next/link";

export default function NotFound() {
  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      background: "linear-gradient(135deg, #232526 0%, #414345 100%)",
      color: "#fff",
      textAlign: "center",
      padding: "2rem"
    }}>
      <h1 style={{ fontSize: "5rem", marginBottom: "1rem", fontWeight: 900, letterSpacing: "2px" }}>😎</h1>
      <h2 style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>Nomani Developer is working here!</h2>
      <p style={{ fontSize: "1.25rem", marginBottom: "2rem", maxWidth: 500 }}>
        You tried to visit a page that doesn't exist yet.<br />
        But don't worry, our developer is on it!<br />
        <span style={{ color: "#FFD700", fontWeight: 700 }}>Coming soon products for this page.</span>
      </p>
      <Link href="/" style={{
        background: "#FFD700",
        color: "#232526",
        padding: "0.75rem 2rem",
        borderRadius: "30px",
        fontWeight: 700,
        fontSize: "1.1rem",
        textDecoration: "none",
        boxShadow: "0 4px 20px rgba(0,0,0,0.15)"
      }}>
        Go to Home
      </Link>
    </div>
  );
} 