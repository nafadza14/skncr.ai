
import React, { useState } from 'react';

interface AuthProps {
  onLogin: (name: string, email: string) => void;
}

export const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleLogin = () => {
    setIsLoading(true);
    // Simulate API call delay
    setTimeout(() => {
      onLogin("New User", "user@example.com");
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary-soft rounded-full blur-3xl -mr-16 -mt-16 opacity-50"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-50 rounded-full blur-3xl -ml-16 -mb-16 opacity-50"></div>

      <div className="z-10 w-full max-w-md text-center space-y-8 animate-fade-in">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 tracking-tight">skncr ai</h1>
          <p className="text-slate-500 mt-2 text-lg">Your personal AI dermatologist.</p>
        </div>

        <div className="bg-white p-1 rounded-2xl shadow-xl border border-slate-100">
           <div className="px-8 py-10 space-y-6">
              <h2 className="text-xl font-semibold text-slate-800">Get Started</h2>
              
              <button 
                onClick={handleGoogleLogin}
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-3 bg-white border border-slate-200 text-slate-700 font-medium py-4 rounded-xl hover:bg-slate-50 transition-colors active:scale-95 shadow-sm"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-slate-300 border-t-slate-600 rounded-full animate-spin"></div>
                ) : (
                  <>
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                    </svg>
                    <span>Sign in with Google</span>
                  </>
                )}
              </button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-slate-200"></span>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-slate-400">Or continue with email</span>
                </div>
              </div>

              <div className="space-y-3">
                 <input type="email" placeholder="Email" className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
                 <input type="password" placeholder="Password" className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
                 <button className="w-full bg-slate-900 text-white font-bold py-3 rounded-xl hover:bg-slate-800 transition-colors">
                    Log In
                 </button>
              </div>
           </div>
        </div>
        <p className="text-xs text-slate-400">By continuing, you agree to our Terms of Service.</p>
      </div>
    </div>
  );
};
