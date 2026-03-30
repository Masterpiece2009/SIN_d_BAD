import { Droplet, Beef, Wheat, Flame, Info } from 'lucide-react';

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
