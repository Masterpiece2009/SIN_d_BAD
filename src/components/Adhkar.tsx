import React, { useState } from 'react';
import { morningAdhkar, eveningAdhkar } from '../azkarData';

export default function Adhkar() {
  const [type, setType] = useState<'morning' | 'evening'>('morning');
  const list = type === 'morning' ? morningAdhkar : eveningAdhkar;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex bg-zinc-900 p-1.5 rounded-xl border border-zinc-800 shadow-lg">
        <button
          onClick={() => setType('morning')}
          className={`flex-1 py-3 text-sm sm:text-base font-black rounded-lg transition-all duration-300 ${
            type === 'morning' ? 'bg-orange-600 text-zinc-50 shadow-[0_0_15px_rgba(249,115,22,0.3)]' : 'text-zinc-500 hover:text-zinc-300'
          }`}
        >
          أذكار الصباح
        </button>
        <button
          onClick={() => setType('evening')}
          className={`flex-1 py-3 text-sm sm:text-base font-black rounded-lg transition-all duration-300 ${
            type === 'evening' ? 'bg-orange-600 text-zinc-50 shadow-[0_0_15px_rgba(249,115,22,0.3)]' : 'text-zinc-500 hover:text-zinc-300'
          }`}
        >
          أذكار المساء
        </button>
      </div>

      <div className="space-y-4 pb-4">
        {list.map((dhikr, idx) => (
          <div key={idx} className="bg-zinc-900 p-5 sm:p-6 rounded-2xl shadow-lg border border-zinc-800 relative overflow-hidden group hover:border-zinc-700 transition-colors">
            <div className="absolute top-0 right-0 w-1.5 h-full bg-orange-500 opacity-80"></div>
            <p className="text-zinc-300 leading-loose text-lg sm:text-xl font-arabic whitespace-pre-line">
              {dhikr.text}
            </p>
            <div className="mt-5 flex justify-between items-center border-t border-zinc-800/50 pt-4">
              <span className="text-xs sm:text-sm font-bold text-zinc-500">التكرار</span>
              <span className="bg-orange-500/10 border border-orange-500/20 text-orange-500 px-4 py-1.5 rounded-full text-xs sm:text-sm font-black tracking-wide">
                {dhikr.count} مرات
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
