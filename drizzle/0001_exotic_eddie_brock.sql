CREATE TABLE "applications" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"phone" text,
	"position" text,
	"cv_url" text NOT NULL,
	"status" text DEFAULT 'new',
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "messages" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"subject" text,
	"message" text NOT NULL,
	"is_read" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "mission_cards" ADD COLUMN "features" jsonb;--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "features" jsonb;--> statement-breakpoint
ALTER TABLE "references" ADD COLUMN "category_id" integer;--> statement-breakpoint
ALTER TABLE "settings" ADD COLUMN "favicon" text;--> statement-breakpoint
ALTER TABLE "settings" ADD COLUMN "catalog_url" text;--> statement-breakpoint
ALTER TABLE "settings" ADD COLUMN "meta_title" text;--> statement-breakpoint
ALTER TABLE "settings" ADD COLUMN "meta_description" text;--> statement-breakpoint
ALTER TABLE "settings" ADD COLUMN "meta_keywords" text;--> statement-breakpoint
ALTER TABLE "settings" ADD COLUMN "og_image" text;--> statement-breakpoint
ALTER TABLE "settings" ADD COLUMN "whatsapp_number" text;--> statement-breakpoint
ALTER TABLE "settings" ADD COLUMN "footer_logo" text;--> statement-breakpoint
ALTER TABLE "settings" ADD COLUMN "logo_height" integer DEFAULT 48;--> statement-breakpoint
ALTER TABLE "settings" ADD COLUMN "menu_font_size" integer DEFAULT 14;--> statement-breakpoint
ALTER TABLE "settings" ADD COLUMN "header_padding" integer DEFAULT 20;--> statement-breakpoint
ALTER TABLE "settings" ADD COLUMN "footer_logo_padding" integer DEFAULT 0;--> statement-breakpoint
ALTER TABLE "settings" ADD COLUMN "references_scroll_speed" integer DEFAULT 30;--> statement-breakpoint
ALTER TABLE "settings" ADD COLUMN "about_us_font_size" text DEFAULT 'text-lg';--> statement-breakpoint
ALTER TABLE "settings" ADD COLUMN "about_us_darkness" text DEFAULT 'text-slate-600';--> statement-breakpoint
ALTER TABLE "settings" ADD COLUMN "menu_items" jsonb DEFAULT '[]';--> statement-breakpoint
ALTER TABLE "settings" ADD COLUMN "reference_logo_height" integer DEFAULT 100;--> statement-breakpoint
ALTER TABLE "references" ADD CONSTRAINT "references_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE set null ON UPDATE no action;