"use client";

import "./globals.css";
import { useModal, useAccount } from "@getpara/react-sdk";
import { useState, useEffect } from "react";
import { upsertWaitlist, getWaitlistEntry } from "@/lib/waitlist";

type Stage = "idle" | "waitlisted" | "form" | "done";

export default function WaitlistPage() {
  const { openModal } = useModal();
  const { isConnected, address } = useAccount();

  const [stage, setStage] = useState<Stage>("idle");
  const [name, setName] = useState("");
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // On connect: auto-register to waitlist
  useEffect(() => {
    if (!isConnected || !address) return;
    if (stage !== "idle") return;

    upsertWaitlist({ address })
      .then(() => setStage("waitlisted"))
      .catch(() => setStage("waitlisted")); // still show confirmation on error
  }, [isConnected, address]);

  async function submitInfo() {
    if (!address) return;
    setSaving(true);
    setError("");
    try {
      await upsertWaitlist({ address, name, notes });
      setStage("done");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  // ── not connected
  if (!isConnected || !address) {
    return (
      <main style={s.main}>
        <div style={s.wordmark}>hush</div>
        <p style={s.tagline}>All signal. No noise.</p>
        <button style={s.btn} onClick={openModal}>join the waitlist</button>
        <div style={s.footer}>coming soon</div>
      </main>
    );
  }

  // ── just connected, offer form
  if (stage === "waitlisted") {
    return (
      <main style={s.main}>
        <div style={s.wordmark}>hush</div>
        <p style={s.confirmation}>
          You're on the waitlist. You may provide additional info for waitlist review if you wish.
        </p>
        <span style={s.address}>{address.slice(0, 6)}…{address.slice(-4)}</span>
        <button style={s.btn} onClick={() => setStage("form")}>add info</button>
        <button style={s.ghost} onClick={() => setStage("done")}>skip</button>
      </main>
    );
  }

  // ── form
  if (stage === "form") {
    const remaining = 999 - notes.length;
    return (
      <main style={s.main}>
        <div style={s.wordmark}>hush</div>
        <div style={s.form}>
          <input
            style={s.input}
            type="text"
            placeholder="name"
            value={name}
            onChange={e => setName(e.target.value)}
            maxLength={120}
          />
          <div style={{ position: "relative", width: "100%" }}>
            <textarea
              style={{ ...s.input, ...s.textarea }}
              placeholder="notes"
              value={notes}
              onChange={e => setNotes(e.target.value)}
              maxLength={999}
            />
            <span style={s.charCount}>{remaining}</span>
          </div>
          {error && <p style={s.error}>{error}</p>}
          <button style={s.btn} onClick={submitInfo} disabled={saving}>
            {saving ? "saving…" : "submit"}
          </button>
          <button style={s.ghost} onClick={() => setStage("done")}>skip</button>
        </div>
      </main>
    );
  }

  // ── done
  return (
    <main style={s.main}>
      <div style={s.wordmark}>hush</div>
      <div style={s.bars}>
        {[6, 10, 15, 20].map((h, i) => (
          <div key={i} style={{ ...s.bar, height: h }} />
        ))}
      </div>
      <p style={s.confirmation}>
        You're on the waitlist. We'll be in touch when it's your turn to speak.
      </p>
      <span style={s.address}>{address.slice(0, 6)}…{address.slice(-4)}</span>
    </main>
  );
}

const s: Record<string, React.CSSProperties> = {
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
  confirmation: {
    fontSize: "0.9rem",
    color: "#8C5828",
    textAlign: "center",
    maxWidth: 300,
    lineHeight: 1.65,
    fontFamily: "Georgia, serif",
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
  ghost: {
    background: "none",
    border: "none",
    color: "#8C5828",
    fontFamily: "system-ui",
    fontSize: "0.78rem",
    cursor: "pointer",
    opacity: 0.7,
  },
  form: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "0.85rem",
    width: "100%",
    maxWidth: 340,
  },
  input: {
    width: "100%",
    background: "#F7EDE2",
    border: "1px solid #F9C49A",
    borderRadius: 10,
    padding: "0.75rem 1rem",
    fontFamily: "Georgia, serif",
    fontSize: "0.9rem",
    color: "#221206",
    outline: "none",
  },
  textarea: {
    minHeight: 120,
    resize: "none" as const,
    paddingBottom: "1.5rem",
  },
  charCount: {
    position: "absolute",
    bottom: "0.5rem",
    right: "0.75rem",
    fontSize: "0.65rem",
    fontFamily: "system-ui",
    color: "#8C5828",
    opacity: 0.6,
  },
  error: {
    color: "#D96B10",
    fontSize: "0.75rem",
    fontFamily: "system-ui",
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
  },
  bar: {
    width: 4,
    borderRadius: 2,
    background: "#D96B10",
    opacity: 0.4,
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
