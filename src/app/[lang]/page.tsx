import React from 'react';
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
import { Locale } from '@/lib/i18n';
import { getDictionary } from '@/lib/dictionary';

const DEFAULT_SECTION_ORDER = ['intro', 'products', 'mission', 'innovation', 'activities', 'stats', 'references'];

export const revalidate = 60;

export default async function Home({ params }: { params: Promise<{ lang: string }> }) {
  const { lang: rawLang } = await params;
  const lang = (rawLang === 'en' ? 'en' : 'tr') as Locale;
  const dict = getDictionary(lang);
  
  const [
    slides,
    activities,
    innovationItems,
    stats,
    settings,
    references,
    posts,
    missionCards
  ] = await Promise.all([
    getHeroSlides(),
    getActivities(),
    getInnovationItems(),
    getStats(),
    getSettings(),
    getReferences(),
    getPosts(),
    getMissionCards()
  ]);

  const rawOrder = (settings?.homeSectionOrder as string[] | null);
  const sectionOrder = (rawOrder && rawOrder.length > 0) ? rawOrder : DEFAULT_SECTION_ORDER;

  const introTitle = lang === 'en' ? settings?.homeIntroTitleEn : settings?.homeIntroTitle;
  const introDesc = lang === 'en' ? settings?.homeIntroDescriptionEn : settings?.homeIntroDescription;

  const sectionComponents: Record<string, React.ReactNode> = {
    intro: introTitle ? (
      <section key="intro" className="py-20 bg-white">
        <div className="container-custom text-center">
          <h2 className="text-3xl font-bold text-slate-900 mb-6">
            {introTitle}
          </h2>
          {introDesc && (
            <p className="max-w-4xl mx-auto text-lg text-slate-600 leading-relaxed">
              {introDesc}
            </p>
          )}
        </div>
      </section>
    ) : null,
    products: <ProductGroups key="products" lang={lang} dict={dict} />,
    mission: <MissionSection key="mission" cards={missionCards} lang={lang} dict={dict} settings={settings} />,
    innovation: <InnovationSection key="innovation" items={innovationItems} lang={lang} dict={dict} settings={settings} />,
    activities: <ActivitiesSection key="activities" activities={activities} posts={posts} catalogUrl={settings?.catalogUrl} lang={lang} dict={dict} />,
    stats: <StatsSection key="stats" stats={stats} lang={lang} dict={dict} />,
    references: <ReferencesCarousel key="references" references={references || []} settings={settings} lang={lang} dict={dict} />,
  };

  return (
    <main className="flex flex-col min-h-screen bg-white">
      <HeroSlider slides={slides} settings={settings} lang={lang} dict={dict} />
      {sectionOrder.map((sectionId) => sectionComponents[sectionId] ?? null)}
    </main>
  );
}
