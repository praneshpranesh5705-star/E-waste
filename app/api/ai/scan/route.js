import { NextResponse } from "next/server";

const MODEL = "gemini-3.8-flash";

export async function POST(request) {
  try {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      return NextResponse.json(
        { error: "GEMINI_API_KEY is not configured. Add it to your Vercel environment variables." },
        { status: 503 }
      );
    }

    const { images, question } = await request.json();
    if (!Array.isArray(images) || !images.length) {
      return NextResponse.json({ error: "At least one image is required." }, { status: 400 });
    }
    if (images.length > 4) {
      return NextResponse.json({ error: "You can upload up to 4 images." }, { status: 400 });
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
              ...images.map((item) => ({
                inline_data: {
                  mime_type: item.mimeType,
                  data: item.image,
                },
              })),
              {
                text: `You are EcoCycle's e-waste assistant. Analyze the uploaded electronic item. ${prompt}
Return a practical answer with these sections:
1. ITEM IDENTIFICATION
2. WHAT I CAN SEE
3. ANSWER TO THE USER REQUIREMENT
4. REUSE / REPAIR / RECYCLING RECOMMENDATION
5. SAFETY
6. NEXT ACTION
If the user asks for a pickup, clearly say they should use the pickup form after reviewing the recommendation. Do not invent exact model numbers, prices, weights, hazardous contents, or certifications when they are not visible or provided. Clearly state uncertainty when appropriate.`,
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