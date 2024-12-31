"use client";

import { useState } from "react";
import Groq from "groq-sdk";
import dotenv from "dotenv";

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

const booksOfTheBible = [
  "Genesis", "Exodus", "Leviticus", "Numbers", "Deuteronomy", "Joshua", "Judges", "Ruth", "1 Samuel", "2 Samuel",
  "1 Kings", "2 Kings", "1 Chronicles", "2 Chronicles", "Ezra", "Nehemiah", "Esther", "Job", "Psalms", "Proverbs",
  "Ecclesiastes", "Song of Solomon", "Isaiah", "Jeremiah", "Lamentations", "Ezekiel", "Daniel", "Hosea", "Joel",
  "Amos", "Obadiah", "Jonah", "Micah", "Nahum", "Habakkuk", "Zephaniah", "Haggai", "Zechariah", "Malachi",
  "Matthew", "Mark", "Luke", "John", "Acts", "Romans", "1 Corinthians", "2 Corinthians", "Galatians", "Ephesians",
  "Philippians", "Colossians", "1 Thessalonians", "2 Thessalonians", "1 Timothy", "2 Timothy", "Titus", "Philemon",
  "Hebrews", "James", "1 Peter", "2 Peter", "1 John", "2 John", "3 John", "Jude", "Revelation"
];

const chaptersPerBook: { [key: string]: number } = {
  "Genesis": 50, "Exodus": 40, "Leviticus": 27, "Numbers": 36, "Deuteronomy": 34, "Joshua": 24, "Judges": 21, "Ruth": 4,
  "1 Samuel": 31, "2 Samuel": 24, "1 Kings": 22, "2 Kings": 25, "1 Chronicles": 29, "2 Chronicles": 36, "Ezra": 10,
  "Nehemiah": 13, "Esther": 10, "Job": 42, "Psalms": 150, "Proverbs": 31, "Ecclesiastes": 12, "Song of Solomon": 8,
  "Isaiah": 66, "Jeremiah": 52, "Lamentations": 5, "Ezekiel": 48, "Daniel": 12, "Hosea": 14, "Joel": 3, "Amos": 9,
  "Obadiah": 1, "Jonah": 4, "Micah": 7, "Nahum": 3, "Habakkuk": 3, "Zephaniah": 3, "Haggai": 2, "Zechariah": 14,
  "Malachi": 4, "Matthew": 28, "Mark": 16, "Luke": 24, "John": 21, "Acts": 28, "Romans": 16, "1 Corinthians": 16,
  "2 Corinthians": 13, "Galatians": 6, "Ephesians": 6, "Philippians": 4, "Colossians": 4, "1 Thessalonians": 5,
  "2 Thessalonians": 3, "1 Timothy": 6, "2 Timothy": 4, "Titus": 3, "Philemon": 1, "Hebrews": 13, "James": 5,
  "1 Peter": 5, "2 Peter": 3, "1 John": 5, "2 John": 1, "3 John": 1, "Jude": 1, "Revelation": 22
};

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

export default function Home() {
  const [book, setBook] = useState<string>("");
  const [chapter, setChapter] = useState<string>("");
  const [summary, setSummary] = useState<string>("");
  const [verses, setVerses] = useState<string>("");

  const fetchVersesAndSummary = async () => {
    const response = await fetch(
      `https://api.biblesupersearch.com/api?bible=${bibleType}&reference=${book}%20${chapter}`
    );
    const data = await response.json();
    const versesData: Verses = data.results[0].verses.kjv[chapter];
    let versesText = Object.values(versesData).map((verse: Verse) => verse.text).join(" ");
    versesText = versesText.replaceAll("¶", "\n\n");
    setVerses(versesText);

    const summary = await getGroqSummary(versesText);
    setSummary(summary);
  };

  const getGroqSummary = async (text: string) => {
    if (!model) {
      throw new Error("The NEXT_PUBLIC_GROQ_MODEL environment variable is missing or empty; please provide a valid model.");
    }

    const response = await groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: `Do not use markdown syntax. Summarize the following text: ${text}`,
        },
      ],
      model: model,
    });
    return response.choices[0]?.message?.content || "";
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-8 pb-20 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 items-center">
        <h1 className="text-2xl font-bold">Scripture Scope</h1>
        <div className="flex flex-col gap-4">
          <select
            value={book}
            onChange={(e) => setBook(e.target.value)}
            className="border p-2 bg-gray-200 dark:bg-gray-800 text-black dark:text-white"
          >
            <option value="" disabled>Select Book</option>
            {booksOfTheBible.map((bookName) => (
              <option key={bookName} value={bookName}>
                {bookName}
              </option>
            ))}
          </select>
          <select
            value={chapter}
            onChange={(e) => setChapter(e.target.value)}
            className="border p-2 bg-gray-200 dark:bg-gray-800 text-black dark:text-white"
            disabled={!book}
          >
            <option value="" disabled>Select Chapter</option>
            {book && Array.from({ length: chaptersPerBook[book] }, (_, i) => i + 1).map((chapterNumber) => (
              <option key={chapterNumber} value={chapterNumber}>
                {chapterNumber}
              </option>
            ))}
          </select>
          <button onClick={fetchVersesAndSummary} className="bg-blue-500 text-white p-2">
            Fetch
          </button>
        </div>
        {verses && (
          <div>
            {verses.split("\n\n").map((paragraph, index) => (
              <p key={index} className="mb-4">{paragraph}</p>
            ))}
          </div>
        )}
        {summary && (
          <div>
            <h2 className="text-xl font-semibold">Summary</h2>
            <p>{summary}</p>
          </div>
        )}
      </main>
    </div>
  );
}