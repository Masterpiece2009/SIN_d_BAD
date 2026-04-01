import React, { useState } from 'react';
import { Film, Search, PlayCircle, ArrowRight, Loader2 } from 'lucide-react';

interface MovieResult {
  identifier: string;
  title: string;
  year?: string;
  downloads?: number;
}

export default function Movies() {
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<MovieResult[]>([]);
  const [selectedMovie, setSelectedMovie] = useState<MovieResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsSearching(true);
    setError(null);
    setSelectedMovie(null);

    try {
      // Search archive.org for movies/videos
      const searchQuery = `${query} AND (mediatype:movies OR mediatype:video)`;
      const url = `https://archive.org/advancedsearch.php?q=${encodeURIComponent(searchQuery)}&fl[]=identifier,title,year,downloads&sort[]=downloads+desc&rows=20&page=1&output=json`;
      
      const res = await fetch(url);
      if (!res.ok) throw new Error('Network response was not ok');
      
      const data = await res.json();
      if (data.response && data.response.docs) {
        setResults(data.response.docs);
        if (data.response.docs.length === 0) {
          setError('لم يتم العثور على نتائج. جرب كلمات بحث مختلفة (يفضل باللغة الإنجليزية).');
        }
      } else {
        throw new Error('Invalid data format');
      }
    } catch (err) {
      console.error(err);
      setError('حدث خطأ أثناء البحث. يرجى المحاولة مرة أخرى.');
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300" dir="rtl">
      <div className="bg-zinc-900 p-6 rounded-2xl shadow-lg border border-zinc-800">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-orange-500/10 p-3 rounded-full text-orange-500">
            <Film size={24} />
          </div>
          <div>
            <h2 className="text-xl font-black text-zinc-100">الأفلام والوثائقيات</h2>
            <p className="text-zinc-400 text-sm">شاهد محتوى مجاني وقانوني من مكتبة Archive.org</p>
          </div>
        </div>

        {selectedMovie ? (
          <div className="space-y-4 animate-in slide-in-from-bottom-4">
            <button
              onClick={() => setSelectedMovie(null)}
              className="flex items-center gap-2 text-zinc-400 hover:text-orange-500 transition-colors mb-4"
            >
              <ArrowRight size={20} />
              <span>العودة للنتائج</span>
            </button>
            
            <div className="aspect-video w-full bg-black rounded-xl overflow-hidden border border-zinc-800 shadow-2xl">
              <iframe
                src={`https://archive.org/embed/${selectedMovie.identifier}`}
                width="100%"
                height="100%"
                frameBorder="0"
                allowFullScreen
                title={selectedMovie.title}
                className="w-full h-full"
              ></iframe>
            </div>
            
            <h3 className="text-xl font-bold text-zinc-100 mt-4">{selectedMovie.title}</h3>
            {selectedMovie.year && <p className="text-zinc-400 text-sm">سنة الإصدار: {selectedMovie.year}</p>}
          </div>
        ) : (
          <>
            <form onSubmit={handleSearch} className="flex gap-2 mb-6">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="ابحث عن فيلم (يفضل بالإنجليزية)..."
                className="flex-1 bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-zinc-100 focus:outline-none focus:border-orange-500 transition-colors"
              />
              <button
                type="submit"
                disabled={isSearching || !query.trim()}
                className="bg-orange-600 text-white px-6 py-3 rounded-xl hover:bg-orange-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 font-bold shadow-[0_0_15px_rgba(249,115,22,0.3)]"
              >
                {isSearching ? <Loader2 size={20} className="animate-spin" /> : <Search size={20} />}
                <span className="hidden sm:inline">بحث</span>
              </button>
            </form>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-xl mb-6 text-sm">
                {error}
              </div>
            )}

            {results.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-lg font-bold text-zinc-100 mb-4 flex items-center gap-2">
                  <PlayCircle size={18} className="text-orange-500" />
                  نتائج البحث
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {results.map((movie) => (
                    <button
                      key={movie.identifier}
                      onClick={() => setSelectedMovie(movie)}
                      className="flex items-start gap-4 bg-zinc-950 p-3 rounded-xl border border-zinc-800 hover:border-orange-500/50 transition-colors text-right group w-full"
                    >
                      <div className="w-20 h-28 bg-zinc-900 rounded-lg overflow-hidden flex-shrink-0 relative">
                        <img 
                          src={`https://archive.org/services/img/${movie.identifier}`} 
                          alt={movie.title}
                          className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://via.placeholder.com/150x200?text=No+Image';
                          }}
                        />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <PlayCircle size={30} className="text-white" />
                        </div>
                      </div>
                      <div className="flex-1 py-1">
                        <h4 className="font-bold text-zinc-200 group-hover:text-orange-500 transition-colors line-clamp-2 text-sm mb-1">
                          {movie.title}
                        </h4>
                        {movie.year && (
                          <p className="text-xs text-zinc-500 mb-1">{movie.year}</p>
                        )}
                        {movie.downloads && (
                          <p className="text-xs text-zinc-600">{movie.downloads.toLocaleString()} مشاهدة</p>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
