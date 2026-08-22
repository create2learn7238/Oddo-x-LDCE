import { requireUser } from '@/lib/auth';
import { prisma } from '@/lib/db';
import ProfileForm from '@/components/ProfileForm';

export const dynamic = 'force-dynamic';

const LANGUAGES: [string, string][] = [
  ['en', 'English'],
  ['hi', 'हिन्दी (Hindi)'],
  ['es', 'Español'],
  ['fr', 'Français'],
  ['de', 'Deutsch'],
  ['ar', 'العربية (Arabic)'],
  ['ja', '日本語 (Japanese)'],
  ['zh', '中文 (Chinese)'],
];

export default async function ProfilePage() {
  const session = await requireUser();
  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    include: { savedCities: true, _count: { select: { trips: true } } },
  });
  if (!user) return null;

  return (
    <div className="container" style={{ maxWidth: 860 }}>
      <div className="page-head">
        <div>
          <h1 className="page-title">Profile & settings</h1>
          <p className="page-sub">Your account, preferences and saved destinations.</p>
        </div>
      </div>

      <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: 20, alignItems: 'start' }}>
        <div className="card card-pad">
          <div className="flex items-center gap-16 mb-16">
            <div className="avatar" style={{ width: 64, height: 64, fontSize: 22 }}>
              {user.name.split(' ').map((p) => p[0]).slice(0, 2).join('').toUpperCase()}
            </div>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontWeight: 800, fontSize: 18 }}>{user.name}</div>
              <div className="muted" style={{ fontSize: 14 }}>{user.email}</div>
              <div className="faint mt-8">
                Member since {user.createdAt.toDateString()} · {user._count.trips} trips {user.isAdmin && '· 👑 Admin'}
              </div>
            </div>
          </div>

          <h3 style={{ fontSize: 15, marginBottom: 10 }}>Saved destinations</h3>
          {user.savedCities.length === 0 ? (
            <p className="faint">None yet — tap ☆ on any city to save it here.</p>
          ) : (
            <div className="flex gap-8 wrap">
              {user.savedCities.map((c) => (
                <span key={c.id} className="badge badge-teal" style={{ padding: '7px 12px', fontSize: 13 }}>
                  {c.emoji} {c.name}, {c.country}
                </span>
              ))}
            </div>
          )}
        </div>

        <ProfileForm
          initial={{ name: user.name, email: user.email, photo: user.photo, language: user.language, savedIds: user.savedCities.map((c) => c.id) }}
          languages={LANGUAGES}
        />
      </div>
    </div>
  );
}
