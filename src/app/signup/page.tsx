import AuthForms from '@/components/AuthForms';
import { HERO_PHOTOS } from '@/lib/photos';
import Link from 'next/link';

export default function SignupPage() {
  return (
    <div className="min-h-[calc(100vh-72px)] flex items-center justify-center p-4 sm:p-6 lg:p-8">
      
      {/* 2-Column Unified Container */}
      <div className="w-full max-w-4xl bg-white rounded-3xl border border-slate-200/90 shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12">
        
        {/* Left Column: Visual Showcase (5 Cols) */}
        <div className="lg:col-span-5 relative bg-gradient-to-br from-amber-950 via-slate-900 to-teal-950 text-white p-8 lg:p-10 flex flex-col justify-between overflow-hidden min-h-[260px] lg:min-h-[580px]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={HERO_PHOTOS.signup}
            alt="Scenic travel destination"
            className="absolute inset-0 w-full h-full object-cover opacity-35 mix-blend-overlay pointer-events-none"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-amber-950/70 to-transparent"></div>

          {/* Top Brand Pill */}
          <div className="relative z-10 space-y-2">
            <Link href="/" className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-bold text-amber-200">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
              <span>Start Planning Today</span>
            </Link>
          </div>

          {/* Middle Pitch */}
          <div className="relative z-10 space-y-4 my-6">
            <div className="text-4xl">🎒✈️</div>
            <h2 className="text-2xl lg:text-3xl font-black font-display tracking-tight text-white leading-tight">
              Turn your dream trips into reality.
            </h2>
            <p className="text-xs lg:text-sm text-slate-300 font-normal leading-relaxed">
              Create custom itineraries, manage multi-city stops, track daily budgets in INR, and explore 34+ curated experiences.
            </p>

            <div className="space-y-2 pt-2 text-xs font-semibold text-amber-100">
              <div className="flex items-center gap-2">
                <i className="bi bi-check2-circle text-teal-400 text-sm"></i>
                <span>20 Curated Indian & Global Destinations</span>
              </div>
              <div className="flex items-center gap-2">
                <i className="bi bi-check2-circle text-teal-400 text-sm"></i>
                <span>Live Travel Simulator & Smart Tools</span>
              </div>
              <div className="flex items-center gap-2">
                <i className="bi bi-check2-circle text-teal-400 text-sm"></i>
                <span>Free Forever — No Credit Card Needed</span>
              </div>
            </div>
          </div>

          {/* Bottom Badge */}
          <div className="relative z-10 pt-4 border-t border-white/15 flex items-center justify-between text-xs text-slate-300">
            <span>Free Community Access</span>
            <span className="text-teal-300 font-bold">100% Free</span>
          </div>

        </div>

        {/* Right Column: Form (7 Cols) */}
        <div className="lg:col-span-7 p-6 sm:p-8 lg:p-10 flex flex-col justify-center bg-white">
          <div className="max-w-md mx-auto w-full space-y-4">
            <div>
              <h1 className="text-2xl font-black font-display text-slate-900">Create your account</h1>
              <p className="text-xs text-slate-500 font-semibold mt-1">
                Sign up in seconds to start building your customized trips.
              </p>
            </div>

            <AuthForms mode="signup" />
          </div>
        </div>

      </div>

    </div>
  );
}
