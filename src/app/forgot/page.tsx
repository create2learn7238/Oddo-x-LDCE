import AuthForms from '@/components/AuthForms';
import Link from 'next/link';

export default function ForgotPage() {
  return (
    <div className="min-h-[calc(100vh-72px)] flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-md bg-white rounded-3xl border border-slate-200/90 shadow-2xl p-8 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-2xl text-amber-700 shadow-sm">
            🔑
          </div>
          <div>
            <h1 className="text-2xl font-black font-display text-slate-900">Reset Password</h1>
            <p className="text-xs text-slate-500 font-semibold mt-0.5">Enter your email to receive recovery instructions.</p>
          </div>
        </div>

        <div className="pt-2">
          <AuthForms mode="forgot" />
        </div>
      </div>
    </div>
  );
}
