'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import TripForm from './TripForm';

export default function NewTripForm() {
  const router = useRouter();
  const [created, setCreated] = useState(false);
  return (
    <>
      <TripForm
        submitLabel="Create trip"
        afterId={(id) => {
          setCreated(true);
          router.push(`/trips/${id}`);
        }}
      />
    </>
  );
}
