
import React from 'react';
import { AnalysisResult } from '../types';
import { CheckCircle2, Lightbulb, TrendingUp } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

interface AnalysisViewProps {
  result: AnalysisResult;
}

const AnalysisView: React.FC<AnalysisViewProps> = ({ result }) => {
  const chartData = [
    { name: 'Confidence', value: result.confidence },
    { name: 'Remaining', value: 100 - result.confidence },
  ];

  const COLORS = ['#F472B6', '#F3F4F6'];

  const getSeverityStyles = (severity: string) => {
    switch (severity) {
      case 'high': return 'bg-red-100 text-red-700 border-red-200';
      case 'medium': return 'bg-amber-100 text-amber-700 border-amber-200';
      default: return 'bg-green-100 text-green-700 border-green-200';
    }
  };

  return (
    <div className="mt-8 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="bg-white rounded-3xl p-6 shadow-lg border border-gray-100 overflow-hidden">
        <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8">
          <div className="w-28 h-28 md:w-32 md:h-32 shrink-0 relative flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={35}
                  outerRadius={45}
                  paddingAngle={5}
                  dataKey="value"
                  startAngle={90}
                  endAngle={450}
                  stroke="none"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none pt-1">
              <span className="text-lg md:text-xl font-black text-pink-500">{result.confidence}%</span>
              <p className="text-[8px] md:text-[10px] text-gray-400 font-bold uppercase tracking-tighter">دقة</p>
            </div>
          </div>

          <div className="flex-1 text-center md:text-right">
            <div className="flex flex-col md:flex-row items-center gap-2 mb-3">
              <span className={`px-3 py-1 rounded-full text-[10px] md:text-xs font-bold border ${getSeverityStyles(result.severity)}`}>
                {result.severity === 'high' ? 'عاجل' : result.severity === 'medium' ? 'انتباه' : 'طبيعي'}
              </span>
              <h2 className="text-xl md:text-2xl font-black text-gray-800">السبب المحتمل: {result.reason}</h2>
            </div>
            <p className="text-sm md:text-base text-gray-600 leading-relaxed italic bg-gray-50 p-4 rounded-2xl border border-gray-100">
              " {result.explanation} "
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-pink-50 rounded-2xl p-5 md:p-6 border border-pink-100">
          <h4 className="flex items-center gap-2 text-pink-700 font-bold mb-4">
            <Lightbulb className="w-5 h-5" />
            ماذا تفعلين الآن؟
          </h4>
          <ul className="space-y-3">
            {result.advice.map((item, idx) => (
              <li key={idx} className="flex items-start gap-3 text-gray-700 text-sm md:text-base leading-snug">
                <CheckCircle2 className="w-4 h-4 text-pink-400 mt-0.5 shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-indigo-50 rounded-2xl p-5 md:p-6 border border-indigo-100 flex flex-col justify-center">
          <h4 className="flex items-center gap-2 text-indigo-700 font-bold mb-3">
            <TrendingUp className="w-5 h-5" />
            ملاحظة إضافية
          </h4>
          <p className="text-gray-600 text-xs md:text-sm leading-relaxed">
            تذكري أن غريزة الأم هي الأقوى. هذا التحليل هو أداة مساعدة لمؤازرتكِ فقط. إذا شعرتِ أن بكاء الطفل غير طبيعي أو كان لديه حرارة، استشيري الطبيب فوراً.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AnalysisView;
