
import React, { useState, useEffect } from 'react';
import { Play, Youtube, Music, Waves, Eye, CloudRain, RefreshCw, ExternalLink, AlertCircle } from 'lucide-react';

interface VideoTrack {
  id: string;
  youtubeId: string;
  name: string;
  icon: React.ReactNode;
  color: string;
  description: string;
  type: 'sensory' | 'noise' | 'music';
}

const videoTracks: VideoTrack[] = [
  { 
    id: 'white-noise-new', 
    youtubeId: 'pRASZVBSRpQ', 
    name: 'الضوضاء البيضاء', 
    icon: <Waves className="w-6 h-6" />,
    color: 'bg-blue-500 shadow-blue-200',
    type: 'noise',
    description: 'صوت رتيب يساعد على حجب الضجيج الخارجي وتهدئة الطفل فوراً.'
  },
  { 
    id: 'music-box-new', 
    youtubeId: 'KKvZt2gde5Y', 
    name: 'صندوق الموسيقى لنوم الاطفال', 
    icon: <Music className="w-6 h-6" />,
    color: 'bg-pink-500 shadow-pink-200',
    type: 'music',
    description: 'ألحان كلاسيكية ناعمة تمنح الطفل شعوراً بالأمان والهدوء.'
  },
  { 
    id: 'sensory-shapes-new', 
    youtubeId: 'xSOp5CjhcI8', 
    name: 'الاشكال الراقصة لنوم الاطفال', 
    icon: <Eye className="w-6 h-6" />,
    color: 'bg-purple-500 shadow-purple-200',
    type: 'sensory',
    description: 'فيديو حسي عالي التباين يجذب انتباه الطفل ويقلل من حدة البكاء.'
  },
  { 
    id: 'rain-sounds-new', 
    youtubeId: 'LmlccGjmPYI', 
    name: 'اصوات المطر لنوم الاطفال', 
    icon: <CloudRain className="w-6 h-6" />,
    color: 'bg-indigo-500 shadow-indigo-200',
    type: 'noise',
    description: 'صوت الطبيعة المهدئ الذي يساعد على الاسترخاء العميق والنوم المتواصل.'
  }
];

const LullabyPlayer: React.FC = () => {
  const [selectedVideo, setSelectedVideo] = useState<VideoTrack>(videoTracks[0]);
  const [key, setKey] = useState(0); // Used to force iframe refresh if needed

  const refreshIframe = () => {
    setKey(prev => prev + 1);
  };

  // Constructing a robust YouTube embed URL
  // Using youtube-nocookie.com to avoid cookie-related blocking
  const embedUrl = `https://www.youtube-nocookie.com/embed/${selectedVideo.youtubeId}?key=${key}&autoplay=0&rel=0&modestbranding=1&enablejsapi=1&origin=${window.location.origin}`;

  return (
    <div className="space-y-6 animate-in fade-in duration-700 text-right" dir="rtl">
      {/* Main Video Player Container */}
      <div className="relative group">
        <div className="bg-black rounded-3xl overflow-hidden shadow-2xl aspect-video relative border-4 border-white">
          <iframe
            key={key}
            src={embedUrl}
            title={selectedVideo.name}
            className="w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          ></iframe>
        </div>
        
        {/* Floating Refresh Control */}
        <button 
          onClick={refreshIframe}
          className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm p-2 rounded-xl shadow-lg hover:bg-white transition-colors text-gray-600 border border-gray-100 flex items-center gap-2 text-xs font-bold"
          title="إعادة تحميل المشغل"
        >
          <RefreshCw className="w-4 h-4" />
          تحديث المشغل
        </button>
      </div>

      {/* Currently Selected Video Card */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-4 text-right w-full">
          <div className={`p-4 rounded-2xl text-white shadow-lg ${selectedVideo.color}`}>
            {selectedVideo.icon}
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-black text-gray-800 leading-tight">{selectedVideo.name}</h3>
            <p className="text-sm text-gray-500 mt-1">{selectedVideo.description}</p>
          </div>
        </div>
        
        <a 
          href={`https://www.youtube.com/watch?v=${selectedVideo.youtubeId}`} 
          target="_blank" 
          rel="noopener noreferrer"
          className="shrink-0 flex items-center gap-2 bg-rose-500 hover:bg-rose-600 text-white px-6 py-3 rounded-2xl font-bold text-sm transition-all shadow-lg shadow-rose-100 active:scale-95"
        >
          <ExternalLink className="w-4 h-4" />
          فتح في يوتيوب
        </a>
      </div>

      {/* Playlist Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {videoTracks.map((track) => (
          <button 
            key={track.id}
            onClick={() => setSelectedVideo(track)}
            className={`w-full p-3 rounded-3xl border-2 transition-all flex items-center gap-4 group relative overflow-hidden ${
              selectedVideo.id === track.id 
                ? 'bg-pink-50 border-pink-400 shadow-md ring-4 ring-pink-50' 
                : 'bg-white border-transparent hover:border-gray-100 hover:shadow-md'
            }`}
          >
            <div className="relative shrink-0 overflow-hidden rounded-2xl w-24 h-16 shadow-inner bg-gray-100">
              <img 
                src={`https://img.youtube.com/vi/${track.youtubeId}/mqdefault.jpg`} 
                alt={track.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/10 transition-colors">
                <Play className="w-6 h-6 text-white fill-white opacity-90" />
              </div>
            </div>

            <div className="text-right flex-1 min-w-0">
              <h4 className={`font-bold text-xs md:text-sm truncate mb-1 ${selectedVideo.id === track.id ? 'text-pink-600' : 'text-gray-800'}`}>
                {track.name}
              </h4>
              <span className="text-[10px] text-gray-400 bg-gray-50 px-2 py-0.5 rounded-full border border-gray-100">
                {track.type === 'sensory' ? 'فيديو بصري' : track.type === 'noise' ? 'أصوات نوم' : 'موسيقى هادئة'}
              </span>
            </div>
          </button>
        ))}
      </div>

      {/* Error Help & Tips */}
      <div className="bg-amber-50 rounded-3xl p-6 border border-amber-100 flex gap-4 items-start shadow-sm">
        <div className="bg-amber-100 p-2 rounded-xl shrink-0">
          <AlertCircle className="w-5 h-5 text-amber-600" />
        </div>
        <div className="text-right">
          <h4 className="font-bold text-amber-800 text-sm mb-1">هل يظهر خطأ في التشغيل؟</h4>
          <p className="text-xs text-amber-700 leading-relaxed font-medium">
            إذا ظهرت رسالة "خطأ" أو "مشاهدة على يوتيوب"، اضغطي على زر <b>"تحديث المشغل"</b> في زاوية الفيديو، أو استخدمي زر <b>"فتح في يوتيوب"</b> لتشغيل الفيديو مباشرة في تطبيق يوتيوب الرسمي لضمان أفضل جودة.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LullabyPlayer;//
