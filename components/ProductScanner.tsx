
import React, { useRef, useState, useEffect } from 'react';
import { analyzeProductImage } from '../services/geminiService';
import { ProductAnalysisResult, IngredientAnalysis } from '../types';
import { GET_ACTIVE_USER } from '../constants';

// --- Subcomponents ---

const VerdictBadge: React.FC<{ verdict: string }> = ({ verdict }) => {
  let style = "bg-gray-100 text-gray-700";
  let label = verdict;

  if (verdict === 'YOU NEED THIS') {
    style = "bg-green-100 text-green-700 border border-green-200";
  } else if (verdict === "YOU DON'T NEED THIS") {
    style = "bg-red-100 text-red-700 border border-red-200";
  } else if (verdict === 'NEUTRAL') {
    style = "bg-gray-100 text-gray-700 border border-gray-200";
  }

  return (
    <div className={`px-4 py-1.5 rounded-full text-[10px] font-bold tracking-widest uppercase shadow-sm ${style}`}>
      {label}
    </div>
  );
};

const IngredientPill: React.FC<{ item: IngredientAnalysis }> = ({ item }) => {
  let colorClass = "bg-slate-50 text-slate-600 border-slate-200"; // Neutral/Safe
  
  if (item.status === 'BENEFICIAL') {
    colorClass = "bg-green-100 text-green-800 border-green-200";
  } else if (item.status === 'AVOID' || item.status === 'CAUTION') {
    colorClass = "bg-red-50 text-red-700 border-red-100";
  }

  return (
    <div className={`inline-flex items-center px-3 py-1.5 rounded-full border text-xs font-medium mr-2 mb-2 ${colorClass}`}>
      {item.name}
    </div>
  );
};

// --- Main Component ---

interface ProductScannerProps {
    onClose?: () => void;
}

export const ProductScanner: React.FC<ProductScannerProps> = ({ onClose }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<ProductAnalysisResult | null>(null);
  const [activeTab, setActiveTab] = useState<'details'|'ingredients'|'reviews'>('ingredients');
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  
  const currentUser = GET_ACTIVE_USER();

  useEffect(() => {
    startCamera();
    return () => stopCamera();
  }, []);

  const startCamera = async () => {
    if (result || capturedImage) return;

    stopCamera();
    setCameraError(null);

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error("Camera not supported.");
      }

      let mediaStream;
      try {
        mediaStream = await navigator.mediaDevices.getUserMedia({ 
          video: { facingMode: 'environment' } 
        });
      } catch (err) {
        mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
      }

      streamRef.current = mediaStream;
      setIsCameraActive(true);

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        videoRef.current.onloadedmetadata = () => {
           videoRef.current?.play().catch(e => console.error("Auto-play blocked:", e));
        };
      }
    } catch (err: any) {
      setCameraError("Unable to access camera.");
      setIsCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsCameraActive(false);
  };

  const scanProduct = async () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    if (video.readyState < 2) return; 

    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(video, 0, 0);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
      const base64 = dataUrl.split(',')[1];
      
      setCapturedImage(dataUrl);
      stopCamera(); 
      setIsAnalyzing(true);

      try {
        const data = await analyzeProductImage(base64, currentUser);
        setResult(data);
      } catch (e) {
        console.error(e);
        alert("Scan error. Please ensure text is clear.");
        setCapturedImage(null);
        startCamera();
      } finally {
        setIsAnalyzing(false);
      }
    }
  };

  const resetScan = () => {
    setResult(null);
    setCapturedImage(null);
    setActiveTab('ingredients');
    startCamera();
  };

  return (
    <div className="relative h-full flex flex-col bg-slate-900 font-sans animate-fade-in">
      {!result && (
        <div className="flex-1 relative overflow-hidden bg-black flex flex-col">
          <div className="absolute top-0 left-0 right-0 p-6 z-10 flex justify-between items-center">
              <button onClick={onClose} className="w-10 h-10 bg-white/10 backdrop-blur rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-all">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
              </button>
              <div className="px-4 py-1.5 bg-black/30 backdrop-blur-md rounded-full border border-white/10">
                <span className="text-white text-[10px] uppercase font-bold tracking-widest">Scanner Active</span>
              </div>
              <div className="w-10" /> 
          </div>

          <video ref={videoRef} playsInline muted autoPlay className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 transform -scale-x-100 ${capturedImage ? 'opacity-0' : 'opacity-100'}`} />
          {capturedImage && <img src={capturedImage} className="absolute inset-0 w-full h-full object-cover" />}

          {cameraError && (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-6 text-center z-20 bg-slate-900">
              <p className="mb-4 text-red-400 font-medium">{cameraError}</p>
              <button onClick={startCamera} className="px-8 py-4 bg-primary text-white font-bold rounded-full active:scale-95 transition-all shadow-xl shadow-primary/20">
                Retrying Camera...
              </button>
            </div>
          )}

          {!capturedImage && !cameraError && isCameraActive && (
             <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
               <div className="flex flex-col items-center gap-6">
                  <div className="w-64 h-80 border-2 border-white/40 rounded-[3rem] relative shadow-2xl">
                      <div className="absolute top-0 left-0 w-12 h-12 border-t-4 border-l-4 border-primary rounded-tl-[1.5rem] -mt-1.5 -ml-1.5"></div>
                      <div className="absolute top-0 right-0 w-12 h-12 border-t-4 border-r-4 border-primary rounded-tr-[1.5rem] -mt-1.5 -mr-1.5"></div>
                      <div className="absolute bottom-0 left-0 w-12 h-12 border-b-4 border-l-4 border-primary rounded-bl-[1.5rem] -mb-1.5 -ml-1.5"></div>
                      <div className="absolute bottom-0 right-0 w-12 h-12 border-b-4 border-r-4 border-primary rounded-br-[1.5rem] -mb-1.5 -mr-1.5"></div>
                  </div>
                  <p className="text-white/80 text-sm font-medium drop-shadow-lg animate-pulse">Align ingredients list within frame</p>
               </div>
            </div>
          )}

          <div className="absolute bottom-16 left-0 right-0 flex justify-center items-center z-20 pointer-events-auto">
             {!cameraError && isCameraActive && (
                isAnalyzing ? (
                   <div className="flex flex-col items-center gap-4">
                     <div className="w-16 h-16 border-4 border-white/20 border-t-primary rounded-full animate-spin"></div>
                     <span className="text-white text-[10px] font-bold tracking-widest uppercase animate-pulse">Processing...</span>
                   </div>
                ) : (
                  <button onClick={scanProduct} className="w-24 h-24 bg-white/10 backdrop-blur-xl rounded-full border-2 border-white flex items-center justify-center active:scale-90 transition-all shadow-2xl">
                    <div className="w-18 h-18 bg-white rounded-full border-4 border-slate-100 flex items-center justify-center">
                        <div className="w-14 h-14 rounded-full border border-primary/20"></div>
                    </div>
                  </button>
                )
             )}
          </div>
          <canvas ref={canvasRef} className="hidden" />
        </div>
      )}

      {result && (
        <div className="flex-1 bg-slate-50 flex flex-col overflow-hidden animate-fade-in relative">
          <div className="h-[45%] w-full relative bg-white">
             {capturedImage && <img src={capturedImage} className="w-full h-full object-cover" />}
             <button onClick={resetScan} className="absolute top-6 left-6 w-10 h-10 bg-white/70 backdrop-blur rounded-full flex items-center justify-center text-slate-800 shadow-xl z-30 active:scale-90 transition-all">
               <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
             </button>
          </div>

          <div className="absolute bottom-0 left-0 right-0 top-[40%] bg-white rounded-t-[3rem] shadow-2xl flex flex-col z-20 overflow-hidden">
            <div className="w-full flex justify-center pt-5 pb-3">
              <div className="w-14 h-1.5 bg-slate-100 rounded-full" />
            </div>

            <div className="px-8 pb-4">
              <div className="flex justify-between items-start mb-2">
                 <div className="flex-1 pr-4">
                    <span className="text-primary font-bold text-[10px] uppercase tracking-[0.2em]">{result.brandName || "Analysis Complete"}</span>
                    <h2 className="text-2xl font-bold text-slate-800 mt-1 leading-tight">{result.productName}</h2>
                 </div>
                 <div className="flex flex-col items-center">
                    <div className="w-14 h-14 rounded-full border-4 border-primary/10 flex items-center justify-center text-primary font-bold text-xl shadow-inner">
                        {result.matchScore}
                    </div>
                    <span className="text-[8px] font-black uppercase text-primary tracking-tighter mt-1">Match</span>
                 </div>
              </div>
            </div>

            <div className="flex border-b border-slate-50 px-8 gap-6 mb-6 overflow-x-auto no-scrollbar">
                <button onClick={() => setActiveTab('details')} className={`pb-3 text-sm font-bold transition-colors uppercase tracking-widest ${activeTab === 'details' ? 'text-primary border-b-4 border-primary' : 'text-slate-300'}`}>Benefits</button>
                <button onClick={() => setActiveTab('ingredients')} className={`pb-3 text-sm font-bold transition-colors uppercase tracking-widest ${activeTab === 'ingredients' ? 'text-primary border-b-4 border-primary' : 'text-slate-300'}`}>Decode</button>
                <button onClick={() => setActiveTab('reviews')} className={`pb-3 text-sm font-bold transition-colors uppercase tracking-widest ${activeTab === 'reviews' ? 'text-primary border-b-4 border-primary' : 'text-slate-300'}`}>Shelf Life</button>
            </div>

            <div className="flex-1 overflow-y-auto px-8 pb-32 no-scrollbar">
              {activeTab === 'ingredients' && (
                <div className="space-y-6 animate-fade-in pb-10">
                   <div>
                      <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">AI Ingredient List</h3>
                      <div className="flex flex-wrap">
                        {result.ingredients.map((item, i) => <IngredientPill key={i} item={item} />)}
                      </div>
                   </div>
                   <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100">
                      <h3 className="text-sm font-bold text-slate-800 mb-3">AI Verdict</h3>
                      <VerdictBadge verdict={result.verdict} />
                      <p className="text-slate-600 text-sm mt-4 leading-relaxed font-medium">"{result.summary}"</p>
                   </div>
                </div>
              )}
              {activeTab === 'details' && (
                  <div className="space-y-4 animate-fade-in">
                      {result.keyBenefits?.map((b, i) => (
                          <div key={i} className="p-4 bg-primary-soft/30 rounded-2xl flex gap-3 items-center">
                              <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-xs">✓</div>
                              <p className="text-sm font-bold text-primary-dark">{b}</p>
                          </div>
                      ))}
                  </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
