import AuthForms from '@/components/AuthForms';
import { HERO_PHOTOS } from '@/lib/photos';

export default function LoginPage() {
  return (
    <div style={{ minHeight: '100vh', display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
      <div className="auth-hero">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={HERO_PHOTOS.auth} alt="Scenic travel destination" className="hero-photo" />
        <div className="hero-scrim" style={{ background: 'linear-gradient(115deg, rgba(15,118,110,0.93) 0%, rgba(13,148,136,0.82) 40%, rgba(15,23,42,0.6) 100%)' }} />
        <div style={{ position: 'relative', zIndex: 2 }}>
          <div style={{ fontSize: 46, marginBottom: 18 }} className="float-emoji">🌍✈️</div>
          <h1 style={{ fontSize: 42, letterSpacing: '-0.03em' }}>GlobeTrotter</h1>
          <p style={{ fontSize: 17, opacity: 0.94, marginTop: 12, maxWidth: 430, lineHeight: 1.6 }}>
            Dream it. Plan it. Share it. Build multi-city itineraries with smart budgeting, day-by-day timelines and a community of fellow wanderers.
          </p>
          <div style={{ marginTop: 34, display: 'grid', gap: 13, maxWidth: 430 }}>
            {[
              ['🧳', 'Multi-city itinerary builder'],
              ['💸', 'Automatic cost breakdowns & budget alerts'],
              ['🗓️', 'Visual calendars & day-by-day plans'],
              ['🔗', 'One-click trip sharing'],
            ].map(([e, t], i) => (
              <div
                key={t}
                style={{
                  background: 'rgba(255,255,255,0.14)',
                  backdropFilter: 'blur(6px)',
                  borderRadius: 12,
                  padding: '12px 16px',
                  fontWeight: 600,
                  fontSize: 14.5,
                  display: 'flex',
                  gap: 10,
                  alignItems: 'center',
                  animation: 'fadeUp 0.7s cubic-bezier(0.22,1,0.36,1) both',
                  animationDelay: `${0.25 + i * 0.1}s`,
                }}
              >
                <span style={{ fontSize: 17 }}>{e}</span> {t}
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <div style={{ display: 'grid', placeItems: 'center', padding: 32 }}>
        <div className="auth-card-in" style={{ width: '100%', maxWidth: 460 }}>
          <div className="card card-pad rounded-3xl border border-slate-200 shadow-xl bg-white/95 backdrop-blur-md">
            <h2 className="text-2xl font-black font-display text-slate-900 mb-1">Welcome back</h2>
            <p className="text-xs font-semibold text-slate-500 mb-6">Log in to pick up where your journey left off.</p>
            <AuthForms mode="login" />
          </div>
        </div>
      </div>
    </div>
  );
}
