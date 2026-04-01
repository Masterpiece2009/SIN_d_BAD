import React, { useState, useEffect, useCallback } from 'react';
import { Compass, MapPin, Clock, Navigation } from 'lucide-react';

function getQiblaAngle(lat: number, lng: number) {
  const meccaLat = 21.422487;
  const meccaLng = 39.826206;
  
  const latR = lat * Math.PI / 180;
  const lngR = lng * Math.PI / 180;
  const meccaLatR = meccaLat * Math.PI / 180;
  const meccaLngR = meccaLng * Math.PI / 180;
  
  const y = Math.sin(meccaLngR - lngR);
  const x = Math.cos(latR) * Math.tan(meccaLatR) - Math.sin(latR) * Math.cos(meccaLngR - lngR);
  
  let qibla = Math.atan2(y, x) * 180 / Math.PI;
  return (qibla + 360) % 360;
}

function QiblaCompass({ lat, lng }: { lat: number, lng: number }) {
  const [heading, setHeading] = useState<number | null>(null);
  const [permissionGranted, setPermissionGranted] = useState<boolean | null>(null);
  const qiblaAngle = getQiblaAngle(lat, lng);

  const requestAccess = useCallback(async () => {
    if (typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
      try {
        const permissionState = await (DeviceOrientationEvent as any).requestPermission();
        if (permissionState === 'granted') {
          setPermissionGranted(true);
        } else {
          setPermissionGranted(false);
        }
      } catch (error) {
        console.error(error);
        setPermissionGranted(false);
      }
    } else {
      setPermissionGranted(true);
    }
  }, []);

  useEffect(() => {
    if (permissionGranted === null) {
      if (typeof (DeviceOrientationEvent as any).requestPermission !== 'function') {
        setPermissionGranted(true);
      }
      return;
    }

    if (!permissionGranted) return;

    const handleOrientation = (event: DeviceOrientationEvent) => {
      let webkitCompassHeading = (event as any).webkitCompassHeading;
      if (webkitCompassHeading !== undefined) {
        setHeading(webkitCompassHeading);
      } else if (event.alpha !== null) {
        // For Android, alpha is usually relative, but if deviceorientationabsolute is used, it's absolute.
        // We'll use 360 - alpha as a fallback.
        setHeading(360 - event.alpha);
      }
    };

    window.addEventListener('deviceorientationabsolute', handleOrientation as any);
    window.addEventListener('deviceorientation', handleOrientation);

    return () => {
      window.removeEventListener('deviceorientationabsolute', handleOrientation as any);
      window.removeEventListener('deviceorientation', handleOrientation);
    };
  }, [permissionGranted]);

  if (permissionGranted === null || permissionGranted === false) {
    return (
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-lg text-center">
        <div className="w-16 h-16 bg-orange-500/10 text-orange-500 rounded-full flex items-center justify-center mx-auto mb-4 border border-orange-500/20">
          <Compass size={32} />
        </div>
        <h3 className="text-xl font-black text-zinc-100 mb-2">اتجاه القبلة</h3>
        <p className="text-zinc-400 text-sm leading-relaxed mb-4">
          نحتاج إلى إذن للوصول إلى بوصلة الهاتف لتحديد اتجاه القبلة بدقة.
        </p>
        <button 
          onClick={requestAccess}
          className="inline-flex items-center justify-center gap-2 bg-orange-600 text-white font-bold py-3 px-6 rounded-xl hover:bg-orange-500 transition-colors shadow-[0_0_20px_rgba(249,115,22,0.3)] w-full sm:w-auto"
        >
          <Compass size={18} />
          تفعيل البوصلة
        </button>
      </div>
    );
  }

  const rotation = heading !== null ? qiblaAngle - heading : 0;

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-lg text-center overflow-hidden relative">
      <h3 className="text-xl font-black text-zinc-100 mb-6">اتجاه القبلة</h3>
      
      <div className="relative w-48 h-48 mx-auto mb-4">
        {/* Compass Background */}
        <div 
          className="absolute inset-0 rounded-full border-4 border-zinc-800 flex items-center justify-center transition-transform duration-200 ease-out"
          style={{ transform: `rotate(${heading !== null ? -heading : 0}deg)` }}
        >
          <div className="absolute top-2 text-red-500 font-bold text-sm">N</div>
          <div className="absolute bottom-2 text-zinc-500 font-bold text-sm">S</div>
          <div className="absolute right-2 text-zinc-500 font-bold text-sm">E</div>
          <div className="absolute left-2 text-zinc-500 font-bold text-sm">W</div>
          
          {/* Compass Ticks */}
          {[...Array(12)].map((_, i) => (
            <div 
              key={i} 
              className="absolute w-1 h-3 bg-zinc-700 rounded-full"
              style={{ transform: `rotate(${i * 30}deg) translateY(-20px)` }}
            />
          ))}
        </div>

        {/* Qibla Pointer */}
        <div 
          className="absolute inset-0 flex items-center justify-center transition-transform duration-200 ease-out"
          style={{ transform: `rotate(${rotation}deg)` }}
        >
          <div className="w-1 h-24 bg-gradient-to-t from-transparent via-orange-500 to-orange-500 rounded-full relative -top-12">
            <div className="absolute -top-2 -left-3 text-orange-500">
              <Navigation size={28} className="fill-orange-500" />
            </div>
          </div>
        </div>
        
        {/* Center Dot */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-zinc-900 border-2 border-orange-500 rounded-full z-10"></div>
      </div>

      <div className="text-zinc-400 text-sm font-mono" dir="ltr">
        {heading !== null ? (
          <div className="flex justify-center gap-4">
            <div>Qibla: {Math.round(qiblaAngle)}°</div>
            <div>Heading: {Math.round(heading)}°</div>
          </div>
        ) : (
          <span className="animate-pulse">جاري معايرة البوصلة...</span>
        )}
      </div>
    </div>
  );
}

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
        <QiblaCompass lat={location.lat} lng={location.lng} />
      )}
    </div>
  );
}
