
export enum CryReason {
  HUNGER = 'الجوع',
  SLEEPY = 'النعاس',
  DISCOMFORT = 'عدم الارتياح (حفاضة متسخة/ملابس ضيقة)',
  PAIN = 'الألم (مغص/غازات)',
  BORDOM = 'الملل/الرغبة في الاهتمام',
  UNKNOWN = 'غير معروف'
}

export interface BabyProfile {
  id: string;
  name: string;
  age: string;
  gender: 'boy' | 'girl';
}

export interface AnalysisResult {
  reason: CryReason;
  confidence: number;
  explanation: string;
  advice: string[];
  severity: 'low' | 'medium' | 'high';
}

export interface CryRecord {
  id: string;
  babyId: string;
  timestamp: Date;
  duration: number;
  result: AnalysisResult;
  audioUrl?: string;
}
