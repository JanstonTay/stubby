import { Lock, Mail, AlertCircle } from 'lucide-react';
import { useState } from 'react';
import type { PageType } from '../App';

interface LoginProps {
  onNavigate: (page: PageType) => void;
}

export function Login({ onNavigate }: LoginProps) {
  const [email, setEmail] = useState('student@ichat.sp.edu.sg');
  const [password, setPassword] = useState('stubby123');
  const [error, setError] = useState<string | null>(null);

  const handleLogin = () => {
    // Correct credentials
    const validEmail = 'student@ichat.sp.edu.sg';
    const validPassword = 'stubby123';

    if (email === validEmail && password === validPassword) {
      setError(null);
      onNavigate('home');
    } else if (!email || !password) {
      setError('Please enter both email and password.');
    } else {
      setError('Wrong email or password');
    }
  };

  return (
    <div className="h-full min-h-0 bg-white flex flex-col">
      {/* Login Page Content */}
      <main className="flex-1 min-h-0 overflow-y-auto flex flex-col justify-center px-8 py-12 bg-white">
        {/* Logo/Branding */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6 animate-in zoom-in duration-700">
            <div className="relative">
              <div className="absolute inset-0 bg-indigo-500 blur-2xl opacity-10 rounded-full scale-150"></div>
              <img 
                src="https://lh3.googleusercontent.com/d/1sVqKxdc4nSztVwyayVbQfNL1oVits_W9" 
                alt="Stubby Logo" 
                className="h-60 object-contain relative transition-transform hover:scale-110 duration-500" 
              />
            </div>
          </div>
        </div>

        {/* Login Form */}
        <div className="space-y-6">
          {/* Email Input */}
          <div className="space-y-2.5">
            <label className="block text-sm font-bold text-slate-700 ml-1">Email</label>
            <div className="relative group">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors">
                <Mail className="w-5 h-5" />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="student@ichat.sp.edu.sg"
                className={`w-full pl-14 pr-6 py-5 bg-slate-50 border-2 rounded-3xl text-sm font-semibold placeholder:text-slate-300 outline-none transition-all ${error ? 'border-red-400 bg-red-50 text-red-600' : 'border-transparent focus:bg-white focus:border-indigo-500/20 focus:ring-4 focus:ring-indigo-500/5'}`}
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="space-y-2.5">
            <label className="block text-sm font-bold text-slate-700 ml-1">Password</label>
            <div className="relative group">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors">
                <Lock className="w-5 h-5" />
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className={`w-full pl-14 pr-6 py-5 bg-slate-50 border-2 rounded-3xl text-sm font-semibold outline-none transition-all ${error ? 'border-red-400 bg-red-50 text-red-600' : 'border-transparent focus:bg-white focus:border-indigo-500/20 focus:ring-4 focus:ring-indigo-500/5'}`}
              />
            </div>
            {error && (
              <div className="flex items-center gap-2 mt-3 ml-1 text-red-500 animate-in slide-in-from-top-2 duration-300">
                <AlertCircle className="w-4 h-4" />
                <span className="text-[13px] font-bold tracking-tight">{error}</span>
              </div>
            )}
          </div>

          {/* Forgot Password Link */}
          <div className="text-right">
            <button className="text-[13px] font-bold text-indigo-500 hover:text-indigo-600 transition-colors">
              Forgot password?
            </button>
          </div>

          {/* Login Button */}
          <div className="pt-4">
            <button 
              onClick={handleLogin}
              className="group relative w-full py-5 bg-indigo-600 rounded-3xl text-white font-extrabold text-base transition-all active:scale-[0.98] overflow-hidden shadow-[0_20px_40px_-15px_rgba(79,70,229,0.3)] hover:shadow-[0_25px_50px_-12px_rgba(79,70,229,0.4)] hover:-translate-y-0.5"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-violet-600 transition-all opacity-100 group-hover:opacity-90"></div>
              <span className="relative z-10 tracking-widest uppercase">Sign In</span>
            </button>
          </div>

          {/* Sign Up Link */}
          <div className="text-center pt-8">
            <p className="text-sm font-bold text-slate-400">
              Don't have an account?{' '}
              <button className="text-indigo-500 hover:text-indigo-600 transition-colors">
                Join now
              </button>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
