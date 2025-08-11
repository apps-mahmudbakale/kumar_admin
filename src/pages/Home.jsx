import initSqlJs from 'sql.js';
import { useEffect, useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import HomeLogo from '../assets/HomeLogo2.png'; // change as needed

const Home = () => {
  const [db, setDb] = useState(null);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [selectedWord, setSelectedWord] = useState(null);
  const [definition, setDefinition] = useState("");

  // Load SQLite database
  useEffect(() => {
    const loadDatabase = async () => {
      const SQL = await initSqlJs({
        locateFile: file => `https://sql.js.org/dist/${file}`
      });

      const response = await fetch("/dictionary.db");
      const buffer = await response.arrayBuffer();
      const db = new SQL.Database(new Uint8Array(buffer));
      setDb(db);
    };

    loadDatabase();
  }, []);

  useEffect(() => {
    if (query.length > 1 && db) {
      const stmt = db.prepare("SELECT word FROM words WHERE word LIKE ? LIMIT 10");
      stmt.bind([`%${query}%`]);

      const rows = [];
      while (stmt.step()) {
        rows.push(stmt.getAsObject());
      }

      stmt.free();
      setResults(rows);
    } else {
      setResults([]);
    }
  }, [query, db]);

  const fetchDefinition = (word) => {
    if (!db) return;

    const stmt = db.prepare("SELECT definition FROM words WHERE word = ?");
    stmt.bind([word]);

    if (stmt.step()) {
      const row = stmt.getAsObject();
      setDefinition(row.definition);
    } else {
      setDefinition("Definition not found.");
    }

    stmt.free();
    setSelectedWord(word);
    setQuery("");
    setResults([]);
  };

  return (
    <div className="flex flex-col items-center mt-[50px] justify-center min-h-screen bg-gray-100 px-4">
      <div className="text-center w-full max-w-2xl">
        <img src={HomeLogo} alt="Logo" className="w-[500px] mx-auto mb-4" />

        <h1 className="text-3xl font-bold text-red-500 sm:text-4xl">
          <span className="block text-lg text-gray-600">(Lexicon Pharmaceuticae McGulmae)</span>
        </h1>
        <p className="text-xl italic font-medium text-gray-600">
          Nigeria’s First Pharmaceutical Dictionary
        </p>
        <p className="text-xl font-medium italic text-blue-600">2,500+ definitions</p>

        <div className="relative mt-6 w-full">
          <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Enter word"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && query.trim()) {
                fetchDefinition(query.trim());
              }
            }}
            className="w-full py-3 pl-12 pr-4 bg-white rounded-lg shadow-md focus:outline-none text-lg"
          />
        </div>

        {results.length > 0 && (
          <ul className="mt-2 bg-white shadow-md rounded-lg max-h-60 overflow-auto w-full">
            {results.map((item, index) => (
              <li
                key={index}
                className="p-2 border-b hover:bg-gray-200 cursor-pointer"
                onClick={() => fetchDefinition(item.word)}
              >
                {item.word}
              </li>
            ))}
          </ul>
        )}

        {selectedWord && (
          <div className="mt-4 bg-white shadow-md rounded-lg p-4 text-gray-800">
            <h2 className="text-2xl font-bold text-red-500">{selectedWord}</h2>
            <p className="mt-2 text-lg">{definition}</p>
          </div>
        )}

        {/* Publication Info */}
        <div className="mt-8 bg-white shadow-lg rounded-lg p-4 sm:p-6 max-w-lg mx-auto text-sm sm:text-base text-gray-700 text-center leading-relaxed">
          <p>
            <strong>First published in Nigeria in 2025</strong>
          </p>
          <p>
            ISBN: <span className="font-medium">978-978-774-985-5</span>
          </p>
          <p>National Library of Nigeria Cataloguing-in-Publication Data</p>
          <p>
            A catalog record for this book is available from the National
            Library of Nigeria.
          </p>
          <p className="mt-2 text-gray-800 font-semibold">
            © Dr. Kabiru Abubakar Gulma, 2025. All rights reserved!
          </p>
        </div>
      </div>
    </div>
  );
};

export default Home;
