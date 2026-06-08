const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export interface Agent {
  did: string;
  public_key: string;
  display_name: string;
  metadata: Record<string, unknown>;
  event_count: number;
  created_at: string;
}

export interface Event {
  id: string;
  agent_did: string;
  seq_num: number;
  action: string;
  resource: string | null;
  metadata: Record<string, unknown>;
  signature: string;
  prev_hash: string;
  event_hash: string;
  x402_tx_hash: string | null;
  created_at: string;
}

export interface VerifyResult {
  valid: boolean;
  event_id?: string;
  agent_did?: string;
  chain_length?: number;
  reason?: string;
  at_seq?: number;
}

export async function getAgent(did: string): Promise<Agent | null> {
  try {
    const r = await fetch(`${API_URL}/agents/${encodeURIComponent(did)}`, {
      next: { revalidate: 30 },
    });
    if (!r.ok) return null;
    return r.json();
  } catch {
    return null;
  }
}

export async function getAgentEvents(
  did: string,
  opts: { limit?: number; before_seq?: number } = {}
): Promise<{ events: Event[]; count: number }> {
  const params = new URLSearchParams();
  if (opts.limit) params.set("limit", String(opts.limit));
  if (opts.before_seq) params.set("before_seq", String(opts.before_seq));

  try {
    const r = await fetch(
      `${API_URL}/agents/${encodeURIComponent(did)}/events?${params}`,
      { next: { revalidate: 10 } }
    );
    if (!r.ok) return { events: [], count: 0 };
    return r.json();
  } catch {
    return { events: [], count: 0 };
  }
}

export async function getEvent(id: string): Promise<Event | null> {
  try {
    const r = await fetch(`${API_URL}/events/${encodeURIComponent(id)}`, {
      next: { revalidate: 60 },
    });
    if (!r.ok) return null;
    return r.json();
  } catch {
    return null;
  }
}

export async function verifyEvent(id: string): Promise<VerifyResult | null> {
  try {
    const r = await fetch(`${API_URL}/verify/${encodeURIComponent(id)}`, {
      cache: "no-store",
    });
    if (!r.ok) return null;
    return r.json();
  } catch {
    return null;
  }
}

// helpers
export function shortHash(s: string, head = 12, tail = 5) {
  if (!s) return "";
  if (s.length <= head + tail + 3) return s;
  return s.slice(0, head) + "..." + s.slice(-tail);
}

export function relativeTime(iso: string): string {
  const now = Date.now();
  const t = new Date(iso).getTime();
  const sec = Math.floor((now - t) / 1000);
  if (sec < 60) return `${sec}s ago`;
  const min = Math.floor(sec / 60);
  if (min < 60) return `${min}m ago`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr}h ago`;
  const day = Math.floor(hr / 24);
  if (day < 30) return `${day}d ago`;
  return new Date(iso).toLocaleDateString();
}
