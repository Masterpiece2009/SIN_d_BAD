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
          className="flex items-center text-indigo-600 font-bold mb-4 bg-indigo-50 px-4 py-2 rounded-full w-fit hover:bg-indigo-100 transition-colors"
        >
          <ChevronRight size={20} />
          <span>العودة للقائمة</span>
        </button>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="animate-spin text-indigo-600" size={40} />
          </div>
        ) : surahData ? (
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-2 font-arabic">{surahData.name}</h2>
            <p className="text-gray-500 mb-6 text-sm font-bold">آياتها {surahData.numberOfAyahs}</p>
            
            {selectedSurah !== 9 && (
              <div className="text-2xl font-arabic text-indigo-800 mb-8 border-b border-indigo-50 pb-4">
                بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
              </div>
            )}

            <div className="text-2xl leading-[2.5] font-arabic text-gray-800 text-justify" dir="rtl">
              {surahData.ayahs.map((ayah: any) => (
                <span key={ayah.numberInSurah}>
                  {ayah.numberInSurah === 1 && selectedSurah !== 1 && ayah.text.startsWith('بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ ') 
                    ? ayah.text.replace('بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ ', '') 
                    : ayah.text}
                  <span className="inline-flex items-center justify-center w-8 h-8 rounded-full border border-indigo-200 text-indigo-600 text-sm mx-2 bg-indigo-50 font-sans font-bold">
                    {ayah.numberInSurah}
                  </span>
                </span>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center text-red-500 font-bold p-10 bg-red-50 rounded-xl">حدث خطأ في تحميل السورة. تأكد من اتصالك بالإنترنت.</div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4 animate-in fade-in duration-300">
      <div className="bg-gradient-to-br from-emerald-600 to-teal-700 rounded-2xl p-6 text-white shadow-md mb-6">
        <h2 className="text-2xl font-bold mb-2">الورد القرآني</h2>
        <p className="text-emerald-100 text-sm leading-relaxed font-medium">
          حافظ على قراءة هذه السور يومياً لما فيها من فضل عظيم وبركة في الرزق والحفظ.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {surahs.map(surah => (
          <button
            key={surah.id}
            onClick={() => setSelectedSurah(surah.id)}
            className="flex items-center justify-between bg-white p-5 rounded-xl shadow-sm border border-gray-100 hover:border-indigo-300 hover:shadow-md transition-all group"
          >
            <div className="flex items-center space-x-4 space-x-reverse">
              <div className="w-12 h-12 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold text-lg group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                {surah.id}
              </div>
              <span className="text-xl font-bold text-gray-800 font-arabic">{surah.name}</span>
            </div>
            <ChevronRight className="text-gray-400 rotate-180 group-hover:text-indigo-600 transition-colors" size={24} />
          </button>
        ))}
      </div>
    </div>
  );
}
