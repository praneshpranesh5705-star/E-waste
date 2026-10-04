import { NextResponse } from "next/server";

const MODEL = "gemini-2.5-flash";

export async function POST(request) {
  try {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      return NextResponse.json(
        { error: "GEMINI_API_KEY is not configured. Add it to your Vercel environment variables." },
        { status: 503 }
      );
    }

    const { image, mimeType, question } = await request.json();
    if (!image || !mimeType) {
      return NextResponse.json({ error: "An image is required." }, { status: 400 });
    }

    const prompt = question || "Identify this electronic item and explain the safest recycling or reuse option.";
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": key,
        },
        body: JSON.stringify({
          contents: [{
            parts: [
              {
                inline_data: {
                  mime_type: mimeType,
                  data: image,
                },
              },
              {
                text: `You are EcoCycle's e-waste assistant. Analyze the uploaded electronic item. ${prompt}
Return a concise practical answer with:
1. Likely device/item
2. Visible condition
3. Reuse/recycling recommendation
4. Any important safety warning
Do not invent exact model numbers when they are not visible. Clearly state uncertainty when appropriate.`,
              },
            ],
          }],
        }),
      }
    );

    const data = await response.json();
    if (!response.ok) {
      return NextResponse.json(
        { error: data?.error?.message || "Gemini request failed." },
        { status: response.status }
      );
    }

    const result = data?.candidates?.[0]?.content?.parts
      ?.map((part) => part.text || "")
      .join("\n")
      .trim();

    return NextResponse.json({ result: result || "The AI could not produce a useful identification." });
  } catch (error) {
    return NextResponse.json(
      { error: error?.message || "Unexpected AI scan error." },
      { status: 500 }
    );
  }
}