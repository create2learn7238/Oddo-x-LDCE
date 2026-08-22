import AuthForms from '@/components/AuthForms';
import { HERO_PHOTOS } from '@/lib/photos';

export default function SignupPage() {
  return (
    <div style={{ minHeight: '100vh', display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
      <div className="auth-hero">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={HERO_PHOTOS.signup} alt="Santorini blue domes at sunset" className="hero-photo" />
        <div className="hero-scrim" style={{ background: 'linear-gradient(115deg, rgba(124,45,18,0.92) 0%, rgba(217,119,6,0.72) 45%, rgba(15,23,42,0.62) 100%)' }} />
        <div style={{ position: 'relative', zIndex: 2 }}>
          <div style={{ fontSize: 46, marginBottom: 18 }} className="float-emoji">🎒</div>
          <h1 style={{ fontSize: 42, letterSpacing: '-0.03em' }}>Your next adventure starts here</h1>
          <p style={{ fontSize: 17, opacity: 0.94, marginTop: 12, maxWidth: 430, lineHeight: 1.6 }}>
            Join GlobeTrotter and turn “someday” into a booked, budgeted, day-by-day plan.
          </p>
          <div style={{ marginTop: 34, display: 'grid', gap: 13, maxWidth: 430 }}>
            {[
              ['🏙️', '31 curated cities with local activities'],
              ['💡', 'Smart per-day cost estimates'],
              ['🤝', 'Copy trips from the community'],
              ['🔔', 'Over-budget day alerts'],
            ].map(([e, t], i) => (
              <div
                key={t}
                style={{
                  background: 'rgba(255,255,255,0.15)',
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
        <div className="auth-card-in">
          <div className="card card-pad" style={{ width: '100%', maxWidth: 400 }}>
            <h2 style={{ fontSize: 25, marginBottom: 4 }}>Create your account</h2>
            <p className="muted mb-16" style={{ fontSize: 14.5 }}>Free forever for travelers and dreamers.</p>
            <AuthForms mode="signup" />
          </div>
        </div>
      </div>
    </div>
  );
}
