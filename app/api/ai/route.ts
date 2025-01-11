import { NextResponse } from 'next/server';
import Groq from 'groq-sdk';
import dotenv from 'dotenv';

dotenv.config();

const apiKey = process.env.NEXT_PUBLIC_GROQ_API_KEY;
const model = process.env.NEXT_PUBLIC_GROQ_MODEL;
const bibleType = process.env.NEXT_PUBLIC_BIBLE_TYPE;

if (!apiKey) {
  throw new Error("The GROQ_API_KEY environment variable is missing or empty; either provide it, or instantiate the Groq client with an apiKey option, like new Groq({ apiKey: 'My API Key' }).");
}

if (!model) {
  throw new Error("The NEXT_PUBLIC_GROQ_MODEL environment variable is missing or empty; please provide a valid model.");
}

if (!bibleType) {
  throw new Error("The NEXT_PUBLIC_BIBLE_TYPE environment variable is missing or empty; please provide a valid Bible type.");
}

const groq = new Groq({ apiKey, dangerouslyAllowBrowser: true });

const fetchInitialData = async (book: string, chapter: string) => {
  const encodedBook = encodeURIComponent(book);
  const encodedChapter = encodeURIComponent(chapter);
  const apiUrl = `/api/${bibleType.toLowerCase()}?q=${encodedBook}%20${encodedChapter}`;

  const response = await fetch(apiUrl);
  const data = await response.json();

  let initialVerses = "";
  let initialSummary = "";

  if (data.passages && data.passages.length > 0) {
    initialVerses = data.passages.join(" ").replaceAll("¶", "\n\n");

    const summaryResponse = await groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: `Do not use markdown syntax. Summarize the following text: ${initialVerses}`,
        },
      ],
      model: model as string, // Ensure model is defined and cast to string
    });
    initialSummary = summaryResponse.choices[0]?.message?.content || "";
  }

  return { initialVerses, initialSummary };
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const book = searchParams.get('book');
  const chapter = searchParams.get('chapter');

  if (!book || !chapter) {
    return NextResponse.json({ error: "Missing book or chapter parameter" }, { status: 400 });
  }

  try {
    const data = await fetchInitialData(book, chapter);
    return NextResponse.json(data);
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    } else {
      return NextResponse.json({ error: "An unknown error occurred" }, { status: 500 });
    }
  }
}

export async function POST(request: Request) {
  try {
    const { text, expertLevel } = await request.json();
    const response = await groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: `Do not use markdown syntax. Summarize the following text for an individual with a ${expertLevel} spiritual knowledge level: ${text}`,
        },
      ],
      model: model as string,
    });
    const summary = response.choices[0]?.message?.content || "";
    return NextResponse.json({ summary });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    } else {
      return NextResponse.json({ error: "An unknown error occurred" }, { status: 500 });
    }
  }
}