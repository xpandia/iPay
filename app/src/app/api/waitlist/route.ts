import { NextRequest, NextResponse } from "next/server";
import { readFile, writeFile, access } from "fs/promises";

// ============================================================================
// iPay Waitlist API — Email collection for investor traction
// POST /api/waitlist — Join waitlist
// GET  /api/waitlist — Get waitlist count
// ============================================================================

const WAITLIST_FILE = "/tmp/ipay-waitlist.json";

// Rate limiting
const rateLimiter = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 10; // requests per minute per IP
const RATE_WINDOW = 60_000;

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimiter.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimiter.set(ip, { count: 1, resetAt: now + RATE_WINDOW });
    return true;
  }
  entry.count++;
  return entry.count <= RATE_LIMIT;
}

// In-memory fallback
let memoryStore: WaitlistEntry[] = [];
let fileLoaded = false;

interface WaitlistEntry {
  email: string;
  name?: string;
  role: "merchant" | "developer" | "investor";
  joinedAt: string;
}

async function loadEntries(): Promise<WaitlistEntry[]> {
  if (fileLoaded) return memoryStore;
  try {
    await access(WAITLIST_FILE);
    const data = await readFile(WAITLIST_FILE, "utf-8");
    memoryStore = JSON.parse(data);
  } catch {
    memoryStore = [];
  }
  fileLoaded = true;
  return memoryStore;
}

async function saveEntries(entries: WaitlistEntry[]): Promise<void> {
  memoryStore = entries;
  try {
    await writeFile(WAITLIST_FILE, JSON.stringify(entries, null, 2));
  } catch {
    // File write failed — data persists in memory for this process lifetime
  }
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

const VALID_ROLES = new Set(["merchant", "developer", "investor"]);

// ─── POST ────────────────────────────────────────────────────────────────────

export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for") ?? request.headers.get("x-real-ip") ?? "unknown";
  if (!checkRateLimit(ip)) {
    return NextResponse.json(
      { error: "Demasiadas solicitudes. Intenta de nuevo en un minuto." },
      { status: 429 }
    );
  }

  let body: { email?: string; name?: string; role?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
  }

  const { email, name, role } = body;

  if (!email || typeof email !== "string" || !isValidEmail(email.trim())) {
    return NextResponse.json({ error: "Email inválido" }, { status: 400 });
  }

  if (role && !VALID_ROLES.has(role)) {
    return NextResponse.json(
      { error: "Rol inválido. Usa: merchant, developer, investor" },
      { status: 400 }
    );
  }

  const entries = await loadEntries();

  // Check duplicate
  const normalizedEmail = email.trim().toLowerCase();
  if (entries.some((e) => e.email === normalizedEmail)) {
    const position = entries.findIndex((e) => e.email === normalizedEmail) + 1;
    return NextResponse.json({ success: true, position, message: "Ya estás en la lista" });
  }

  const entry: WaitlistEntry = {
    email: normalizedEmail,
    name: name?.trim() || undefined,
    role: (role as WaitlistEntry["role"]) || "merchant",
    joinedAt: new Date().toISOString(),
  };

  entries.push(entry);
  await saveEntries(entries);

  return NextResponse.json({
    success: true,
    position: entries.length,
    message: "¡Bienvenido a la lista de espera!",
  });
}

// ─── GET ─────────────────────────────────────────────────────────────────────

export async function GET() {
  const entries = await loadEntries();
  return NextResponse.json({ count: entries.length });
}
