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

interface Verse {
  id: number;
  book: number;
  chapter: number;
  verse: number;
  text: string;
  italics: string;
  claimed: boolean;
}

interface Verses {
  [key: string]: Verse;
}

const fetchInitialData = async (book: string, chapter: string) => {
  const encodedBook = encodeURIComponent(book);
  const encodedChapter = encodeURIComponent(chapter);
  const response = await fetch(
    `https://api.biblesupersearch.com/api?bible=${bibleType}&reference=${encodedBook}%20${encodedChapter}`
  );
  const data = await response.json();

  let initialVerses = "";
  let initialSummary = "";

  if (data.results && data.results[0] && data.results[0].verses && data.results[0].verses.kjv) {
    const versesData: Verses = data.results[0].verses.kjv[chapter];
    initialVerses = Object.values(versesData).map((verse: Verse) => verse.text).join(" ");
    initialVerses = initialVerses.replaceAll("¶", "\n\n");

    const response = await groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: `Do not use markdown syntax. Summarize the following text: ${initialVerses}`,
        },
      ],
      model: model as string, // Ensure model is defined and cast to string
    });
    initialSummary = response.choices[0]?.message?.content || "";
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
    const { text } = await request.json();
    const response = await groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: `Do not use markdown syntax. Summarize the following text: ${text}`,
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