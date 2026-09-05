import { pgTable, serial, text, integer, boolean, jsonb, timestamp } from 'drizzle-orm/pg-core';

// --- User Interaction Tables ---

export const messages = pgTable('messages', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull(),
  subject: text('subject'),
  message: text('message').notNull(),
  isRead: boolean('is_read').default(false),
  createdAt: timestamp('created_at').defaultNow(),
});

export const quoteRequests = pgTable('quote_requests', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull(),
  phone: text('phone').notNull(),
  company: text('company'),
  productName: text('product_name').notNull(), // Ürün veya kategori adı
  quantity: text('quantity'),                   // Miktar / açıklama
  status: text('status').default('new'),        // new, inProgress, done
  isRead: boolean('is_read').default(false),
  createdAt: timestamp('created_at').defaultNow(),
});

export const applications = pgTable('applications', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull(),
  phone: text('phone'),
  position: text('position'),
  cvUrl: text('cv_url').notNull(),
  status: text('status').default('new'), // new, reviewed, interviewed, rejected
  createdAt: timestamp('created_at').defaultNow(),
});
export const admins = pgTable('admins', {
  id: serial('id').primaryKey(),
  username: text('username').notNull().unique(),
  password: text('password').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

export const categories = pgTable('categories', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  titleEn: text('title_en'),
  slug: text('slug').notNull().unique(),
  description: text('description'),
  descriptionEn: text('description_en'),
  image: text('image'),
  order: integer('order').default(0),
});

export const products = pgTable('products', {
  id: serial('id').primaryKey(),
  categoryId: integer('category_id').references(() => categories.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  titleEn: text('title_en'),
  slug: text('slug').notNull().unique(),
  shortDescription: text('short_description'),
  shortDescriptionEn: text('short_description_en'),
  description: text('description'),
  descriptionEn: text('description_en'),
  usage: text('usage'),
  usageEn: text('usage_en'),
  image: text('image'),
  images: text('images'), // Kept as text for simple JSON string storage if jsonb is overkill or for compatibility
  features: jsonb('features'), // Array of strings for product features
  featuresEn: jsonb('features_en'), // Array of strings for product features in English
  isNew: boolean('is_new').default(false),
  createdAt: timestamp('created_at').defaultNow(),
});

export const posts = pgTable('posts', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  titleEn: text('title_en'),
  slug: text('slug').notNull().unique(),
  content: text('content'),
  contentEn: text('content_en'),
  image: text('image'),
  type: text('type').notNull().default('news'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const references = pgTable('references', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  categoryId: integer('category_id').references(() => categories.id, { onDelete: 'set null' }),
  image: text('image').notNull(),
  order: integer('order').default(0),
});

export const certificates = pgTable('certificates', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  image: text('image').notNull(),
  description: text('description'),
});

// --- CMS Tables ---

export const settings = pgTable('settings', {
  id: serial('id').primaryKey(),
  siteTitle: text('site_title').notNull().default('Aquachems'),
  siteTitleEn: text('site_title_en'),
  description: text('description'),
  descriptionEn: text('description_en'),
  logo: text('logo'),
  logoEn: text('logo_en'),
  favicon: text('favicon'),
  contactEmail: text('contact_email'),
  contactPhone: text('contact_phone'),
  address: text('address'),
  socialMedia: jsonb('social_media').default('{}'), // Store social links as JSON
  aboutUs: text('about_us'),
  aboutUsEn: text('about_us_en'),
  mission: text('mission'),
  missionEn: text('mission_en'),
  vision: text('vision'),
  visionEn: text('vision_en'),
  humanPolicy: text('human_policy'),
  humanPolicyEn: text('human_policy_en'),
  aboutImage: text('about_image'),
  catalogUrl: text('catalog_url'),
  // SEO Fields
  metaTitle: text('meta_title'),
  metaTitleEn: text('meta_title_en'),
  metaDescription: text('meta_description'),
  metaDescriptionEn: text('meta_description_en'),
  metaKeywords: text('meta_keywords'),
  ogImage: text('og_image'),
  whatsappNumber: text('whatsapp_number'),
  footerLogo: text('footer_logo'),
  footerLogoEn: text('footer_logo_en'),
  logoHeight: integer('logo_height').default(48), // Logo height in pixels (default 48px approx h-12)
  menuFontSize: integer('menu_font_size').default(14), // Menu font size in pixels (default 14px text-sm)
  headerPadding: integer('header_padding').default(20), // Header vertical padding in pixels (default 20px py-5)
  footerLogoPadding: integer('footer_logo_padding').default(0), // Footer logo top padding in pixels (default 0)
  referencesScrollSpeed: integer('references_scroll_speed').default(30), // References scroll animation duration in seconds (default 30s)
  aboutUsFontSize: text('about_us_font_size').default('text-lg'), // text-base, text-lg, text-xl
  aboutUsDarkness: text('about_us_darkness').default('text-slate-600'), // text-slate-600, text-slate-700, text-slate-900, text-black
  menuItems: jsonb('menu_items').default('[]'), // Store custom menu items order/structure
  referenceLogoHeight: integer('reference_logo_height').default(100), // Reference logo height in pixels (default 100px)
  heroOverlayOpacity: integer('hero_overlay_opacity').default(60), // Hero slider image opacity (0-100)
  heroGradientOpacity: integer('hero_gradient_opacity').default(80), // Hero slider gradient opacity (0-100)
  heroTitleFontSize: integer('hero_title_font_size').default(48), // Hero title font size in pixels (default 48)
  heroTitleColor: text('hero_title_color').default('#ffffff'), // Hero title color (default #ffffff)
  heroDescFontSize: integer('hero_desc_font_size').default(18), // Hero description font size in pixels (default 18)
  heroDescColor: text('hero_desc_color').default('#f1f5f9'), // Hero description color (default #f1f5f9)
  heroTextShadowEnabled: boolean('hero_text_shadow_enabled').default(true), // Toggle text shadow (default true)
  homeIntroTitle: text('home_intro_title'),
  homeIntroTitleEn: text('home_intro_title_en'),
  homeIntroDescription: text('home_intro_description'),
  homeIntroDescriptionEn: text('home_intro_description_en'),
  corporateStat1Value: text('corporate_stat1_value').default('15+'),
  corporateStat1Label: text('corporate_stat1_label').default('Yıllık Tecrübe'),
  corporateStat2Value: text('corporate_stat2_value').default('100+'),
  corporateStat2Label: text('corporate_stat2_label').default('Tamamlanan Proje'),
  siteSlogan: text('site_slogan').default('İnsanların yüzündeki gülümsemeyi görmek için çalışıyoruz'),
  siteSloganEn: text('site_slogan_en').default("We work to see the smile on people's faces"),
  siteSloganFontSize: integer('site_slogan_font_size').default(10),
  homeSectionOrder: jsonb('home_section_order').default('[]'), // Array of section IDs in display order
  // AI Enrichment Settings
  aiPrompt: text('ai_prompt'), // Custom AI prompt for product description enrichment
  aiModel: text('ai_model').default('openai/gpt-4o-mini'), // Default OpenRouter model
});

export const contactLocations = pgTable('contact_locations', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  titleEn: text('title_en'),
  address: text('address').notNull(),
  addressEn: text('address_en'),
  phone: text('phone'),
  email: text('email'),
  type: text('type').default('office'), // office, factory, etc.
  mapEmbedCode: text('map_embed_code'),
  order: integer('order').default(0),
});

export const activityItems = pgTable('activity_items', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  titleEn: text('title_en'),
  order: integer('order').default(0),
  isActive: boolean('is_active').default(true),
});

export const heroSlides = pgTable('hero_slides', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  titleEn: text('title_en'),
  description: text('description'),
  descriptionEn: text('description_en'),
  image: text('image').notNull(),
  link: text('link'),
  buttonText: text('button_text'),
  order: integer('order').default(0),
  isActive: boolean('is_active').default(true),
});

export const stats = pgTable('stats', {
  id: serial('id').primaryKey(),
  label: text('label').notNull(),
  value: text('value').notNull(),
  icon: text('icon').notNull(), // Lucide icon name
  order: integer('order').default(0),
});

export const missionCards = pgTable('mission_cards', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  titleEn: text('title_en'),
  description: text('description').notNull(),
  descriptionEn: text('description_en'),
  icon: text('icon').notNull(),
  image: text('image'),
  features: jsonb('features'), // Array of strings for list items
  featuresEn: jsonb('features_en'), // Array of strings for list items in English
  order: integer('order').default(0),
});

export const innovationItems = pgTable('innovation_items', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  titleEn: text('title_en'),
  description: text('description').notNull(),
  descriptionEn: text('description_en'),
  image: text('image'),
  watermarkText: text('watermark_text'),
  order: integer('order').default(0),
});
