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
  slug: text('slug').notNull().unique(),
  description: text('description'),
  image: text('image'),
  order: integer('order').default(0),
});

export const products = pgTable('products', {
  id: serial('id').primaryKey(),
  categoryId: integer('category_id').references(() => categories.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  slug: text('slug').notNull().unique(),
  shortDescription: text('short_description'),
  description: text('description'),
  usage: text('usage'),
  image: text('image'),
  images: text('images'), // Kept as text for simple JSON string storage if jsonb is overkill or for compatibility
  features: jsonb('features'), // Array of strings for product features
  isNew: boolean('is_new').default(false),
  createdAt: timestamp('created_at').defaultNow(),
});

export const posts = pgTable('posts', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  slug: text('slug').notNull().unique(),
  content: text('content'),
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
  description: text('description'),
  logo: text('logo'),
  favicon: text('favicon'),
  contactEmail: text('contact_email'),
  contactPhone: text('contact_phone'),
  address: text('address'),
  socialMedia: jsonb('social_media').default('{}'), // Store social links as JSON
  aboutUs: text('about_us'),
  mission: text('mission'),
  vision: text('vision'),
  humanPolicy: text('human_policy'),
  aboutImage: text('about_image'),
  catalogUrl: text('catalog_url'),
  // SEO Fields
  metaTitle: text('meta_title'),
  metaDescription: text('meta_description'),
  metaKeywords: text('meta_keywords'),
  ogImage: text('og_image'),
  whatsappNumber: text('whatsapp_number'),
  footerLogo: text('footer_logo'),
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
  homeIntroTitle: text('home_intro_title'),
  homeIntroDescription: text('home_intro_description'),
  corporateStat1Value: text('corporate_stat1_value').default('15+'),
  corporateStat1Label: text('corporate_stat1_label').default('Yıllık Tecrübe'),
  corporateStat2Value: text('corporate_stat2_value').default('100+'),
  corporateStat2Label: text('corporate_stat2_label').default('Tamamlanan Proje'),
  siteSlogan: text('site_slogan').default('İnsanların yüzündeki gülümsemeyi görmek için çalışıyoruz'),
});

export const contactLocations = pgTable('contact_locations', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  address: text('address').notNull(),
  phone: text('phone'),
  email: text('email'),
  type: text('type').default('office'), // office, factory, etc.
  mapEmbedCode: text('map_embed_code'),
  order: integer('order').default(0),
});

export const activityItems = pgTable('activity_items', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  order: integer('order').default(0),
  isActive: boolean('is_active').default(true),
});

export const heroSlides = pgTable('hero_slides', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  description: text('description'),
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
  description: text('description').notNull(),
  icon: text('icon').notNull(),
  image: text('image'),
  features: jsonb('features'), // Array of strings for list items
  order: integer('order').default(0),
});

export const innovationItems = pgTable('innovation_items', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  image: text('image'),
  watermarkText: text('watermark_text'),
  order: integer('order').default(0),
});
