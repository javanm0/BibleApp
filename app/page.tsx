"use client";

import React, { useState } from "react";
import { Search, Book, Settings, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import Footer from "../components/ui/footer";

const booksOfTheBible = [
  "Genesis", "Exodus", "Leviticus", "Numbers", "Deuteronomy", "Joshua", "Judges", "Ruth", "1 Samuel", "2 Samuel",
  "1 Kings", "2 Kings", "1 Chronicles", "2 Chronicles", "Ezra", "Nehemiah", "Esther", "Job", "Psalms", "Proverbs",
  "Ecclesiastes", "Song of Solomon", "Isaiah", "Jeremiah", "Lamentations", "Ezekiel", "Daniel", "Hosea", "Joel",
  "Amos", "Obadiah", "Jonah", "Micah", "Nahum", "Habakkuk", "Zephaniah", "Haggai", "Zechariah", "Malachi",
  "Matthew", "Mark", "Luke", "John", "Acts", "Romans", "1 Corinthians", "2 Corinthians", "Galatians", "Ephesians",
  "Philippians", "Colossians", "1 Thessalonians", "2 Thessalonians", "1 Timothy", "2 Timothy", "Titus", "Philemon",
  "Hebrews", "James", "1 Peter", "2 Peter", "1 John", "2 John", "3 John", "Jude", "Revelation"
];

const chaptersPerBook = {
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

const expertLevels = ["Beginner", "Standard"];
const versions = ["ESV", "KJV"];

export default function Home() {
  const [book, setBook] = useState("");
  const [chapter, setChapter] = useState("");
  const [selectedBook, setSelectedBook] = useState("");
  const [selectedChapter, setSelectedChapter] = useState("");
  const [summary, setSummary] = useState("");
  const [verses, setVerses] = useState("");
  const [showIntro, setShowIntro] = useState(true);
  const [expertLevel, setExpertLevel] = useState("Standard");
  const [version, setVersion] = useState("KJV");
  const [loadingVerses, setLoadingVerses] = useState(false);
  const [loadingSummary, setLoadingSummary] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showScriptureSelection, setShowScriptureSelection] = useState(false);

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
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: versesText, expertLevel, version }),
        });
        const summaryData = await summaryResponse.json();
        setSummary(summaryData.summary);
        setLoadingSummary(false);
      }
    } catch (error) {
      console.error("Error:", error);
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
    setShowSettings(false);
  };

  const handleGetStartedClick = () => {
    setShowScriptureSelection(true);
    setShowIntro(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleTitleClick = () => {
    setShowScriptureSelection(false);
    setShowIntro(true);
    setBook("");
    setChapter("");
    setSelectedBook("");
    setSelectedChapter("");
    setSummary("");
    setVerses("");
    setShowSettings(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="flex-grow max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <header className="text-center mb-8 md:mb-12 relative">
          <div className="flex items-center justify-center gap-3 mb-2">
            <h1
              className="text-5xl sm:text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent cursor-pointer"
              onClick={handleTitleClick}
            >
              Scripture Scope
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400 text-lg">Explore and understand scripture with AI-powered insights</p>
        </header>

        {/* Main Search Card */}
        {showScriptureSelection && (
          <Card className="max-w-xl mx-auto mb-12 shadow-lg">
            <CardContent className="p-6">
              <div className="flex flex-col gap-4">
                {/* Book and Chapter Selection */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <select
                    value={book}
                    onChange={(e) => setBook(e.target.value)}
                    className="w-full max-w-xs px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors text-base"
                  >
                    <option value="" disabled>Select Book</option>
                    {booksOfTheBible.map((bookName) => (
                      <option key={bookName} value={bookName}>{bookName}</option>
                    ))}
                  </select>
                  
                  <select
                    value={chapter}
                    onChange={(e) => setChapter(e.target.value)}
                    className="w-full max-w-xs px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors text-base"
                    disabled={!book}
                  >
                    <option value="" disabled>Select Chapter</option>
                    {book && Array.from({ length: chaptersPerBook[book as keyof typeof chaptersPerBook] }, (_, i) => (
                      <option key={i + 1} value={i + 1}>{i + 1}</option>
                    ))}
                  </select>
                </div>

                {/* Search Button and Settings Icon */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleFetchClick}
                    disabled={!book || !chapter}
                    className="w-full px-5 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg font-medium flex items-center justify-center gap-2 transition-colors text-base"
                  >
                    <Search className="w-5 h-5" />
                    Search Scripture
                  </button>
                  <button
                    onClick={() => setShowSettings(!showSettings)}
                    className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    title="Settings"
                  >
                    <Settings className="w-5 h-5" />
                  </button>
                </div>

                {/* Settings Panel */}
                {showSettings && (
                  <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <select
                        value={expertLevel}
                        onChange={(e) => setExpertLevel(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors text-base"
                      >
                        {expertLevels.map((level) => (
                          <option key={level} value={level}>{level}</option>
                        ))}
                      </select>
                      
                      <select
                        value={version}
                        onChange={(e) => setVersion(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors text-base"
                      >
                        {versions.map((v) => (
                          <option key={v} value={v}>{v}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Content Area */}
        <div className="max-w-4xl mx-auto">
          {showIntro ? (
            <Card className="text-center">
              <CardContent className="p-8 md:p-12">
                <Book className="w-20 h-20 mx-auto mb-8 text-blue-600 dark:text-blue-400" />
                <h2 className="text-3xl font-semibold mb-6">Welcome to Scripture Scope</h2>
                <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
                  Explore the Bible with our guided journey. Select a book and chapter to begin your study with verse-by-verse reading and AI-powered summaries.
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 italic max-w-2xl mx-auto">
                  Note: Summaries are AI-generated for educational purposes only. Please refer to trusted theological sources for authoritative interpretation.
                </p>
                <button
                  onClick={handleGetStartedClick}
                  className="mt-6 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors text-lg"
                >
                  Get Started
                </button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-8">
              {loadingVerses && (
                <div className="flex items-center justify-center p-8">
                  <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                </div>
              )}

              {!loadingVerses && verses && (
                <Card className="shadow-lg">
                  <CardHeader className="border-b px-6 py-4">
                    <CardTitle className="text-2xl font-semibold">
                      {selectedBook} {selectedChapter}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    {verses.split("\n\n").map((paragraph, index) => (
                      <p key={index} className="mb-6 leading-relaxed text-lg">{paragraph}</p>
                    ))}
                  </CardContent>
                </Card>
              )}

              {loadingSummary && (
                <div className="flex items-center justify-center p-8">
                  <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                </div>
              )}

              {!loadingVerses && !loadingSummary && summary && (
                <Card className="shadow-lg">
                  <CardHeader className="border-b px-6 py-4">
                    <CardTitle className="text-2xl font-semibold">Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <p className="leading-relaxed text-lg">{summary}</p>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}