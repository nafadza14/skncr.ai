
import React, { useState } from 'react';
import { SmartMirror } from './components/SmartMirror';
import { ProductScanner } from './components/ProductScanner';
import { Auth } from './components/Auth';
import { Survey } from './components/Survey';
import { TabView, UserSkinProfile, AuthState, OnboardingData, SkinConcernType, ProductAnalysisResult } from './types';
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

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabView>('HOME');
  const [authState, setAuthState] = useState<AuthState>('GUEST');
  const [currentUser, setCurrentUser] = useState<UserSkinProfile>(GUEST_USER);
  const [onboardingData, setOnboardingData] = useState<OnboardingData>({});
  const [scanSubView, setScanSubView] = useState<'HUB' | 'SCANNER' | 'TRACKER'>('HUB');
  
  // Routine State (Mock)
  const [routineState, setRoutineState] = useState({
    am: { cleanser: true, toner: false, vitaminC: false, moisturizer: false, spf: false },
    pm: { cleanser: false, retinol: false, moisturizer: false }
  });

  const isGuest = authState === 'GUEST';
  const triggerAuth = () => setAuthState('LOGIN');

  const renderContent = () => {
    switch (activeTab) {
      case 'HOME':
        return (
          <div className="px-6 py-8 space-y-8 animate-fade-in pb-28 overflow-y-auto no-scrollbar h-full">
            <header className="flex justify-between items-center">
              <div>
                <h1 className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-1">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</h1>
                <h2 className="text-2xl font-bold text-slate-900 leading-tight">Good Morning, {isGuest ? "Guest" : currentUser.name.split(' ')[0]}</h2>
              </div>
              <button onClick={() => setActiveTab('PROFILE')} className="w-10 h-10 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center border border-primary/20">
                {currentUser.name[0]}
              </button>
            </header>

            {/* Daily Streak / Quick Status */}
            <div className="flex gap-4 overflow-x-auto no-scrollbar">
                <div className="min-w-[140px] bg-gradient-to-br from-primary to-primary-dark rounded-[1.5rem] p-5 text-white shadow-lg shadow-primary/20">
                    <div className="text-[10px] font-bold opacity-80 uppercase tracking-wider mb-2">Skin Score</div>
                    <div className="text-3xl font-bold">85<span className="text-base opacity-70 font-normal">/100</span></div>
                    <div className="mt-2 text-xs opacity-90">Improving +2%</div>
                </div>
                <div className="min-w-[140px] bg-white rounded-[1.5rem] p-5 border border-slate-100 shadow-sm">
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Streak</div>
                    <div className="text-3xl font-bold text-slate-800">4<span className="text-base text-slate-400 font-normal"> days</span></div>
                    <div className="mt-2 text-xs text-green-600 font-medium">Keep it up!</div>
                </div>
            </div>

            <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary rounded-full blur-[3rem] opacity-20 -mr-10 -mt-10"></div>
              <h3 className="text-[10px] font-bold text-primary uppercase tracking-widest mb-4 relative z-10">Tip of the Day</h3>
              <p className="text-slate-200 text-lg leading-relaxed relative z-10 font-medium">"Double cleansing at night prevents oil plugs from turning into cystic acne."</p>
              <button className="mt-6 px-4 py-2 bg-white/10 backdrop-blur rounded-full text-xs font-bold hover:bg-white/20 transition-colors">Save Tip</button>
            </div>

            <div>
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-bold text-slate-800">Your Shelf</h3>
                    <button onClick={() => { setActiveTab('SCAN'); setScanSubView('TRACKER'); }} className="text-xs font-bold text-primary">View All</button>
                </div>
                <div className="flex gap-4 overflow-x-auto no-scrollbar pb-4">
                    {(MOCK_SHELF[currentUser.id] || MOCK_SHELF['user_a']).slice(0, 3).map((item, i) => (
                        <div key={i} className="min-w-[160px] bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold mb-3 ${item.matchScore > 80 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                {item.matchScore}%
                            </div>
                            <h4 className="font-bold text-slate-800 text-sm truncate">{item.productName}</h4>
                            <p className="text-[10px] text-slate-400 truncate">{item.brandName}</p>
                        </div>
                    ))}
                    <button onClick={() => { setActiveTab('SCAN'); setScanSubView('SCANNER'); }} className="min-w-[60px] flex items-center justify-center bg-slate-50 rounded-2xl border border-dashed border-slate-300">
                        <span className="text-2xl text-slate-300">+</span>
                    </button>
                </div>
            </div>

            {isGuest && (
              <button onClick={triggerAuth} className="w-full bg-primary text-white font-bold py-5 rounded-full shadow-xl shadow-primary/20 hover:scale-105 transition-transform">
                Unlock Full Analysis
              </button>
            )}
          </div>
        );

      case 'EXPLORE':
        return (
            <div className="h-full flex flex-col bg-slate-50">
                <div className="px-6 py-8 pb-4">
                    <h1 className="text-2xl font-bold text-slate-900 mb-6">Discover</h1>
                    <div className="relative">
                        <input type="text" placeholder="Search ingredients, brands..." className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white border border-slate-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/20" />
                        <svg className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                    </div>
                </div>
                
                <div className="flex-1 overflow-y-auto no-scrollbar px-6 pb-28 space-y-8">
                    {/* Categories */}
                    <div>
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Categories</h3>
                        <div className="flex gap-3 overflow-x-auto no-scrollbar">
                            {['Acne Safe', 'Hydration', 'Sun Protection', 'Clean Beauty', 'Sensitive'].map(cat => (
                                <button key={cat} className="whitespace-nowrap px-5 py-2.5 bg-white border border-slate-200 rounded-full text-sm font-bold text-slate-600 shadow-sm">
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Trending Ingredients */}
                    <div>
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Trending Ingredients</h3>
                        <div className="space-y-3">
                            <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex gap-4 items-center">
                                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-xl">💧</div>
                                <div>
                                    <h4 className="font-bold text-slate-800">Hyaluronic Acid</h4>
                                    <p className="text-xs text-slate-500">The hydration hero for all skin types.</p>
                                </div>
                            </div>
                            <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex gap-4 items-center">
                                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-xl">🌿</div>
                                <div>
                                    <h4 className="font-bold text-slate-800">Centella Asiatica</h4>
                                    <p className="text-xs text-slate-500">Calming redness and repairing barriers.</p>
                                </div>
                            </div>
                            <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex gap-4 items-center">
                                <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center text-xl">✨</div>
                                <div>
                                    <h4 className="font-bold text-slate-800">Retinol</h4>
                                    <p className="text-xs text-slate-500">The gold standard for anti-aging.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Article Card */}
                    <div className="bg-slate-200 h-48 rounded-[2rem] relative overflow-hidden flex items-end p-6">
                        <img src="https://images.unsplash.com/photo-1556228552-523c0356c3ce?auto=format&fit=crop&q=80&w=400" className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-60" />
                        <div className="relative z-10">
                            <span className="bg-white/20 backdrop-blur text-white text-[10px] font-bold px-2 py-1 rounded-md uppercase mb-2 inline-block">Read</span>
                            <h3 className="text-xl font-bold text-slate-800">Understanding Skin Cycling</h3>
                        </div>
                    </div>
                </div>
            </div>
        );

      case 'ROUTINE':
        return (
          <div className="h-full flex flex-col bg-slate-50 px-6 py-8 pb-28">
            <h1 className="text-2xl font-bold text-slate-900 mb-6">Daily Routine</h1>
            
            <div className="flex-1 overflow-y-auto no-scrollbar space-y-8">
                {/* Morning */}
                <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center text-orange-500">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>
                        </div>
                        <h2 className="text-lg font-bold text-slate-800">Morning</h2>
                    </div>
                    <div className="space-y-4">
                        {Object.entries(routineState.am).map(([key, checked]) => (
                            <div key={key} onClick={() => setRoutineState(p => ({...p, am: {...p.am, [key]: !checked}}))} className="flex items-center gap-4 cursor-pointer group">
                                <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-colors ${checked ? 'bg-primary border-primary' : 'border-slate-300'}`}>
                                    {checked && <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4"><polyline points="20 6 9 17 4 12"/></svg>}
                                </div>
                                <span className={`flex-1 font-medium capitalize ${checked ? 'text-slate-400 line-through' : 'text-slate-700'}`}>{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Night */}
                <div className="bg-slate-900 rounded-[2rem] p-6 shadow-lg text-white">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-8 h-8 bg-indigo-500/30 rounded-full flex items-center justify-center text-indigo-200">
                             <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>
                        </div>
                        <h2 className="text-lg font-bold">Night</h2>
                    </div>
                    <div className="space-y-4">
                         {Object.entries(routineState.pm).map(([key, checked]) => (
                            <div key={key} onClick={() => setRoutineState(p => ({...p, pm: {...p.pm, [key]: !checked}}))} className="flex items-center gap-4 cursor-pointer group">
                                <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-colors ${checked ? 'bg-primary border-primary' : 'border-slate-600'}`}>
                                    {checked && <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4"><polyline points="20 6 9 17 4 12"/></svg>}
                                </div>
                                <span className={`flex-1 font-medium capitalize ${checked ? 'text-slate-500 line-through' : 'text-slate-200'}`}>{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
          </div>
        );

      case 'SCAN':
        if (isGuest) return (
            <div className="h-full flex flex-col items-center justify-center p-8 text-center bg-slate-900">
                <ScanIcon active={true} />
                <h3 className="text-2xl font-bold text-white mt-6">AI Scanner</h3>
                <p className="text-slate-400 text-sm mt-3 mb-8">Scan your face for analysis or products for ingredient safety.</p>
                <button onClick={triggerAuth} className="w-full py-5 bg-primary rounded-full font-bold text-white">Join to Scan</button>
            </div>
        );
        if (scanSubView === 'SCANNER') return <ProductScanner onClose={() => setScanSubView('HUB')} />;
        if (scanSubView === 'TRACKER') return (
          <div className="p-6 h-full bg-slate-50 overflow-y-auto no-scrollbar pb-28 animate-fade-in">
             <div className="flex items-center gap-4 mb-8">
               <button onClick={() => setScanSubView('HUB')} className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm text-slate-600 border border-slate-100">
                 <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
               </button>
               <h2 className="text-xl font-bold text-slate-800">My Product Shelf</h2>
             </div>
             <div className="space-y-4">
                {(MOCK_SHELF[currentUser.id] || []).map((item, i) => (
                  <div key={i} className="bg-white p-5 rounded-[1.5rem] border border-slate-100 shadow-sm flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-slate-800">{item.productName}</h4>
                      <p className="text-[10px] font-bold text-primary uppercase tracking-widest">{item.brandName}</p>
                    </div>
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-[10px] font-bold ${item.matchScore > 80 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {item.matchScore}
                    </div>
                  </div>
                ))}
                {(MOCK_SHELF[currentUser.id] || []).length === 0 && (
                    <div className="text-center py-10 text-slate-400">No products scanned yet.</div>
                )}
             </div>
          </div>
        );
        return (
          <div className="px-6 py-12 flex flex-col justify-center h-full gap-6 animate-fade-in bg-slate-50">
             <div className="text-center mb-4">
                <h2 className="text-2xl font-bold text-slate-900">Scan Center</h2>
                <p className="text-slate-500 text-sm">Select a tool to begin</p>
             </div>
             
             <button onClick={() => setAuthState('ONBOARDING_SELFIE')} className="w-full p-8 bg-gradient-to-br from-primary to-primary-dark rounded-[2.5rem] shadow-xl shadow-primary/30 flex flex-col items-center text-center active:scale-95 transition-all relative overflow-hidden group">
                 <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-8 -mt-8 blur-2xl"></div>
                 <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mb-4 backdrop-blur-sm">
                    <svg className="text-white" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                 </div>
                <h3 className="text-xl font-bold text-white relative z-10">Face Analysis</h3>
                <p className="text-white/80 text-xs mt-2 relative z-10">Check skin condition & progress</p>
             </button>

             <button onClick={() => setScanSubView('SCANNER')} className="w-full p-8 bg-slate-900 rounded-[2.5rem] shadow-xl flex flex-col items-center text-center active:scale-95 transition-all relative overflow-hidden">
                <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mb-4">
                    <ScanIcon active={true} />
                </div>
                <h3 className="text-xl font-bold text-white">Product Scanner</h3>
                <p className="text-slate-400 text-xs mt-2">Analyze ingredients instantly</p>
             </button>

             <button onClick={() => setScanSubView('TRACKER')} className="w-full p-6 bg-white border border-slate-200 rounded-[2.5rem] shadow-sm flex items-center justify-center gap-4 text-center active:scale-95 transition-all">
                <span className="text-slate-800 font-bold">View My Shelf</span>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1e293b" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
             </button>
          </div>
        );

      case 'PROFILE':
        return (
          <div className="px-6 py-8 pb-28 h-full overflow-y-auto no-scrollbar bg-slate-50">
             <div className="flex flex-col items-center mb-8">
                <div className="w-24 h-24 rounded-full bg-slate-200 mb-4 border-4 border-white shadow-lg flex items-center justify-center text-3xl font-bold text-slate-400">
                    {currentUser.photoUrl ? <img src={currentUser.photoUrl} className="w-full h-full rounded-full object-cover" /> : currentUser.name[0]}
                </div>
                <h2 className="text-2xl font-bold text-slate-900">{currentUser.name}</h2>
                <p className="text-primary font-bold text-xs uppercase tracking-widest mt-1">{currentUser.skinType} Skin</p>
             </div>

             {/* Stats Grid */}
             <div className="grid grid-cols-2 gap-4 mb-8">
                 <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm text-center">
                    <div className="text-2xl font-bold text-slate-800">12</div>
                    <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Scans</div>
                 </div>
                 <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm text-center">
                    <div className="text-2xl font-bold text-slate-800">3</div>
                    <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Alerts</div>
                 </div>
             </div>

             {/* Detailed Analysis */}
             {!isGuest && currentUser.currentMetrics.length > 0 && (
              <div className="space-y-4 mb-8">
                <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-2">Current Skin Analysis</h3>
                <div className="space-y-3">
                  {currentUser.currentMetrics.map((m, i) => (
                    <div key={i} className="bg-white p-5 rounded-[1.5rem] border border-slate-100 shadow-sm">
                      <div className="flex justify-between items-center mb-2">
                          <p className="text-xs font-bold text-primary uppercase tracking-widest">{m.concern}</p>
                          <span className={`text-xs font-bold px-2 py-1 rounded-full ${m.severity > 5 ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>{m.severity}/10</span>
                      </div>
                      <p className="text-sm text-slate-600 leading-relaxed">{m.notes}</p>
                    </div>
                  ))}
                </div>
              </div>
             )}

             <div className="bg-white rounded-[2rem] p-2 border border-slate-100 shadow-sm">
                 <button className="w-full text-left px-6 py-4 border-b border-slate-50 flex justify-between items-center">
                    <span className="font-bold text-slate-700">Skin Profile Settings</span>
                    <svg width="16" height="16" stroke="currentColor" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/></svg>
                 </button>
                 <button className="w-full text-left px-6 py-4 border-b border-slate-50 flex justify-between items-center">
                    <span className="font-bold text-slate-700">Notifications</span>
                    <svg width="16" height="16" stroke="currentColor" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/></svg>
                 </button>
                 <button onClick={() => setAuthState('GUEST')} className="w-full text-left px-6 py-4 text-red-500 font-bold flex justify-between items-center">
                    <span>Log Out</span>
                 </button>
             </div>
          </div>
        );
        
      default: return <div className="h-full bg-slate-50" />;
    }
  };

  if (authState === 'LOGIN') return <Auth onLogin={(n) => { setAuthState('ONBOARDING_SELFIE'); setOnboardingData({name: n}); }} />;
  if (authState === 'ONBOARDING_SELFIE') return <SmartMirror onClose={() => setAuthState('AUTHENTICATED')} mode="ONBOARDING" onAnalysisComplete={(m) => { setAuthState('ONBOARDING_SURVEY'); setOnboardingData(p => ({...p, metrics: m})); }} />;
  if (authState === 'ONBOARDING_SURVEY') return <Survey onComplete={(d) => { setCurrentUser({...currentUser, ...onboardingData, ...d, id: 'user_a'} as UserSkinProfile); setAuthState('AUTHENTICATED'); }} />;

  return (
    <div className="bg-[#F8FAFC] min-h-screen font-sans flex flex-col select-none max-w-md mx-auto relative overflow-hidden shadow-2xl">
      <main className="flex-1 overflow-hidden h-screen">{renderContent()}</main>
      
      {/* Enhanced Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-lg border-t border-slate-100 h-[90px] px-6 flex justify-between items-start pt-4 z-[100] max-w-md mx-auto pb-safe">
         <button onClick={() => { setActiveTab('HOME'); setScanSubView('HUB'); }} className="flex flex-col items-center gap-1.5 w-14 group">
            <HomeIcon active={activeTab === 'HOME'} />
            <span className={`text-[9px] font-bold uppercase tracking-wide transition-colors ${activeTab === 'HOME' ? 'text-primary' : 'text-slate-300 group-hover:text-slate-400'}`}>Home</span>
         </button>
         
         <button onClick={() => { setActiveTab('EXPLORE'); setScanSubView('HUB'); }} className="flex flex-col items-center gap-1.5 w-14 group">
            <ExploreIcon active={activeTab === 'EXPLORE'} />
            <span className={`text-[9px] font-bold uppercase tracking-wide transition-colors ${activeTab === 'EXPLORE' ? 'text-primary' : 'text-slate-300 group-hover:text-slate-400'}`}>Explore</span>
         </button>
         
         {/* Floating Scan Button */}
         <button onClick={() => { setActiveTab('SCAN'); setScanSubView('HUB'); }} className="relative -top-6">
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
