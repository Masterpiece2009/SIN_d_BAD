import { useState } from 'react';
import { BookOpen, Dumbbell, Apple, Sun, Download, X } from 'lucide-react';
import Quran from './components/Quran';
import Adhkar from './components/Adhkar';
import Workout from './components/Workout';
import Nutrition from './components/Nutrition';

export default function App() {
  const [activeTab, setActiveTab] = useState('workout');
  const [showInstallModal, setShowInstallModal] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 pb-20 text-gray-900 selection:bg-indigo-100">
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="px-4 py-4 text-center relative flex justify-center items-center">
          <button 
            onClick={() => setShowInstallModal(true)}
            className="absolute right-4 text-indigo-600 hover:text-indigo-800 flex items-center gap-1 bg-indigo-50 px-3 py-1.5 rounded-full text-xs font-bold transition-colors"
          >
            <Download size={16} />
            <span>حفظ التطبيق</span>
          </button>
          <h1 className="text-xl font-bold text-indigo-600">روتيني اليومي</h1>
        </div>
      </header>

      <main className="p-4 max-w-md mx-auto w-full">
        {activeTab === 'quran' && <Quran />}
        {activeTab === 'adhkar' && <Adhkar />}
        {activeTab === 'workout' && <Workout />}
        {activeTab === 'nutrition' && <Nutrition />}
      </main>

      <nav className="fixed bottom-0 w-full bg-white border-t border-gray-200 flex justify-around items-center h-16 max-w-md mx-auto left-0 right-0 z-20 pb-safe">
        <NavItem icon={<Dumbbell size={24} />} label="التمارين" isActive={activeTab === 'workout'} onClick={() => setActiveTab('workout')} />
        <NavItem icon={<Apple size={24} />} label="التغذية" isActive={activeTab === 'nutrition'} onClick={() => setActiveTab('nutrition')} />
        <NavItem icon={<Sun size={24} />} label="الأذكار" isActive={activeTab === 'adhkar'} onClick={() => setActiveTab('adhkar')} />
        <NavItem icon={<BookOpen size={24} />} label="القرآن" isActive={activeTab === 'quran'} onClick={() => setActiveTab('quran')} />
      </nav>

      {showInstallModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl relative animate-in zoom-in-95 duration-200">
            <button 
              onClick={() => setShowInstallModal(false)}
              className="absolute top-4 left-4 text-gray-400 hover:text-gray-600 bg-gray-50 p-1 rounded-full"
            >
              <X size={20} />
            </button>
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Download size={32} />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">حفظ التطبيق على هاتفك</h2>
              <p className="text-gray-600 text-sm leading-relaxed">
                يمكنك حفظ هذا التطبيق على شاشتك الرئيسية للوصول إليه بدون إنترنت في أي وقت!
              </p>
            </div>
            
            <div className="space-y-4 bg-gray-50 p-4 rounded-xl text-sm text-gray-700">
              <div className="flex items-start gap-3">
                <div className="bg-white w-6 h-6 rounded-full flex items-center justify-center font-bold text-indigo-600 shadow-sm shrink-0">1</div>
                <p><strong>في الآيفون (Safari):</strong> اضغط على زر المشاركة <span className="inline-block border border-gray-300 rounded px-1 text-xs mx-1">Share</span> ثم اختر <span className="font-bold">"إضافة للشاشة الرئيسية"</span> (Add to Home Screen).</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-white w-6 h-6 rounded-full flex items-center justify-center font-bold text-indigo-600 shadow-sm shrink-0">2</div>
                <p><strong>في الأندرويد (Chrome):</strong> اضغط على القائمة (الثلاث نقاط) ثم اختر <span className="font-bold">"إضافة للشاشة الرئيسية"</span> (Add to Home screen).</p>
              </div>
            </div>
            
            <button 
              onClick={() => setShowInstallModal(false)}
              className="w-full mt-6 bg-indigo-600 text-white font-bold py-3 rounded-xl hover:bg-indigo-700 transition-colors"
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
      className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors ${
        isActive ? 'text-indigo-600' : 'text-gray-400 hover:text-indigo-400'
      }`}
    >
      <div className={`${isActive ? 'scale-110' : 'scale-100'} transition-transform duration-200`}>
        {icon}
      </div>
      <span className="text-[11px] font-bold">{label}</span>
    </button>
  );
}
