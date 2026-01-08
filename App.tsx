// NannyAI - Smart Baby Cry Assistant
// Main App Component

import React, { useState, useEffect } from 'react';
import Recorder from './components/Recorder';
import AnalysisView from './components/AnalysisView';
import LullabyPlayer from './components/LullabyPlayer';
import MomInspiration from './components/MomInspiration';
import { analyzeCryAudio } from './services/geminiService';
import { AnalysisResult, CryRecord, BabyProfile } from './types';
import { Heart, History, Sparkles, BookOpen, Baby, ShieldCheck, Lock, Music, RefreshCw, Plus, Trash2, CheckCircle2, UserCircle } from 'lucide-react';

const App: React.FC = () => {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [babies, setBabies] = useState<BabyProfile[]>([]);
  const [selectedBabyId, setSelectedBabyId] = useState<string>('');
  const [showAddBaby, setShowAddBaby] = useState(false);
  const [newBabyName, setNewBabyName] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentResult, setCurrentResult] = useState<AnalysisResult | null>(null);
  const [history, setHistory] = useState<CryRecord[]>([]);
  const [activeTab, setActiveTab] = useState<'analyze' | 'history'| 'lullaby' | 'inspiration'>('analyze');

  useEffect(() => {
    const savedAuth = localStorage.getItem('nanny_auth');
    if (savedAuth === 'true') setIsAuthorized(true);
  }, []);

  useEffect(() => {
    const savedBabies = localStorage.getItem('nanny_babies');
    if (savedBabies) {
      try {
        const parsed = JSON.parse(savedBabies);
        setBabies(parsed);
      } catch (e) {
        console.error('Failed to parse babies', e);
      }
    }
  }, []);

  const handleLogin = (pwd: string) => {
    if (pwd === 'nannyai2024') {
      setIsAuthorized(true);
      localStorage.setItem('nanny_auth', 'true');
      setAuthError('');
    } else {
      setAuthError('Invalid password');
    }
  };

  const handleAddBaby = () => {
    if (!newBabyName.trim()) return;
    const newBaby: BabyProfile = {
      id: Date.now().toString(),
      name: newBabyName,
      createdAt: new Date()
    };
    const updated = [...babies, newBaby];
    setBabies(updated);
    localStorage.setItem('nanny_babies', JSON.stringify(updated));
    setNewBabyName('');
    setShowAddBaby(false);
    setSelectedBabyId(newBaby.id);
  };

  const handleAnalysis = async (audioBlob: Blob) => {
    setIsAnalyzing(true);
    try {
      const result = await analyzeCryAudio(audioBlob, selectedBabyId);
      setCurrentResult(result);
      if (result) {
        const record: CryRecord = {
          id: Date.now().toString(),
          babyId: selectedBabyId,
          timestamp: new Date(),
          analysis: result
        };
        setHistory([record, ...history]);
      }
    } catch (error) {
      console.error('Analysis failed:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-blue-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
          <div className="flex items-center justify-center mb-6">
            <Baby className="w-12 h-12 text-pink-500" />
          </div>
          <h1 className="text-3xl font-bold text-center mb-2">مساعد ثاني الذكي</h1>
          <p className="text-gray-600 text-center mb-8">برج اساسية مشفرة خصوصية</p>
          <input
            type="password"
            placeholder="أدخل كلمة المرور"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleLogin(password)}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg mb-4 focus:outline-none focus:border-pink-400"
          />
          {authError && <p className="text-red-500 text-sm mb-4">{authError}</p>}
          <button
            onClick={() => handleLogin(password)}
            className="w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white py-3 rounded-lg font-bold hover:shadow-lg transition-all"
          >
            دخول
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Baby className="w-8 h-8 text-pink-500" />
              <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500">مساعد ثاني الذكي</h1>
            </div>
            <button
              onClick={() => {
                setIsAuthorized(false);
                localStorage.removeItem('nanny_auth');
              }}
              className="px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors flex items-center gap-2"
            >
              <Lock className="w-4 h-4" />
              تسجيل الخروج
            </button>
          </div>

          {/* Baby Selection */}
          <div className="flex gap-2 flex-wrap items-center">
            {babies.map((baby) => (
              <button
                key={baby.id}
                onClick={() => setSelectedBabyId(baby.id)}
                className={`px-4 py-2 rounded-full font-semibold transition-all ${
                  selectedBabyId === baby.id
                    ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-lg'
                    : 'bg-white border-2 border-gray-200 text-gray-700 hover:border-pink-300'
                }`}
              >
                {baby.name}
              </button>
            ))}
            <button
              onClick={() => setShowAddBaby(!showAddBaby)}
              className="px-4 py-2 rounded-full border-2 border-dashed border-pink-300 text-pink-600 hover:bg-pink-50 transition-all flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              إضافة طفل
            </button>
          </div>

          {showAddBaby && (
            <div className="mt-4 flex gap-2">
              <input
                type="text"
                placeholder="اسم الطفل"
                value={newBabyName}
                onChange={(e) => setNewBabyName(e.target.value)}
                className="flex-1 px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-pink-400"
              />
              <button
                onClick={handleAddBaby}
                className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
              >
                إضافة
              </button>
            </div>
          )}
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {!selectedBabyId ? (
          <div className="text-center py-12">
            <UserCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-700 mb-2">اختر أو أضف طفل</h2>
            <p className="text-gray-500">يرجى تحديد طفل لتبدأ التحليل</p>
          </div>
        ) : (
          <>
            {/* Navigation Tabs */}
            <div className="flex gap-2 mb-8 flex-wrap">
              {[
                { id: 'analyze', label: 'التحليل', icon: Heart },
                { id: 'history', label: 'السجل', icon: History },
                { id: 'lullaby', label: 'الأغاني', icon: Music },
                { id: 'inspiration', label: 'نصائح', icon: Sparkles }
              ].map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id as any)}
                  className={`px-6 py-3 rounded-lg font-bold transition-all flex items-center gap-2 ${
                    activeTab === id
                      ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-lg'
                      : 'bg-white text-gray-700 hover:bg-gray-50 border-2 border-gray-200'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {label}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            {activeTab === 'analyze' && (
              <>
                <Recorder onRecording={handleAnalysis} isAnalyzing={isAnalyzing} />
                {currentResult && <AnalysisView result={currentResult} />}
              </>
            )}
            {activeTab === 'history' && <AnalysisView result={null} />}
            {activeTab === 'lullaby' && <LullabyPlayer />}
            {activeTab === 'inspiration' && <MomInspiration />}
          </>
        )}
      </main>
    </div>
  );
};

export default App;
