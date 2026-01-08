
import React, { useState, useEffect } from 'react';
import { Heart, RefreshCw, Sparkles, Star } from 'lucide-react';

const messages = [
  "أنتِ تقومين بعمل عظيم. طفلكِ يراكِ بطله الخارق.",
  "غريزة الأمومة لديكِ هي أقوى بوصلة. ثقي بقلبكِ دائماً.",
  "الاعتناء بنفسكِ ليس رفاهية، بل هو جزء من حبكِ لطفلكِ.",
  "كل لمسة وكل حضن منكِ يبني عالماً من الأمان لصغيركِ.",
  "تذكري أن الأيام الصعبة ستمر، وستبقى الذكريات الجميلة فقط.",
  "أنتِ الأفضل لطفلكِ، ولا أحد يمكنه أن يحل محلكِ.",
  "اليوم قد يكون مرهقاً، لكنكِ تزرعين بذور الحب لمستقبل مشرق.",
  "لا تقارني نفسكِ بالآخرين، رحلتكِ مع طفلكِ فريدة ومميزة.",
  "نفس عميق.. أنتِ صبورة وقوية ومحبة.",
  "ابتسامة طفلكِ هي أكبر شكر على كل ما تبذلينه.",
  "صوتكِ هو أجمل لحن في أذن طفلكِ، طمئنيه بوجودكِ.",
  "لا بأس بطلب المساعدة، الأمومة رحلة تشاركية وليست سباقاً فردياً.",
  "أنتِ تصنعين المعجزات كل يوم، حتى لو لم تري ذلك بوضوح.",
  "طفلكِ يتعلم الحب من خلال عينيكِ وقلبكِ الرقيق.",
  "أعطي نفسكِ الفضل الذي تستحقينه، أنتِ حجر الأساس في هذه الأسرة."
];

const dailyTips = [
  "شرب كوب من الماء الدافئ يساعد على الاسترخاء وتحسين الحالة المزاجية.",
  "جربي التنفس العميق 5 مرات عندما تشعرين بالتوتر.",
  "نوم الطفل في غرفتكِ (وليس في سريركِ) يقلل من مخاطر متلازمة موت الرضع المفاجئ.",
  "تعرض الطفل لضوء الشمس الخفيف صباحاً يساعد في تنظيم دورة نومه.",
  "التحدث مع طفلكِ منذ اليوم الأول ينمي مهاراته اللغوية مستقبلاً.",
  "حضن طفلكِ لمدة 20 ثانية يفرز هرمون الأوكسيتوسين الذي يقلل التوتر لكليكما."
];

const MomInspiration: React.FC = () => {
  const [msgIndex, setMsgIndex] = useState(0);
  const [tipIndex, setTipIndex] = useState(0);
  const [animate, setAnimate] = useState(true);

  const refreshContent = () => {
    setAnimate(false);
    setTimeout(() => {
      setMsgIndex(Math.floor(Math.random() * messages.length));
      setTipIndex(Math.floor(Math.random() * dailyTips.length));
      setAnimate(true);
    }, 150);
  };

  useEffect(() => {
    setMsgIndex(Math.floor(Math.random() * messages.length));
    setTipIndex(Math.floor(Math.random() * dailyTips.length));
    
    const timer = setInterval(refreshContent, 60000); // Refresh every minute
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="space-y-4">
      <div className="bg-gradient-to-br from-pink-500 to-rose-600 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden transition-all group">
        <Sparkles className="w-12 h-12 absolute -right-2 -bottom-2 text-white/10 rotate-12 group-hover:scale-125 transition-transform duration-700" />
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-bold text-lg flex items-center gap-2">
            <Heart className="w-5 h-5 fill-white" />
            كلمة لكِ أيتها الأم..
          </h4>
          <button 
            onClick={refreshContent}
            className="p-2 hover:bg-white/20 rounded-full transition-colors active:rotate-180 duration-500"
            title="تغيير الرسالة"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
        <div className={`min-h-[70px] flex items-center transition-all duration-500 ${animate ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'}`}>
          <p className="text-pink-50 text-sm md:text-base leading-relaxed relative z-10 font-medium italic">
            "{messages[msgIndex]}"
          </p>
        </div>
      </div>

      <div className="bg-white rounded-3xl p-5 shadow-sm border border-pink-100 relative overflow-hidden">
        <div className="flex items-center gap-3 mb-2">
          <div className="bg-pink-100 p-2 rounded-xl">
            <Star className="w-4 h-4 text-pink-500" />
          </div>
          <span className="text-xs font-bold text-pink-600 uppercase tracking-wider">نصيحة اللحظة</span>
        </div>
        <p className={`text-gray-600 text-sm leading-relaxed transition-all duration-500 ${animate ? 'opacity-100' : 'opacity-0'}`}>
          {dailyTips[tipIndex]}
        </p>
      </div>
    </div>
  );
};

export default MomInspiration;
