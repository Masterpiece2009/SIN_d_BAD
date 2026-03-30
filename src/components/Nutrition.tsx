import { Droplet, Beef, Wheat, Flame, Info } from 'lucide-react';

export default function Nutrition() {
  return (
    <div className="space-y-4 animate-in fade-in duration-300">
      <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-2xl p-6 text-white shadow-md">
        <h2 className="text-2xl font-bold mb-2">خطة التغذية والمكملات</h2>
        <p className="text-indigo-100 text-sm leading-relaxed font-medium">
          التغذية السليمة هي المفتاح الأساسي لبناء العضلات والاستشفاء. التزم بالاحتياج اليومي لتحقيق أفضل النتائج.
        </p>
      </div>

      <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
        <div className="flex items-center space-x-3 space-x-reverse mb-4">
          <div className="bg-blue-100 p-2 rounded-lg text-blue-600">
            <Info size={24} />
          </div>
          <h3 className="text-lg font-bold text-gray-900">المكملات الأساسية</h3>
        </div>
        <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
          <h4 className="font-bold text-blue-900 mb-1 text-lg">MuscleSeeds Creatine Monohydrate</h4>
          <p className="text-sm text-blue-800 mb-3 font-bold bg-blue-100 inline-block px-3 py-1 rounded-full">
            الجرعة: 5 جرام يومياً (سكوب واحد)
          </p>
          <ul className="text-sm text-blue-800 space-y-2 list-disc list-inside font-medium">
            <li>يفضل تناوله بعد التمرين مع مصدر كربوهيدرات لسرعة الامتصاص.</li>
            <li>في أيام الراحة، تناوله في أي وقت من اليوم.</li>
            <li>تأكد من شرب كميات كافية من الماء (3-4 لتر يومياً) لتجنب الجفاف.</li>
            <li>يساعد في زيادة القوة، تحسين الأداء، وزيادة الكتلة العضلية.</li>
          </ul>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <NutritionCard 
          icon={<Beef size={24} />} 
          title="البروتين" 
          desc="1.6 - 2.2 جم لكل كجم من وزنك. (دجاج، لحم، بيض، أسماك)"
          color="bg-red-50 text-red-600 border-red-100"
        />
        <NutritionCard 
          icon={<Wheat size={24} />} 
          title="الكربوهيدرات" 
          desc="مصدر الطاقة الأساسي للتمرين. (أرز، بطاطس، شوفان)"
          color="bg-amber-50 text-amber-600 border-amber-100"
        />
        <NutritionCard 
          icon={<Flame size={24} />} 
          title="الدهون الصحية" 
          desc="لدعم الهرمونات وصحة المفاصل. (مكسرات، زيت زيتون)"
          color="bg-orange-50 text-orange-600 border-orange-100"
        />
        <NutritionCard 
          icon={<Droplet size={24} />} 
          title="الماء" 
          desc="3 إلى 4 لتر يومياً، خاصة مع استخدام الكرياتين."
          color="bg-cyan-50 text-cyan-600 border-cyan-100"
        />
      </div>
    </div>
  );
}

function NutritionCard({ icon, title, desc, color }: { icon: React.ReactNode, title: string, desc: string, color: string }) {
  return (
    <div className={`p-4 rounded-xl border ${color} flex flex-col items-start`}>
      <div className="mb-3 bg-white/50 p-2 rounded-lg mix-blend-multiply">
        {icon}
      </div>
      <h4 className="font-bold text-base mb-1 text-gray-900">{title}</h4>
      <p className="text-xs text-gray-700 leading-relaxed font-medium">{desc}</p>
    </div>
  );
}
