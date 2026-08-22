import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center p-6 bg-slate-50">
      <div className="max-w-md w-full text-center space-y-6 bg-white p-8 rounded-3xl border border-slate-200 shadow-xl">
        <div className="w-20 h-20 mx-auto rounded-3xl bg-teal-50 text-teal-600 flex items-center justify-center text-4xl shadow-inner animate-bounce">
          ✈️
        </div>
        
        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-600 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
            404 — Page Off The Map
          </span>
          <h1 className="text-3xl font-black font-display text-slate-900">Destination Not Found</h1>
          <p className="text-xs text-slate-500 leading-relaxed">
            The travel route or page you are looking for has taken a detour or does not exist.
          </p>
        </div>

        <div className="pt-2 flex flex-col gap-2">
          <Link
            href="/dashboard"
            className="w-full py-3 bg-gradient-to-r from-teal-600 to-teal-700 text-white font-bold text-xs rounded-xl shadow-md hover:shadow-teal-600/30 hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
          >
            <i className="bi bi-speedometer2"></i> Return to Dashboard
          </Link>
          <Link
            href="/cities"
            className="w-full py-3 bg-slate-100 text-slate-700 font-bold text-xs rounded-xl hover:bg-slate-200 transition-all flex items-center justify-center gap-2"
          >
            <i className="bi bi-compass"></i> Explore Cities
          </Link>
        </div>
      </div>
    </div>
  );
}
