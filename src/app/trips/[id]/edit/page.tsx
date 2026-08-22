import { notFound } from 'next/navigation';
import { requireUser } from '@/lib/auth';
import { getTripFull } from '@/lib/data';
import { TripShell } from '@/components/TripShell';
import TripEditForm from '@/components/TripEditForm';
import { computeTripCosts } from '@/lib/estimates';

export const dynamic = 'force-dynamic';

export default async function EditTripPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await requireUser();
  const trip = await getTripFull(id);
  if (!trip) notFound();
  if (trip.userId !== session.userId && !session.isAdmin) notFound();

  const costs = computeTripCosts(trip);
  const toKey = (d: Date) => {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${dd}`;
  };

  return (
    <TripShell trip={trip} costs={costs} active="overview">
      <div className="card card-pad" style={{ maxWidth: 640 }}>
        <h2 style={{ fontSize: 18, marginBottom: 14 }}>Edit trip</h2>
        <TripEditForm
          tripId={trip.id}
          initial={{
            name: trip.name,
            description: trip.description,
            startDate: toKey(trip.startDate),
            endDate: toKey(trip.endDate),
            coverEmoji: trip.coverEmoji,
            coverColor: trip.coverColor,
            coverImage: trip.coverImage,
            budgetTotal: trip.budgetTotal,
          }}
        />
      </div>
    </TripShell>
  );
}
