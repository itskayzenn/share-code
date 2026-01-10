"use client";
import { useState } from 'react';
import { initialCodes } from '@/lib/data';
import Socials from '@/components/Socials';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import Link from 'next/link';

export default function Home() {
  // Dalam real app, gunakan useEffect untuk fetch data dari API/Database
  const [codes] = useState(initialCodes);

  return (
    <main className="min-h-screen bg-gray-950 text-gray-200 p-6 font-mono">
      <nav className="flex justify-between items-center mb-10 max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-blue-500">DevShare_</h1>
        <Link href="/admin" className="text-sm bg-gray-800 px-3 py-1 rounded hover:bg-gray-700 transition">
          Access Developer
        </Link>
      </nav>

      <div className="max-w-4xl mx-auto space-y-8">
        {codes.map((item) => (
          <div key={item.id} className="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden">
            <div className="bg-gray-800 px-4 py-2 flex justify-between items-center">
              <span className="font-semibold text-white">{item.title}</span>
              <span className="text-xs text-gray-400">{item.language} • {item.date}</span>
            </div>
            <SyntaxHighlighter 
              language={item.language} 
              style={vscDarkPlus}
              customStyle={{ margin: 0, padding: '1.5rem', background: 'transparent' }}
            >
              {item.code}
            </SyntaxHighlighter>
          </div>
        ))}
      </div>

      <Socials />
    </main>
  );
  }
  
