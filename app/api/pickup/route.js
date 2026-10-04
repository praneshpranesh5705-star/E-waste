import { NextResponse } from "next/server";

async function saveToSupabase(record) {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return false;

  const response = await fetch(`${url}/rest/v1/pickup_requests`, {
    method: "POST",
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
      Prefer: "return=minimal",
    },
    body: JSON.stringify(record),
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`Database error: ${detail}`);
  }
  return true;
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, phone, type, message = "" } = body || {};
    if (!name || !phone || !type) {
      return NextResponse.json({ error: "Name, phone and e-waste type are required." }, { status: 400 });
    }

    const record = {
      name: String(name).trim(),
      phone: String(phone).trim(),
      type: String(type).trim(),
      message: String(message).trim(),
      status: "new",
    };

    const saved = await saveToSupabase(record);
    if (!saved) {
      console.log("EcoCycle pickup request (database not configured):", {
        ...record,
        createdAt: new Date().toISOString(),
      });
    }

    return NextResponse.json({ ok: true, stored: saved });
  } catch (error) {
    return NextResponse.json({ error: error?.message || "Invalid request." }, { status: 500 });
  }
}