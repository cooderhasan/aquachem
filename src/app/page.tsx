import HeroSlider from '@/components/home/HeroSlider';
import MissionSection from '@/components/home/MissionSection';
import ProductGroups from '@/components/home/ProductGroups';
import InnovationSection from '@/components/home/InnovationSection';
import ActivitiesSection from '@/components/home/ActivitiesSection';
import StatsSection from '@/components/home/StatsSection';
import ReferencesCarousel from '@/components/home/ReferencesCarousel';
import { getActivities } from '@/app/admin/activities/actions';
import { getInnovationItems } from '@/app/admin/innovation/actions';
import { getStats } from '@/app/admin/stats/actions';
import { getSettings } from '@/app/admin/settings/actions';
import { getHeroSlides } from '@/app/admin/hero/actions';

export default async function Home() {
  const slides = await getHeroSlides();
  const activities = await getActivities();
  const innovationItems = await getInnovationItems();
  const stats = await getStats();
  const settings = await getSettings();

  return (
    <main className="flex flex-col min-h-screen bg-white">
      <HeroSlider slides={slides} />
      <MissionSection />
      <ProductGroups />
      <InnovationSection items={innovationItems} />
      <ActivitiesSection activities={activities} catalogUrl={settings?.catalogUrl} />
      <StatsSection stats={stats} />
      <ReferencesCarousel />
    </main>
  );
}
