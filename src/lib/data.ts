import { prisma } from './db';
import type { StopFull, TripFull } from './estimates';

const stopInclude = {
  city: true,
  activities: { include: { activity: true }, orderBy: { dayOffset: 'asc' as const } },
};

/** Re-number stop sequences (0..n) using the given ordering. */
export async function resyncSequences(tripId: string, by: 'sequence' | 'date' = 'sequence') {
  const all = await prisma.stop.findMany({
    where: { tripId },
    orderBy: by === 'date' ? { arrivalDate: 'asc' } : { sequence: 'asc' },
  });
  for (let i = 0; i < all.length; i++) {
    if (all[i].sequence !== i) {
      await prisma.stop.update({ where: { id: all[i].id }, data: { sequence: i } });
    }
  }
}

export async function getTripFull(id: string): Promise<TripFull | null> {
  return (await prisma.trip.findUnique({
    where: { id },
    include: { stops: { include: stopInclude, orderBy: { arrivalDate: 'asc' } } },
  })) as unknown as TripFull | null;
}

export async function getTripsForUser(userId: string) {
  return prisma.trip.findMany({
    where: { userId },
    include: { stops: { include: { city: true } } },
    orderBy: { startDate: 'desc' },
  });
}

export async function getPublicTrip(token: string) {
  return (await prisma.trip.findUnique({
    where: { shareToken: token },
    include: {
      user: { select: { name: true } },
      stops: { include: stopInclude, orderBy: { arrivalDate: 'asc' } },
    },
  })) as unknown as (TripFull & { user: { name: string } }) | null;
}

export type CitySearchParams = { q?: string; country?: string; region?: string };

export async function searchCities({ q, country, region }: CitySearchParams) {
  return prisma.city.findMany({
    where: {
      ...(q
        ? {
            OR: [
              { name: { contains: q } },
              { country: { contains: q } },
            ],
          }
        : {}),
      ...(country ? { country: { equals: country } } : {}),
      ...(region ? { region: { equals: region } } : {}),
    },
    orderBy: { popularity: 'desc' },
  });
}

export async function getRegions() {
  return prisma.city.findMany({ distinct: ['region'], select: { region: true }, orderBy: { region: 'asc' } });
}

export async function getCountries() {
  return prisma.city.findMany({ distinct: ['country'], select: { country: true }, orderBy: { country: 'asc' } });
}

export type ActivitySearchParams = {
  cityId?: string;
  q?: string;
  type?: string;
  maxCost?: number;
  maxDuration?: number;
};

export async function searchActivities({ cityId, q, type, maxCost, maxDuration }: ActivitySearchParams) {
  return prisma.activity.findMany({
    where: {
      ...(cityId ? { cityId } : {}),
      ...(q ? { OR: [{ name: { contains: q } }, { description: { contains: q } }] } : {}),
      ...(type ? { type: { equals: type } } : {}),
      ...(maxCost ? { cost: { lte: maxCost } } : {}),
      ...(maxDuration ? { duration: { lte: maxDuration } } : {}),
    },
    include: { city: { select: { name: true, country: true, emoji: true } } },
    orderBy: [{ cost: 'asc' }],
  });
}

export async function getSavedCityIds(userId: string): Promise<string[]> {
  const rows = await prisma.user.findUnique({ where: { id: userId }, include: { savedCities: { select: { id: true } } } });
  return rows?.savedCities.map((c) => c.id) ?? [];
}

export async function getAdminStats() {
  const [users, trips, stops, assignments, cities, stopRows, actRows, usersWithTrips] = await Promise.all([
    prisma.user.count(),
    prisma.trip.count(),
    prisma.stop.count(),
    prisma.stopActivity.count(),
    prisma.city.count(),
    prisma.stop.findMany({ select: { cityId: true } }),
    prisma.stopActivity.findMany({ select: { activityId: true } }),
    prisma.user.findMany({
      include: { _count: { select: { trips: true, savedCities: true } }, trips: { select: { id: true, name: true, createdAt: true, isPublic: true } } },
      orderBy: { createdAt: 'asc' },
    }),
  ]);

  const cityCounts = new Map<string, number>();
  for (const r of stopRows) cityCounts.set(r.cityId, (cityCounts.get(r.cityId) ?? 0) + 1);
  const cityIds = [...cityCounts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 6).map(([id]) => id);
  const cityObjs = await prisma.city.findMany({ where: { id: { in: cityIds } } });
  const byId = new Map(cityObjs.map((c) => [c.id, c]));
  const topCities = cityIds.map((id) => ({ city: byId.get(id) ?? null, count: cityCounts.get(id) ?? 0 }));

  const actCounts = new Map<string, number>();
  for (const r of actRows) actCounts.set(r.activityId, (actCounts.get(r.activityId) ?? 0) + 1);
  const actIds = [...actCounts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 6).map(([id]) => id);
  const actObjs = await prisma.activity.findMany({ where: { id: { in: actIds } } });
  const actById = new Map(actObjs.map((a) => [a.id, a]));
  const topActivities = actIds
    .map((id) => (actById.get(id) ? { activity: actById.get(id)!, count: actCounts.get(id) ?? 0 } : null))
    .filter((x): x is { activity: NonNullable<(typeof actObjs)[number]>; count: number } => x !== null);

  return { users, trips, stops, assignments, cities, topCities, topActivities, usersWithTrips };
}
