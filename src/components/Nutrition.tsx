import React, { useState, useEffect } from 'react';
import { Droplet, Beef, Wheat, Flame, Info, Calculator, Plus, Minus } from 'lucide-react';

export default function Nutrition() {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-full h-1 bg-gradient-to-r from-orange-600 to-yellow-500"></div>
        <div className="absolute -right-10 -top-10 opacity-5 group-hover:opacity-10 transition-opacity duration-500">
          <img src="https://api.iconify.design/mdi:bat.svg?color=%23ffffff" className="w-40 h-40" alt="Bat" />
        </div>
        <h2 className="text-2xl font-black mb-3 text-zinc-100 relative z-10">خطة التغذية والمكملات</h2>
        <p className="text-zinc-400 text-sm leading-relaxed font-medium relative z-10">
          التغذية السليمة هي المفتاح الأساسي لبناء العضلات والاستشفاء. التزم بالاحتياج اليومي لتحقيق أفضل النتائج.
        </p>
      </div>

      <WaterTracker />
      <MacroCalculator />

      <div className="bg-zinc-900 rounded-2xl p-5 shadow-lg border border-zinc-800">
        <div className="flex items-center space-x-3 space-x-reverse mb-5">
          <div className="bg-orange-500/10 p-2 rounded-xl text-orange-500 border border-orange-500/20">
            <Info size={24} />
          </div>
          <h3 className="text-xl font-black text-zinc-100">المكملات الأساسية</h3>
        </div>
        <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-5 relative overflow-hidden">
          <div className="absolute left-0 top-0 w-1 h-full bg-orange-500"></div>
          <h4 className="font-black text-orange-500 mb-2 text-lg">MuscleSeeds Creatine Monohydrate</h4>
          <p className="text-xs text-zinc-300 mb-4 font-bold bg-zinc-800 inline-block px-3 py-1.5 rounded-md border border-zinc-700">
            الجرعة: 5 جرام يومياً (سكوب واحد)
          </p>
          <ul className="text-sm text-zinc-400 space-y-3 list-none font-medium">
            <li className="flex items-start gap-2">
              <span className="text-orange-500 mt-1">▪</span>
              <span>يفضل تناوله بعد التمرين مع مصدر كربوهيدرات لسرعة الامتصاص.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-orange-500 mt-1">▪</span>
              <span>في أيام الراحة، تناوله في أي وقت من اليوم.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-orange-500 mt-1">▪</span>
              <span>تأكد من شرب كميات كافية من الماء (3-4 لتر يومياً) لتجنب الجفاف.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-orange-500 mt-1">▪</span>
              <span>يساعد في زيادة القوة، تحسين الأداء، وزيادة الكتلة العضلية.</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:gap-4">
        <NutritionCard 
          icon={<Beef size={24} />} 
          title="البروتين" 
          desc="1.6 - 2.2 جم لكل كجم من وزنك. (دجاج، لحم، بيض، أسماك)"
          color="text-red-500"
          bg="bg-red-500/10"
          border="border-red-500/20"
        />
        <NutritionCard 
          icon={<Wheat size={24} />} 
          title="الكربوهيدرات" 
          desc="مصدر الطاقة الأساسي للتمرين. (أرز، بطاطس، شوفان)"
          color="text-amber-500"
          bg="bg-amber-500/10"
          border="border-amber-500/20"
        />
        <NutritionCard 
          icon={<Flame size={24} />} 
          title="الدهون الصحية" 
          desc="لدعم الهرمونات وصحة المفاصل. (مكسرات، زيت زيتون)"
          color="text-orange-500"
          bg="bg-orange-500/10"
          border="border-orange-500/20"
        />
        <NutritionCard 
          icon={<Droplet size={24} />} 
          title="الماء" 
          desc="3 إلى 4 لتر يومياً، خاصة مع استخدام الكرياتين."
          color="text-cyan-500"
          bg="bg-cyan-500/10"
          border="border-cyan-500/20"
        />
      </div>
    </div>
  );
}

function NutritionCard({ icon, title, desc, color, bg, border }: { icon: React.ReactNode, title: string, desc: string, color: string, bg: string, border: string }) {
  return (
    <div className={`p-4 sm:p-5 rounded-xl border border-zinc-800 bg-zinc-900 flex flex-col items-start hover:border-zinc-700 transition-colors`}>
      <div className={`mb-4 ${bg} ${color} ${border} border p-2.5 rounded-xl`}>
        {icon}
      </div>
      <h4 className="font-black text-base mb-1.5 text-zinc-100">{title}</h4>
      <p className="text-xs text-zinc-400 leading-relaxed font-medium">{desc}</p>
    </div>
  );
}

function WaterTracker() {
  const [glasses, setGlasses] = useState(() => {
    const saved = localStorage.getItem('waterGlasses');
    const date = localStorage.getItem('waterDate');
    const today = new Date().toDateString();
    if (date === today && saved) return parseInt(saved);
    return 0;
  });

  useEffect(() => {
    localStorage.setItem('waterGlasses', glasses.toString());
    localStorage.setItem('waterDate', new Date().toDateString());
  }, [glasses]);

  return (
    <div className="bg-zinc-900 rounded-2xl p-5 shadow-lg border border-zinc-800">
      <div className="flex items-center space-x-3 space-x-reverse mb-4">
        <div className="bg-cyan-500/10 p-2 rounded-xl text-cyan-500 border border-cyan-500/20">
          <Droplet size={24} />
        </div>
        <h3 className="text-xl font-black text-zinc-100">متتبع شرب الماء</h3>
      </div>
      <div className="flex items-center justify-between bg-zinc-950 p-4 rounded-xl border border-zinc-800">
        <button onClick={() => setGlasses(Math.max(0, glasses - 1))} className="p-2 bg-zinc-800 rounded-lg text-zinc-400 hover:text-white transition-colors"><Minus size={20} /></button>
        <div className="text-center">
          <span className="text-3xl font-black text-cyan-500">{glasses}</span>
          <span className="text-zinc-500 text-sm block">/ 8 أكواب</span>
        </div>
        <button onClick={() => setGlasses(glasses + 1)} className="p-2 bg-cyan-600 rounded-lg text-white hover:bg-cyan-500 transition-colors"><Plus size={20} /></button>
      </div>
      <div className="mt-4 flex gap-1 justify-center" dir="ltr">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className={`h-2 flex-1 rounded-full transition-colors duration-500 ${i < glasses ? 'bg-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.5)]' : 'bg-zinc-800'}`} />
        ))}
      </div>
    </div>
  );
}

function MacroCalculator() {
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [activity, setActivity] = useState('1.2');
  const [goal, setGoal] = useState('maintain');
  const [results, setResults] = useState<{ calories: number, protein: number, carbs: number, fat: number } | null>(null);

  const calculateMacros = () => {
    const w = parseFloat(weight);
    const h = parseFloat(height);
    const a = parseFloat(age);

    if (!w || !h || !a) return;

    // Mifflin-St Jeor Equation
    let bmr = (10 * w) + (6.25 * h) - (5 * a);
    bmr += gender === 'male' ? 5 : -161;

    let tdee = bmr * parseFloat(activity);

    if (goal === 'lose') tdee -= 500;
    if (goal === 'gain') tdee += 500;

    const calories = Math.round(tdee);
    
    // Macros distribution (approximate)
    // Protein: 2.2g per kg of bodyweight
    const protein = Math.round(w * 2.2);
    // Fat: 25% of total calories
    const fat = Math.round((calories * 0.25) / 9);
    // Carbs: Remaining calories
    const carbs = Math.round((calories - (protein * 4) - (fat * 9)) / 4);

    setResults({ calories, protein, carbs, fat });
  };

  return (
    <div className="bg-zinc-900 rounded-2xl p-5 shadow-lg border border-zinc-800">
      <div className="flex items-center space-x-3 space-x-reverse mb-4">
        <div className="bg-orange-500/10 p-2 rounded-xl text-orange-500 border border-orange-500/20">
          <Calculator size={24} />
        </div>
        <div>
          <h3 className="text-xl font-black text-zinc-100">حاسبة السعرات والماكروز</h3>
          <p className="text-xs text-zinc-400">احسب احتياجك اليومي بدقة</p>
        </div>
      </div>
      
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-zinc-400 mb-1 font-bold">الوزن (كجم)</label>
            <input 
              type="number" 
              value={weight} 
              onChange={(e) => setWeight(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-white focus:border-orange-500 outline-none transition-colors"
              placeholder="75"
              dir="ltr"
            />
          </div>
          <div>
            <label className="block text-xs text-zinc-400 mb-1 font-bold">الطول (سم)</label>
            <input 
              type="number" 
              value={height} 
              onChange={(e) => setHeight(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-white focus:border-orange-500 outline-none transition-colors"
              placeholder="175"
              dir="ltr"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-zinc-400 mb-1 font-bold">العمر</label>
            <input 
              type="number" 
              value={age} 
              onChange={(e) => setAge(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-white focus:border-orange-500 outline-none transition-colors"
              placeholder="25"
              dir="ltr"
            />
          </div>
          <div>
            <label className="block text-xs text-zinc-400 mb-1 font-bold">الجنس</label>
            <select 
              value={gender} 
              onChange={(e) => setGender(e.target.value as 'male' | 'female')}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-white focus:border-orange-500 outline-none transition-colors appearance-none"
            >
              <option value="male">ذكر</option>
              <option value="female">أنثى</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs text-zinc-400 mb-1 font-bold">مستوى النشاط</label>
          <select 
            value={activity} 
            onChange={(e) => setActivity(e.target.value)}
            className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-white focus:border-orange-500 outline-none transition-colors appearance-none"
          >
            <option value="1.2">خامل (قليل أو معدوم الحركة)</option>
            <option value="1.375">نشاط خفيف (تمرين 1-3 أيام/أسبوع)</option>
            <option value="1.55">نشاط متوسط (تمرين 3-5 أيام/أسبوع)</option>
            <option value="1.725">نشاط عالي (تمرين 6-7 أيام/أسبوع)</option>
            <option value="1.9">نشاط شديد (تمرين مرتين يومياً)</option>
          </select>
        </div>
        
        <div>
          <label className="block text-xs text-zinc-400 mb-1 font-bold">الهدف</label>
          <div className="flex bg-zinc-950 rounded-lg p-1 border border-zinc-800">
            <button onClick={() => setGoal('lose')} className={`flex-1 py-2 text-xs font-bold rounded-md transition-colors ${goal === 'lose' ? 'bg-orange-600 text-white' : 'text-zinc-400 hover:text-zinc-200'}`}>خسارة وزن</button>
            <button onClick={() => setGoal('maintain')} className={`flex-1 py-2 text-xs font-bold rounded-md transition-colors ${goal === 'maintain' ? 'bg-orange-600 text-white' : 'text-zinc-400 hover:text-zinc-200'}`}>ثبات</button>
            <button onClick={() => setGoal('gain')} className={`flex-1 py-2 text-xs font-bold rounded-md transition-colors ${goal === 'gain' ? 'bg-orange-600 text-white' : 'text-zinc-400 hover:text-zinc-200'}`}>زيادة وزن</button>
          </div>
        </div>

        <button 
          onClick={calculateMacros}
          disabled={!weight || !height || !age}
          className="w-full mt-4 bg-orange-600 text-white font-black py-3 rounded-xl hover:bg-orange-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          احسب احتياجي
        </button>

        {results && (
          <div className="bg-zinc-950 p-4 rounded-xl border border-orange-500/30 mt-4 animate-in fade-in zoom-in-95 duration-300">
            <div className="text-center mb-4">
              <span className="text-4xl font-black text-orange-500 font-mono">{results.calories}</span>
              <span className="text-zinc-400 text-xs font-bold block mt-1">سعرة حرارية / يوم</span>
            </div>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="bg-zinc-900 p-2 rounded-lg border border-zinc-800">
                <div className="text-red-500 font-black font-mono text-lg">{results.protein}g</div>
                <div className="text-[10px] text-zinc-500 font-bold">بروتين</div>
              </div>
              <div className="bg-zinc-900 p-2 rounded-lg border border-zinc-800">
                <div className="text-amber-500 font-black font-mono text-lg">{results.carbs}g</div>
                <div className="text-[10px] text-zinc-500 font-bold">كاربوهيدرات</div>
              </div>
              <div className="bg-zinc-900 p-2 rounded-lg border border-zinc-800">
                <div className="text-orange-500 font-black font-mono text-lg">{results.fat}g</div>
                <div className="text-[10px] text-zinc-500 font-bold">دهون</div>
              </div>
            </div>
            <div className="mt-4 flex items-start gap-2 text-[10px] text-zinc-500 bg-zinc-900/50 p-2 rounded-lg">
              <Info size={14} className="shrink-0 mt-0.5" />
              <p>هذه الحسابات تقديرية. قد تختلف النتائج الفعلية بناءً على عوامل أخرى. استشر أخصائي تغذية للحصول على خطة دقيقة.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
