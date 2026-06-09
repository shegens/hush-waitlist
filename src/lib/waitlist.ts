// Waitlist DB via Supabase
// Requires: NEXT_PUBLIC_SUPABASE_URL + NEXT_PUBLIC_SUPABASE_ANON_KEY

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

function headers() {
  return {
    "Content-Type": "application/json",
    apikey: SUPABASE_ANON_KEY,
    Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
    Prefer: "resolution=merge-duplicates,return=representation",
  };
}

export type WaitlistEntry = {
  address: string;
  name?: string;
  notes?: string;
  score: number;
  status: "pending" | "approved";
};

// Score: 1 (base) + 1 (name filled) + 1 (notes filled)
function calcScore(name?: string, notes?: string) {
  return 1 + (name?.trim() ? 1 : 0) + (notes?.trim() ? 1 : 0);
}

export async function upsertWaitlist(entry: {
  address: string;
  name?: string;
  notes?: string;
}): Promise<WaitlistEntry> {
  const score = calcScore(entry.name, entry.notes);
  const body = {
    address: entry.address.toLowerCase(),
    name: entry.name?.trim() || null,
    notes: entry.notes?.trim() || null,
    score,
    updated_at: new Date().toISOString(),
  };

  const res = await fetch(`${SUPABASE_URL}/rest/v1/waitlist`, {
    method: "POST",
    headers: headers(),
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text();
    console.error("Waitlist upsert failed:", res.status, text);
    throw new Error(`Waitlist error: ${res.status}`);
  }
  const data = await res.json();
  return data[0];
}

// No public reads — admin uses service key directly in Supabase dashboard
