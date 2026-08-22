import { notFound } from 'next/navigation';
import { requireUser } from '@/lib/auth';
import { getTripFull } from '@/lib/data';
import { computeTripCosts } from '@/lib/estimates';
import { TripShell } from '@/components/TripShell';
import TripCalendar from '@/components/TripCalendar';

export const dynamic = 'force-dynamic';

export default async function CalendarPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await requireUser();
  const trip = await getTripFull(id);
  if (!trip) notFound();
  if (trip.userId !== session.userId && !session.isAdmin) notFound();

  const costs = computeTripCosts(trip);
  return (
    <TripShell trip={trip} costs={costs} active="calendar">
      <TripCalendar trip={trip} costs={costs} />
    </TripShell>
  );
}
