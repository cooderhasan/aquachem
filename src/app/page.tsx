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
import { getHeroSlides } from '@/app/admin/hero/actions'; // Added import for getHeroSlides

export default async function Home() {
  const slides = await getHeroSlides(); // Fetched slides
  const activities = await getActivities();
  const innovationItems = await getInnovationItems();
  const stats = await getStats();

  return (
    <main className="flex flex-col min-h-screen bg-white">
      <HeroSlider slides={slides} /> {/* Passed slides to HeroSlider */}
      <MissionSection />
      <ProductGroups />
      <InnovationSection items={innovationItems} />
      <ActivitiesSection activities={activities} />
      <StatsSection stats={stats} />
      <ReferencesCarousel />
    </main>
  );
}
