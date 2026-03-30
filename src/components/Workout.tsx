import React, { useState } from 'react';

const days = [
  { id: 'saturday', ar: 'السبت', en: 'Saturday' },
  { id: 'sunday', ar: 'الأحد', en: 'Sunday' },
  { id: 'monday', ar: 'الاثنين', en: 'Monday' },
  { id: 'tuesday', ar: 'الثلاثاء (راحة)', en: 'Tuesday' },
  { id: 'wednesday', ar: 'الأربعاء', en: 'Wednesday' },
  { id: 'thursday', ar: 'الخميس', en: 'Thursday' },
];

type Exercise = { name: string; sets: string; img: string };
type WorkoutGroup = { name: string; exercises: Exercise[] };
type WorkoutDay = {
  title: string;
  desc: string;
  exercises?: Exercise[];
  groups?: WorkoutGroup[];
  rest?: boolean;
  img?: string;
  msg?: string;
  subMsg?: string;
};

const workouts: Record<string, WorkoutDay> = {
  saturday: {
    title: 'السبت — صدر وتراي',
    desc: 'يوم الدفع والقوة',
    exercises: [
      { name: 'تجميع بالدامبل مسطح', sets: '4×8–12', img: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=500&q=80' },
      { name: 'بار عالي', sets: '4×8–12', img: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=500&q=80' },
      { name: 'كيبول من فوق', sets: '3×12–15', img: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=500&q=80' },
      { name: 'فراشة', sets: '3×12–15', img: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=500&q=80' },
      { name: 'مسطرة زجزاج تراي ضيق', sets: '3×8–12', img: 'https://images.unsplash.com/photo-1581009137042-c552e485697a?w=500&q=80' },
      { name: 'حبل تراي', sets: '3×12–15', img: 'https://images.unsplash.com/photo-1534438097544-ad21389e13e1?w=500&q=80' },
    ]
  },
  sunday: {
    title: 'الأحد — ظهر وبايسبس',
    desc: 'يوم السحب المتين',
    exercises: [
      { name: 'سحب أمامي عالي', sets: '4×8-12', img: 'https://images.unsplash.com/photo-1603287681836-b174ce5074c2?w=500&q=80' },
      { name: 'سحب أرضي بالمثلث', sets: '4×8-12', img: 'https://images.unsplash.com/photo-1526506441334-77a80b61a46b?w=500&q=80' },
      { name: 'مسطرة على الكابل معكوس', sets: '3×10-12', img: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=500&q=80' },
      { name: 'قطانية على الجهاز', sets: '3×12-15', img: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=500&q=80' },
      { name: 'تبادل دامبل باي', sets: '3×10-12', img: 'https://images.unsplash.com/photo-1581009137042-c552e485697a?w=500&q=80' },
      { name: 'هامر دامبل', sets: '3×10-12', img: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=500&q=80' },
    ]
  },
  monday: {
    title: 'الاثنين — أرجل',
    desc: 'لا تفوت يوم الرجل أبداً!',
    exercises: [
      { name: 'سكوات', sets: '4 × 12', img: 'https://images.unsplash.com/photo-1566241440091-ec10de8db2e1?w=500&q=80' },
      { name: 'جهاز أمامي', sets: '4 × 12', img: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=500&q=80' },
      { name: 'جهاز خلفي', sets: '4 × 12', img: 'https://images.unsplash.com/photo-1584466977710-1ce3f395b282?w=500&q=80' },
      { name: 'مكبس خلفي', sets: '4 × 12', img: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=500&q=80' },
      { name: 'سمانة هاك سكوات', sets: '4 × 15', img: 'https://images.unsplash.com/photo-1434682881908-b43d0467b798?w=500&q=80' },
    ]
  },
  tuesday: {
    title: 'الثلاثاء — يوم راحة',
    desc: 'الاستشفاء هو وقت بناء العضلات',
    rest: true,
    img: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=500&q=80',
    msg: 'خذ وقتك للتعافي!',
    subMsg: 'قُم بتمارين الإطالة، احصل على نوم كافي، وتناول بروتينك.'
  },
  wednesday: {
    title: 'الأربعاء — أكتاف',
    desc: 'أكتاف ثلاثية الأبعاد 3D',
    exercises: [
      { name: 'حبل من تحت', sets: '4×10-12', img: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=500&q=80' },
      { name: 'رفرفة جانبي', sets: '4×12-15', img: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=500&q=80' },
      { name: 'تجميع دامبل', sets: '4×8-10', img: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=500&q=80' },
      { name: 'ترابيس T-Bar', sets: '3×12', img: 'https://images.unsplash.com/photo-1603287681836-b174ce5074c2?w=500&q=80' },
      { name: 'كتف خلفي جهاز', sets: '3×12-15', img: 'https://images.unsplash.com/photo-1581009137042-c552e485697a?w=500&q=80' },
    ]
  },
  thursday: {
    title: 'الخميس — أذرع',
    desc: 'يوم البامب (بايسبس وترايسبس)',
    groups: [
      {
        name: 'بايسبس (Biceps)',
        exercises: [
          { name: 'كرسي ارتكاز بالبار', sets: '3×10-12', img: 'https://images.unsplash.com/photo-1581009137042-c552e485697a?w=500&q=80' },
          { name: 'هامر بالحبل كابل', sets: '3×10-12', img: 'https://images.unsplash.com/photo-1534438097544-ad21389e13e1?w=500&q=80' },
          { name: 'تبادل دامبل جالس', sets: '3×10-12', img: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=500&q=80' },
        ]
      },
      {
        name: 'ترايسبس (Triceps)',
        exercises: [
          { name: 'حبل من تحت', sets: '3×12-15', img: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=500&q=80' },
          { name: 'مسطرة زجزاج ضيق', sets: '3×10-12', img: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=500&q=80' },
          { name: 'كيك باك كابل', sets: '3×12-15', img: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=500&q=80' },
        ]
      }
    ]
  }
};

export default function Workout() {
  const [activeDay, setActiveDay] = useState('thursday');
  const currentWorkout = workouts[activeDay as keyof typeof workouts];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div className="flex justify-center overflow-x-auto pb-4 -mx-4 px-4 space-x-2 space-x-reverse hide-scrollbar">
        {days.map(day => (
          <button
            key={day.id}
            onClick={() => setActiveDay(day.id)}
            className={`whitespace-nowrap px-5 py-2.5 rounded-full text-sm font-bold transition-all duration-300 border ${
              activeDay === day.id 
                ? 'bg-orange-600 text-zinc-50 border-orange-500 shadow-[0_0_15px_rgba(249,115,22,0.4)] scale-105' 
                : 'bg-zinc-900/50 text-zinc-400 border-zinc-800 hover:bg-zinc-800 hover:text-zinc-200'
            }`}
          >
            {day.ar}
          </button>
        ))}
      </div>

      <div className="text-center mb-8">
        <h2 className="text-3xl font-black text-zinc-100 mb-2 tracking-tight">{currentWorkout.title}</h2>
        <p className="text-orange-500 font-bold text-sm tracking-wide">{currentWorkout.desc}</p>
      </div>

      {currentWorkout.rest ? (
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl relative group">
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-900/80 to-transparent z-10"></div>
          <img src={currentWorkout.img} alt="Rest" className="w-full h-64 object-cover opacity-60 group-hover:opacity-80 transition-opacity duration-500" />
          <div className="absolute bottom-0 left-0 right-0 p-6 z-20 text-center">
            <h3 className="text-2xl font-black text-zinc-100 mb-2">{currentWorkout.msg}</h3>
            <p className="text-zinc-400 font-medium">{currentWorkout.subMsg}</p>
          </div>
        </div>
      ) : currentWorkout.groups ? (
        <div className="space-y-10">
          {currentWorkout.groups.map((group, gIdx) => (
            <div key={gIdx} className="space-y-4">
              <h3 className="text-xl font-black text-zinc-100 border-b border-zinc-800 pb-3 inline-block">
                {group.name}
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
                {group.exercises.map((ex, idx) => (
                  <ExerciseCard key={idx} ex={ex} />
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
          {currentWorkout.exercises?.map((ex, idx) => (
            <ExerciseCard key={idx} ex={ex} />
          ))}
        </div>
      )}
    </div>
  );
}

const ExerciseCard: React.FC<{ ex: any }> = ({ ex }) => {
  return (
    <article className="relative bg-zinc-900 rounded-xl overflow-hidden border border-zinc-800 hover:border-orange-500/50 transition-all duration-300 group flex flex-col h-40 sm:h-48 shadow-lg hover:shadow-orange-500/10">
      <div className="absolute inset-0">
        <img src={ex.img} alt={ex.name} className="w-full h-full object-cover opacity-50 group-hover:opacity-70 transition-opacity duration-500 grayscale group-hover:grayscale-0" loading="lazy" />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/80 to-transparent"></div>
      </div>
      <div className="relative z-10 mt-auto p-3 sm:p-4 text-center">
        <h3 className="font-bold text-zinc-100 text-xs sm:text-sm mb-1 line-clamp-2">{ex.name}</h3>
        {ex.sets && <p className="text-[10px] sm:text-xs text-orange-500 font-black tracking-wider">{ex.sets}</p>}
      </div>
    </article>
  );
}
