import { useState } from 'react';

const days = [
  { id: 'saturday', ar: 'السبت', en: 'Saturday' },
  { id: 'sunday', ar: 'الأحد', en: 'Sunday' },
  { id: 'monday', ar: 'الاثنين', en: 'Monday' },
  { id: 'tuesday', ar: 'الثلاثاء (راحة)', en: 'Tuesday' },
  { id: 'wednesday', ar: 'الأربعاء', en: 'Wednesday' },
  { id: 'thursday', ar: 'الخميس', en: 'Thursday' },
];

const workouts = {
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
    exercises: [
      { name: 'كرسي ارتكاز بالبار (بايسبس)', sets: '3×10-12', img: 'https://images.unsplash.com/photo-1581009137042-c552e485697a?w=500&q=80' },
      { name: 'هامر بالحبل كابل (بايسبس)', sets: '3×10-12', img: 'https://images.unsplash.com/photo-1534438097544-ad21389e13e1?w=500&q=80' },
      { name: 'تبادل دامبل جالس (بايسبس)', sets: '3×10-12', img: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=500&q=80' },
      { name: 'حبل من تحت (ترايسبس)', sets: '3×12-15', img: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=500&q=80' },
      { name: 'مسطرة زجزاج ضيق (ترايسبس)', sets: '3×10-12', img: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=500&q=80' },
      { name: 'كيك باك كابل (ترايسبس)', sets: '3×12-15', img: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=500&q=80' },
    ]
  }
};

export default function Workout() {
  const [activeDay, setActiveDay] = useState('saturday');
  const currentWorkout = workouts[activeDay as keyof typeof workouts];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex overflow-x-auto pb-2 -mx-4 px-4 space-x-2 space-x-reverse hide-scrollbar">
        {days.map(day => (
          <button
            key={day.id}
            onClick={() => setActiveDay(day.id)}
            className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-bold transition-all ${
              activeDay === day.id 
                ? 'bg-indigo-600 text-white shadow-md scale-105' 
                : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            {day.ar}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
        <header className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900">{currentWorkout.title}</h2>
          <p className="text-indigo-600 mt-1 font-medium">{currentWorkout.desc}</p>
        </header>

        {currentWorkout.rest ? (
          <div className="text-center py-8">
            <img src={currentWorkout.img} alt="Rest" className="w-full h-48 object-cover rounded-xl mb-6 shadow-sm" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">{currentWorkout.msg}</h3>
            <p className="text-gray-600">{currentWorkout.subMsg}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {currentWorkout.exercises?.map((ex, idx) => (
              <article key={idx} className="flex bg-gray-50 rounded-xl overflow-hidden border border-gray-100 hover:shadow-md transition-shadow">
                <div className="w-24 h-24 flex-shrink-0">
                  <img src={ex.img} alt={ex.name} className="w-full h-full object-cover" loading="lazy" />
                </div>
                <div className="p-3 flex flex-col justify-center">
                  <h3 className="font-bold text-gray-900 text-sm mb-1">{ex.name}</h3>
                  <p className="text-xs text-indigo-600 font-bold bg-indigo-50 self-start px-2 py-1 rounded-md mt-1">{ex.sets}</p>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
