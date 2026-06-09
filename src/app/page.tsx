"use client";

import "./globals.css";
import { useModal, useAccount } from "@getpara/react-sdk";

export default function WaitlistPage() {
  const { openModal } = useModal();
  const { isConnected, address } = useAccount();

  if (isConnected && address) {
    return (
      <main style={styles.main}>
        <div style={styles.wordmark}>hush</div>
        <div style={styles.bars}>
          {[6, 10, 15, 20].map((h, i) => (
            <div key={i} style={{ ...styles.bar, height: h }} />
          ))}
        </div>
        <p style={styles.confirmation}>
          You're on the list. We'll be in touch when it's your turn to speak.
        </p>
        <span style={styles.address}>
          {address.slice(0, 6)}…{address.slice(-4)}
        </span>
      </main>
    );
  }

  return (
    <main style={styles.main}>
      <div style={styles.wordmark}>hush</div>
      <p style={styles.tagline}>All signal. No noise.</p>
      <button style={styles.btn} onClick={openModal}>
        join the waitlist
      </button>
      <div style={styles.footer}>coming soon</div>
    </main>
  );
}

const styles: Record<string, React.CSSProperties> = {
  main: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "2rem 1.5rem",
    gap: "1.25rem",
    background: "#FDF6EE",
  },
  wordmark: {
    fontSize: "2.5rem",
    fontStyle: "italic",
    color: "#D96B10",
    letterSpacing: "0.04em",
  },
  tagline: {
    fontSize: "1.1rem",
    color: "#8C5828",
    lineHeight: 1.7,
    textAlign: "center",
    maxWidth: 320,
  },
  btn: {
    background: "#D96B10",
    color: "#fff",
    border: "none",
    borderRadius: 24,
    padding: "0.75rem 2rem",
    fontSize: "0.85rem",
    fontFamily: "system-ui",
    letterSpacing: "0.04em",
    cursor: "pointer",
    boxShadow: "0 2px 16px rgba(217,107,16,0.18)",
  },
  footer: {
    position: "fixed" as const,
    bottom: "1.5rem",
    fontSize: "0.65rem",
    fontFamily: "system-ui",
    letterSpacing: "0.08em",
    textTransform: "uppercase" as const,
    color: "#F9C49A",
  },
  bars: {
    display: "flex",
    alignItems: "flex-end",
    gap: 3,
    marginBottom: "0.25rem",
  },
  bar: {
    width: 4,
    borderRadius: 2,
    background: "#D96B10",
    opacity: 0.4,
  },
  confirmation: {
    fontSize: "0.85rem",
    color: "#8C5828",
    textAlign: "center",
    maxWidth: 280,
    lineHeight: 1.6,
  },
  address: {
    fontFamily: "monospace",
    fontSize: "0.72rem",
    color: "#5C2E0E",
    background: "#F7EDE2",
    borderRadius: 20,
    padding: "0.3rem 0.85rem",
  },
};
