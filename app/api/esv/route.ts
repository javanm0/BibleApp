import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');

  if (!query) {
    return NextResponse.json({ error: "Missing query parameter" }, { status: 400 });
  }

  const apiKey = process.env.NEXT_PUBLIC_ESV_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "Missing API key" }, { status: 500 });
  }

  try {
    const response = await fetch(`https://api.esv.org/v3/passage/text/?q=${encodeURIComponent(query)}&include-footnotes=false&include-headings=false`, {
      headers: {
        'Authorization': `Token ${apiKey}`
      }
    });

    if (!response.ok) {
      console.error(`Failed to fetch data from ESV API: ${response.statusText}`);
      return NextResponse.json({ error: "Failed to fetch data from ESV API" }, { status: response.status });
    }

    const data = await response.json();
    if (data.passages && data.passages.length > 0) {
      let versesText = data.passages.join(" ").replaceAll("¶", "\n\n");
      versesText = versesText.replace(/\[\d+\]/g, "");
      versesText = versesText.replace(/^\s*([^\d\n]+)\s*\d+\s*\n\n/gm, "");
      versesText = versesText.replace(/\s*\(ESV\)\s*$/, "");

      return NextResponse.json({
        query: query,
        canonical: query,
        passages: [versesText]
      });
    } else {
      console.error("Invalid data structure received from the API");
      return NextResponse.json({ error: "Invalid data structure received from the API" }, { status: 500 });
    }
  } catch (error) {
    if (error instanceof Error) {
      console.error(`Error fetching data from ESV API: ${error.message}`);
      return NextResponse.json({ error: "Failed to fetch data from ESV API" }, { status: 500 });
    } else {
      console.error("An unknown error occurred");
      return NextResponse.json({ error: "An unknown error occurred" }, { status: 500 });
    }
  }
}