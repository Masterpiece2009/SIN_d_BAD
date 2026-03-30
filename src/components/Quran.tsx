import { useState, useEffect } from 'react';
import { ChevronRight, Loader2 } from 'lucide-react';

const surahs = [
  { id: 36, name: 'سورة يس' },
  { id: 55, name: 'سورة الرحمن' },
  { id: 56, name: 'سورة الواقعة' },
  { id: 67, name: 'سورة الملك' },
];

export default function Quran() {
  const [selectedSurah, setSelectedSurah] = useState<number | null>(null);
  const [surahData, setSurahData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (selectedSurah) {
      setLoading(true);
      fetch(`https://api.alquran.cloud/v1/surah/${selectedSurah}`)
        .then(res => res.json())
        .then(data => {
          setSurahData(data.data);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [selectedSurah]);

  if (selectedSurah) {
    return (
      <div className="space-y-4 animate-in slide-in-from-right-4 duration-300">
        <button 
          onClick={() => {
            setSelectedSurah(null);
            setSurahData(null);
          }}
          className="flex items-center text-orange-500 font-bold mb-4 bg-orange-500/10 border border-orange-500/20 px-4 py-2 rounded-full w-fit hover:bg-orange-500/20 transition-colors"
        >
          <ChevronRight size={20} />
          <span>العودة للقائمة</span>
        </button>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="animate-spin text-orange-500" size={40} />
          </div>
        ) : surahData ? (
          <div className="bg-zinc-900 rounded-2xl p-6 sm:p-8 shadow-xl border border-zinc-800 text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-600 to-yellow-500"></div>
            <h2 className="text-3xl sm:text-4xl font-bold text-zinc-100 mb-2 font-arabic">{surahData.name}</h2>
            <p className="text-zinc-500 mb-8 text-sm font-bold">آياتها {surahData.numberOfAyahs}</p>
            
            {selectedSurah !== 9 && (
              <div className="text-2xl sm:text-3xl font-arabic text-orange-500 mb-10 border-b border-zinc-800/50 pb-6">
                بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
              </div>
            )}

            <div className="text-2xl sm:text-3xl leading-[2.5] sm:leading-[2.5] font-arabic text-zinc-300 text-justify" dir="rtl">
              {surahData.ayahs.map((ayah: any) => (
                <span key={ayah.numberInSurah}>
                  {ayah.numberInSurah === 1 && selectedSurah !== 1 && ayah.text.startsWith('بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ ') 
                    ? ayah.text.replace('بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ ', '') 
                    : ayah.text}
                  <span className="inline-flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full border border-orange-500/30 text-orange-500 text-xs sm:text-sm mx-2 bg-orange-500/10 font-sans font-bold">
                    {ayah.numberInSurah}
                  </span>
                </span>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center text-red-500 font-bold p-10 bg-red-500/10 border border-red-500/20 rounded-xl">حدث خطأ في تحميل السورة. تأكد من اتصالك بالإنترنت.</div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-full h-1 bg-gradient-to-r from-orange-600 to-yellow-500"></div>
        <div className="absolute -left-10 -top-10 opacity-5 group-hover:opacity-10 transition-opacity duration-500">
          <BookOpen className="w-40 h-40 text-white" />
        </div>
        <h2 className="text-2xl font-black mb-3 text-zinc-100 relative z-10">الورد القرآني</h2>
        <p className="text-zinc-400 text-sm leading-relaxed font-medium relative z-10">
          حافظ على قراءة هذه السور يومياً لما فيها من فضل عظيم وبركة في الرزق والحفظ.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:gap-4">
        {surahs.map(surah => (
          <button
            key={surah.id}
            onClick={() => setSelectedSurah(surah.id)}
            className="flex items-center justify-between bg-zinc-900 p-5 rounded-xl shadow-lg border border-zinc-800 hover:border-orange-500/50 hover:shadow-orange-500/5 transition-all group"
          >
            <div className="flex items-center space-x-4 space-x-reverse">
              <div className="w-12 h-12 rounded-full bg-zinc-950 border border-zinc-800 flex items-center justify-center text-zinc-400 font-black text-lg group-hover:bg-orange-500 group-hover:text-zinc-950 group-hover:border-orange-500 transition-colors">
                {surah.id}
              </div>
              <span className="text-xl font-bold text-zinc-100 font-arabic">{surah.name}</span>
            </div>
            <ChevronRight className="text-zinc-600 rotate-180 group-hover:text-orange-500 transition-colors" size={24} />
          </button>
        ))}
      </div>
    </div>
  );
}
