import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import initSqlJs from "sql.js";
import { FaArrowLeft, FaRegBookmark, FaPlay } from "react-icons/fa";

export default function Definition() {
  const { word } = useParams();
  const [definition, setDefinition] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadDatabase = async () => {
      try {
        const SQL = await initSqlJs({
          locateFile: file => `https://sql.js.org/dist/${file}`,
        });

        const response = await fetch("/dictionary.db");
        const buffer = await response.arrayBuffer();
        const db = new SQL.Database(new Uint8Array(buffer));

        const stmt = db.prepare("SELECT * FROM words WHERE word = ?");
        stmt.bind([word]);

        if (stmt.step()) {
          const row = stmt.getAsObject();
          setDefinition(row);
        } else {
          setDefinition(null);
        }

        stmt.free();
      } catch (err) {
        console.error("Error loading SQLite DB:", err);
        setDefinition(null);
      } finally {
        setLoading(false);
      }
    };

    loadDatabase();
  }, [word]);

  if (loading) {
    return <div className="text-center p-10 text-lg">Loading...</div>;
  }

  if (!definition) {
    return <div className="text-center p-10 text-lg">Definition not found.</div>;
  }

  return (
    <div className="flex justify-center items-start min-h-screen bg-gray-100 pt-12">
      <div className="w-full max-w-2xl p-6">
        {/* Top Icons */}
        <div className="flex justify-between items-center mb-6">
          <FaArrowLeft onClick={() => navigate(-1)} className="text-gray-600 cursor-pointer text-2xl" />
          <FaRegBookmark className="text-gray-600 cursor-pointer text-2xl" />
        </div>

        {/* Header Card */}
        <div className="relative bg-gradient-to-r from-indigo-900 to-indigo-700 p-6 rounded-2xl shadow-xl flex items-center justify-between">
          <h2 className="text-white font-bold text-2xl">{definition.word}</h2>
          <div className="bg-red-400 p-3 rounded-full">
            <FaPlay className="text-white text-lg" />
          </div>
        </div>

        {/* Definition Content */}
        <div className="bg-white p-8 mt-6 rounded-2xl shadow-xl">
          <h3 className="font-semibold text-gray-900 text-xl">{definition.word}</h3>
          <p className="text-gray-600 mt-2">{definition.definition}</p>
        </div>
      </div>
    </div>
  );
}
