import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, phone, type } = body || {};

    if (!name || !phone || !type) {
      return NextResponse.json(
        { error: "Name, phone and e-waste type are required." },
        { status: 400 }
      );
    }

    // API-ready endpoint. Connect a database, email provider, or CRM here.
    console.log("EcoCycle pickup request:", {
      ...body,
      createdAt: new Date().toISOString(),
    });

    return NextResponse.json({
      ok: true,
      message: "Pickup request received.",
    });
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
}