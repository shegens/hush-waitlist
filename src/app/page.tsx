"use client";

import { useModal, useAccount, useLogout } from "@getpara/react-sdk";
import { useState, useEffect } from "react";
import { upsertWaitlist } from "@/lib/waitlist";



function AccountButton({ connected, onConnect, onDisconnect }: {
  connected: boolean;
  onConnect: () => void;
  onDisconnect: () => void;
}) {
  return (
    <button
      style={{
        ...s.avatar,
        background: connected ? "#D96B10" : "#F7EDE2",
        borderColor: connected ? "#D96B10" : "#F9C49A",
      }}
      onClick={connected ? onDisconnect : onConnect}
      title={connected ? "Disconnect" : "Connect"}
    />
  );
}

export default function WaitlistPage() {
  const { openModal } = useModal();
  const { isConnected, embedded } = useAccount();
  const { logout } = useLogout();
  const address = embedded?.wallets?.[0]?.address ?? null;

  function handleDisconnect() {
    logout();
    setDone(false);
    setName("");
    setNotes("");
    setError("");
  }

  const [done, setDone] = useState(false);
  const [name, setName] = useState("");
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function submitInfo() {
    if (!address) return;
    setSaving(true);
    setError("");
    try {
      await upsertWaitlist({ address, name, notes });
      setDone(true);
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
        <AccountButton connected={false} onConnect={() => openModal()} onDisconnect={handleDisconnect} />
        <div style={s.wordmark}>hush</div>
        <p style={s.tagline}>All signal. No noise.</p>
        {error && <p style={s.error}>{error}</p>}
        <button style={{ ...s.btn, marginTop: "0.75rem" }} onClick={() => openModal()}>join the waitlist</button>
      </main>
    );
  }

  // ── connected but hasn't submitted yet: show form
  if (!done) {
    const remaining = 999 - notes.length;
    return (
      <main style={s.main}>
        <AccountButton connected={true} onConnect={() => openModal()} onDisconnect={handleDisconnect} />
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
          <button style={s.ghost} onClick={() => { upsertWaitlist({ address }); setDone(true); }}>skip</button>
        </div>
      </main>
    );
  }

  // ── done
  return (
    <main style={s.main}>
      <AccountButton connected={true} onConnect={() => openModal()} onDisconnect={handleDisconnect} />
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
    width: 32,
    height: 32,
    borderRadius: "50%",
    border: "1.5px solid",
    cursor: "pointer",
    padding: 0,
    transition: "background 0.2s, border-color 0.2s",
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
