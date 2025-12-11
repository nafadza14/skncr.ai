
import React, { useRef, useState, useEffect } from 'react';
import { analyzeSkinImage } from '../services/geminiService';
import { SkinMetric, SkinConcernType } from '../types';

interface SmartMirrorProps {
  onClose: () => void;
  onAnalysisComplete?: (metrics: SkinMetric[]) => void;
  mode?: 'ONBOARDING' | 'DAILY';
}

export const SmartMirror: React.FC<SmartMirrorProps> = ({ onClose, onAnalysisComplete, mode = 'DAILY' }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState<{ metrics: SkinMetric[], followUpQuestion: string } | null>(null);

  useEffect(() => {
    startCamera();
    return () => stopCamera();
  }, []);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'user' } 
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      console.error("Camera access denied", err);
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };

  const captureAndAnalyze = async () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.translate(canvas.width, 0);
      ctx.scale(-1, 1); // Mirror effect
      ctx.drawImage(video, 0, 0);
      
      // Get Base64 without prefix for API
      const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
      const base64 = dataUrl.split(',')[1];
      
      setCapturedImage(dataUrl);
      stopCamera(); // Stop stream to freeze UI
      setIsAnalyzing(true);

      try {
        const data = await analyzeSkinImage(base64);
        setResults(data);
        if (onAnalysisComplete) {
            onAnalysisComplete(data.metrics);
        }
      } catch (e) {
        alert("Failed to analyze. Please try again.");
        setCapturedImage(null);
        startCamera();
      } finally {
        setIsAnalyzing(false);
      }
    }
  };

  const getSeverityColor = (sev: number) => {
    if (sev < 3) return 'bg-green-100 text-green-700';
    if (sev < 6) return 'bg-yellow-100 text-yellow-700';
    return 'bg-red-100 text-red-700';
  };

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center z-10 text-white">
        <button onClick={onClose} className="p-2 bg-white/10 backdrop-blur-md rounded-full hover:bg-white/20 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
        </button>
        <h2 className="font-semibold text-lg tracking-wide">
            {mode === 'ONBOARDING' ? 'First Scan' : 'Smart Mirror'}
        </h2>
        <div className="w-10" />
      </div>

      {/* Camera View */}
      <div className="flex-1 relative overflow-hidden bg-gray-900">
        {!capturedImage ? (
          <>
            <video 
              ref={videoRef} 
              autoPlay 
              playsInline 
              muted
              className="absolute inset-0 w-full h-full object-cover transform -scale-x-100"
            />
            <div className="absolute inset-0 pointer-events-none border-2 border-white/20 m-8 rounded-[3rem]" />
            
            {/* Guide Text for Onboarding */}
            {mode === 'ONBOARDING' && (
                <div className="absolute top-24 left-0 right-0 text-center px-10">
                    <p className="text-white/90 text-lg font-medium shadow-black drop-shadow-md">
                        Take a selfie in natural light to analyze your skin type.
                    </p>
                </div>
            )}

            {/* Controls */}
            <div className="absolute bottom-12 left-0 right-0 flex justify-center">
               <button 
                onClick={captureAndAnalyze}
                className="w-20 h-20 bg-white rounded-full border-4 border-primary-soft/50 shadow-lg flex items-center justify-center hover:scale-105 transition-transform"
               >
                 <div className="w-16 h-16 bg-white border-4 border-primary rounded-full" />
               </button>
            </div>
          </>
        ) : (
          <img src={capturedImage} alt="Analysis" className="absolute inset-0 w-full h-full object-cover" />
        )}

        <canvas ref={canvasRef} className="hidden" />
      </div>

      {/* Analysis Bottom Sheet */}
      {(isAnalyzing || results) && (
        <div className="absolute bottom-0 left-0 right-0 bg-white/95 backdrop-blur-xl rounded-t-[2.5rem] p-6 shadow-2xl transition-transform duration-500 max-h-[80vh] overflow-y-auto">
          {isAnalyzing ? (
            <div className="flex flex-col items-center py-10 space-y-4">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
              <p className="text-primary font-medium animate-pulse">Scanning skin texture & barriers...</p>
            </div>
          ) : results ? (
            <div className="space-y-6">
              <div className="flex justify-between items-end">
                <h3 className="text-2xl font-bold text-slate-800">Skin Report</h3>
                <span className="text-sm text-slate-400">{new Date().toLocaleDateString()}</span>
              </div>

              {/* Summary Chips */}
              <div className="flex flex-wrap gap-2">
                {results.metrics.map((m, idx) => (
                  <div key={idx} className={`px-4 py-2 rounded-2xl flex flex-col items-start ${getSeverityColor(m.severity)}`}>
                    <span className="text-xs font-bold uppercase opacity-70">{m.concern}</span>
                    <span className="font-semibold text-lg">{m.severity}/10</span>
                  </div>
                ))}
              </div>

              {/* Detailed Findings */}
              <div className="space-y-3">
                <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Analysis</h4>
                {results.metrics.map((m, idx) => (
                  <div key={idx} className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                    <div className="flex justify-between mb-1">
                      <span className="font-medium text-slate-800">{m.location || 'General Area'}</span>
                    </div>
                    <p className="text-sm text-slate-600 leading-relaxed">{m.notes}</p>
                  </div>
                ))}
              </div>
              
              <button 
                onClick={() => { 
                    if (mode === 'ONBOARDING' && onAnalysisComplete) {
                        onClose(); // Parent handles logic via onAnalysisComplete callback usually, but here we trigger close to proceed
                    } else {
                        setCapturedImage(null); setResults(null); startCamera();
                    }
                    onClose();
                }}
                className="w-full py-4 bg-primary text-white rounded-full font-bold shadow-lg shadow-primary/30"
              >
                {mode === 'ONBOARDING' ? 'Continue to Survey' : 'Done'}
              </button>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
};
