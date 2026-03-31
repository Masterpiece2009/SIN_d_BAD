import React, { useState, useEffect } from 'react';
import { Compass, MapPin, Clock } from 'lucide-react';

type PrayerTimesData = {
  Fajr: string;
  Dhuhr: string;
  Asr: string;
  Maghrib: string;
  Isha: string;
};

export default function PrayerTimes() {
  const [prayerTimes, setPrayerTimes] = useState<PrayerTimesData | null>(null);
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locationName, setLocationName] = useState<string>('جاري تحديد الموقع...');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          setLocation({ lat, lng });
          
          try {
            // Fetch prayer times
            const date = new Date();
            const response = await fetch(`https://api.aladhan.com/v1/timings/${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}?latitude=${lat}&longitude=${lng}&method=2`);
            const data = await response.json();
            
            if (data.code === 200) {
              setPrayerTimes({
                Fajr: data.data.timings.Fajr,
                Dhuhr: data.data.timings.Dhuhr,
                Asr: data.data.timings.Asr,
                Maghrib: data.data.timings.Maghrib,
                Isha: data.data.timings.Isha,
              });
              
              // Try to get location name using reverse geocoding (optional, might fail due to rate limits)
              try {
                const geoResponse = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=ar`);
                const geoData = await geoResponse.json();
                setLocationName(geoData.city || geoData.locality || 'موقعك الحالي');
              } catch (e) {
                setLocationName('موقعك الحالي');
              }
            } else {
              setError('فشل في جلب مواقيت الصلاة');
            }
          } catch (err) {
            setError('حدث خطأ أثناء الاتصال بالخادم');
          } finally {
            setLoading(false);
          }
        },
        (err) => {
          setError('يرجى تفعيل خدمات الموقع (GPS) للحصول على مواقيت الصلاة والقبلة بدقة.');
          setLoading(false);
        }
      );
    } else {
      setError('متصفحك لا يدعم تحديد الموقع.');
      setLoading(false);
    }
  }, []);

  const formatTime = (timeStr: string) => {
    // Convert 24h to 12h format
    const [hours, minutes] = timeStr.split(':');
    let h = parseInt(hours, 10);
    const ampm = h >= 12 ? 'م' : 'ص';
    h = h % 12;
    h = h ? h : 12; // the hour '0' should be '12'
    return `${h}:${minutes} ${ampm}`;
  };

  const prayerNames: Record<keyof PrayerTimesData, string> = {
    Fajr: 'الفجر',
    Dhuhr: 'الظهر',
    Asr: 'العصر',
    Maghrib: 'المغرب',
    Isha: 'العشاء',
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-black text-zinc-100 mb-2 tracking-tight">مواقيت الصلاة</h2>
        <p className="text-orange-500 font-bold text-sm tracking-wide">حافظ على صلاتك</p>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/5 rounded-full blur-3xl -mr-10 -mt-10"></div>
        
        <div className="flex items-center justify-center gap-2 mb-6 text-zinc-300">
          <MapPin size={18} className="text-orange-500" />
          <span className="font-bold text-sm">{locationName}</span>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-10 space-y-4">
            <div className="w-8 h-8 border-4 border-orange-500/30 border-t-orange-500 rounded-full animate-spin"></div>
            <p className="text-zinc-400 text-sm font-bold">جاري تحديد الموقع...</p>
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <div className="bg-red-500/10 text-red-500 p-4 rounded-xl border border-red-500/20 text-sm font-bold leading-relaxed">
              {error}
            </div>
          </div>
        ) : prayerTimes ? (
          <div className="space-y-3">
            {(Object.keys(prayerTimes) as Array<keyof PrayerTimesData>).map((prayer) => (
              <div key={prayer} className="flex items-center justify-between bg-zinc-950/50 p-4 rounded-xl border border-zinc-800 hover:border-orange-500/30 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="bg-orange-500/10 p-2 rounded-lg text-orange-500">
                    <Clock size={18} />
                  </div>
                  <span className="font-bold text-zinc-100">{prayerNames[prayer]}</span>
                </div>
                <span className="text-orange-500 font-black font-mono text-lg tracking-wider" dir="ltr">
                  {formatTime(prayerTimes[prayer])}
                </span>
              </div>
            ))}
          </div>
        ) : null}
      </div>

      {location && (
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-lg text-center">
          <div className="w-16 h-16 bg-orange-500/10 text-orange-500 rounded-full flex items-center justify-center mx-auto mb-4 border border-orange-500/20">
            <Compass size={32} />
          </div>
          <h3 className="text-xl font-black text-zinc-100 mb-2">اتجاه القبلة</h3>
          <p className="text-zinc-400 text-sm leading-relaxed mb-4">
            يمكنك استخدام تطبيقات البوصلة في هاتفك وتوجيهها نحو مكة المكرمة.
          </p>
          <a 
            href={`https://qiblafinder.withgoogle.com/intl/ar/`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 bg-orange-600 text-white font-bold py-3 px-6 rounded-xl hover:bg-orange-500 transition-colors shadow-[0_0_20px_rgba(249,115,22,0.3)] w-full sm:w-auto"
          >
            <Compass size={18} />
            تحديد القبلة عبر Google
          </a>
        </div>
      )}
    </div>
  );
}
