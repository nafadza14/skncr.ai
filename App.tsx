
import React, { useState } from 'react';
import { SmartMirror } from './components/SmartMirror';
import { ProductScanner } from './components/ProductScanner';
import { Auth } from './components/Auth';
import { Survey } from './components/Survey';
import { Calendar } from './components/Calendar';
import { TabView, UserSkinProfile, AuthState, OnboardingData, DailyRoutineLog, RoutineStep } from './types';
import { MOCK_USERS, GUEST_USER, MOCK_SHELF } from './constants';

// --- Icons ---
const HomeIcon = ({ active }: { active: boolean }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={active ? "#ea4d89" : "#94a3b8"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
);
const ExploreIcon = ({ active }: { active: boolean }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={active ? "#ea4d89" : "#94a3b8"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"></polygon></svg>
);
const RoutineIcon = ({ active }: { active: boolean }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={active ? "#ea4d89" : "#94a3b8"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path><polyline points="14 2 14 8 20 8"></polyline><path d="M9 15l2 2 4-4"></path></svg>
);
const ScanIcon = ({ active }: { active: boolean }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={active ? "#ffffff" : "#ffffff"} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 8V6a2 2 0 0 1 2-2h2" /><path d="M4 16v2a2 2 0 0 0 2 2h2" /><path d="M16 4h2a2 2 0 0 1 2 2v2" /><path d="M16 20h2a2 2 0 0 0 2-2v-2" /><rect x="9" y="9" width="6" height="6" rx="1.5" fill={active ? "#ffffff" : "none"} /></svg>
);
const UserIcon = ({ active }: { active: boolean }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={active ? "#ea4d89" : "#94a3b8"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
);

// --- Helper Components ---

const RoutineChecklist = ({ 
  steps, 
  onToggle,
  availableProducts 
}: { 
  steps: RoutineStep[], 
  onToggle: (idx: number) => void,
  availableProducts: any[]
}) => (
  <div className="space-y-4">
    {steps.map((step, idx) => (
      <div key={idx} className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between">
         <div className="flex items-center gap-4">
            <button 
              onClick={() => onToggle(idx)}
              className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${step.isCompleted ? 'bg-primary border-primary' : 'border-slate-300'}`}
            >
               {step.isCompleted && <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4"><polyline points="20 6 9 17 4 12"/></svg>}
            </button>
            <div>
               <p className={`text-sm font-bold ${step.isCompleted ? 'text-slate-800' : 'text-slate-600'}`}>{step.stepName}</p>
               <p className="text-xs text-slate-400">{step.productName || "Select product..."}</p>
            </div>
         </div>
      </div>
    ))}
  </div>
);

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabView>('HOME');
  const [authState, setAuthState] = useState<AuthState>('GUEST');
  const [currentUser, setCurrentUser] = useState<UserSkinProfile>(GUEST_USER);
  const [onboardingData, setOnboardingData] = useState<OnboardingData>({});
  
  // States for sub-views
  const [showProductScanner, setShowProductScanner] = useState(false);
  const [showFaceScanner, setShowFaceScanner] = useState(false);
  
  // Routine Data
  const [routineData, setRoutineData] = useState<DailyRoutineLog>({
     morning: [
       { stepName: "Cleanser", isCompleted: false, productName: "Gentle Foam" },
       { stepName: "Vitamin C", isCompleted: false },
       { stepName: "Moisturizer", isCompleted: false },
       { stepName: "Sunscreen", isCompleted: false }
     ],
     afternoon: [
        { stepName: "Sunscreen Re-apply", isCompleted: false }
     ],
     night: [
        { stepName: "Double Cleanse", isCompleted: false },
        { stepName: "Retinol", isCompleted: false },
        { stepName: "Moisturizer", isCompleted: false }
     ]
  });
  const [routineTab, setRoutineTab] = useState<'Morning'|'Afternoon'|'Night'>('Morning');

  const isGuest = authState === 'GUEST';
  const triggerAuth = () => setAuthState('LOGIN');

  // Handle Routine Toggle
  const toggleRoutineStep = (time: 'morning'|'afternoon'|'night', index: number) => {
     const newData = {...routineData};
     newData[time][index].isCompleted = !newData[time][index].isCompleted;
     setRoutineData(newData);
  };

  // --- Main Render Logic ---

  const renderContent = () => {
    // Overlays take precedence
    if (showProductScanner) return <ProductScanner onClose={() => setShowProductScanner(false)} />;
    if (showFaceScanner) return <SmartMirror onClose={() => setShowFaceScanner(false)} mode="DAILY" />;

    switch (activeTab) {
      case 'HOME':
        return (
          <div className="bg-[#3e2e38] min-h-screen pb-24">
             {/* Header + Calendar */}
             <div className="px-6 pt-8 pb-4">
                 <div className="flex justify-between items-center mb-4 text-white">
                    <div>
                        <p className="text-xs font-medium opacity-80 uppercase tracking-widest">Good Morning</p>
                        <h1 className="text-2xl font-bold">{isGuest ? 'Guest' : currentUser.name}</h1>
                    </div>
                    <button onClick={() => setActiveTab('PROFILE')} className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white font-bold border border-white/30">
                        {currentUser.name[0]}
                    </button>
                 </div>
                 <Calendar />
             </div>

             {/* Content Body */}
             <div className="bg-[#F8FAFC] rounded-t-[2.5rem] min-h-screen px-6 py-8 -mt-6">
                
                {/* Getting Started / Analysis Card */}
                <div className="bg-[#2d2a32] text-white p-6 rounded-[2rem] mb-6 shadow-xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary rounded-full blur-[3rem] opacity-20 -mt-6 -mr-6"></div>
                    <div className="flex justify-between items-center mb-4 relative z-10">
                        <h3 className="text-lg font-bold">Getting Started 🌱</h3>
                    </div>
                    
                    {isGuest ? (
                        <div className="space-y-4 relative z-10">
                            <p className="text-sm text-slate-300">Start your journey to better skin.</p>
                            <button onClick={triggerAuth} className="w-full py-3 bg-primary rounded-xl font-bold text-sm hover:bg-primary-dark transition-colors">Create Account</button>
                        </div>
                    ) : (
                        <div className="space-y-4 relative z-10">
                            <div className="flex items-start gap-3">
                                <div className="w-6 h-6 rounded-full border-2 border-primary flex items-center justify-center mt-0.5">
                                    <div className="w-3 h-3 bg-primary rounded-full"></div>
                                </div>
                                <div>
                                    <p className="font-bold text-sm">Start your first routine</p>
                                    <p className="text-xs text-slate-400 mt-1">Logged 3 products today</p>
                                </div>
                            </div>
                            
                            {/* Product Highlights Card */}
                            <div className="bg-white/5 p-4 rounded-xl border border-white/10 mt-2">
                                <div className="flex gap-4 items-center">
                                    <div className="w-10 h-10 bg-white rounded-lg p-1">
                                        <img src="https://via.placeholder.com/40" className="w-full h-full object-contain" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-white">Jelly Joker</p>
                                        <p className="text-[10px] text-slate-400">Geek & Gorgeous</p>
                                    </div>
                                </div>
                            </div>

                            <button onClick={() => setActiveTab('ROUTINE')} className="w-full py-3 bg-primary/20 text-primary border border-primary/50 rounded-xl font-bold text-sm mt-2">Check Routine</button>
                        </div>
                    )}
                </div>

                {/* Products Used Section */}
                {!isGuest && (
                    <div className="mb-6">
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Your Product Use</h3>
                        <div className="flex gap-3 overflow-x-auto no-scrollbar">
                           {(MOCK_SHELF[currentUser.id] || []).slice(0,3).map((p,i) => (
                               <div key={i} className="min-w-[140px] bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center text-center">
                                   <div className="w-10 h-10 bg-slate-50 rounded-full mb-2 flex items-center justify-center text-xl">🧴</div>
                                   <p className="text-xs font-bold text-slate-800 line-clamp-1">{p.productName}</p>
                                   <p className="text-[10px] text-slate-400">{p.brandName}</p>
                               </div>
                           ))}
                        </div>
                    </div>
                )}

                {/* Tip of the Day */}
                <div className="mb-24">
                     <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 text-center">Tip of the Day</h3>
                     <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm text-center">
                        <p className="text-slate-600 text-sm font-medium leading-relaxed">
                           "Based on your scan, your skin barrier seems slightly compromised. Avoid exfoliants tonight and focus on hydration."
                        </p>
                        <div className="flex justify-center gap-4 mt-4 text-slate-400 text-xs">
                           <span className="flex items-center gap-1">❤️ 256</span>
                           <span className="flex items-center gap-1">💬 12</span>
                        </div>
                     </div>
                </div>
             </div>
          </div>
        );

      case 'EXPLORE':
        return (
           <div className="bg-[#F8FAFC] min-h-screen px-6 py-8 pb-28">
              <h1 className="text-2xl font-bold text-slate-900 mb-6">Explore</h1>
              
              <div className="grid grid-cols-2 gap-4">
                  {/* Scan Bottle Card */}
                  <div 
                    onClick={() => { if(isGuest) triggerAuth(); else setShowProductScanner(true); }}
                    className="col-span-2 h-48 bg-slate-900 rounded-[2rem] relative overflow-hidden p-6 flex flex-col justify-end group active:scale-95 transition-all cursor-pointer"
                  >
                      <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full -mr-10 -mt-10 blur-2xl"></div>
                      <div className="absolute top-6 right-6 w-12 h-12 bg-white/10 rounded-full flex items-center justify-center backdrop-blur text-white">
                         <ScanIcon active={true} />
                      </div>
                      <h3 className="text-xl font-bold text-white relative z-10">Scan Bottle / Pack</h3>
                      <p className="text-slate-400 text-xs mt-1 relative z-10 w-2/3">Analyze ingredients instantly for suitability.</p>
                  </div>

                  {/* Other placeholders */}
                  <div className="bg-white p-5 rounded-[2rem] border border-slate-100 shadow-sm h-40 flex flex-col justify-between">
                     <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center text-orange-500 text-xl">✨</div>
                     <p className="font-bold text-slate-800">Trending</p>
                  </div>
                  <div className="bg-white p-5 rounded-[2rem] border border-slate-100 shadow-sm h-40 flex flex-col justify-between">
                     <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-500 text-xl">💧</div>
                     <p className="font-bold text-slate-800">Hydration</p>
                  </div>
              </div>
              
              <div className="mt-8">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Community Picks</h3>
                <div className="space-y-4">
                    {[1,2].map(i => (
                        <div key={i} className="bg-white p-4 rounded-2xl border border-slate-100 flex gap-4 items-center">
                            <div className="w-12 h-12 bg-slate-100 rounded-xl"></div>
                            <div>
                                <p className="font-bold text-slate-800 text-sm">Review: CeraVe Cleanser</p>
                                <p className="text-xs text-slate-400">by @skincare_junkie</p>
                            </div>
                        </div>
                    ))}
                </div>
              </div>
           </div>
        );

      case 'SCAN':
        // Middle button logic usually just overlays, but if accessed via tab:
        return (
            <div className="bg-slate-900 h-full flex flex-col items-center justify-center p-8 text-center pb-24">
                <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mb-6 shadow-2xl shadow-primary/50">
                    <ScanIcon active={true} />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">Start Analysis</h2>
                <p className="text-slate-400 text-sm mb-8">Choose what you want to analyze today</p>
                
                <div className="w-full space-y-4 max-w-xs">
                    <button onClick={() => { if(isGuest) triggerAuth(); else setShowFaceScanner(true); }} className="w-full py-4 bg-white rounded-2xl font-bold text-slate-900 shadow-lg active:scale-95 transition-transform flex items-center justify-center gap-2">
                        <span>👤</span> Face Scan
                    </button>
                    <button onClick={() => { if(isGuest) triggerAuth(); else setShowProductScanner(true); }} className="w-full py-4 bg-white/10 text-white border border-white/20 rounded-2xl font-bold active:scale-95 transition-transform flex items-center justify-center gap-2">
                        <span>🧴</span> Product Scan
                    </button>
                </div>
            </div>
        );

      case 'ROUTINE':
        if(isGuest) {
            return (
                <div className="flex flex-col items-center justify-center h-full p-8 text-center pb-24">
                    <h2 className="text-xl font-bold text-slate-800 mb-2">Track your journey</h2>
                    <p className="text-slate-500 text-sm mb-6">Log in to create your personalized routine.</p>
                    <button onClick={triggerAuth} className="px-8 py-3 bg-primary text-white rounded-full font-bold">Log In</button>
                </div>
            );
        }
        return (
           <div className="bg-[#F8FAFC] min-h-screen px-6 py-8 pb-32 flex flex-col">
              <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-slate-900">Skin Log</h1>
                <p className="text-xs font-bold text-primary bg-primary-soft px-3 py-1 rounded-full">{new Date().toLocaleDateString()}</p>
              </div>

              {/* Selfie Trigger */}
              <button 
                onClick={() => setShowFaceScanner(true)}
                className="w-full bg-slate-900 text-white p-6 rounded-[2rem] mb-8 flex items-center justify-between shadow-xl active:scale-95 transition-transform"
              >
                  <div className="text-left">
                      <p className="font-bold text-lg">Log Face Condition</p>
                      <p className="text-xs text-slate-400 mt-1">Take a daily selfie to track progress</p>
                  </div>
                  <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center text-xl">📸</div>
              </button>

              {/* Time Tabs */}
              <div className="flex bg-white p-1 rounded-2xl mb-6 border border-slate-100 shadow-sm">
                  {['Morning', 'Afternoon', 'Night'].map((t) => (
                      <button 
                        key={t}
                        onClick={() => setRoutineTab(t as any)}
                        className={`flex-1 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${routineTab === t ? 'bg-primary text-white shadow-md' : 'text-slate-400'}`}
                      >
                          {t}
                      </button>
                  ))}
              </div>

              {/* Routine Checklist */}
              <div className="flex-1 overflow-y-auto no-scrollbar">
                  <RoutineChecklist 
                    steps={routineData[routineTab.toLowerCase() as 'morning'|'afternoon'|'night']} 
                    onToggle={(idx) => toggleRoutineStep(routineTab.toLowerCase() as any, idx)}
                    availableProducts={MOCK_SHELF[currentUser.id]}
                  />
                  
                  <button className="w-full mt-6 py-4 border-2 border-dashed border-slate-200 rounded-2xl text-slate-400 font-bold text-sm hover:bg-white hover:border-primary/30 hover:text-primary transition-colors">
                      + Add Product to {routineTab}
                  </button>
              </div>
           </div>
        );

      case 'PROFILE':
        return (
            <div className="bg-[#F8FAFC] min-h-screen px-6 py-8 pb-28">
               <div className="flex flex-col items-center mb-8">
                  <div className="w-24 h-24 rounded-full bg-slate-200 mb-4 overflow-hidden border-4 border-white shadow-xl">
                      {currentUser.photoUrl ? <img src={currentUser.photoUrl} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-3xl font-bold text-slate-400">{currentUser.name[0]}</div>}
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900">{currentUser.name}</h2>
                  <p className="text-slate-500 text-sm">{currentUser.tagline}</p>
               </div>

               <div className="space-y-6">
                   <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
                       <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Skin Profile</h3>
                       <div className="grid grid-cols-2 gap-4">
                           <div className="p-3 bg-slate-50 rounded-xl">
                               <p className="text-[10px] text-slate-400 uppercase">Type</p>
                               <p className="font-bold text-slate-800">{currentUser.skinType}</p>
                           </div>
                           <div className="p-3 bg-slate-50 rounded-xl">
                               <p className="text-[10px] text-slate-400 uppercase">Concern</p>
                               <p className="font-bold text-slate-800">{currentUser.primaryConcerns[0]}</p>
                           </div>
                       </div>
                   </div>

                   <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
                       <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">My Shelf ({MOCK_SHELF[currentUser.id]?.length || 0})</h3>
                       <div className="space-y-3">
                           {(MOCK_SHELF[currentUser.id] || []).map((p, i) => (
                               <div key={i} className="flex items-center gap-3 border-b border-slate-50 pb-3 last:border-0 last:pb-0">
                                   <div className={`w-2 h-full min-h-[30px] rounded-full ${p.matchScore > 80 ? 'bg-green-400' : 'bg-red-400'}`}></div>
                                   <div className="flex-1">
                                       <p className="font-bold text-sm text-slate-800">{p.productName}</p>
                                       <p className="text-xs text-slate-400">{p.brandName}</p>
                                   </div>
                               </div>
                           ))}
                       </div>
                   </div>
               </div>
               
               {isGuest ? (
                   <button onClick={triggerAuth} className="w-full mt-8 py-4 bg-primary text-white rounded-xl font-bold">Sign In / Register</button>
               ) : (
                   <button onClick={() => setAuthState('GUEST')} className="w-full mt-8 py-4 text-red-500 font-bold">Log Out</button>
               )}
            </div>
        );
      
      default: return null;
    }
  };

  // --- Auth & Onboarding Flow ---
  if (authState === 'LOGIN') return <Auth onLogin={(n) => { setAuthState('ONBOARDING_SURVEY'); setOnboardingData({name: n}); }} />;
  if (authState === 'ONBOARDING_SURVEY') return <Survey onComplete={(d) => { setOnboardingData(prev => ({...prev, ...d})); setAuthState('ONBOARDING_SELFIE'); }} />;
  if (authState === 'ONBOARDING_SELFIE') return <SmartMirror onClose={() => { setCurrentUser({...currentUser, ...onboardingData, id: 'user_new'} as UserSkinProfile); setAuthState('AUTHENTICATED'); }} mode="ONBOARDING" onAnalysisComplete={(metrics) => { setOnboardingData(prev => ({...prev, metrics})); }} />;

  return (
    <div className="bg-[#F8FAFC] min-h-screen font-sans flex flex-col select-none max-w-md mx-auto relative overflow-hidden shadow-2xl">
      <main className="flex-1 overflow-hidden h-screen overflow-y-auto no-scrollbar relative">
          {renderContent()}
      </main>
      
      {/* Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-lg border-t border-slate-100 h-[90px] px-6 flex justify-between items-start pt-4 z-[100] max-w-md mx-auto pb-safe">
         <button onClick={() => setActiveTab('HOME')} className="flex flex-col items-center gap-1.5 w-14 group">
            <HomeIcon active={activeTab === 'HOME'} />
            <span className={`text-[9px] font-bold uppercase tracking-wide transition-colors ${activeTab === 'HOME' ? 'text-primary' : 'text-slate-300 group-hover:text-slate-400'}`}>Home</span>
         </button>
         
         <button onClick={() => setActiveTab('EXPLORE')} className="flex flex-col items-center gap-1.5 w-14 group">
            <ExploreIcon active={activeTab === 'EXPLORE'} />
            <span className={`text-[9px] font-bold uppercase tracking-wide transition-colors ${activeTab === 'EXPLORE' ? 'text-primary' : 'text-slate-300 group-hover:text-slate-400'}`}>Explore</span>
         </button>
         
         {/* Floating Scan Button (Accesses Scan Tab directly) */}
         <button onClick={() => setActiveTab('SCAN')} className="relative -top-6">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center shadow-xl transition-all duration-300 transform ${activeTab === 'SCAN' ? 'bg-primary scale-110 shadow-primary/40' : 'bg-slate-900 scale-100 hover:scale-105'}`}>
                <ScanIcon active={true} />
            </div>
         </button>
         
         <button onClick={() => setActiveTab('ROUTINE')} className="flex flex-col items-center gap-1.5 w-14 group">
            <RoutineIcon active={activeTab === 'ROUTINE'} />
            <span className={`text-[9px] font-bold uppercase tracking-wide transition-colors ${activeTab === 'ROUTINE' ? 'text-primary' : 'text-slate-300 group-hover:text-slate-400'}`}>Routine</span>
         </button>
         
         <button onClick={() => setActiveTab('PROFILE')} className="flex flex-col items-center gap-1.5 w-14 group">
            <UserIcon active={activeTab === 'PROFILE'} />
            <span className={`text-[9px] font-bold uppercase tracking-wide transition-colors ${activeTab === 'PROFILE' ? 'text-primary' : 'text-slate-300 group-hover:text-slate-400'}`}>Profile</span>
         </button>
      </nav>
    </div>
  );
};

export default App;
