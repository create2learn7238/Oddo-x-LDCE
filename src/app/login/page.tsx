import AuthForms from '@/components/AuthForms';
import { HERO_PHOTOS } from '@/lib/photos';
import Link from 'next/link';

export default function LoginPage() {
  return (
    <div className="min-h-[calc(100vh-72px)] flex items-center justify-center p-4 sm:p-6 lg:p-8">
      
      {/* 2-Column Unified Container */}
      <div className="w-full max-w-4xl bg-white rounded-3xl border border-slate-200/90 shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12">
        
        {/* Left Column: Visual Showcase (5 Cols) */}
        <div className="lg:col-span-5 relative bg-gradient-to-br from-teal-950 via-slate-900 to-amber-950 text-white p-8 lg:p-10 flex flex-col justify-between overflow-hidden min-h-[260px] lg:min-h-[580px]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={HERO_PHOTOS.auth}
            alt="Scenic travel destination"
            className="absolute inset-0 w-full h-full object-cover opacity-35 mix-blend-overlay pointer-events-none"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-teal-950/70 to-transparent"></div>

          {/* Top Brand Pill */}
          <div className="relative z-10 space-y-2">
            <Link href="/" className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-bold text-teal-200">
              <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse"></span>
              <span>GlobeTrotter India</span>
            </Link>
          </div>

          {/* Middle Pitch */}
          <div className="relative z-10 space-y-4 my-6">
            <div className="text-4xl">🦁✈️</div>
            <h2 className="text-2xl lg:text-3xl font-black font-display tracking-tight text-white leading-tight">
              Plan your next India & Gujarat adventure.
            </h2>
            <p className="text-xs lg:text-sm text-slate-300 font-normal leading-relaxed">
              Multi-city itineraries with automatic INR (₹) estimates, day-by-day scheduling, and interactive travel tools.
            </p>

            <div className="space-y-2 pt-2 text-xs font-semibold text-teal-100">
              <div className="flex items-center gap-2">
                <i className="bi bi-check2-circle text-amber-400 text-sm"></i>
                <span>UNESCO Gujarat & Rajasthan Circuits</span>
              </div>
              <div className="flex items-center gap-2">
                <i className="bi bi-check2-circle text-amber-400 text-sm"></i>
                <span>Smart INR (₹) Daily Expense Estimates</span>
              </div>
              <div className="flex items-center gap-2">
                <i className="bi bi-check2-circle text-amber-400 text-sm"></i>
                <span>1-Click Trip Sharing & Export</span>
              </div>
            </div>
          </div>

          {/* Bottom Trust Badge */}
          <div className="relative z-10 pt-4 border-t border-white/15 flex items-center justify-between text-xs text-slate-300">
            <span>Trusted by 10,000+ wanderers</span>
            <span className="text-amber-300 font-bold">★ 4.9 / 5.0</span>
          </div>

        </div>

        {/* Right Column: Form (7 Cols) */}
        <div className="lg:col-span-7 p-6 sm:p-8 lg:p-10 flex flex-col justify-center bg-white">
          <div className="max-w-md mx-auto w-full space-y-4">
            <div>
              <h1 className="text-2xl font-black font-display text-slate-900">Welcome back</h1>
              <p className="text-xs text-slate-500 font-semibold mt-1">
                Log in with a 1-click demo account or enter your credentials.
              </p>
            </div>

            <AuthForms mode="login" />
          </div>
        </div>

      </div>

    </div>
  );
}
