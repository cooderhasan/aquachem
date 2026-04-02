CREATE TABLE "quote_requests" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"phone" text NOT NULL,
	"company" text,
	"product_name" text NOT NULL,
	"quantity" text,
	"status" text DEFAULT 'new',
	"is_read" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "settings" ADD COLUMN "hero_overlay_opacity" integer DEFAULT 60;--> statement-breakpoint
ALTER TABLE "settings" ADD COLUMN "hero_gradient_opacity" integer DEFAULT 80;--> statement-breakpoint
ALTER TABLE "settings" ADD COLUMN "home_intro_title" text;--> statement-breakpoint
ALTER TABLE "settings" ADD COLUMN "home_intro_description" text;