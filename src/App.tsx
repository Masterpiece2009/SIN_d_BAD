import React, { useState, useRef, useEffect } from 'react';
import { BookOpen, Dumbbell, Apple, Sun, Download, X, Volume2, VolumeX } from 'lucide-react';
import Quran from './components/Quran';
import Adhkar from './components/Adhkar';
import Workout from './components/Workout';
import Nutrition from './components/Nutrition';

export default function App() {
  const [activeTab, setActiveTab] = useState('workout');
  const [showInstallModal, setShowInstallModal] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    // Attempt to autoplay
    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise.then(() => {
        setIsPlaying(true);
      }).catch(error => {
        // Autoplay prevented by browser, requires user interaction
        console.log("Autoplay prevented. User interaction required.");
        setIsPlaying(false);
      });
    }
  }, []);

  const toggleAudio = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 pb-20 text-zinc-100 selection:bg-orange-500/30 font-sans">
      <header className="bg-zinc-900/80 backdrop-blur-md shadow-lg sticky top-0 z-10 border-b border-zinc-800">
        <div className="px-4 py-4 text-center relative flex justify-center items-center max-w-md mx-auto">
          <button
            onClick={toggleAudio}
            className="absolute left-4 text-zinc-400 hover:text-orange-500 transition-colors bg-zinc-800/50 p-2 rounded-full border border-zinc-700/50"
            title="تشغيل/إيقاف الموسيقى"
          >
            {isPlaying ? <Volume2 size={18} /> : <VolumeX size={18} />}
          </button>
          <button 
            onClick={() => setShowInstallModal(true)}
            className="absolute right-4 text-orange-500 hover:text-orange-400 flex items-center gap-1 bg-orange-500/10 px-3 py-1.5 rounded-full text-xs font-bold transition-colors border border-orange-500/20"
          >
            <Download size={16} />
            <span className="hidden sm:inline">تثبيت</span>
          </button>
          <h1 className="text-xl font-black text-zinc-100 tracking-wide flex items-center gap-2">
            <div className="w-8 h-8 bg-zinc-600 rounded-full flex items-center justify-center">
              <img src="https://api.iconify.design/mdi:bat.svg?color=%2318181b" alt="Batman" className="w-5 h-5" />
            </div>
            روتيني اليومي
          </h1>
        </div>
      </header>

      {/* Audio element for background music */}
      <audio ref={audioRef} loop>
        {/* Using a placeholder epic track. Replace src with actual Hans Zimmer track URL if available */}
        <source src="https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0a13f69d2.mp3?filename=epic-hollywood-trailer-9489.mp3" type="audio/mpeg" />
      </audio>

      <main className="p-4 max-w-2xl mx-auto w-full">
        {activeTab === 'quran' && <Quran />}
        {activeTab === 'adhkar' && <Adhkar />}
        {activeTab === 'workout' && <Workout />}
        {activeTab === 'nutrition' && <Nutrition />}
      </main>

      <nav className="fixed bottom-0 w-full bg-zinc-900/95 backdrop-blur-md border-t border-zinc-800 flex justify-around items-center h-16 max-w-md mx-auto left-0 right-0 z-20 pb-safe shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
        <NavItem icon={<Dumbbell size={24} />} label="التمارين" isActive={activeTab === 'workout'} onClick={() => setActiveTab('workout')} />
        <NavItem icon={<Apple size={24} />} label="التغذية" isActive={activeTab === 'nutrition'} onClick={() => setActiveTab('nutrition')} />
        <NavItem icon={<Sun size={24} />} label="الأذكار" isActive={activeTab === 'adhkar'} onClick={() => setActiveTab('adhkar')} />
        <NavItem icon={<BookOpen size={24} />} label="القرآن" isActive={activeTab === 'quran'} onClick={() => setActiveTab('quran')} />
      </nav>

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
