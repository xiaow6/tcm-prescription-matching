export interface Prescription {
  id: number;
  name: string;
  category: string;
  efficacy: string;
  indication: string;
  symptoms: string;
  patternPoints: string;
  dosage: string;
  precautions: string;
  keywords: string[];
}

export interface UserProfile {
  name: string;
  gender: '男' | '女' | '';
  age: string;
  medicalHistory: string;   // 既往病史：高血压、糖尿病等
  allergies: string;        // 过敏史
  isPregnant?: boolean;     // 女性：是否怀孕
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  prescriptions?: PrescriptionRecommendation[];
  timestamp: number;
}

export interface PrescriptionRecommendation {
  prescription: Prescription;
  matchLevel: 'high' | 'medium' | 'low';
  matchPoints: string[];
  explanation: string;
}

export interface LLM1Output {
  ready: boolean;
  symptoms?: string[];
  symptom_features?: string;
  medical_history?: string;
  tongue_pulse?: string;
  preliminary_pattern?: string;
  search_query?: string;
  possible_category?: string;
  collected_so_far?: string[];
  missing_info?: string[];
  follow_up_question?: string;
}

export interface ConversationState {
  stage: 'collecting' | 'matching';
  roundCount: number;
}

export interface ChatRequest {
  messages: { role: 'user' | 'assistant'; content: string }[];
  stage: 'collecting' | 'matching';
  roundCount: number;
  userProfile?: UserProfile;
  locale?: 'zh' | 'en';
}

export interface SearchResult {
  prescription: Prescription;
  score: number;
  details: {
    patternScore: number;
    keywordScore: number;
    symptomScore: number;
    categoryScore: number;
  };
}
