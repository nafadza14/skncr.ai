
export const APP_NAME = "skncr ai";

// --- System Prompts for Gemini ---

export const DERMATOLOGIST_SYSTEM_INSTRUCTION = `
You are Dr. Aura, a clinical yet empathetic AI Dermatologist.
Analyze facial skin images for: Acne, Redness, Texture, Wrinkles, Dark Circles.
Tone: Supportive, professional.
Output: Valid JSON matching the required schema.
`;

export const CHEMIST_SYSTEM_INSTRUCTION = `
You are The Chemist. Analyze ingredient lists against a user profile.
- 'YOU NEED THIS': Solves primary concern.
- 'YOU DON'T NEED THIS': Triggers sensitivities or avoid list.
- 'NEUTRAL': Maintenance.
Output: Valid JSON matching schema. Strictly return ONLY the JSON block.
`;

// --- Mock Database (Exhaustive Dummy Data) ---

import { UserSkinProfile, SkinConcernType, DailyLog, ProductAnalysisResult } from './types';

export const MOCK_USERS: Record<string, UserSkinProfile> = {
  'user_a': {
    id: 'user_a',
    name: 'Mia',
    tagline: 'Active Acne Fighter',
    skinType: 'Oily',
    primaryConcerns: [SkinConcernType.ACNE, SkinConcernType.TEXTURE],
    sensitivities: [],
    avoid_list: ['Coconut Oil', 'Cocoa Butter', 'Isopropyl Myristate'],
    currentMetrics: [
      { concern: SkinConcernType.ACNE, severity: 7, notes: 'Inflamed clusters on cheeks' },
      { concern: SkinConcernType.TEXTURE, severity: 5, notes: 'Rough patches on forehead' }
    ]
  },
  'user_b': {
    id: 'user_b',
    name: 'Liam',
    tagline: 'Sensitive & Redness Focus',
    skinType: 'Sensitive',
    primaryConcerns: [SkinConcernType.REDNESS],
    sensitivities: ['Fragrance', 'Alcohol Denat'],
    avoid_list: ['Essential Oils', 'Limonene', 'Menthol'],
    currentMetrics: [
      { concern: SkinConcernType.REDNESS, severity: 8, notes: 'Visible capillary expansion on nose' }
    ]
  }
};

export const MOCK_LOGS: DailyLog[] = [
  {
    id: 'l1', userId: 'user_a', date: '2023-10-24',
    metrics: [{ concern: SkinConcernType.ACNE, severity: 8, notes: 'Morning flare up' }],
    lifestyleFactors: { sleepHours: 6, waterIntake: 4, dietaryTriggers: ['Dairy'], stressLevel: 4 }
  },
  {
    id: 'l2', userId: 'user_a', date: '2023-10-23',
    metrics: [{ concern: SkinConcernType.ACNE, severity: 7, notes: 'Stable' }],
    lifestyleFactors: { sleepHours: 8, waterIntake: 8, dietaryTriggers: [], stressLevel: 2 }
  }
];

// Pre-analyzed shelf items for users
export const MOCK_SHELF: Record<string, ProductAnalysisResult[]> = {
  'user_a': [
    {
      productName: "BHA Liquid Exfoliant",
      brandName: "Skin Clinic",
      matchScore: 92,
      verdict: 'YOU NEED THIS',
      summary: "High concentration of Salicylic Acid will effectively clear the cystic acne on your cheeks.",
      ingredients: [
        { name: "Salicylic Acid", status: 'BENEFICIAL', function: "Exfoliant", reason: "Directly targets Mia's Acne concern." },
        { name: "Green Tea Extract", status: 'SAFE', function: "Antioxidant", reason: "Calms inflammation." }
      ],
      keyBenefits: ["Deep Pore Cleansing", "Oil Control"]
    },
    {
      productName: "Barrier Relief Cream",
      brandName: "Oasis",
      matchScore: 40,
      verdict: "YOU DON'T NEED THIS",
      summary: "Contains Isopropyl Myristate which is high on your avoid list and may trigger new breakouts.",
      ingredients: [
        { name: "Isopropyl Myristate", status: 'AVOID', function: "Emollient", reason: "Comedogenic; explicitly on Mia's avoid list." }
      ],
      keyBenefits: ["Deep Hydration"]
    }
  ],
  'user_b': [
    {
      productName: "Soothing Cica Balm",
      brandName: "Centella Hub",
      matchScore: 95,
      verdict: 'YOU NEED THIS',
      summary: "Fragrance-free formula is perfect for your sensitive, redness-prone skin.",
      ingredients: [
        { name: "Madecassoside", status: 'BENEFICIAL', function: "Healing", reason: "Reduces redness visibly." }
      ],
      keyBenefits: ["Redness Relief", "Barrier Repair"]
    }
  ]
};

export const GUEST_USER: UserSkinProfile = {
  id: 'guest', name: 'Guest', tagline: 'Future Glow Getter',
  skinType: 'Normal', primaryConcerns: [], sensitivities: [], avoid_list: [], currentMetrics: []
};

export const GET_ACTIVE_USER = () => MOCK_USERS['user_a'];
