
import { GoogleGenAI, Type } from "@google/genai";
import { CryReason, AnalysisResult } from "../types";

// Using gemini-3-flash-preview as it supports multimodal (audio) analysis via generateContent
const MODEL_NAME = 'gemini-3-flash-preview';

export const analyzeCryAudio = async (base64Audio: string): Promise<AnalysisResult> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  
  const systemInstruction = `
    أنت خبير في تحليل صوت بكاء الأطفال الرضع. 
    مهمتك هي تحليل المقطع الصوتي المقدم وتحديد السبب المحتمل للبكاء بناءً على الأنماط الصوتية (الحدة، التردد، الوقفات، النبرة).
    
    الأسباب المحتملة تشمل:
    - الجوع: يكون عادة بكاءً إيقاعياً يبدأ منخفضاً ثم يزداد.
    - النعاس: بكاء متقطع، نبرة "أنّة" خفيفة، فرك العينين المحتمل.
    - الألم (مغص): صرخة مفاجئة وحادة ومكثفة.
    - عدم الارتياح: بكاء نبرته منخفضة ومستمرة.
    - الملل: بكاء يبدأ ويتوقف ليرى إذا كانت هناك استجابة.

    يجب أن تكون النتيجة بتنسيق JSON حصراً.
  `;

  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: 'audio/webm',
              data: base64Audio,
            },
          },
          {
            text: "حلل صوت بكاء الطفل هذا وأعطني النتائج باللغة العربية بتنسيق JSON."
          }
        ]
      },
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            reason: {
              type: Type.STRING,
              description: 'سبب البكاء المحتمل باللغة العربية',
            },
            confidence: {
              type: Type.NUMBER,
              description: 'نسبة التأكد من 0 إلى 100',
            },
            explanation: {
              type: Type.STRING,
              description: 'شرح صوتي لماذا تم اختيار هذا السبب',
            },
            advice: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'قائمة من 3 نصائح عملية للأم',
            },
            severity: {
              type: Type.STRING,
              description: 'مدى إلحاح الموقف: low, medium, high',
            }
          },
          required: ["reason", "confidence", "explanation", "advice", "severity"]
        }
      }
    });

    const resultText = response.text || "{}";
    const data = JSON.parse(resultText);
    
    return {
      reason: data.reason as CryReason,
      confidence: data.confidence,
      explanation: data.explanation,
      advice: data.advice,
      severity: data.severity as 'low' | 'medium' | 'high'
    };
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    throw new Error("فشل تحليل الصوت. يرجى المحاولة مرة أخرى.");
  }
};
