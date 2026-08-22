import { notFound } from 'next/navigation';
import Link from 'next/link';
import { requireUser } from '@/lib/auth';
import { getAdminStats } from '@/lib/data';
import { fmtMoney } from '@/lib/dates';
import { computeTripCosts } from '@/lib/estimates';
import { prisma } from '@/lib/db';
import { AdminUserActions } from '@/components/AdminUserActions';
import { CountUp, Reveal } from '@/components/Anim';

export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  const session = await requireUser();
  if (!session.isAdmin) notFound();

  const stats = await getAdminStats();

  // Average trip cost across all trips
  const allTrips = await prisma.trip.findMany({ include: { stops: { include: { city: true, activities: { include: { activity: true } } } } } });
  let totalSpend = 0;
  for (const t of allTrips) {
    try {
      totalSpend += computeTripCosts(t as never).totals.total;
    } catch {
      /* skip malformed */
    }
  }

  const maxTripsPerUser = Math.max(1, ...stats.usersWithTrips.map((u) => u.trips.length));

  return (
    <div className="container-wide">
      <div className="page-head">
        <div>
          <h1 className="page-title">📊 Admin analytics</h1>
          <p className="page-sub">Platform adoption, popular destinations and user activity.</p>
        </div>
        <Link href="/dashboard" className="btn btn-ghost">← Back to app</Link>
      </div>

      <div className="grid grid-4" style={{ marginBottom: 20 }}>
        <Reveal><div className="card card-pad card-hover"><div className="stat-num"><CountUp value={stats.users} /></div><div className="stat-label">Users</div></div></Reveal>
        <Reveal delay={70}><div className="card card-pad card-hover"><div className="stat-num"><CountUp value={stats.trips} /></div><div className="stat-label">Trips created</div></div></Reveal>
        <Reveal delay={140}><div className="card card-pad card-hover"><div className="stat-num"><CountUp value={stats.stops} /></div><div className="stat-label">City stops</div></div></Reveal>
        <Reveal delay={210}><div className="card card-pad card-hover"><div className="stat-num"><CountUp value={stats.assignments} /></div><div className="stat-label">Activities planned</div></div></Reveal>
      </div>

      <div className="grid" style={{ gridTemplateColumns: '1.4fr 1fr', gap: 20, marginBottom: 20, alignItems: 'start' }}>
        <div className="card card-pad">
          <h3 style={{ fontSize: 16, marginBottom: 14 }}>Trips per user</h3>
          <div style={{ display: 'grid', gap: 12 }}>
            {stats.usersWithTrips.map((u) => (
              <div key={u.id} className="flex items-center gap-12">
                <span style={{ minWidth: 150, fontWeight: 700, fontSize: 13.5, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {u.name} {u.isAdmin && '👑'}
                </span>
                <div className="progress grow" style={{ flex: 1 }}>
                  <i style={{ width: `${(u.trips.length / maxTripsPerUser) * 100}%`, background: '#0f766e' }} />
                </div>
                <span style={{ fontWeight: 800, fontSize: 13.5, minWidth: 20 }}>{u.trips.length}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="card card-pad">
          <h3 style={{ fontSize: 16, marginBottom: 14 }}>Top cities by stops</h3>
          {stats.topCities.length === 0 && <p className="faint">No stops yet.</p>}
          <div style={{ display: 'grid', gap: 12 }}>
            {stats.topCities.map((r) => (
              r.city && (
                <div key={r.city.id} className="flex items-center gap-12">
                  <span style={{ fontSize: 17 }}>{r.city.emoji}</span>
                  <span style={{ minWidth: 110, fontWeight: 700, fontSize: 13.5 }}>{r.city.name}</span>
                  <div className="progress" style={{ flex: 1 }}>
                    <i style={{ width: `${(r.count / Math.max(1, stats.topCities[0].count)) * 100}%`, background: r.city.color }} />
                  </div>
                  <span style={{ fontWeight: 800, fontSize: 13.5 }}>{r.count}</span>
                </div>
              )
            ))}
          </div>
          <h3 style={{ fontSize: 16, marginTop: 20, marginBottom: 14 }}>Top activities</h3>
          <div style={{ display: 'grid', gap: 8 }}>
            {stats.topActivities.map((r) => (
              <div key={r.activity.id} className="flex items-center gap-8">
                <span>{r.activity.emoji}</span>
                <span style={{ flex: 1, fontSize: 13.5, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.activity.name}</span>
                <span className="badge">{r.count}×</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-2" style={{ marginBottom: 20 }}>
        <div className="card card-pad">
          <h3 style={{ fontSize: 16, marginBottom: 10 }}>Estimated platform spend</h3>
          <div className="stat-num">{fmtMoney(totalSpend)}</div>
          <p className="faint mt-8">Sum of estimated trip costs across all {stats.trips} trips (per person).</p>
        </div>
        <div className="card card-pad">
          <h3 style={{ fontSize: 16, marginBottom: 10 }}>Destination coverage</h3>
          <div className="stat-num">{stats.cities}</div>
          <p className="faint mt-8">Cities available for discovery and booking.</p>
        </div>
      </div>

      <div className="card" style={{ overflowX: 'auto' }}>
        <table className="table">
          <thead>
            <tr>
              <th>User</th>
              <th>Joined</th>
              <th>Trips</th>
              <th>Public</th>
              <th>Saved cities</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {stats.usersWithTrips.map((u) => (
              <tr key={u.id}>
                <td>
                  <b>{u.name}</b> {u.isAdmin && '👑'}
                  <div className="faint">{u.email}</div>
                </td>
                <td>{u.createdAt.toDateString()}</td>
                <td>
                  {u.trips.length > 0 ? (
                    u.trips.map((t) => (
                      <div key={t.id} style={{ fontSize: 13 }}>
                        {t.isPublic ? '🔗' : '🔒'} {t.name}
                      </div>
                    ))
                  ) : (
                    <span className="faint">—</span>
                  )}
                </td>
                <td>{u.trips.filter((t) => t.isPublic).length}</td>
                <td>{u._count.savedCities}</td>
                <td>
                  <AdminUserActions user={u} isSelf={u.id === session.userId} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
