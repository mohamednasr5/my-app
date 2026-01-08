
import React, { useState, useRef, useEffect } from 'react';
import { Mic, Square, Loader2, Baby } from 'lucide-react';

interface RecorderProps {
  onRecordingComplete: (base64Audio: string) => void;
  isAnalyzing: boolean;
}

const Recorder: React.FC<RecorderProps> = ({ onRecordingComplete, isAnalyzing }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<number | null>(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const reader = new FileReader();
        reader.readAsDataURL(audioBlob);
        reader.onloadend = () => {
          const base64String = (reader.result as string).split(',')[1];
          onRecordingComplete(base64String);
        };
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);
      timerRef.current = window.setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } catch (err) {
      console.error("Error accessing microphone:", err);
      alert("يرجى السماح بالوصول إلى الميكروفون لتحليل البكاء.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerRef.current) clearInterval(timerRef.current);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 md:p-10 bg-white rounded-3xl shadow-xl border border-pink-50 transition-all">
      <div className="relative mb-6">
        {isRecording && (
          <div className="absolute inset-0 animate-ping bg-pink-200 rounded-full opacity-40"></div>
        )}
        <button
          onClick={isRecording ? stopRecording : startRecording}
          disabled={isAnalyzing}
          className={`relative z-10 w-20 h-20 md:w-28 md:h-28 rounded-full flex items-center justify-center transition-all active:scale-95 touch-none ${
            isRecording 
              ? 'bg-red-500 hover:bg-red-600 shadow-lg shadow-red-200' 
              : 'bg-gradient-to-tr from-pink-400 to-rose-400 hover:scale-105 shadow-xl shadow-pink-100'
          } ${isAnalyzing ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {isAnalyzing ? (
            <Loader2 className="w-8 h-8 md:w-12 md:h-12 text-white animate-spin" />
          ) : isRecording ? (
            <Square className="w-8 h-8 md:w-12 md:h-12 text-white fill-current" />
          ) : (
            <Mic className="w-8 h-8 md:w-12 md:h-12 text-white" />
          )}
        </button>
      </div>
      
      <div className="text-center px-4">
        <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-2">
          {isRecording ? "جارٍ الاستماع لبكاء طفلك..." : isAnalyzing ? "جارٍ التحليل بالذكاء الاصطناعي..." : "اضغطي للبدء بالتحليل"}
        </h3>
        <p className="text-xs md:text-sm text-gray-400 flex items-center justify-center gap-2">
          {isRecording ? (
            <span className="font-mono text-red-500 font-bold bg-red-50 px-3 py-1 rounded-full">{formatTime(recordingTime)}</span>
          ) : (
            <>
              <Baby className="w-3 h-3 text-pink-400" />
              <span>دعي التطبيق يستمع لمدة 5-10 ثوانٍ لنتائج أدق</span>
            </>
          )}
        </p>
      </div>
    </div>
  );
};

export default Recorder;
