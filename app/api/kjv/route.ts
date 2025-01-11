import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');

  if (!query) {
    return NextResponse.json({ error: "Missing query parameter" }, { status: 400 });
  }

  const match = query.match(/^(\d?\s?\w+)\s+(\d+)$/);
  if (!match) {
    return NextResponse.json({ error: "Invalid query parameter" }, { status: 400 });
  }

  const [, book, chapter] = match;

  if (!book || !chapter) {
    return NextResponse.json({ error: "Invalid query parameter" }, { status: 400 });
  }

  const response = await fetch(
    `https://api.biblesupersearch.com/api?bible=kjv&reference=${encodeURIComponent(book)}%20${encodeURIComponent(chapter)}`
  );

  if (!response.ok) {
    return NextResponse.json({ error: "Failed to fetch data from KJV API" }, { status: response.status });
  }

  const data = await response.json();
  if (data.results && data.results[0] && data.results[0].verses && data.results[0].verses.kjv) {
    const versesData: { [key: string]: { text: string } } = data.results[0].verses.kjv[chapter];
    const versesText = Object.values(versesData)
      .map((verse) => verse.text)
      .join(" ")
      .replaceAll("¶", "\n\n");

    return NextResponse.json({
      query: query,
      canonical: query,
      passages: [versesText]
    });
  } else {
    return NextResponse.json({ error: "Invalid data structure received from the API" }, { status: 500 });
  }
}