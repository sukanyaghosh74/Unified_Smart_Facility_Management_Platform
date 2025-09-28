import React, { useState } from 'react';

const TABS = ['Access', 'Climate', 'IT Infra'];

export default function App() {
  const [tab, setTab] = useState('Access');

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="p-4 bg-white shadow flex justify-between items-center">
        <h1 className="text-xl font-bold">USFMP Dashboard</h1>
        <div>
          {/* Placeholder for user/admin menu */}
        </div>
      </header>
      <nav className="flex space-x-4 p-4 bg-gray-100">
        {TABS.map((t) => (
          <button
            key={t}
            className={`px-4 py-2 rounded ${tab === t ? 'bg-blue-600 text-white' : 'bg-white text-gray-700'}`}
            onClick={() => setTab(t)}
          >
            {t}
          </button>
        ))}
      </nav>
      <main className="p-4">
        {tab === 'Access' && <div>Access Control Module (Smart V-Pass)</div>}
        {tab === 'Climate' && <div>Climate Monitoring Module (Smart Airsenz)</div>}
        {tab === 'IT Infra' && <div>IT Infra Monitoring Module (IT Managed Services)</div>}
      </main>
    </div>
  );
}
