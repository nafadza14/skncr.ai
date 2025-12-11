
import React, { useRef, useState, useEffect } from 'react';
import { analyzeProductImage } from '../services/geminiService';
import { ProductAnalysisResult, IngredientAnalysis } from '../types';
import { GET_ACTIVE_USER } from '../constants';

// --- Subcomponents ---

const VerdictBadge: React.FC<{ verdict: string }> = ({ verdict }) => {
  let style = "bg-gray-100 text-gray-700";
  let icon = "−";

  if (verdict === 'YOU NEED THIS') {
    style = "bg-green-500 text-white shadow-lg shadow-green-500/30";
    icon = "✓";
  } else if (verdict === "YOU DON'T NEED THIS") {
    style = "bg-red-500 text-white shadow-lg shadow-red-500/30";
    icon = "✕";
  }

  return (
    <div className={`w-full py-4 rounded-xl flex items-center justify-center gap-3 text-sm font-bold tracking-widest uppercase transition-all ${style}`}>
      <span className="text-xl">{icon}</span> {verdict}
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
  const [cameraError, setCameraError] = useState<string | null>(null);
  
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
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });

      streamRef.current = mediaStream;

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        videoRef.current.onloadedmetadata = () => {
           videoRef.current?.play().catch(e => console.error("Auto-play blocked:", e));
        };
      }
    } catch (err: any) {
      setCameraError("Unable to access camera. Please allow permissions.");
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
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
        alert("Scan failed. Ensure ingredients are visible.");
        setCapturedImage(null);
        startCamera();
      } finally {
        setIsAnalyzing(false);
      }
    }
  };

  return (
    <div className="relative h-full flex flex-col bg-slate-900 font-sans">
      {!result ? (
        <div className="flex-1 relative overflow-hidden bg-black flex flex-col">
          {/* Header */}
          <div className="absolute top-0 left-0 right-0 p-6 z-20 flex justify-between items-center text-white">
              <button onClick={onClose} className="p-2 bg-black/40 backdrop-blur rounded-full">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m15 18-6-6 6-6"/></svg>
              </button>
              <h3 className="font-bold">Scan Product</h3>
              <div className="w-8"/>
          </div>

          <video ref={videoRef} playsInline muted autoPlay className={`absolute inset-0 w-full h-full object-cover ${capturedImage ? 'opacity-0' : 'opacity-100'}`} />
          {capturedImage && <img src={capturedImage} className="absolute inset-0 w-full h-full object-cover" />}

          {/* Overlay Instructions */}
          {!capturedImage && !cameraError && (
             <div className="absolute inset-0 pointer-events-none z-10 flex flex-col items-center justify-center">
                 <div className="w-64 h-80 border-2 border-white/50 rounded-3xl relative">
                    <div className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-primary -mt-1 -ml-1 rounded-tl-lg"></div>
                    <div className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-primary -mt-1 -mr-1 rounded-tr-lg"></div>
                    <div className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-primary -mb-1 -ml-1 rounded-bl-lg"></div>
                    <div className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-primary -mb-1 -mr-1 rounded-br-lg"></div>
                 </div>
                 
                 <div className="absolute bottom-32 w-full text-center space-y-2 px-8">
                    <p className="text-white font-bold text-lg shadow-black drop-shadow-md">Capture Front or Ingredients</p>
                    <div className="flex justify-center gap-4 text-[10px] text-white/80 bg-black/40 p-2 rounded-xl backdrop-blur-sm">
                        <span>✓ Plain Background</span>
                        <span>✓ Good Lighting</span>
                        <span>✓ No Blur</span>
                    </div>
                 </div>
             </div>
          )}

          {/* Capture Button */}
          <div className="absolute bottom-10 left-0 right-0 flex justify-center items-center z-20">
            {isAnalyzing ? (
               <div className="flex flex-col items-center text-primary">
                 <div className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin mb-2"></div>
                 <span className="text-xs font-bold uppercase animate-pulse">Analyzing...</span>
               </div>
            ) : (
              <button onClick={scanProduct} className="w-20 h-20 bg-white rounded-full border-4 border-slate-200 flex items-center justify-center shadow-2xl active:scale-95 transition-transform">
                <div className="w-16 h-16 bg-white border-2 border-slate-900 rounded-full"></div>
              </button>
            )}
          </div>
          <canvas ref={canvasRef} className="hidden" />
        </div>
      ) : (
        <div className="flex-1 bg-white overflow-y-auto no-scrollbar pb-10">
           {/* Result View */}
           <div className="relative h-64 bg-slate-100">
               {capturedImage && <img src={capturedImage} className="w-full h-full object-cover" />}
               <button onClick={() => { setResult(null); setCapturedImage(null); startCamera(); }} className="absolute top-4 left-4 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center text-slate-800">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m15 18-6-6 6-6"/></svg>
               </button>
           </div>

           <div className="px-6 -mt-10 relative z-10">
              <div className="bg-white rounded-3xl p-6 shadow-xl border border-slate-100">
                 <h2 className="text-2xl font-bold text-slate-900 mb-1">{result.productName}</h2>
                 <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-6">{result.brandName}</p>
                 
                 <VerdictBadge verdict={result.verdict} />

                 <div className="mt-6">
                    <h3 className="text-xs font-bold text-slate-900 uppercase mb-2">Analysis</h3>
                    <p className="text-slate-600 text-sm leading-relaxed">{result.summary}</p>
                 </div>

                 <div className="mt-6">
                    <h3 className="text-xs font-bold text-slate-900 uppercase mb-3">Ingredient Match</h3>
                    <div className="flex flex-wrap gap-2">
                        {result.ingredients.map((ing, i) => (
                            <span key={i} className={`text-xs px-3 py-1 rounded-full border ${ing.status === 'BENEFICIAL' ? 'bg-green-100 text-green-700 border-green-200' : ing.status === 'AVOID' ? 'bg-red-100 text-red-700 border-red-200' : 'bg-slate-50 text-slate-500 border-slate-200'}`}>
                                {ing.name}
                            </span>
                        ))}
                    </div>
                 </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};
