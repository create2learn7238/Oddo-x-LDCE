import { prisma } from '@/lib/db';
import { requireUser } from '@/lib/auth';
import { getRegions, getSavedCityIds } from '@/lib/data';
import CitySearch from '@/components/CitySearch';

export const dynamic = 'force-dynamic';

export default async function CitiesPage({ searchParams }: { searchParams: Promise<{ q?: string; tripId?: string }> }) {
  const session = await requireUser();
  const { q, tripId } = await searchParams;

  const [cities, regions, saved, tripName] = await Promise.all([
    prisma.city.findMany({ orderBy: { popularity: 'desc' } }),
    getRegions(),
    getSavedCityIds(session.userId),
    tripId ? prisma.trip.findFirst({ where: { id: tripId, userId: session.userId }, select: { id: true, name: true, startDate: true, endDate: true } }) : Promise.resolve(null),
  ]);

  return (
    <CitySearch
      cities={cities}
      regions={regions.map((r) => r.region)}
      savedIds={saved}
      initialQ={q || ''}
      trip={tripName ? { id: tripName.id, name: tripName.name } : null}
    />
  );
}
