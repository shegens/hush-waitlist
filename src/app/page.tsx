"use client";

import { useModal, useAccount } from "@getpara/react-sdk";
import { useState, useEffect } from "react";
import { upsertWaitlist } from "@/lib/waitlist";

type Stage = "idle" | "waitlisted" | "done";

function AccountButton({ address, onClick }: { address: string | null; onClick: () => void }) {
  const label = address ? `${address.slice(0, 4)}…${address.slice(-2)}` : "●";
  return (
    <button style={s.avatar} onClick={onClick} title="Account">
      <span style={s.avatarText}>{label}</span>
    </button>
  );
}

export default function WaitlistPage() {
  const { openModal } = useModal();
  const { isConnected, embedded } = useAccount();
  const address = embedded?.wallets?.[0]?.address ?? null;

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
      .catch(() => setError("Failed to join waitlist. Please refresh and try again."));
  }, [isConnected, address, stage]);

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

  // ── not connected (or connect failed)
  if (!isConnected || !address) {
    return (
      <main style={s.main}>
        <AccountButton address={null} onClick={() => openModal()} />
        <div style={s.wordmark}>hush</div>
        <p style={s.tagline}>All signal. No noise.</p>
        {error && <p style={s.error}>{error}</p>}
        <button style={{ ...s.btn, marginTop: "0.75rem" }} onClick={() => openModal()}>join the waitlist</button>
      </main>
    );
  }

  // ── waitlisted: show optional form inline
  if (stage === "waitlisted") {
    const remaining = 999 - notes.length;
    return (
      <main style={s.main}>
        <AccountButton address={address} onClick={() => openModal()} />
        <div style={s.wordmark}>hush</div>
        <p style={s.confirmation}>
          You're on the waitlist. You may provide additional info for waitlist review if you wish.
        </p>
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
      <AccountButton address={address} onClick={() => openModal()} />
      <div style={s.wordmark}>hush</div>
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
    position: "relative",
  },
  avatar: {
    position: "absolute",
    top: "1.25rem",
    right: "1.25rem",
    width: 36,
    height: 36,
    borderRadius: "50%",
    background: "#F7EDE2",
    border: "1.5px solid #F9C49A",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 0,
    transition: "border-color 0.2s",
  },
  avatarText: {
    fontFamily: "monospace",
    fontSize: "0.55rem",
    color: "#5C2E0E",
    letterSpacing: "-0.02em",
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
  address: {
    fontFamily: "monospace",
    fontSize: "0.72rem",
    color: "#5C2E0E",
    background: "#F7EDE2",
    borderRadius: 20,
    padding: "0.3rem 0.85rem",
  },
};
