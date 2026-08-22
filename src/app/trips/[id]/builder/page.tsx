import { notFound } from 'next/navigation';
import { requireUser } from '@/lib/auth';
import { getTripFull } from '@/lib/data';
import { prisma } from '@/lib/db';
import { computeTripCosts } from '@/lib/estimates';
import { TripShell } from '@/components/TripShell';
import ItineraryBuilder from '@/components/ItineraryBuilder';

export const dynamic = 'force-dynamic';

export default async function BuilderPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await requireUser();
  const trip = await getTripFull(id);
  if (!trip) notFound();
  if (trip.userId !== session.userId && !session.isAdmin) notFound();

  const costs = computeTripCosts(trip);
  const [allCities, cityActivities] = await (async () => {
    const cities = await prisma.city.findMany({ orderBy: { name: 'asc' } });
    const map: Record<string, (typeof trip.stops)[number]['activities'][number]['activity'][]> = {};
    for (const s of trip.stops) {
      map[s.cityId] = await prisma.activity.findMany({ where: { cityId: s.cityId }, orderBy: { cost: 'asc' } });
    }
    return [cities, map] as const;
  })();

  return (
    <TripShell trip={trip} costs={costs} active="builder">
      <ItineraryBuilder trip={trip} stops={trip.stops} allCities={allCities} cityActivities={cityActivities} />
    </TripShell>
  );
}
