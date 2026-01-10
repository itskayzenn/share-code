"use client";
import { useState } from 'react';
import Link from 'next/link';

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  
  // State untuk form input code
  const [title, setTitle] = useState("");
  const [lang, setLang] = useState("javascript");
  const [codeSnippet, setCodeSnippet] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    // Mengecek password dengan Environment Variable
    if (password === process.env.NEXT_PUBLIC_ADMIN_SECRET) {
      setIsAuthenticated(true);
    } else {
      alert("Access Denied: You are not the developer!");
    }
  };

  const handleSubmitCode = (e) => {
    e.preventDefault();
    alert("Fitur simpan: Di Vercel, Anda perlu menyambungkan Database (Supabase/Firebase) agar data tersimpan permanen. Saat ini hanya demo UI.");
    // Logika simpan ke database akan ditaruh di sini
    console.log({ title, lang, codeSnippet });
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center p-4">
        <h1 className="text-xl text-white mb-4 font-mono">Developer Access Protocol</h1>
        <form onSubmit={handleLogin} className="flex flex-col gap-3 w-full max-w-sm">
          <input 
            type="password" 
            placeholder="Enter Secret Key" 
            className="p-3 bg-gray-900 border border-gray-700 text-white rounded focus:outline-none focus:border-blue-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white py-2 rounded transition font-bold">
            Unlock
          </button>
          <Link href="/" className="text-center text-gray-500 text-sm mt-4 hover:underline">
            ← Back to Public View
          </Link>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-gray-200 p-6 font-mono">
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-green-500">Admin Dashboard</h1>
          <button onClick={() => setIsAuthenticated(false)} className="text-sm text-red-400 hover:text-red-300">
            Lock Access
          </button>
        </div>

        <form onSubmit={handleSubmitCode} className="flex flex-col gap-4 bg-gray-900 p-6 rounded-lg border border-gray-800">
          <div>
            <label className="block text-sm mb-2">Title</label>
            <input 
              type="text" 
              className="w-full bg-gray-950 border border-gray-700 p-2 rounded text-white"
              value={title} onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          
          <div>
            <label className="block text-sm mb-2">Language</label>
            <select 
              className="w-full bg-gray-950 border border-gray-700 p-2 rounded text-white"
              value={lang} onChange={(e) => setLang(e.target.value)}
            >
              <option value="javascript">JavaScript</option>
              <option value="python">Python</option>
              <option value="html">HTML</option>
              <option value="css">CSS</option>
              <option value="cpp">C++</option>
            </select>
          </div>

          <div>
            <label className="block text-sm mb-2">Code Snippet</label>
            <textarea 
              rows="8"
              className="w-full bg-gray-950 border border-gray-700 p-2 rounded text-white font-mono text-sm"
              value={codeSnippet} onChange={(e) => setCodeSnippet(e.target.value)}
            ></textarea>
          </div>

          <button type="submit" className="bg-green-600 hover:bg-green-700 text-white py-2 rounded mt-2 font-bold">
            Share Code
          </button>
        </form>
      </div>
    </div>
  );
              }
              
