import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Search, Loader2, Navigation } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet default icon issue in React
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const customIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-orange.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Component to dynamically update map center
function MapUpdater({ center, zoom }: { center: [number, number], zoom: number }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  return null;
}

export default function Places() {
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [mapCenter, setMapCenter] = useState<[number, number]>([30.0444, 31.2357]); // Default Cairo
  const [mapZoom, setMapZoom] = useState(13);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const loc: [number, number] = [position.coords.latitude, position.coords.longitude];
          setUserLocation(loc);
          setMapCenter(loc);
        },
        (err) => {
          console.log("Geolocation error:", err);
        }
      );
    }
  }, []);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsSearching(true);
    setError(null);

    try {
      // Use Nominatim API for searching
      // If we have user location, we can add viewbox to bias results
      let url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=10`;
      
      if (userLocation) {
        // Create a bounding box around user location (approx 50km)
        const lat = userLocation[0];
        const lon = userLocation[1];
        const offset = 0.5;
        url += `&viewbox=${lon-offset},${lat+offset},${lon+offset},${lat-offset}&bounded=0`;
      }

      const res = await fetch(url, {
        headers: {
          'Accept-Language': 'ar'
        }
      });
      
      if (!res.ok) throw new Error('Failed to fetch places');
      const data = await res.json();
      
      setResults(data);
      
      if (data.length > 0) {
        setMapCenter([parseFloat(data[0].lat), parseFloat(data[0].lon)]);
        setMapZoom(14);
      } else {
        setError('لم يتم العثور على نتائج.');
      }
    } catch (err) {
      setError('حدث خطأ أثناء البحث. يرجى المحاولة مرة أخرى.');
    } finally {
      setIsSearching(false);
    }
  };

  const handleLocateMe = () => {
    if (userLocation) {
      setMapCenter(userLocation);
      setMapZoom(15);
    } else if (navigator.geolocation) {
      setIsSearching(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const loc: [number, number] = [position.coords.latitude, position.coords.longitude];
          setUserLocation(loc);
          setMapCenter(loc);
          setMapZoom(15);
          setIsSearching(false);
        },
        () => {
          setError('تعذر تحديد موقعك. يرجى التأكد من تفعيل خدمات الموقع.');
          setIsSearching(false);
        }
      );
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300" dir="rtl">
      <div className="bg-zinc-900 p-4 sm:p-6 rounded-2xl shadow-lg border border-zinc-800">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="bg-orange-500/10 p-3 rounded-full text-orange-500">
              <MapPin size={24} />
            </div>
            <div>
              <h2 className="text-xl font-black text-zinc-100">البحث عن أماكن</h2>
              <p className="text-zinc-400 text-sm">ابحث عن مطاعم، مقاهي، أو محلات قريبة منك</p>
            </div>
          </div>
          <button 
            onClick={handleLocateMe}
            className="bg-zinc-800 text-zinc-300 hover:text-orange-500 p-2 rounded-xl transition-colors border border-zinc-700"
            title="تحديد موقعي"
          >
            <Navigation size={20} />
          </button>
        </div>

        <form onSubmit={handleSearch} className="flex gap-2 mb-6">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="مثال: مطعم بيتزا، صيدلية..."
            className="flex-1 bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-zinc-100 focus:outline-none focus:border-orange-500 transition-colors"
          />
          <button
            type="submit"
            disabled={!query.trim() || isSearching}
            className="bg-orange-600 text-white px-4 sm:px-6 py-3 rounded-xl hover:bg-orange-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-bold shadow-[0_0_15px_rgba(249,115,22,0.3)] min-w-[80px]"
          >
            {isSearching ? <Loader2 size={20} className="animate-spin" /> : <Search size={20} />}
            <span className="hidden sm:inline">بحث</span>
          </button>
        </form>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-3 rounded-xl mb-4 text-sm">
            {error}
          </div>
        )}

        <div className="h-[400px] w-full rounded-xl overflow-hidden border border-zinc-800 relative z-0">
          <MapContainer 
            center={mapCenter} 
            zoom={mapZoom} 
            style={{ height: '100%', width: '100%', background: '#18181b' }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <MapUpdater center={mapCenter} zoom={mapZoom} />
            
            {userLocation && (
              <Marker position={userLocation}>
                <Popup>
                  <div className="text-right font-bold" dir="rtl">موقعك الحالي</div>
                </Popup>
              </Marker>
            )}

            {results.map((place, idx) => (
              <Marker 
                key={idx} 
                position={[parseFloat(place.lat), parseFloat(place.lon)]}
                icon={customIcon}
              >
                <Popup>
                  <div className="text-right" dir="rtl">
                    <strong className="block mb-1">{place.name || place.display_name.split(',')[0]}</strong>
                    <span className="text-xs text-gray-600">{place.display_name}</span>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>

        {results.length > 0 && (
          <div className="mt-4 space-y-2 max-h-48 overflow-y-auto pr-1 custom-scrollbar">
            <h3 className="text-sm font-bold text-zinc-400 mb-2">نتائج البحث:</h3>
            {results.map((place, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setMapCenter([parseFloat(place.lat), parseFloat(place.lon)]);
                  setMapZoom(16);
                }}
                className="w-full text-right p-3 rounded-xl border border-zinc-800 bg-zinc-950/50 text-zinc-300 hover:bg-zinc-800 transition-all flex items-start gap-3"
              >
                <MapPin size={18} className="text-orange-500 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-sm">{place.name || place.display_name.split(',')[0]}</div>
                  <div className="text-xs text-zinc-500 line-clamp-1 mt-1">{place.display_name}</div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
