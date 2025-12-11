
import React, { useState } from 'react';
import { UserSkinProfile, SkinConcernType } from '../types';

interface SurveyProps {
  onComplete: (data: Partial<UserSkinProfile>) => void;
}

type QuestionType = 'SINGLE' | 'MULTI';

interface Question {
  id: number;
  section: string;
  text: string;
  type: QuestionType;
  options: { label: string; value: string }[];
  key: string; // Key to store in answers object
}

const QUESTIONS: Question[] = [
  // --- SECTION 1: SKIN BASICS (Mapped to Schema) ---
  {
    id: 1,
    section: "Skin Basics",
    text: "How does your skin feel 2 hours after washing?",
    type: 'SINGLE',
    key: 'skinType',
    options: [
      { label: 'Tight & Dry', value: 'Dry' },
      { label: 'Shiny all over', value: 'Oily' },
      { label: 'Oily T-zone, Dry cheeks', value: 'Combination' },
      { label: 'Red & Itchy', value: 'Sensitive' },
      { label: 'Comfortable', value: 'Normal' }
    ]
  },
  {
    id: 2,
    section: "Skin Basics",
    text: "What are your main concerns? (Select all that apply)",
    type: 'MULTI',
    key: 'primaryConcerns',
    options: Object.values(SkinConcernType).map(c => ({ label: c, value: c }))
  },
  {
    id: 3,
    section: "Skin Basics",
    text: "Do you have any known ingredient sensitivities?",
    type: 'MULTI',
    key: 'sensitivities',
    options: [
      { label: 'Fragrance / Parfum', value: 'Fragrance' },
      { label: 'Alcohol', value: 'Alcohol Denat' },
      { label: 'Essential Oils', value: 'Essential Oils' },
      { label: 'Retinol', value: 'Retinol' },
      { label: 'Vitamin C', value: 'Vitamin C' },
      { label: 'None', value: 'None' }
    ]
  },

  // --- SECTION 2: SKIN DEEP DIVE ---
  {
    id: 4,
    section: "Skin Deep Dive",
    text: "How often do you wear sunscreen?",
    type: 'SINGLE',
    key: 'sunscreen',
    options: [
      { label: 'Every single day', value: 'Daily' },
      { label: 'Most days', value: 'Often' },
      { label: 'Only when sunny', value: 'Sometimes' },
      { label: 'Rarely / Never', value: 'Never' }
    ]
  },
  {
    id: 5,
    section: "Skin Deep Dive",
    text: "Do you experience breakouts? If so, where?",
    type: 'MULTI',
    key: 'breakoutLocation',
    options: [
      { label: 'I rarely break out', value: 'None' },
      { label: 'Chin & Jawline (Hormonal)', value: 'Chin' },
      { label: 'Forehead', value: 'Forehead' },
      { label: 'Cheeks', value: 'Cheeks' },
      { label: 'T-Zone', value: 'T-Zone' }
    ]
  },
  {
    id: 6,
    section: "Skin Deep Dive",
    text: "How would you describe your pores?",
    type: 'SINGLE',
    key: 'pores',
    options: [
      { label: 'Invisible / Small', value: 'Small' },
      { label: 'Visible on nose/chin', value: 'Medium' },
      { label: 'Large & Visible all over', value: 'Large' }
    ]
  },
  {
    id: 7,
    section: "Skin Deep Dive",
    text: "Does your skin get red or flush easily (e.g., after exercise/heat)?",
    type: 'SINGLE',
    key: 'redness',
    options: [
      { label: 'Yes, very easily', value: 'Yes' },
      { label: 'Sometimes', value: 'Sometimes' },
      { label: 'No, rarely', value: 'No' }
    ]
  },
  {
    id: 8,
    section: "Skin Deep Dive",
    text: "How does your skin react to new products?",
    type: 'SINGLE',
    key: 'reactivity',
    options: [
      { label: 'It loves everything (Resilient)', value: 'Resilient' },
      { label: 'Sometimes reacts / breaks out', value: 'Moderate' },
      { label: 'Reacts to almost everything', value: 'Sensitive' }
    ]
  },
  {
    id: 9,
    section: "Skin Deep Dive",
    text: "Do you have dark spots or hyperpigmentation?",
    type: 'MULTI',
    key: 'pigmentation',
    options: [
      { label: 'Yes, from sun damage', value: 'Sun' },
      { label: 'Yes, post-acne marks (PIH)', value: 'Acne' },
      { label: 'Melasma', value: 'Melasma' },
      { label: 'No', value: 'None' }
    ]
  },
  {
    id: 10,
    section: "Skin Deep Dive",
    text: "What is your typical daily makeup usage?",
    type: 'SINGLE',
    key: 'makeup',
    options: [
      { label: 'None / Skincare only', value: 'None' },
      { label: 'Light (Tinted moisturizer/Concealer)', value: 'Light' },
      { label: 'Full coverage foundation', value: 'Heavy' }
    ]
  },

  // --- SECTION 3: DIET & LIFESTYLE ---
  {
    id: 11,
    section: "Lifestyle & Diet",
    text: "How much water do you drink daily?",
    type: 'SINGLE',
    key: 'water',
    options: [
      { label: 'Less than 1 Liter', value: 'Low' },
      { label: '1 - 2 Liters', value: 'Medium' },
      { label: 'More than 2 Liters', value: 'High' }
    ]
  },
  {
    id: 12,
    section: "Lifestyle & Diet",
    text: "How often do you consume dairy products?",
    type: 'SINGLE',
    key: 'dairy',
    options: [
      { label: 'Daily', value: 'High' },
      { label: 'A few times a week', value: 'Moderate' },
      { label: 'Rarely / Never', value: 'Low' }
    ]
  },
  {
    id: 13,
    section: "Lifestyle & Diet",
    text: "How would you rate your sugar intake?",
    type: 'SINGLE',
    key: 'sugar',
    options: [
      { label: 'I have a sweet tooth (High)', value: 'High' },
      { label: 'Moderate', value: 'Moderate' },
      { label: 'I avoid sugar (Low)', value: 'Low' }
    ]
  },
  {
    id: 14,
    section: "Lifestyle & Diet",
    text: "Do you smoke or consume alcohol frequently?",
    type: 'SINGLE',
    key: 'vices',
    options: [
      { label: 'Yes, both', value: 'Both' },
      { label: 'Smoker', value: 'Smoke' },
      { label: 'Alcohol occasionally', value: 'Alcohol' },
      { label: 'No / Rarely', value: 'None' }
    ]
  },
  {
    id: 15,
    section: "Lifestyle & Diet",
    text: "How many hours of sleep do you average?",
    type: 'SINGLE',
    key: 'sleep',
    options: [
      { label: 'Less than 6 hours', value: 'Low' },
      { label: '6 - 8 hours', value: 'Medium' },
      { label: 'More than 8 hours', value: 'High' }
    ]
  }
];

export const Survey: React.FC<SurveyProps> = ({ onComplete }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  
  const currentQuestion = QUESTIONS[currentIndex];
  const progress = ((currentIndex + 1) / QUESTIONS.length) * 100;

  const handleSelect = (value: string) => {
    if (currentQuestion.type === 'SINGLE') {
      // Auto advance for single choice
      setAnswers(prev => ({ ...prev, [currentQuestion.key]: value }));
      setTimeout(() => handleNext(value), 250); // Small delay for visual feedback
    } else {
      // Multi select toggle
      const currentValues = (answers[currentQuestion.key] as string[]) || [];
      let newValues;
      if (currentValues.includes(value)) {
        newValues = currentValues.filter(v => v !== value);
      } else {
        // Exclusive handling for 'None'
        if (value === 'None') newValues = ['None'];
        else newValues = [...currentValues.filter(v => v !== 'None'), value];
      }
      setAnswers(prev => ({ ...prev, [currentQuestion.key]: newValues }));
    }
  };

  const handleNext = (overrideValue?: string) => {
    // Validation check for multi-select (unless overridden by single select auto-advance)
    if (!overrideValue && currentQuestion.type === 'MULTI') {
        if (!answers[currentQuestion.key] || answers[currentQuestion.key].length === 0) {
            return; // Require at least one selection
        }
    }

    if (currentIndex < QUESTIONS.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      finishSurvey();
    }
  };

  const finishSurvey = () => {
    // Process answers into UserSkinProfile format
    const processedData: Partial<UserSkinProfile> = {
      skinType: answers['skinType'] || 'Normal',
      primaryConcerns: answers['primaryConcerns'] || [],
      sensitivities: (answers['sensitivities'] || []).filter((s: string) => s !== 'None'),
      avoid_list: [],
    };

    // Logic: Build Avoid List & Tagline
    const avoidList = [...processedData.sensitivities!]; // Start with explicit sensitivities
    
    // Add logic based on diet/lifestyle
    if (answers['dairy'] === 'High' && answers['primaryConcerns']?.includes(SkinConcernType.ACNE)) {
       // Only internal logic note, but we could add dairy derivatives to avoid list if we were strict
    }
    
    if (answers['sensitivities']?.includes('Alcohol Denat') || answers['skinType'] === 'Dry') {
        avoidList.push('Alcohol Denat', 'SD Alcohol');
    }

    processedData.avoid_list = avoidList;

    onComplete(processedData);
  };

  const isSelected = (val: string) => {
    const curr = answers[currentQuestion.key];
    if (Array.isArray(curr)) return curr.includes(val);
    return curr === val;
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Header / Progress */}
      <div className="sticky top-0 bg-slate-50 z-10 pt-4 px-6 pb-2">
         <div className="flex justify-between items-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">
            <span>{currentQuestion.section}</span>
            <span>{currentIndex + 1} / {QUESTIONS.length}</span>
         </div>
         <div className="h-1.5 bg-slate-200 w-full rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary transition-all duration-500 ease-out rounded-full" 
              style={{ width: `${progress}%` }} 
            />
         </div>
      </div>

      {/* Content */}
      <div className="flex-1 px-6 pt-8 pb-32 max-w-lg mx-auto w-full flex flex-col justify-center">
        <h2 className="text-2xl font-bold text-slate-900 mb-8 leading-tight animate-fade-in">
          {currentQuestion.text}
        </h2>

        <div className="space-y-3">
          {currentQuestion.options.map((opt) => (
            <button
              key={opt.value}
              onClick={() => handleSelect(opt.value)}
              className={`w-full p-4 rounded-2xl border-2 text-left transition-all duration-200 flex justify-between items-center group
                ${isSelected(opt.value) 
                  ? 'border-primary bg-primary-soft/40 text-primary-dark font-bold shadow-sm' 
                  : 'border-white bg-white text-slate-600 hover:border-slate-200 hover:bg-slate-50'
                }`}
            >
              <span>{opt.label}</span>
              {isSelected(opt.value) && (
                <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Footer Controls (Only needed for multi-select to confirm) */}
      <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-slate-50 via-slate-50 to-transparent">
        <div className="max-w-lg mx-auto">
            {currentQuestion.type === 'MULTI' ? (
                <button 
                  onClick={() => handleNext()}
                  disabled={!answers[currentQuestion.key] || answers[currentQuestion.key].length === 0}
                  className="w-full bg-slate-900 text-white font-bold py-4 rounded-2xl shadow-lg hover:bg-slate-800 active:scale-95 transition-all disabled:opacity-50 disabled:scale-100"
                >
                  Continue
                </button>
            ) : (
                <div className="h-14"></div> // Spacer
            )}
        </div>
      </div>
    </div>
  );
};
