ALTER TABLE "settings" ADD COLUMN "corporate_stat1_value" text DEFAULT '15+';--> statement-breakpoint
ALTER TABLE "settings" ADD COLUMN "corporate_stat1_label" text DEFAULT 'Yıllık Tecrübe';--> statement-breakpoint
ALTER TABLE "settings" ADD COLUMN "corporate_stat2_value" text DEFAULT '100+';--> statement-breakpoint
ALTER TABLE "settings" ADD COLUMN "corporate_stat2_label" text DEFAULT 'Tamamlanan Proje';--> statement-breakpoint
ALTER TABLE "settings" ADD COLUMN "site_slogan" text DEFAULT 'İnsanların yüzündeki gülümsemeyi görmek için çalışıyoruz';