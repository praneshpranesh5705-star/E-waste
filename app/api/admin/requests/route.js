import { NextResponse } from "next/server";

export async function GET(request) {
  const password = request.headers.get("x-admin-password");
  if (!process.env.ADMIN_PASSWORD || password !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    return NextResponse.json({ error: "Supabase is not configured." }, { status: 503 });
  }

  const response = await fetch(
    url + "/rest/v1/pickup_requests?select=*&order=created_at.desc&limit=100",
    { headers: { apikey: key, Authorization: "Bearer " + key }, cache: "no-store" }
  );

  if (!response.ok) {
    return NextResponse.json({ error: "Could not load pickup requests." }, { status: 500 });
  }

  return NextResponse.json({ requests: await response.json() });
}