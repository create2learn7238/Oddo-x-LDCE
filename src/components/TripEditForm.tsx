'use client';

import { useRouter } from 'next/navigation';
import TripForm from './TripForm';

export default function TripEditForm({
  tripId,
  initial,
}: {
  tripId: string;
  initial: {
    name: string;
    description?: string | null;
    startDate: string;
    endDate: string;
    coverEmoji?: string;
    coverColor?: string;
    coverImage?: string | null;
    budgetTotal?: number | null;
  };
}) {
  const router = useRouter();
  return (
    <TripForm
      initial={initial}
      endpoint={`/api/trips/${tripId}`}
      submitLabel="Save changes"
      afterId={(id) => router.push(`/trips/${id}`)}
    />
  );
}
