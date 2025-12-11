
// Firestore-aligned Schema

export enum SkinConcernType {
  ACNE = 'Acne',
  REDNESS = 'Redness',
  WRINKLES = 'Wrinkles',
  TEXTURE = 'Texture',
  DARK_CIRCLES = 'Dark Circles',
  DULLNESS = 'Dullness'
}

export interface SkinMetric {
  concern: SkinConcernType;
  severity: number; // 1-10
  location?: string;
  notes: string;
}

export interface UserSkinProfile {
  id: string;
  name: string;
  email?: string;
  tagline?: string; // e.g. "The Acne Fighter"
  primaryConcerns: SkinConcernType[];
  sensitivities: string[]; // e.g., "Fragrance", "Alcohol"
  avoid_list: string[]; // STRICT avoid list
  skinType: 'Oily' | 'Dry' | 'Combination' | 'Sensitive' | 'Normal';
  currentMetrics: SkinMetric[]; // The latest analysis
  photoUrl?: string;
}

export interface IngredientAnalysis {
  name: string;
  status: 'SAFE' | 'CAUTION' | 'AVOID' | 'BENEFICIAL';
  reason: string; // Why it matches/mismatches the profile
  function: string; // e.g. "Exfoliant", "Preservative"
}

export interface ProductAnalysisResult {
  productName: string;
  brandName?: string;
  matchScore: number; // 0-100
  verdict: 'YOU NEED THIS' | 'NEUTRAL' | 'YOU DON\'T NEED THIS';
  summary: string;
  ingredients: IngredientAnalysis[];
  keyBenefits: string[];
}

export interface DailyLog {
  id: string;
  userId: string;
  date: string;
  photoUrl?: string; // Base64 for this demo
  metrics: SkinMetric[];
  lifestyleFactors: {
    sleepHours: number;
    waterIntake: number; // glasses
    dietaryTriggers: string[]; // "Dairy", "Sugar"
    stressLevel: number; // 1-5
  };
  correlation_suspect?: string; // AI generated insight linking trigger to issue
}

export type TabView = 'HOME' | 'EXPLORE' | 'SCAN' | 'ROUTINE' | 'PROFILE';

// --- Auth & Onboarding Types ---

export type AuthState = 'GUEST' | 'LOGIN' | 'ONBOARDING_SELFIE' | 'ONBOARDING_SURVEY' | 'AUTHENTICATED';

export interface OnboardingData {
  name?: string;
  email?: string;
  metrics?: SkinMetric[];
  skinType?: UserSkinProfile['skinType'];
  concerns?: SkinConcernType[];
  sensitivities?: string[];
}
