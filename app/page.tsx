"use client";

import { useState } from "react";

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
  "1 Peter": 5, "2 Peter": 3, "1 John": 5, "2 John": 1, "3 John": 1, "Jude": 1, "Revelation": 22,
};

const expertLevels = ["Beginner", "Standard"];
const versions = ["ESV", "KJV"];

export default function Home() {
  const [book, setBook] = useState<string>("");
  const [chapter, setChapter] = useState<string>("");
  const [selectedBook, setSelectedBook] = useState<string>("");
  const [selectedChapter, setSelectedChapter] = useState<string>("");
  const [summary, setSummary] = useState<string>("");
  const [verses, setVerses] = useState<string>("");
  const [showIntro, setShowIntro] = useState<boolean>(true);
  const [expertLevel, setExpertLevel] = useState<string>("Standard");
  const [version, setVersion] = useState<string>("KJV");
  const [loadingVerses, setLoadingVerses] = useState<boolean>(false);
  const [loadingSummary, setLoadingSummary] = useState<boolean>(false);

  const fetchVersesAndSummary = async (book: string, chapter: string, expertLevel: string, version: string) => {
    setLoadingVerses(true);
    setLoadingSummary(false);
    try {
      const query = `${book} ${chapter}`;
      const response = await fetch(`/api/${version.toLowerCase()}?q=${encodeURIComponent(query)}`);
      const data = await response.json();

      if (data.passages && data.passages.length > 0) {
        const versesText = data.passages.join(" ");
        setVerses(versesText);
        setLoadingVerses(false);
        setLoadingSummary(true);

        const summaryResponse = await fetch('/api/ai', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ text: versesText, expertLevel }),
        });
        const summaryData = await summaryResponse.json();
        setSummary(summaryData.summary);
        setLoadingSummary(false);
      } else {
        throw new Error("Invalid data structure received from the API");
      }
    } catch (error) {
      console.error("Error fetching verses and summary:", error);
      setVerses("Error fetching verses. Please try again.");
      setSummary("");
      setLoadingVerses(false);
      setLoadingSummary(false);
    }
  };
  const handleFetchClick = () => {
    setSelectedBook(book);
    setSelectedChapter(chapter);
    fetchVersesAndSummary(book, chapter, expertLevel, version);
    setShowIntro(false);
  };

  return (
    <div className="flex flex-col min-h-screen max-w-5xl mx-auto">
      <main className="flex flex-col gap-8 items-center flex-grow p-8 pb-20 sm:p-20 font-[family-name:var(--font-geist-sans)]">
        <h1 className="text-4xl font-bold">Scripture Scope</h1>
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
          <select
            value={expertLevel}
            onChange={(e) => setExpertLevel(e.target.value)}
            className="border p-2 bg-gray-200 dark:bg-gray-800 text-black dark:text-white"
          >
            {expertLevels.map((level) => (
              <option key={level} value={level}>
                {level}
              </option>
            ))}
          </select>
          <select
            value={version}
            onChange={(e) => setVersion(e.target.value)}
            className="border p-2 bg-gray-200 dark:bg-gray-800 text-black dark:text-white"
          >
            {versions.map((version) => (
              <option key={version} value={version}>
                {version}
              </option>
            ))}
          </select>
          <button onClick={handleFetchClick} className="bg-blue-500 text-white p-2">
            Fetch
          </button>
        </div>
        {loadingVerses && (
          <div className="mt-4 text-center">
            <p className="text-lg">Loading verses...</p>
          </div>
        )}
        {!loadingVerses && verses && (
          <div>
            <h2 className="text-xl font-semibold">{selectedBook} {selectedChapter}</h2>
            <div className="mt-2">
              {verses.split("\n\n").map((paragraph, index) => (
                <p key={index} className="mb-4">{paragraph}</p>
              ))}
            </div>
          </div>
        )}
        {!loadingVerses && loadingSummary && (
          <div className="mt-4 text-center">
            <p className="text-lg">Loading summary...</p>
          </div>
        )}
        {!loadingVerses && !loadingSummary && summary && (
          <div>
            <h2 className="text-xl font-semibold">Summary</h2>
            <div className="mt-4">
              <p>{summary}</p>
            </div>
          </div>
        )}
        {showIntro && (
          <div className="mt-4 text-center">
            <p className="text-lg">
            Scripture Scope guides you through the Bible by letting you choose a book, chapter, and difficulty level, then providing relevant verses with a summary.</p>
            <p className="mt-12 text-md italic">
              Disclaimer: This summary provided by Scripture Scope has been generated by AI and does not represent the opinions, interpretations, or conclusions of the author
              of the original source or the developer of this application. The content is provided &quot;as is&quot; for informational purposes only, without
              any warranties, express or implied, regarding its accuracy, completeness, or reliability.
            </p>
          </div>
        )}
      </main>
      <footer className="pb-4 w-full mt-12">
        <div className="w-full px-4 flex justify-between items-center">
          <p className="text-black dark:text-white">
            © 2025 <a href="https://www.javanmiller.com">Javan Miller</a>
          </p>
          <div className="text-black dark:text-white">
            <a href="https://www.javanmiller.com/blog/ScriptureScope">Learn More</a>
          </div>
        </div>
      </footer>
    </div>
  );
}