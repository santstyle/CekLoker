CREATE TYPE "public"."alasan_masukan" AS ENUM('temuan_keliru', 'temuan_terlewat', 'kutipan_tidak_sesuai', 'rentang_tidak_sesuai', 'alasan_lain');--> statement-breakpoint
CREATE TABLE "masukan_hasil" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"check_id" text NOT NULL,
	"alasan" "alasan_masukan" NOT NULL,
	"rule_code" text
);
--> statement-breakpoint
CREATE INDEX "masukan_hasil_created_at_idx" ON "masukan_hasil" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "masukan_hasil_alasan_idx" ON "masukan_hasil" USING btree ("alasan");--> statement-breakpoint
CREATE INDEX "masukan_hasil_check_id_idx" ON "masukan_hasil" USING btree ("check_id");