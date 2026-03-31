import React, { useState, useRef, useEffect } from 'react';
import { BookOpen, Dumbbell, Apple, Sun, Download, X, Volume2, VolumeX, Music, Timer, Play, Pause, RotateCcw, Quote, Moon, Compass, Search, Loader2 } from 'lucide-react';
import Quran from './components/Quran';
import Adhkar from './components/Adhkar';
import Workout from './components/Workout';
import Nutrition from './components/Nutrition';
import PrayerTimes from './components/PrayerTimes';

const defaultTracks = [
  { id: 'chill_1', name: 'موسيقى بديلة 1', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' },
  { id: 'chill_2', name: 'موسيقى بديلة 2', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3' },
];

const quotes = [
  "Consistency is what transforms average into excellence.",
  "A healthy mind in a healthy body.",
  "You get what you work for, not what you wish for.",
  "The only bad workout is the one that didn't happen.",
  "Time is a sword; if you don't cut it, it cuts you.",
  "Discipline is doing what needs to be done, even if you don't want to do it.",
  "Push yourself, because no one else is going to do it for you."
];

export default function App() {
  const [activeTab, setActiveTab] = useState('workout');
  const [showInstallModal, setShowInstallModal] = useState(false);
  const [showMusicModal, setShowMusicModal] = useState(false);
  const [customTracks, setCustomTracks] = useState<{id: string, name: string, url: string}[]>(() => {
    const saved = localStorage.getItem('customTracks');
    return saved ? JSON.parse(saved) : [];
  });
  const tracks = [...defaultTracks, ...customTracks];

  const [selectedTrackId, setSelectedTrackId] = useState(() => {
    const saved = localStorage.getItem('selectedTrackId');
    const allTracks = [...defaultTracks, ...(localStorage.getItem('customTracks') ? JSON.parse(localStorage.getItem('customTracks')!) : [])];
    return allTracks.some(t => t.id === saved) ? saved! : defaultTracks[0].id;
  });
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(() => {
    const saved = localStorage.getItem('audioVolume');
    return saved ? parseFloat(saved) : 0.5;
  });
  const [showTimerModal, setShowTimerModal] = useState(false);
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [audioError, setAudioError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<{id: string, name: string, url: string}[]>([]);
  const audioRef = useRef<HTMLAudioElement>(null);

  const [isLightMode, setIsLightMode] = useState(() => {
    const saved = localStorage.getItem('lightMode');
    return saved ? saved === 'true' : false;
  });

  useEffect(() => {
    if (isLightMode) {
      document.documentElement.classList.add('light-mode');
    } else {
      document.documentElement.classList.remove('light-mode');
    }
    localStorage.setItem('lightMode', isLightMode.toString());
  }, [isLightMode]);

  useEffect(() => {
    setQuoteIndex(Math.floor(Math.random() * quotes.length));
  }, []);

  useEffect(() => {
    let interval: number | null = null;
    if (isTimerActive && timeLeft > 0) {
      interval = window.setInterval(() => {
        setTimeLeft(t => t - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsTimerActive(false);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerActive, timeLeft]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);

    return () => {
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
    };
  }, []);

  const isInitialMount = useRef(true);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    if (isPlaying) {
      audio.play().catch((err) => {
        console.log("Audio playback prevented:", err);
        setIsPlaying(false);
        setAudioError("تعذر تشغيل المقطع. قد يكون الرابط معطلاً.");
      });
    }
  }, [selectedTrackId]);

  const toggleAudio = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (audio.paused) {
      setAudioError(null);
      audio.play().catch((err) => {
        console.log("Audio playback prevented:", err);
        setIsPlaying(false);
        setAudioError("تعذر تشغيل المقطع. قد يكون الرابط معطلاً.");
      });
    } else {
      audio.pause();
    }
  };

  const handleTrackSelect = (id: string) => {
    setSelectedTrackId(id);
    setAudioError(null);
    localStorage.setItem('selectedTrackId', id);
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    setAudioError(null);
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}`);
      if (!res.ok) throw new Error('Search failed');
      const data = await res.json();
      setSearchResults(data.results || []);
    } catch (err) {
      setAudioError('فشل البحث. يرجى المحاولة مرة أخرى.');
    } finally {
      setIsSearching(false);
    }
  };

  const handleAddTrack = async (track: {id: string, name: string, url: string}) => {
    setIsSearching(true);
    setAudioError(null);
    try {
      const res = await fetch(`/api/song/${track.id}`);
      if (!res.ok) throw new Error('Failed to fetch song URL');
      const data = await res.json();
      
      if (data.url) {
        const newTrack = { id: track.id, name: track.name, url: data.url };
        const updatedTracks = [...customTracks.filter(t => t.id !== track.id), newTrack];
        setCustomTracks(updatedTracks);
        localStorage.setItem('customTracks', JSON.stringify(updatedTracks));
        handleTrackSelect(track.id);
        setSearchResults([]);
        setSearchQuery('');
        
        // Auto-play the newly added track
        setTimeout(() => {
          if (audioRef.current) {
            audioRef.current.play().catch(err => {
               console.log("Auto-play prevented:", err);
               setAudioError("تعذر تشغيل المقطع تلقائياً.");
            });
          }
        }, 100);
      } else {
        throw new Error('No audio URL found');
      }
    } catch (err) {
      setAudioError('تعذر تحميل هذه الأغنية.');
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 pb-20 text-zinc-100 selection:bg-orange-500/30 font-sans">
      <header className="bg-zinc-900/80 backdrop-blur-md shadow-lg sticky top-0 z-10 border-b border-zinc-800">
        <div className="px-4 py-3 max-w-2xl mx-auto flex flex-col gap-3">
          <div className="flex justify-between items-center" dir="rtl">
            <h1 className="text-xl font-black text-zinc-100 tracking-wide flex items-center gap-2">
              <div className="w-8 h-8 bg-zinc-600 rounded-full flex items-center justify-center shrink-0">
                <img src="https://api.iconify.design/mdi:bat.svg?color=%2318181b" alt="Batman" className="w-5 h-5" />
              </div>
              روتيني اليومي
            </h1>
            <button 
              onClick={() => setShowInstallModal(true)}
              className="text-orange-500 hover:text-orange-400 flex items-center gap-1 bg-orange-500/10 px-3 py-1.5 rounded-full text-xs font-bold transition-colors border border-orange-500/20"
            >
              <Download size={16} />
              <span className="hidden sm:inline">تثبيت</span>
            </button>
          </div>
          
          <div className="flex items-center justify-center gap-2" dir="ltr">
            <button
              onClick={() => setIsLightMode(!isLightMode)}
              className="text-zinc-400 hover:text-orange-500 transition-colors bg-zinc-800/50 p-2 rounded-full border border-zinc-700/50 flex-1 flex justify-center max-w-[80px]"
              title="تغيير المظهر"
            >
              {isLightMode ? <Moon size={18} /> : <Sun size={18} />}
            </button>
            <button
              onClick={() => setShowTimerModal(true)}
              className={`transition-colors bg-zinc-800/50 p-2 rounded-full border border-zinc-700/50 flex-1 flex justify-center max-w-[80px] ${isTimerActive ? 'text-orange-500 animate-pulse' : 'text-zinc-400 hover:text-orange-500'}`}
              title="مؤقت التركيز"
            >
              <Timer size={18} />
            </button>
            <button
              onClick={() => setShowMusicModal(true)}
              className="text-zinc-400 hover:text-orange-500 transition-colors bg-zinc-800/50 p-2 rounded-full border border-zinc-700/50 flex-1 flex justify-center max-w-[80px]"
              title="اختر الموسيقى"
            >
              <Music size={18} />
            </button>
            <button
              onClick={toggleAudio}
              className={`transition-colors bg-zinc-800/50 p-2 rounded-full border border-zinc-700/50 flex-1 flex justify-center max-w-[80px] ${isPlaying ? 'text-orange-500' : 'text-zinc-400 hover:text-orange-500'}`}
              title="تشغيل/إيقاف الموسيقى"
            >
              {isPlaying ? <Volume2 size={18} /> : <VolumeX size={18} />}
            </button>
          </div>
        </div>
      </header>

      {/* Audio element for background music */}
      <audio ref={audioRef} loop src={tracks.find(t => t.id === selectedTrackId)?.url} />

      <main className="p-4 max-w-2xl mx-auto w-full">
        <div 
          key={quoteIndex} 
          className="bg-zinc-900/50 border border-zinc-800/50 rounded-2xl p-4 mb-6 flex items-center gap-4 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-700"
        >
          <div className="bg-orange-500/10 p-3 rounded-full text-orange-500 shrink-0 animate-pulse">
            <Quote size={20} />
          </div>
          <p className="text-zinc-300 text-sm font-medium leading-relaxed italic" dir="ltr">
            "{quotes[quoteIndex]}"
          </p>
        </div>

        {activeTab === 'quran' && <Quran />}
        {activeTab === 'adhkar' && <Adhkar />}
        {activeTab === 'workout' && <Workout />}
        {activeTab === 'nutrition' && <Nutrition />}
        {activeTab === 'prayer' && <PrayerTimes />}
      </main>

      <nav className="fixed bottom-0 w-full bg-zinc-900/95 backdrop-blur-md border-t border-zinc-800 flex justify-around items-center h-16 max-w-md mx-auto left-0 right-0 z-20 pb-safe shadow-[0_-10px_40px_rgba(0,0,0,0.5)] overflow-x-auto hide-scrollbar px-2">
        <NavItem icon={<Dumbbell size={24} />} label="التمارين" isActive={activeTab === 'workout'} onClick={() => setActiveTab('workout')} />
        <NavItem icon={<Apple size={24} />} label="التغذية" isActive={activeTab === 'nutrition'} onClick={() => setActiveTab('nutrition')} />
        <NavItem icon={<Sun size={24} />} label="الأذكار" isActive={activeTab === 'adhkar'} onClick={() => setActiveTab('adhkar')} />
        <NavItem icon={<BookOpen size={24} />} label="القرآن" isActive={activeTab === 'quran'} onClick={() => setActiveTab('quran')} />
        <NavItem icon={<Compass size={24} />} label="الصلاة" isActive={activeTab === 'prayer'} onClick={() => setActiveTab('prayer')} />
      </nav>

      {showMusicModal && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 max-w-sm w-full shadow-2xl relative animate-in zoom-in-95 duration-200">
            <button 
              onClick={() => setShowMusicModal(false)}
              className="absolute top-4 left-4 text-zinc-400 hover:text-zinc-200 bg-zinc-800 p-1 rounded-full transition-colors"
            >
              <X size={20} />
            </button>
            <div className="text-center mb-6">
              <div className="w-12 h-12 bg-orange-500/10 text-orange-500 rounded-full flex items-center justify-center mx-auto mb-4 border border-orange-500/20">
                <Music size={24} />
              </div>
              <h2 className="text-2xl font-bold text-zinc-100 mb-2">الموسيقى الخلفية</h2>
              <p className="text-zinc-400 text-sm mb-4">اختر المقطع المفضل لك للاستماع إليه أثناء التصفح</p>
              
              <form onSubmit={handleSearch} className="flex gap-2 mb-4" dir="rtl">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="ابحث عن أغنية (Albumaty)..."
                  className="flex-1 bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2 text-sm text-zinc-100 focus:outline-none focus:border-orange-500 transition-colors"
                />
                <button
                  type="submit"
                  disabled={isSearching || !searchQuery.trim()}
                  className="bg-orange-500 text-white p-2 rounded-xl hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-w-[40px]"
                >
                  {isSearching ? <Loader2 size={18} className="animate-spin" /> : <Search size={18} />}
                </button>
              </form>

              {audioError && (
                <p className="text-red-500 text-xs mb-4 bg-red-500/10 p-2 rounded-lg border border-red-500/20">
                  {audioError}
                </p>
              )}
            </div>
            
            <div className="space-y-2 max-h-60 overflow-y-auto pr-1 custom-scrollbar" dir="rtl">
              {searchResults.length > 0 ? (
                <div className="mb-4">
                  <h3 className="text-xs font-bold text-zinc-500 mb-2 px-2">نتائج البحث:</h3>
                  {searchResults.map(track => (
                    <button
                      key={track.id}
                      onClick={() => handleAddTrack(track)}
                      className="w-full text-right p-3 rounded-xl border border-zinc-800 bg-zinc-950/50 text-zinc-300 hover:bg-zinc-800 transition-all flex justify-between items-center mb-2"
                    >
                      <span className="font-bold text-sm truncate pr-2">{track.name}</span>
                      <Download size={16} className="text-orange-500 shrink-0" />
                    </button>
                  ))}
                </div>
              ) : null}

              <h3 className="text-xs font-bold text-zinc-500 mb-2 px-2">قائمتي:</h3>
              {tracks.map(track => {
                const isCustom = customTracks.some(t => t.id === track.id);
                return (
                  <div key={track.id} className="flex gap-2">
                    <button
                      onClick={() => handleTrackSelect(track.id)}
                      className={`flex-1 text-right p-3 rounded-xl border transition-all flex justify-between items-center ${
                        selectedTrackId === track.id 
                          ? 'bg-orange-500/20 border-orange-500/50 text-orange-500' 
                          : 'bg-zinc-950/50 border-zinc-800 text-zinc-300 hover:bg-zinc-800'
                      }`}
                    >
                      <span className="font-bold text-sm truncate pr-2">{track.name}</span>
                      {selectedTrackId === track.id && isPlaying && (
                        <Volume2 size={16} className="animate-pulse text-orange-500 shrink-0" />
                      )}
                    </button>
                    {isCustom && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          const updatedTracks = customTracks.filter(t => t.id !== track.id);
                          setCustomTracks(updatedTracks);
                          localStorage.setItem('customTracks', JSON.stringify(updatedTracks));
                          if (selectedTrackId === track.id) {
                            handleTrackSelect(defaultTracks[0].id);
                          }
                        }}
                        className="bg-red-500/10 text-red-500 p-3 rounded-xl border border-red-500/20 hover:bg-red-500/20 transition-colors flex items-center justify-center shrink-0"
                        title="حذف"
                      >
                        <X size={16} />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="mt-6 bg-zinc-950/50 p-4 rounded-xl border border-zinc-800">
              <div className="flex justify-between items-center mb-2">
                <label className="text-zinc-300 text-sm font-bold">مستوى الصوت</label>
                <span className="text-orange-500 text-xs font-bold">{Math.round(volume * 100)}%</span>
              </div>
              <input 
                type="range" 
                min="0" 
                max="1" 
                step="0.01" 
                value={volume}
                onChange={(e) => {
                  const newVol = parseFloat(e.target.value);
                  setVolume(newVol);
                  localStorage.setItem('audioVolume', newVol.toString());
                }}
                className="w-full accent-orange-500 h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer"
                dir="ltr"
              />
            </div>
          </div>
        </div>
      )}

      {showInstallModal && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 max-w-sm w-full shadow-2xl relative animate-in zoom-in-95 duration-200">
            <button 
              onClick={() => setShowInstallModal(false)}
              className="absolute top-4 left-4 text-zinc-400 hover:text-zinc-200 bg-zinc-800 p-1 rounded-full transition-colors"
            >
              <X size={20} />
            </button>
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-zinc-600 rounded-full flex items-center justify-center mx-auto mb-4 border border-zinc-500/20">
                <img src="https://api.iconify.design/mdi:bat.svg?color=%2318181b" alt="Batman" className="w-10 h-10" />
              </div>
              <h2 className="text-2xl font-bold text-zinc-100 mb-2">حفظ التطبيق على هاتفك</h2>
              <p className="text-zinc-400 text-sm leading-relaxed">
                يمكنك حفظ هذا التطبيق على شاشتك الرئيسية للوصول إليه بدون إنترنت في أي وقت!
              </p>
            </div>
            
            <div className="space-y-4 bg-zinc-950/50 p-4 rounded-xl text-sm text-zinc-300 border border-zinc-800/50">
              <div className="flex items-start gap-3">
                <div className="bg-zinc-800 w-6 h-6 rounded-full flex items-center justify-center font-bold text-orange-500 shadow-sm shrink-0 border border-zinc-700">1</div>
                <p><strong>في الآيفون (Safari):</strong> اضغط على زر المشاركة <span className="inline-block border border-zinc-700 bg-zinc-800 rounded px-1 text-xs mx-1">Share</span> ثم اختر <span className="font-bold text-zinc-100">"إضافة للشاشة الرئيسية"</span>.</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-zinc-800 w-6 h-6 rounded-full flex items-center justify-center font-bold text-orange-500 shadow-sm shrink-0 border border-zinc-700">2</div>
                <p><strong>في الأندرويد (Chrome):</strong> اضغط على القائمة (الثلاث نقاط) ثم اختر <span className="font-bold text-zinc-100">"إضافة للشاشة الرئيسية"</span>.</p>
              </div>
            </div>
            
            <button 
              onClick={() => setShowInstallModal(false)}
              className="w-full mt-6 bg-orange-600 text-white font-bold py-3 rounded-xl hover:bg-orange-500 transition-colors shadow-[0_0_20px_rgba(249,115,22,0.3)]"
            >
              حسناً، فهمت
            </button>
          </div>
        </div>
      )}

      {showTimerModal && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 max-w-sm w-full shadow-2xl relative animate-in zoom-in-95 duration-200">
            <button 
              onClick={() => setShowTimerModal(false)}
              className="absolute top-4 left-4 text-zinc-400 hover:text-zinc-200 bg-zinc-800 p-1 rounded-full transition-colors"
            >
              <X size={20} />
            </button>
            <div className="text-center mb-6">
              <div className="w-12 h-12 bg-orange-500/10 text-orange-500 rounded-full flex items-center justify-center mx-auto mb-4 border border-orange-500/20">
                <Timer size={24} />
              </div>
              <h2 className="text-2xl font-bold text-zinc-100 mb-2">مؤقت التركيز</h2>
              <p className="text-zinc-400 text-sm">حدد وقتاً للتركيز على مهامك أو قراءتك</p>
            </div>
            
            <div className="text-center mb-8">
              <div className="text-6xl font-black text-orange-500 tracking-wider font-mono drop-shadow-[0_0_15px_rgba(249,115,22,0.3)]">
                {formatTime(timeLeft)}
              </div>
            </div>

            <div className="flex justify-center gap-4 mb-8">
              <button
                onClick={() => { setTimeLeft(15 * 60); setIsTimerActive(false); }}
                className="px-4 py-2 rounded-lg bg-zinc-800 text-zinc-300 hover:bg-zinc-700 hover:text-white transition-colors text-sm font-bold"
              >
                15 دقيقة
              </button>
              <button
                onClick={() => { setTimeLeft(25 * 60); setIsTimerActive(false); }}
                className="px-4 py-2 rounded-lg bg-zinc-800 text-zinc-300 hover:bg-zinc-700 hover:text-white transition-colors text-sm font-bold"
              >
                25 دقيقة
              </button>
              <button
                onClick={() => { setTimeLeft(45 * 60); setIsTimerActive(false); }}
                className="px-4 py-2 rounded-lg bg-zinc-800 text-zinc-300 hover:bg-zinc-700 hover:text-white transition-colors text-sm font-bold"
              >
                45 دقيقة
              </button>
            </div>
            
            <div className="flex gap-3">
              <button 
                onClick={() => setIsTimerActive(!isTimerActive)}
                className={`flex-1 flex items-center justify-center gap-2 font-bold py-3 rounded-xl transition-colors shadow-lg ${
                  isTimerActive 
                    ? 'bg-zinc-800 text-white hover:bg-zinc-700' 
                    : 'bg-orange-600 text-white hover:bg-orange-500 shadow-[0_0_20px_rgba(249,115,22,0.3)]'
                }`}
              >
                {isTimerActive ? (
                  <><Pause size={20} /> إيقاف مؤقت</>
                ) : (
                  <><Play size={20} /> ابدأ التركيز</>
                )}
              </button>
              <button 
                onClick={() => { setIsTimerActive(false); setTimeLeft(25 * 60); }}
                className="bg-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-700 p-3 rounded-xl transition-colors"
                title="إعادة ضبط"
              >
                <RotateCcw size={20} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function NavItem({ icon, label, isActive, onClick }: { icon: React.ReactNode, label: string, isActive: boolean, onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-all duration-300 ${
        isActive ? 'text-orange-500' : 'text-zinc-500 hover:text-orange-400/70'
      }`}
    >
      <div className={`${isActive ? 'scale-110 drop-shadow-[0_0_8px_rgba(249,115,22,0.5)]' : 'scale-100'} transition-all duration-300`}>
        {icon}
      </div>
      <span className="text-[11px] font-bold tracking-wide">{label}</span>
    </button>
  );
}
