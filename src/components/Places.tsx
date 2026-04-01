import React, { useState } from 'react';
import { MapPin, Search, Loader2, Navigation, ExternalLink } from 'lucide-react';

export default function Places() {
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<{ title: string; uri: string }[]>([]);
  const [aiText, setAiText] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    // Open Google Maps search in a new tab
    const searchUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
    window.open(searchUrl, '_blank');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300" dir="rtl">
      <div className="bg-zinc-900 p-6 rounded-2xl shadow-lg border border-zinc-800">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-orange-500/10 p-3 rounded-full text-orange-500">
            <MapPin size={24} />
          </div>
          <div>
            <h2 className="text-xl font-black text-zinc-100">البحث عن أماكن</h2>
            <p className="text-zinc-400 text-sm">ابحث عن مطاعم، مقاهي، أو محلات قريبة منك (عبر خرائط جوجل)</p>
          </div>
        </div>

        <form onSubmit={handleSearch} className="flex gap-2 mb-6">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="مثال: مطعم بيتزا، صيدلية، سوبر ماركت..."
            className="flex-1 bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-zinc-100 focus:outline-none focus:border-orange-500 transition-colors"
          />
          <button
            type="submit"
            disabled={!query.trim()}
            className="bg-orange-600 text-white px-6 py-3 rounded-xl hover:bg-orange-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 font-bold shadow-[0_0_15px_rgba(249,115,22,0.3)]"
          >
            <Search size={20} />
            <span className="hidden sm:inline">بحث في الخرائط</span>
          </button>
        </form>
      </div>
    </div>
  );
}
