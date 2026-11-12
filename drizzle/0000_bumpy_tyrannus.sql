CREATE TYPE "public"."band_risiko" AS ENUM('rendah', 'perlu_dicek', 'tinggi');--> statement-breakpoint
CREATE TYPE "public"."hasil_jika_cocok" AS ENUM('menyimpang', 'perlu_dicek');--> statement-breakpoint
CREATE TYPE "public"."jenis_upah" AS ENUM('UMK', 'UMP');--> statement-breakpoint
CREATE TYPE "public"."jenis_wilayah" AS ENUM('kabupaten', 'kota', 'provinsi');--> statement-breakpoint
CREATE TYPE "public"."kategori_aturan" AS ENUM('upah', 'kontak', 'identitas', 'dokumen', 'seleksi', 'tekanan', 'diskriminasi', 'penempatan', 'lainnya');--> statement-breakpoint
CREATE TYPE "public"."kekuatan_hukum" AS ENUM('law', 'ministerial_regulation', 'circular', 'practice_indicator');--> statement-breakpoint
CREATE TYPE "public"."status_verifikasi" AS ENUM('verified', 'needs_verification');--> statement-breakpoint
CREATE TYPE "public"."tipe_detektor" AS ENUM('keyword', 'regex', 'threshold', 'function');--> statement-breakpoint
CREATE TABLE "admin_audit_log" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"admin" text NOT NULL,
	"action" text NOT NULL,
	"entity" text NOT NULL,
	"entity_id" text,
	"diff" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "admin_users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" text NOT NULL,
	"password_hash" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "admin_users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "checks" (
	"id" text PRIMARY KEY NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"region" text,
	"band" "band_risiko" NOT NULL,
	"score" integer NOT NULL,
	"triggered_rule_codes" text[] DEFAULT '{}' NOT NULL,
	"used_ai" boolean DEFAULT false NOT NULL,
	"input_length" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "legal_basis" (
	"id" text PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"type" text NOT NULL,
	"summary" text NOT NULL,
	"source_url" text NOT NULL,
	"verification_status" "status_verifikasi" DEFAULT 'needs_verification' NOT NULL,
	"verified_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "regional_wages" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"region_name" text NOT NULL,
	"region_type" "jenis_wilayah" NOT NULL,
	"province" text NOT NULL,
	"wage_type" "jenis_upah" NOT NULL,
	"amount" integer NOT NULL,
	"effective_year" integer NOT NULL,
	"source_url" text,
	"verified_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "rules" (
	"id" text PRIMARY KEY NOT NULL,
	"code" text NOT NULL,
	"category" "kategori_aturan" NOT NULL,
	"title" text NOT NULL,
	"description_user" text NOT NULL,
	"detector_type" "tipe_detektor" NOT NULL,
	"detector_config" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"weight" integer NOT NULL,
	"strength" "kekuatan_hukum" NOT NULL,
	"result_if_match" "hasil_jika_cocok" NOT NULL,
	"exception_note" text,
	"advice" text,
	"legal_basis_ids" text[] DEFAULT '{}' NOT NULL,
	"verification_status" "status_verifikasi" DEFAULT 'needs_verification' NOT NULL,
	"verified_at" timestamp with time zone,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "rules_code_unique" UNIQUE("code")
);
--> statement-breakpoint
CREATE TABLE "scam_patterns" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" text NOT NULL,
	"title" text NOT NULL,
	"keywords" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"explanation" text NOT NULL,
	"how_to_respond" text NOT NULL,
	"published" boolean DEFAULT false NOT NULL,
	CONSTRAINT "scam_patterns_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE INDEX "admin_audit_log_created_at_idx" ON "admin_audit_log" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "admin_audit_log_admin_idx" ON "admin_audit_log" USING btree ("admin");--> statement-breakpoint
CREATE INDEX "checks_created_at_idx" ON "checks" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "checks_band_idx" ON "checks" USING btree ("band");--> statement-breakpoint
CREATE INDEX "checks_region_idx" ON "checks" USING btree ("region");--> statement-breakpoint
CREATE INDEX "regional_wages_province_idx" ON "regional_wages" USING btree ("province");--> statement-breakpoint
CREATE INDEX "regional_wages_effective_year_idx" ON "regional_wages" USING btree ("effective_year");--> statement-breakpoint
CREATE INDEX "rules_category_idx" ON "rules" USING btree ("category");--> statement-breakpoint
CREATE INDEX "scam_patterns_published_idx" ON "scam_patterns" USING btree ("published");