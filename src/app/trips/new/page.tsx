import { requireUser } from '@/lib/auth';
import NewTripForm from '@/components/NewTripForm';

export const dynamic = 'force-dynamic';

export default async function NewTripPage() {
  await requireUser();
  return (
    <div className="container" style={{ maxWidth: 640 }}>
      <div className="page-head">
        <div>
          <h1 className="page-title">Plan a new trip</h1>
          <p className="page-sub">Step 1 — the basics. Add stops and activities next.</p>
        </div>
      </div>
      <div className="card card-pad">
        <NewTripForm />
      </div>
    </div>
  );
}
