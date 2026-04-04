import React, { useState, useEffect } from 'react';
import { Timer, X, Flame, Plus, Trash2, Edit2, Save, Cloud, Sun, CloudRain, Loader2 } from 'lucide-react';

function WeatherWidget() {
  const [weather, setWeather] = useState<{ temp: number, condition: string, icon: React.ReactNode } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [permissionDenied, setPermissionDenied] = useState(false);

  const fetchWeather = async (latitude: number, longitude: number) => {
    try {
      const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`);
      if (!res.ok) throw new Error('Failed to fetch weather');
      const data = await res.json();
      
      const code = data.current_weather.weathercode;
      let condition = 'مشمس';
      let icon = <Sun size={24} className="text-yellow-500" />;
      
      if (code >= 1 && code <= 3) {
        condition = 'غائم';
        icon = <Cloud size={24} className="text-zinc-400" />;
      } else if (code >= 51 && code <= 65) {
        condition = 'ممطر';
        icon = <CloudRain size={24} className="text-blue-400" />;
      } else if (code >= 71) {
        condition = 'غائم / ممطر';
        icon = <CloudRain size={24} className="text-blue-400" />;
      }

      setWeather({
        temp: Math.round(data.current_weather.temperature),
        condition,
        icon
      });
      setError(false);
      setPermissionDenied(false);
    } catch (err) {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const requestLocation = () => {
    setLoading(true);
    setError(false);
    setPermissionDenied(false);

    if (!navigator.geolocation) {
      setError(true);
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        fetchWeather(position.coords.latitude, position.coords.longitude);
      },
      (err) => {
        setLoading(false);
        if (err.code === err.PERMISSION_DENIED) {
          setPermissionDenied(true);
        } else {
          setError(true);
        }
      },
      { timeout: 10000, maximumAge: 600000 }
    );
  };

  useEffect(() => {
    requestLocation();
  }, []);

  if (loading) {
    return (
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 shadow-lg flex items-center justify-center h-[76px] mb-4">
        <Loader2 size={20} className="text-orange-500 animate-spin" />
      </div>
    );
  }

  if (permissionDenied || error || !weather) {
    return (
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 shadow-lg flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="bg-zinc-800/50 p-2 rounded-xl border border-zinc-700/50 text-zinc-400">
            <Cloud size={24} />
          </div>
          <div>
            <h4 className="font-bold text-zinc-100 text-sm">الطقس</h4>
            <div className="text-xs text-zinc-400">
              {permissionDenied ? 'يرجى تفعيل الموقع' : 'تعذر جلب الطقس'}
            </div>
          </div>
        </div>
        <button 
          onClick={requestLocation}
          className="bg-orange-500/10 text-orange-500 hover:bg-orange-500/20 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors border border-orange-500/20"
        >
          تحديث
        </button>
      </div>
    );
  }

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 shadow-lg flex items-center justify-between mb-4">
      <div className="flex items-center gap-3">
        <div className="bg-zinc-800/50 p-2 rounded-xl border border-zinc-700/50">
          {weather.icon}
        </div>
        <div>
          <h4 className="font-bold text-zinc-100 text-sm">الطقس الآن</h4>
          <div className="text-xs text-zinc-400">{weather.condition}</div>
        </div>
      </div>
      <div className="flex items-center gap-1">
        <div className="text-2xl font-black text-zinc-100 font-mono">
          {weather.temp}°
        </div>
        <span className="text-xs text-zinc-500 font-bold">C</span>
      </div>
    </div>
  );
}

const days = [
  { id: 'saturday', ar: 'السبت', en: 'Saturday' },
  { id: 'sunday', ar: 'الأحد', en: 'Sunday' },
  { id: 'monday', ar: 'الاثنين', en: 'Monday' },
  { id: 'tuesday', ar: 'الثلاثاء (راحة)', en: 'Tuesday' },
  { id: 'wednesday', ar: 'الأربعاء', en: 'Wednesday' },
  { id: 'thursday', ar: 'الخميس', en: 'Thursday' },
];

type Exercise = { id: string; name: string; sets: string; img: string; isCustom?: boolean };
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

const defaultWorkouts: Record<string, WorkoutDay> = {
  saturday: {
    title: 'السبت — صدر وتراي',
    desc: 'يوم الدفع والقوة',
    exercises: [
      { id: 's1', name: 'تجميع بالدامبل مسطح', sets: '4×8–12', img: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=500&q=80' },
      { id: 's2', name: 'بار عالي', sets: '4×8–12', img: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=500&q=80' },
      { id: 's3', name: 'كيبول من فوق', sets: '3×12–15', img: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=500&q=80' },
      { id: 's4', name: 'فراشة', sets: '3×12–15', img: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=500&q=80' },
      { id: 's5', name: 'مسطرة زجزاج تراي ضيق', sets: '3×8–12', img: 'https://images.unsplash.com/photo-1581009137042-c552e485697a?w=500&q=80' },
      { id: 's6', name: 'حبل تراي', sets: '3×12–15', img: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=500&q=80' },
    ]
  },
  sunday: {
    title: 'الأحد — ظهر وبايسبس',
    desc: 'يوم السحب المتين',
    exercises: [
      { id: 'su1', name: 'سحب أمامي عالي', sets: '4×8-12', img: 'https://images.unsplash.com/photo-1603287681836-b174ce5074c2?w=500&q=80' },
      { id: 'su2', name: 'سحب أرضي بالمثلث', sets: '4×8-12', img: 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?w=500&q=80' },
      { id: 'su3', name: 'مسطرة على الكابل معكوس', sets: '3×10-12', img: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=500&q=80' },
      { id: 'su4', name: 'قطانية على الجهاز', sets: '3×12-15', img: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=500&q=80' },
      { id: 'su5', name: 'تبادل دامبل باي', sets: '3×10-12', img: 'https://images.unsplash.com/photo-1581009137042-c552e485697a?w=500&q=80' },
      { id: 'su6', name: 'هامر دامبل', sets: '3×10-12', img: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=500&q=80' },
    ]
  },
  monday: {
    title: 'الاثنين — أرجل',
    desc: 'لا تفوت يوم الرجل أبداً!',
    exercises: [
      { id: 'm1', name: 'سكوات', sets: '4 × 12', img: 'https://images.unsplash.com/photo-1566241440091-ec10de8db2e1?w=500&q=80' },
      { id: 'm2', name: 'جهاز أمامي', sets: '4 × 12', img: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=500&q=80' },
      { id: 'm3', name: 'جهاز خلفي', sets: '4 × 12', img: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=500&q=80' },
      { id: 'm4', name: 'مكبس خلفي', sets: '4 × 12', img: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=500&q=80' },
      { id: 'm5', name: 'سمانة هاك سكوات', sets: '4 × 15', img: 'https://images.unsplash.com/photo-1434682881908-b43d0467b798?w=500&q=80' },
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
      { id: 'w1', name: 'حبل من تحت', sets: '4×10-12', img: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=500&q=80' },
      { id: 'w2', name: 'رفرفة جانبي', sets: '4×12-15', img: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=500&q=80' },
      { id: 'w3', name: 'تجميع دامبل', sets: '4×8-10', img: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=500&q=80' },
      { id: 'w4', name: 'ترابيس T-Bar', sets: '3×12', img: 'https://images.unsplash.com/photo-1603287681836-b174ce5074c2?w=500&q=80' },
      { id: 'w5', name: 'كتف خلفي جهاز', sets: '3×12-15', img: 'https://images.unsplash.com/photo-1581009137042-c552e485697a?w=500&q=80' },
    ]
  },
  thursday: {
    title: 'الخميس — أذرع',
    desc: 'يوم البامب (بايسبس وترايسبس)',
    groups: [
      {
        name: 'بايسبس (Biceps)',
        exercises: [
          { id: 'th1', name: 'كرسي ارتكاز بالبار', sets: '3×10-12', img: 'https://images.unsplash.com/photo-1581009137042-c552e485697a?w=500&q=80' },
          { id: 'th2', name: 'هامر بالحبل كابل', sets: '3×10-12', img: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=500&q=80' },
          { id: 'th3', name: 'تبادل دامبل جالس', sets: '3×10-12', img: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=500&q=80' },
        ]
      },
      {
        name: 'ترايسبس (Triceps)',
        exercises: [
          { id: 'th4', name: 'حبل من تحت', sets: '3×12-15', img: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=500&q=80' },
          { id: 'th5', name: 'مسطرة زجزاج ضيق', sets: '3×10-12', img: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=500&q=80' },
          { id: 'th6', name: 'كيك باك كابل', sets: '3×12-15', img: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=500&q=80' },
        ]
      }
    ]
  }
};

export default function Workout() {
  const [activeDay, setActiveDay] = useState('thursday');
  const [workouts, setWorkouts] = useState<Record<string, WorkoutDay>>(() => {
    const saved = localStorage.getItem('customWorkouts');
    return saved ? JSON.parse(saved) : defaultWorkouts;
  });
  const [isEditingMode, setIsEditingMode] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newExercise, setNewExercise] = useState({ name: '', sets: '', img: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=500&q=80' });
  const [targetGroupIdx, setTargetGroupIdx] = useState<number | null>(null);

  const currentWorkout = workouts[activeDay as keyof typeof workouts];

  useEffect(() => {
    localStorage.setItem('customWorkouts', JSON.stringify(workouts));
  }, [workouts]);

  const handleDeleteExercise = (dayId: string, exId: string, groupIdx?: number) => {
    setWorkouts(prev => {
      const newWorkouts = { ...prev };
      const day = { ...newWorkouts[dayId] };
      
      if (groupIdx !== undefined && day.groups) {
        day.groups = [...day.groups];
        day.groups[groupIdx] = { ...day.groups[groupIdx] };
        day.groups[groupIdx].exercises = day.groups[groupIdx].exercises.filter(e => e.id !== exId);
      } else if (day.exercises) {
        day.exercises = day.exercises.filter(e => e.id !== exId);
      }
      
      newWorkouts[dayId] = day;
      return newWorkouts;
    });
  };

  const handleAddExercise = () => {
    if (!newExercise.name || !newExercise.sets) return;
    
    setWorkouts(prev => {
      const newWorkouts = { ...prev };
      const day = { ...newWorkouts[activeDay] };
      const exerciseToAdd: Exercise = { 
        ...newExercise, 
        id: `custom_${Date.now()}`,
        isCustom: true 
      };
      
      if (targetGroupIdx !== null && day.groups) {
        day.groups = [...day.groups];
        day.groups[targetGroupIdx] = { ...day.groups[targetGroupIdx] };
        day.groups[targetGroupIdx].exercises = [...day.groups[targetGroupIdx].exercises, exerciseToAdd];
      } else if (day.exercises) {
        day.exercises = [...day.exercises, exerciseToAdd];
      } else {
        day.exercises = [exerciseToAdd];
      }
      
      newWorkouts[activeDay] = day;
      return newWorkouts;
    });
    
    setShowAddModal(false);
    setNewExercise({ name: '', sets: '', img: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=500&q=80' });
    setTargetGroupIdx(null);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <WeatherWidget />
      <StreakCounter />
      
      <div className="flex overflow-x-auto pb-4 -mx-4 px-4 space-x-2 space-x-reverse hide-scrollbar">
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

      <div className="flex items-center justify-between mb-8">
        <div className="text-right flex-1">
          <h2 className="text-3xl font-black text-zinc-100 mb-2 tracking-tight">{currentWorkout.title}</h2>
          <p className="text-orange-500 font-bold text-sm tracking-wide">{currentWorkout.desc}</p>
        </div>
        {!currentWorkout.rest && (
          <button 
            onClick={() => setIsEditingMode(!isEditingMode)}
            className={`p-2 rounded-xl transition-colors shrink-0 mr-4 ${isEditingMode ? 'bg-orange-600 text-white' : 'bg-zinc-800 text-zinc-400 hover:text-white'}`}
            title="تعديل التمارين"
          >
            {isEditingMode ? <Save size={20} /> : <Edit2 size={20} />}
          </button>
        )}
      </div>

      {!currentWorkout.rest && <RestTimer />}

      {currentWorkout.rest ? (
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl relative group hover:-translate-y-1 transition-transform duration-300">
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-900/80 to-transparent z-10"></div>
          <img src={currentWorkout.img} alt="Rest" className="w-full h-64 object-cover opacity-60 group-hover:opacity-80 group-hover:scale-105 transition-all duration-700" />
          <div className="absolute bottom-0 left-0 right-0 p-6 z-20 text-center">
            <h3 className="text-2xl font-black text-zinc-100 mb-2 drop-shadow-lg">{currentWorkout.msg}</h3>
            <p className="text-zinc-400 font-medium drop-shadow-md">{currentWorkout.subMsg}</p>
          </div>
        </div>
      ) : currentWorkout.groups ? (
        <div className="space-y-10">
          {currentWorkout.groups.map((group, gIdx) => (
            <div key={gIdx} className="space-y-4">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-3 mb-4">
                <h3 className="text-xl font-black text-zinc-100">
                  {group.name}
                </h3>
                {isEditingMode && (
                  <button 
                    onClick={() => { setTargetGroupIdx(gIdx); setShowAddModal(true); }}
                    className="text-orange-500 hover:text-orange-400 bg-orange-500/10 p-1.5 rounded-lg transition-colors flex items-center gap-1 text-xs font-bold"
                  >
                    <Plus size={14} /> إضافة تمرين
                  </button>
                )}
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
                {group.exercises.map((ex, idx) => (
                  <ExerciseCard 
                    key={ex.id} 
                    ex={ex} 
                    isEditing={isEditingMode}
                    onDelete={() => handleDeleteExercise(activeDay, ex.id, gIdx)}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {isEditingMode && (
            <div className="flex justify-end mb-4">
              <button 
                onClick={() => { setTargetGroupIdx(null); setShowAddModal(true); }}
                className="text-orange-500 hover:text-orange-400 bg-orange-500/10 px-3 py-2 rounded-lg transition-colors flex items-center gap-2 text-sm font-bold"
              >
                <Plus size={16} /> إضافة تمرين جديد
              </button>
            </div>
          )}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
            {currentWorkout.exercises?.map((ex, idx) => (
              <ExerciseCard 
                key={ex.id} 
                ex={ex} 
                isEditing={isEditingMode}
                onDelete={() => handleDeleteExercise(activeDay, ex.id)}
              />
            ))}
          </div>
        </div>
      )}

      {showAddModal && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 max-w-sm w-full shadow-2xl relative animate-in zoom-in-95 duration-200">
            <button 
              onClick={() => setShowAddModal(false)}
              className="absolute top-4 left-4 text-zinc-400 hover:text-zinc-200 bg-zinc-800 p-1 rounded-full transition-colors"
            >
              <X size={20} />
            </button>
            <h2 className="text-2xl font-bold text-zinc-100 mb-6 text-center">إضافة تمرين جديد</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-xs text-zinc-400 mb-1 font-bold">اسم التمرين</label>
                <input 
                  type="text" 
                  value={newExercise.name}
                  onChange={e => setNewExercise({...newExercise, name: e.target.value})}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-white focus:border-orange-500 outline-none transition-colors"
                  placeholder="مثال: ضغط بنش"
                />
              </div>
              <div>
                <label className="block text-xs text-zinc-400 mb-1 font-bold">المجموعات والتكرارات</label>
                <input 
                  type="text" 
                  value={newExercise.sets}
                  onChange={e => setNewExercise({...newExercise, sets: e.target.value})}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-white focus:border-orange-500 outline-none transition-colors"
                  placeholder="مثال: 3×10-12"
                  dir="ltr"
                />
              </div>
              <button 
                onClick={handleAddExercise}
                disabled={!newExercise.name || !newExercise.sets}
                className="w-full mt-6 bg-orange-600 text-white font-bold py-3 rounded-xl hover:bg-orange-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                إضافة
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const ExerciseCard: React.FC<{ ex: Exercise, isEditing?: boolean, onDelete?: () => void }> = ({ ex, isEditing, onDelete }) => {
  const [weight, setWeight] = useState(() => {
    return localStorage.getItem(`weight_${ex.id}`) || '';
  });

  const handleWeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setWeight(e.target.value);
    localStorage.setItem(`weight_${ex.id}`, e.target.value);
  };

  return (
    <article className="relative bg-zinc-900 rounded-xl overflow-hidden border border-zinc-800 hover:border-orange-500/50 transition-all duration-300 group flex flex-col h-48 sm:h-56 shadow-lg hover:shadow-orange-500/10 hover:-translate-y-1">
      {isEditing && (
        <button 
          onClick={onDelete}
          className="absolute top-2 right-2 z-20 bg-red-500/90 text-white p-1.5 rounded-lg hover:bg-red-600 transition-colors shadow-lg"
        >
          <Trash2 size={16} />
        </button>
      )}
      <div className="absolute inset-0 overflow-hidden h-32 sm:h-40">
        <img src={ex.img} alt={ex.name} className="w-full h-full object-cover opacity-50 group-hover:opacity-70 transition-all duration-700 grayscale group-hover:grayscale-0 group-hover:scale-110" loading="lazy" />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-zinc-900/80 to-transparent"></div>
      </div>
      <div className="relative z-10 mt-auto p-3 sm:p-4 text-center transform transition-transform duration-300">
        <h3 className="font-bold text-zinc-100 text-xs sm:text-sm mb-1 line-clamp-2 drop-shadow-md">{ex.name}</h3>
        {ex.sets && <p className="text-[10px] sm:text-xs text-orange-500 font-black tracking-wider drop-shadow-md mb-2">{ex.sets}</p>}
        <div className="flex items-center justify-center gap-1 bg-zinc-950/50 rounded-lg p-1 border border-zinc-800/50 mx-auto w-fit">
          <input 
            type="number" 
            value={weight} 
            onChange={handleWeightChange} 
            placeholder="0" 
            className="w-10 bg-transparent text-center text-zinc-100 text-xs font-bold outline-none focus:text-orange-500 transition-colors"
            dir="ltr"
          />
          <span className="text-[10px] text-zinc-500 font-bold">kg</span>
        </div>
      </div>
    </article>
  );
}

function RestTimer() {
  const [timeLeft, setTimeLeft] = useState(0);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let interval: number | null = null;
    if (isActive && timeLeft > 0) {
      interval = window.setInterval(() => {
        setTimeLeft(t => t - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeLeft]);

  const startTimer = (seconds: number) => {
    setTimeLeft(seconds);
    setIsActive(true);
  };

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 shadow-lg flex items-center justify-between mb-6">
      <div className="flex items-center gap-3">
        <div className="bg-orange-500/10 p-2 rounded-xl text-orange-500 border border-orange-500/20">
          <Timer size={20} />
        </div>
        <div>
          <h4 className="font-bold text-zinc-100 text-sm">مؤقت الراحة</h4>
          <div className="text-xs text-zinc-400">بين المجموعات</div>
        </div>
      </div>
      
      {isActive && timeLeft > 0 ? (
        <div className="flex items-center gap-3">
          <div className="text-2xl font-black text-orange-500 font-mono w-12 text-center">
            {timeLeft}s
          </div>
          <button onClick={() => setIsActive(false)} className="bg-zinc-800 p-2 rounded-lg text-zinc-400 hover:text-white transition-colors">
            <X size={16} />
          </button>
        </div>
      ) : (
        <div className="flex gap-2">
          <button onClick={() => startTimer(60)} className="bg-zinc-800 hover:bg-zinc-700 text-zinc-300 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors">60s</button>
          <button onClick={() => startTimer(90)} className="bg-zinc-800 hover:bg-zinc-700 text-zinc-300 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors">90s</button>
        </div>
      )}
    </div>
  );
}

function StreakCounter() {
  const [streak, setStreak] = useState(() => {
    return parseInt(localStorage.getItem('workoutStreak') || '0');
  });
  const [lastWorkout, setLastWorkout] = useState(() => {
    return localStorage.getItem('lastWorkoutDate');
  });

  const handleComplete = () => {
    const today = new Date().toDateString();
    if (lastWorkout === today) return;

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    
    let newStreak = 1;
    if (lastWorkout === yesterday.toDateString()) {
      newStreak = streak + 1;
    }

    setStreak(newStreak);
    setLastWorkout(today);
    localStorage.setItem('workoutStreak', newStreak.toString());
    localStorage.setItem('lastWorkoutDate', today);
  };

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 shadow-lg flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="bg-orange-500/10 p-2 rounded-xl text-orange-500 border border-orange-500/20">
          <Flame size={24} className={streak > 0 ? "text-orange-500" : "text-zinc-500"} />
        </div>
        <div>
          <h4 className="font-bold text-zinc-100 text-sm">أيام الالتزام</h4>
          <div className="text-xs text-zinc-400">استمر في التقدم!</div>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <div className="text-2xl font-black text-orange-500 font-mono">
          {streak} <span className="text-xs text-zinc-500 font-sans">يوم</span>
        </div>
        <button 
          onClick={handleComplete}
          disabled={lastWorkout === new Date().toDateString()}
          className={`px-3 py-1.5 rounded-lg text-[10px] sm:text-xs font-bold transition-colors ${
            lastWorkout === new Date().toDateString() 
              ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed' 
              : 'bg-orange-600 text-white hover:bg-orange-500'
          }`}
        >
          {lastWorkout === new Date().toDateString() ? 'تم إنجاز اليوم' : 'إنهاء التمرين'}
        </button>
      </div>
    </div>
  );
}
