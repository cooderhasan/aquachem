import HeroSlider from '@/components/home/HeroSlider';
import MissionSection from '@/components/home/MissionSection';
import ProductGroups from '@/components/home/ProductGroups';
import InnovationSection from '@/components/home/InnovationSection';
import ActivitiesSection from '@/components/home/ActivitiesSection';
import StatsSection from '@/components/home/StatsSection';
import ReferencesCarousel from '@/components/home/ReferencesCarousel';

export default function Home() {
  return (
    <main className="flex flex-col min-h-screen bg-white">
      <HeroSlider />
      <MissionSection />
      <ProductGroups />
      <InnovationSection />
      <ActivitiesSection />
      <StatsSection />
      <ReferencesCarousel />
    </main>
  );
}
