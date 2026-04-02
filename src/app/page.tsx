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
import { getReferences } from '@/app/admin/references/actions';
import { getMissionCards } from '@/app/admin/mission/actions';

import { getPosts } from '@/lib/data';

export default async function Home() {
  const slides = await getHeroSlides();
  const activities = await getActivities();
  const innovationItems = await getInnovationItems();
  const stats = await getStats();
  const settings = await getSettings();
  const references = await getReferences();
  const posts = await getPosts();
  const missionCards = await getMissionCards();

  return (
    <main className="flex flex-col min-h-screen bg-white">
      <h1 className="sr-only">Endüstriyel Temizlik ve Bakım Kimyasalları | Aquachems</h1>
      <HeroSlider slides={slides} settings={settings} />
      <MissionSection cards={missionCards} />
      <section className="py-20 bg-white">
        <div className="container-custom text-center">
          <h2 className="text-3xl font-bold text-slate-900 mb-6">
            Sektörünüze Özel Endüstriyel Kimya Çözümleri
          </h2>
          <p className="max-w-4xl mx-auto text-lg text-slate-600 leading-relaxed">
            Aquachems olarak, otelcilikten gıda üretimine, metal sanayiden sağlık sektörüne kadar geniş bir yelpazede faaliyet gösteren endüstriyel işletmeler için yüksek performanslı temizlik ve bakım kimyasalları geliştiriyoruz. Ar-Ge merkezimizde formüle ettiğimiz yenilikçi ürünlerimizle, işletmenizin verimliliğini artırırken, sürdürülebilir ve çevreye duyarlı çözümler sunmayı hedefliyoruz. Güçlü teknik desteğimiz ve sektör tecrübemizle, proseslerinize özel, kalıcı ve ekonomik çözümler üreterek güvenilir iş ortağınız olmaktan gurur duyuyoruz.
          </p>
        </div>
      </section>
      <ProductGroups />
      <InnovationSection items={innovationItems} />
      <ActivitiesSection activities={activities} posts={posts} catalogUrl={settings?.catalogUrl} />
      <StatsSection stats={stats} />
      {/* References Section */}
      <ReferencesCarousel
        references={references || []}
        settings={settings}
      />
    </main>
  );
}
