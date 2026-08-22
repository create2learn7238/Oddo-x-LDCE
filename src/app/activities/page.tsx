import { requireUser } from '@/lib/auth';
import { prisma } from '@/lib/db';
import ActivitySearch from '@/components/ActivitySearch';

export const dynamic = 'force-dynamic';

export default async function ActivitiesPage({ searchParams }: { searchParams: Promise<{ cityId?: string; q?: string }> }) {
  await requireUser();
  const { cityId, q } = await searchParams;
  const [cities, activities] = await Promise.all([
    prisma.city.findMany({ orderBy: { name: 'asc' }, select: { id: true, name: true, country: true, emoji: true } }),
    prisma.activity.findMany({
      where: cityId ? { cityId } : {},
      include: { city: { select: { name: true, country: true, emoji: true } } },
      orderBy: { cost: 'asc' },
    }),
  ]);
  return <ActivitySearch cities={cities} activities={activities} initialCityId={cityId || ''} initialQ={q || ''} />;
}
