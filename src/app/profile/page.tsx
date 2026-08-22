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
  if (!user) {
    redirect('/login');
  }

  const initials = user.name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0])
    .join('')
    .toUpperCase() || 'GT';

  const isPhotoUrl = user.photo && (user.photo.startsWith('http://') || user.photo.startsWith('https://') || user.photo.startsWith('/'));

  return (
    <div className="container-wide py-8">
      {/* Header Title */}
      <div className="page-head mb-8">
        <div>
          <h1 className="page-title text-3xl font-black font-display text-slate-900">Profile & Account Settings</h1>
          <p className="page-sub text-slate-500 text-sm mt-1">Manage your personal profile details, language preferences, and saved destinations.</p>
        </div>
      </div>

      {/* Spacious 2-Column Responsive Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Left Column: User Summary Badge & Saved Destinations */}
        <div className="lg:col-span-1 space-y-6">
          <div className="card p-6 bg-white rounded-3xl border border-slate-200 shadow-md space-y-6">
            <div className="flex flex-col items-center text-center space-y-3 pb-6 border-b border-slate-100">
              {isPhotoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={user.photo!}
                  alt={user.name}
                  className="w-24 h-24 rounded-full object-cover border-4 border-amber-500/40 shadow-lg"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-amber-600 via-amber-700 to-amber-900 text-white font-black text-2xl flex items-center justify-center shadow-xl border-4 border-white tracking-wider">
                  {initials}
                </div>
              )}

              <div>
                <h2 className="text-2xl font-black text-slate-900 font-display">{user.name}</h2>
                <p className="text-slate-500 text-xs font-semibold">{user.email}</p>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <span className="px-3 py-1 bg-teal-50 text-teal-700 font-extrabold text-xs rounded-full border border-teal-200">
                  {user._count.trips} Trips Planned
                </span>
                {user.isAdmin && (
                  <span className="px-3 py-1 bg-amber-50 text-amber-800 font-extrabold text-xs rounded-full border border-amber-200">
                    👑 Admin
                  </span>
                )}
              </div>
            </div>

            {/* Saved Destinations Block */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2">
                <i className="bi bi-star-fill text-amber-500"></i> Saved Destinations ({user.savedCities.length})
              </h3>
              {user.savedCities.length === 0 ? (
                <p className="text-slate-400 text-xs italic">No saved cities yet — click ☆ on any city card to pin it here.</p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {user.savedCities.map((c) => (
                    <span key={c.id} className="px-3 py-1.5 bg-teal-50 text-teal-800 font-bold text-xs rounded-xl border border-teal-200 flex items-center gap-1.5">
                      <span>{c.emoji}</span> {c.name}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Edit Profile Form */}
        <div className="lg:col-span-2">
          <ProfileForm
            initial={{
              name: user.name,
              email: user.email,
              photo: isPhotoUrl ? user.photo : '',
              language: user.language,
              savedIds: user.savedCities.map((c) => c.id),
            }}
            languages={LANGUAGES}
          />
        </div>

      </div>
    </div>
  );
}
