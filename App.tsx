
import React, { useState } from 'react';
import { SmartMirror } from './components/SmartMirror';
import { ProductScanner } from './components/ProductScanner';
import { Auth } from './components/Auth';
import { Survey } from './components/Survey';
import { Calendar } from './components/Calendar';
import { TabView, UserSkinProfile, AuthState, OnboardingData, DailyRoutineLog, RoutineStep } from './types';
import { MOCK_USERS, GUEST_USER, MOCK_SHELF } from './constants';

// --- Icons (Clean & Rounded Line Style) ---
const HomeIcon = ({ active }: { active: boolean }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill={active ? "#ea4d89" : "none"} stroke={active ? "#ea4d89" : "#a0aeba"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22" stroke={active ? "#ffffff" : "#a0aeba"}></polyline></svg>
);
const ExploreIcon = ({ active }: { active: boolean }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill={active ? "#ea4d89" : "none"} stroke={active ? "#ea4d89" : "#a0aeba"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" stroke={active ? "#ffffff" : "#a0aeba"}></polygon></svg>
);
const RoutineIcon = ({ active }: { active: boolean }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill={active ? "#ea4d89" : "none"} stroke={active ? "#ea4d89" : "#a0aeba"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
);
const ScanIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 7V5a2 2 0 0 1 2-2h2" />
    <path d="M17 3h2a2 2 0 0 1 2 2v2" />
    <path d="M21 17v2a2 2 0 0 1-2 2h-2" />
    <path d="M7 21H5a2 2 0 0 1-2-2v-2" />
    <line x1="7" y1="12" x2="17" y2="12" />
  </svg>
);
const UserIcon = ({ active }: { active: boolean }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill={active ? "#ea4d89" : "none"} stroke={active ? "#ea4d89" : "#a0aeba"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
);

// --- Helper Components ---

const RoutineChecklist = ({ 
  steps, 
  onToggle
}: { 
  steps: RoutineStep[], 
  onToggle: (idx: number) => void
}) => (
  <div className="space-y-3">
    {steps.map((step, idx) => (
      <div 
        key={idx} 
        onClick={() => onToggle(idx)}
        className={`p-4 rounded-3xl flex items-center justify-between transition-all duration-300 cursor-pointer
        ${step.isCompleted 
          ? 'bg-primary-soft border border-transparent shadow-none opacity-80' 
          : 'bg-white border border-slate-50 shadow-card hover:shadow-lg'}`}
      >
         <div className="flex items-center gap-4">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${step.isCompleted ? 'bg-gradient-primary text-white scale-110' : 'bg-slate-100 text-transparent'}`}>
               <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4"><polyline points="20 6 9 17 4 12"/></svg>
            </div>
            <div>
               <p className={`text-sm font-bold ${step.isCompleted ? 'text-primary line-through decoration-primary/50' : 'text-slate-800'}`}>{step.stepName}</p>
               <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wide">{step.productName || "No Product"}</p>
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
       { stepName: "Cleanser", isCompleted: true, productName: "Gentle Foam" },
       { stepName: "Vitamin C", isCompleted: false, productName: "Glow Serum" },
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

  const renderContent = () => {
    if (showProductScanner) return <ProductScanner onClose={() => setShowProductScanner(false)} />;
    if (showFaceScanner) return <SmartMirror onClose={() => setShowFaceScanner(false)} mode="DAILY" />;

    switch (activeTab) {
      case 'HOME':
        return (
          <div className="min-h-screen bg-background pb-32">
             {/* Header Area */}
             <div className="pt-8 pb-4 px-6 bg-white rounded-b-[3rem] shadow-soft mb-6 relative z-10">
                 <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full p-[2px] bg-gradient-primary">
                             <div className="w-full h-full rounded-full bg-white p-[2px] overflow-hidden">
                                {currentUser.photoUrl ? (
                                    <img src={currentUser.photoUrl} className="w-full h-full object-cover rounded-full"/>
                                ) : (
                                    <div className="w-full h-full bg-slate-100 flex items-center justify-center font-bold text-slate-400">{currentUser.name[0]}</div>
                                )}
                             </div>
                        </div>
                        <div>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Hello</p>
                            <h1 className="text-xl font-bold text-slate-800">{currentUser.name.split(' ')[0]}</h1>
                        </div>
                    </div>
                    <button onClick={() => setActiveTab('PROFILE')} className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 shadow-sm border border-slate-100">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
                    </button>
                 </div>
                 <Calendar />
             </div>

             <div className="px-6 space-y-6">
                {/* Hero Gradient Card */}
                <div className="relative w-full h-48 rounded-[2.5rem] bg-gradient-primary p-6 text-white shadow-soft overflow-hidden flex items-center justify-between group">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl -mr-16 -mt-16 group-hover:scale-110 transition-transform duration-700"></div>
                    
                    <div className="relative z-10 flex flex-col justify-center">
                        <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full mb-3 w-fit">
                            <span className="text-[10px] font-bold uppercase tracking-wider">Daily Score</span>
                        </div>
                        <h2 className="text-3xl font-bold mb-1">92<span className="text-lg opacity-80 font-normal">/100</span></h2>
                        <p className="text-sm opacity-90 font-medium">Skin barrier is looking <br/>strong today!</p>
                    </div>

                    <div className="relative z-10 w-24 h-24 relative">
                        {/* CSS Circle Progress Placeholder */}
                        <svg className="w-full h-full transform -rotate-90">
                            <circle cx="48" cy="48" r="40" stroke="rgba(255,255,255,0.2)" strokeWidth="8" fill="none" />
                            <circle cx="48" cy="48" r="40" stroke="white" strokeWidth="8" fill="none" strokeDasharray="251" strokeDashoffset="25" strokeLinecap="round" />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center text-2xl">✨</div>
                    </div>
                </div>

                {/* Getting Started / Actions */}
                <div className="grid grid-cols-2 gap-4">
                     <button onClick={() => setShowFaceScanner(true)} className="bg-white p-5 rounded-3xl shadow-card border border-slate-50 flex flex-col items-center text-center gap-3 active:scale-95 transition-all group hover:shadow-soft">
                         <div className="w-12 h-12 rounded-2xl bg-primary-soft text-primary flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">📸</div>
                         <span className="text-xs font-bold text-slate-700">Scan Face</span>
                     </button>
                     <button onClick={() => setShowProductScanner(true)} className="bg-white p-5 rounded-3xl shadow-card border border-slate-50 flex flex-col items-center text-center gap-3 active:scale-95 transition-all group hover:shadow-soft">
                         <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-500 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">🧴</div>
                         <span className="text-xs font-bold text-slate-700">Check Product</span>
                     </button>
                </div>

                {/* Routine Snapshot */}
                <div>
                    <div className="flex justify-between items-center mb-4 px-2">
                        <h3 className="text-sm font-bold text-slate-800">Morning Routine</h3>
                        <span className="text-xs font-bold text-primary">2/4 Done</span>
                    </div>
                    <div className="flex gap-4 overflow-x-auto no-scrollbar pb-4 -mx-6 px-6">
                        {routineData.morning.map((step, i) => (
                            <div key={i} className="min-w-[140px] bg-white p-4 rounded-3xl border border-slate-50 shadow-card flex flex-col gap-3">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${step.isCompleted ? 'bg-green-100 text-green-600' : 'bg-slate-100 text-slate-300'}`}>
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4"><polyline points="20 6 9 17 4 12"/></svg>
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-slate-700">{step.stepName}</p>
                                    <p className="text-[10px] text-slate-400 truncate">{step.productName}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Tip Card */}
                <div className="bg-gradient-soft p-6 rounded-[2.5rem] border border-white shadow-soft text-center relative overflow-hidden">
                     <div className="absolute top-0 left-0 w-full h-1 bg-gradient-primary"></div>
                     <span className="text-2xl mb-2 block">💡</span>
                     <p className="text-slate-600 text-sm font-medium leading-relaxed">
                       "Hydration is key today. Your analysis shows slightly dry cheeks. Drink water!"
                     </p>
                </div>
             </div>
          </div>
        );

      case 'EXPLORE':
        return (
           <div className="bg-background min-h-screen pb-32">
              <div className="bg-white px-6 pt-10 pb-6 rounded-b-[3rem] shadow-soft mb-6 sticky top-0 z-20">
                 <h1 className="text-2xl font-bold text-slate-900 mb-4">Explore</h1>
                 <div className="relative">
                    <input type="text" placeholder="Ingredients, brands..." className="w-full bg-slate-50 border-none rounded-2xl py-4 pl-12 pr-4 text-sm font-medium focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-slate-400" />
                    <svg className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                 </div>
              </div>
              
              <div className="px-6 space-y-6">
                  {/* Hero Explore Card */}
                  <div 
                    onClick={() => { if(isGuest) triggerAuth(); else setShowProductScanner(true); }}
                    className="w-full h-56 rounded-[2.5rem] relative overflow-hidden p-8 flex flex-col justify-end group active:scale-95 transition-all cursor-pointer shadow-soft"
                  >
                      {/* Dark Gradient Background */}
                      <div className="absolute inset-0 bg-gradient-dark"></div>
                      <img src="https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80&w=600" className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-40 group-hover:scale-105 transition-transform duration-700" />
                      
                      <div className="absolute top-6 right-6 w-14 h-14 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center text-white border border-white/20">
                         <ScanIcon />
                      </div>

                      <div className="relative z-10">
                          <span className="px-3 py-1 rounded-full bg-primary text-white text-[10px] font-bold uppercase tracking-wider mb-2 inline-block">New Feature</span>
                          <h3 className="text-2xl font-bold text-white leading-tight">Scan Bottle <br/>& Analyze</h3>
                          <p className="text-slate-300 text-xs mt-2 font-medium">Instantly check ingredients safety</p>
                      </div>
                  </div>

                  {/* Categories */}
                  <div>
                      <h3 className="text-sm font-bold text-slate-800 mb-4">Categories</h3>
                      <div className="flex gap-3 overflow-x-auto no-scrollbar">
                          {['Acne Safe', 'Clean Beauty', 'Sun Care', 'Hydration', 'Anti-Aging'].map((cat, i) => (
                              <button key={i} className="whitespace-nowrap px-6 py-3 bg-white border border-slate-50 rounded-2xl text-xs font-bold text-slate-600 shadow-card hover:bg-primary-soft hover:text-primary transition-colors">
                                  {cat}
                              </button>
                          ))}
                      </div>
                  </div>

                  {/* Trending Cards */}
                  <div>
                      <h3 className="text-sm font-bold text-slate-800 mb-4">Trending Now</h3>
                      <div className="grid grid-cols-2 gap-4">
                          {[1,2].map(i => (
                             <div key={i} className="bg-white p-5 rounded-[2rem] border border-slate-50 shadow-card flex flex-col gap-4">
                                 <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl ${i===1 ? 'bg-orange-50 text-orange-500' : 'bg-green-50 text-green-500'}`}>
                                     {i===1 ? '🍊' : '🌿'}
                                 </div>
                                 <div>
                                     <h4 className="font-bold text-slate-800 text-sm">{i===1 ? 'Vitamin C' : 'Centella'}</h4>
                                     <p className="text-[10px] text-slate-400 mt-1">Brightening & Glow</p>
                                 </div>
                             </div>
                          ))}
                      </div>
                  </div>
              </div>
           </div>
        );

      case 'SCAN':
        // If accessed directly via bottom nav
        return (
            <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-8 text-center pb-32 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-primary rounded-full blur-[100px] opacity-20 -mr-20 -mt-20"></div>
                <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-500 rounded-full blur-[100px] opacity-20 -ml-20 -mb-20"></div>

                <div className="relative z-10 mb-10">
                    <div className="w-24 h-24 bg-gradient-primary rounded-3xl flex items-center justify-center shadow-glow transform rotate-12">
                         <div className="transform -rotate-12">
                             <ScanIcon />
                         </div>
                    </div>
                </div>

                <h2 className="text-3xl font-bold text-white mb-3 relative z-10">AI Analysis Hub</h2>
                <p className="text-slate-400 text-sm mb-12 max-w-xs relative z-10 font-medium">Advanced diagnostics for your skin and products.</p>
                
                <div className="w-full space-y-4 max-w-xs relative z-10">
                    <button 
                        onClick={() => { if(isGuest) triggerAuth(); else setShowFaceScanner(true); }} 
                        className="w-full py-5 bg-white rounded-3xl font-bold text-slate-900 shadow-xl active:scale-95 transition-transform flex items-center justify-center gap-3 group"
                    >
                        <span className="text-xl group-hover:scale-110 transition-transform">👤</span> 
                        <span>Face Diagnosis</span>
                    </button>
                    <button 
                        onClick={() => { if(isGuest) triggerAuth(); else setShowProductScanner(true); }} 
                        className="w-full py-5 bg-white/10 text-white border border-white/20 backdrop-blur-md rounded-3xl font-bold active:scale-95 transition-transform flex items-center justify-center gap-3 hover:bg-white/20"
                    >
                        <span className="text-xl">🧴</span> 
                        <span>Product Scan</span>
                    </button>
                </div>
            </div>
        );

      case 'ROUTINE':
        if(isGuest) {
            return (
                <div className="flex flex-col items-center justify-center h-screen p-8 text-center pb-24 bg-background">
                    <div className="w-20 h-20 bg-primary-soft rounded-full flex items-center justify-center mb-6 text-primary text-3xl">🔒</div>
                    <h2 className="text-2xl font-bold text-slate-800 mb-2">My Routine</h2>
                    <p className="text-slate-500 text-sm mb-8 font-medium">Log in to create your personalized schedule.</p>
                    <button onClick={triggerAuth} className="px-10 py-4 bg-primary text-white rounded-2xl font-bold shadow-soft">Log In</button>
                </div>
            );
        }
        return (
           <div className="bg-background min-h-screen px-6 py-10 pb-32">
              <div className="flex justify-between items-end mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Skin Log</h1>
                    <p className="text-sm text-slate-400 font-medium mt-1">Track consistency & progress</p>
                </div>
                <div className="w-12 h-12 bg-white rounded-2xl shadow-card flex items-center justify-center font-bold text-slate-800">
                    {new Date().getDate()}
                </div>
              </div>

              {/* Selfie Trigger Card */}
              <button 
                onClick={() => setShowFaceScanner(true)}
                className="w-full bg-gradient-dark text-white p-6 rounded-[2.5rem] mb-8 flex items-center justify-between shadow-xl active:scale-95 transition-transform overflow-hidden relative group"
              >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-6 -mt-6 group-hover:bg-white/20 transition-colors"></div>
                  <div className="relative z-10 text-left">
                      <p className="font-bold text-lg">Daily Face Check</p>
                      <p className="text-xs text-slate-400 mt-1">Snap a selfie to track changes</p>
                  </div>
                  <div className="relative z-10 w-12 h-12 bg-white/10 backdrop-blur rounded-full flex items-center justify-center text-xl">📸</div>
              </button>

              {/* Custom Tab Switcher */}
              <div className="flex bg-white p-1.5 rounded-[1.5rem] mb-8 shadow-card relative">
                  {['Morning', 'Afternoon', 'Night'].map((t) => (
                      <button 
                        key={t}
                        onClick={() => setRoutineTab(t as any)}
                        className={`flex-1 py-3 rounded-2xl text-xs font-bold uppercase tracking-wider transition-all duration-300 relative z-10 
                        ${routineTab === t ? 'text-white shadow-soft' : 'text-slate-400 hover:text-slate-600'}`}
                      >
                          {t}
                      </button>
                  ))}
                  {/* Sliding Background */}
                  <div 
                    className="absolute top-1.5 bottom-1.5 bg-gradient-primary rounded-2xl transition-all duration-300 shadow-md"
                    style={{
                        left: routineTab === 'Morning' ? '6px' : routineTab === 'Afternoon' ? 'calc(33.33% + 4px)' : 'calc(66.66% + 2px)',
                        width: 'calc(33.33% - 5px)'
                    }}
                  />
              </div>

              {/* Routine Checklist */}
              <div className="pb-10">
                  <RoutineChecklist 
                    steps={routineData[routineTab.toLowerCase() as 'morning'|'afternoon'|'night']} 
                    onToggle={(idx) => toggleRoutineStep(routineTab.toLowerCase() as any, idx)}
                  />
                  
                  <button className="w-full mt-6 py-4 border-2 border-dashed border-slate-200 rounded-3xl text-slate-400 font-bold text-sm hover:bg-white hover:border-primary/30 hover:text-primary transition-colors flex items-center justify-center gap-2">
                      <span>+</span> Add Product
                  </button>
              </div>
           </div>
        );

      case 'PROFILE':
        return (
            <div className="bg-background min-h-screen px-6 py-10 pb-32">
               <div className="flex flex-col items-center mb-10">
                  <div className="w-28 h-28 rounded-full p-1 bg-gradient-primary shadow-glow mb-4">
                      <div className="w-full h-full rounded-full bg-white p-1 overflow-hidden">
                        {currentUser.photoUrl ? <img src={currentUser.photoUrl} className="w-full h-full object-cover rounded-full" /> : <div className="w-full h-full bg-slate-100 flex items-center justify-center text-3xl font-bold text-slate-400">{currentUser.name[0]}</div>}
                      </div>
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900">{currentUser.name}</h2>
                  <p className="text-primary font-bold text-xs uppercase tracking-widest mt-1 bg-primary-soft px-3 py-1 rounded-full">{currentUser.skinType} Skin</p>
               </div>

               {/* Stats Grid */}
               <div className="grid grid-cols-2 gap-4 mb-8">
                    <div className="bg-white p-5 rounded-[2rem] shadow-card text-center flex flex-col items-center">
                        <span className="text-3xl mb-1">🔥</span>
                        <div className="text-2xl font-bold text-slate-800">4</div>
                        <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Day Streak</div>
                    </div>
                    <div className="bg-white p-5 rounded-[2rem] shadow-card text-center flex flex-col items-center">
                        <span className="text-3xl mb-1">🧴</span>
                        <div className="text-2xl font-bold text-slate-800">12</div>
                        <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Products</div>
                    </div>
               </div>

               <div className="space-y-6">
                   <div className="bg-white p-6 rounded-[2rem] border border-slate-50 shadow-card">
                       <div className="flex justify-between items-center mb-6">
                           <h3 className="text-sm font-bold text-slate-800">My Shelf</h3>
                           <span className="text-xs font-bold text-primary">See All</span>
                       </div>
                       <div className="space-y-4">
                           {(MOCK_SHELF[currentUser.id] || []).map((p, i) => (
                               <div key={i} className="flex items-center gap-4">
                                   <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xs font-bold ${p.matchScore > 80 ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                                       {p.matchScore}%
                                   </div>
                                   <div className="flex-1">
                                       <p className="font-bold text-sm text-slate-800 line-clamp-1">{p.productName}</p>
                                       <p className="text-xs text-slate-400">{p.brandName}</p>
                                   </div>
                               </div>
                           ))}
                       </div>
                   </div>

                   {/* Settings List */}
                   <div className="bg-white rounded-[2rem] p-2 shadow-card">
                        {['Skin Profile', 'Notifications', 'Help & Support'].map((item, i) => (
                            <button key={i} className="w-full text-left px-6 py-4 flex justify-between items-center hover:bg-slate-50 rounded-2xl transition-colors">
                                <span className="font-bold text-slate-700 text-sm">{item}</span>
                                <svg width="16" height="16" stroke="#94a3b8" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/></svg>
                            </button>
                        ))}
                        <div className="h-px bg-slate-50 my-1"></div>
                        <button onClick={() => setAuthState('GUEST')} className="w-full text-left px-6 py-4 text-red-500 font-bold text-sm hover:bg-red-50 rounded-2xl transition-colors">
                            Log Out
                        </button>
                   </div>
               </div>
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
    <div className="bg-background min-h-screen font-sans flex flex-col select-none max-w-md mx-auto relative shadow-2xl overflow-hidden">
      <main className="flex-1 h-screen overflow-y-auto no-scrollbar relative">
          {renderContent()}
      </main>
      
      {/* Floating Glass Navigation */}
      <nav className="fixed bottom-6 left-6 right-6 h-[80px] rounded-[2.5rem] glass-panel shadow-soft flex justify-between items-center px-2 z-[100] max-w-[calc(28rem-3rem)] mx-auto">
         <button onClick={() => setActiveTab('HOME')} className="flex flex-col items-center justify-center w-16 h-full group">
            <div className={`p-2 rounded-full transition-all duration-300 ${activeTab === 'HOME' ? 'bg-primary-soft -translate-y-1' : ''}`}>
                <HomeIcon active={activeTab === 'HOME'} />
            </div>
         </button>
         
         <button onClick={() => setActiveTab('EXPLORE')} className="flex flex-col items-center justify-center w-16 h-full group">
             <div className={`p-2 rounded-full transition-all duration-300 ${activeTab === 'EXPLORE' ? 'bg-primary-soft -translate-y-1' : ''}`}>
                <ExploreIcon active={activeTab === 'EXPLORE'} />
             </div>
         </button>
         
         {/* Floating Scan Button */}
         <button onClick={() => setActiveTab('SCAN')} className="relative -top-8">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center shadow-glow transition-all duration-300 transform border-4 border-background ${activeTab === 'SCAN' ? 'bg-gradient-primary scale-110' : 'bg-slate-800 scale-100'}`}>
                <ScanIcon />
            </div>
         </button>
         
         <button onClick={() => setActiveTab('ROUTINE')} className="flex flex-col items-center justify-center w-16 h-full group">
             <div className={`p-2 rounded-full transition-all duration-300 ${activeTab === 'ROUTINE' ? 'bg-primary-soft -translate-y-1' : ''}`}>
                <RoutineIcon active={activeTab === 'ROUTINE'} />
             </div>
         </button>
         
         <button onClick={() => setActiveTab('PROFILE')} className="flex flex-col items-center justify-center w-16 h-full group">
             <div className={`p-2 rounded-full transition-all duration-300 ${activeTab === 'PROFILE' ? 'bg-primary-soft -translate-y-1' : ''}`}>
                <UserIcon active={activeTab === 'PROFILE'} />
             </div>
         </button>
      </nav>
    </div>
  );
};

export default App;
