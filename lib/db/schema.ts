/**
 * Skema database CekLoker (Fase 1, spesifikasi §6).
 *
 * Prinsip:
 * - Tabel `checks` menyimpan hanya data agregat dan anonim. Tidak ada kolom
 *   teks lowongan mentah, nomor telepon, email, atau nomor rekening.
 * - Enum nilai mengikuti spesifikasi §6; kategori aturan mengikuti
 *   `KATEGORI_RULE` di `lib/evaluation/types.ts` agar konsisten dengan mesin.
 * - `rules.legal_basis_ids` berbentuk array id `legal_basis.id`; integritas
 *   nilainya divalidasi saat seed karena PostgreSQL tidak mendukung FK pada
 *   kolom array.
 */
import {
  boolean,
  index,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

export const bandRisiko = pgEnum("band_risiko", [
  "rendah",
  "perlu_dicek",
  "tinggi",
]);

export const kategoriAturan = pgEnum("kategori_aturan", [
  "upah",
  "kontak",
  "identitas",
  "dokumen",
  "seleksi",
  "tekanan",
  "diskriminasi",
  "penempatan",
  "lainnya",
]);

export const tipeDetektor = pgEnum("tipe_detektor", [
  "keyword",
  "regex",
  "threshold",
  "function",
]);

export const kekuatanHukum = pgEnum("kekuatan_hukum", [
  "law",
  "ministerial_regulation",
  "circular",
  "practice_indicator",
]);

export const hasilJikaCocok = pgEnum("hasil_jika_cocok", [
  "menyimpang",
  "perlu_dicek",
]);

export const statusVerifikasi = pgEnum("status_verifikasi", [
  "verified",
  "needs_verification",
]);

export const jenisWilayah = pgEnum("jenis_wilayah", [
  "kabupaten",
  "kota",
  "provinsi",
]);

export const jenisUpah = pgEnum("jenis_upah", ["UMK", "UMP"]);

export const rules = pgTable(
  "rules",
  {
    id: text("id").primaryKey(),
    code: text("code").notNull().unique(),
    category: kategoriAturan("category").notNull(),
    title: text("title").notNull(),
    descriptionUser: text("description_user").notNull(),
    detectorType: tipeDetektor("detector_type").notNull(),
    detectorConfig: jsonb("detector_config")
      .$type<Record<string, unknown>>()
      .notNull()
      .default({}),
    weight: integer("weight").notNull(),
    strength: kekuatanHukum("strength").notNull(),
    resultIfMatch: hasilJikaCocok("result_if_match").notNull(),
    exceptionNote: text("exception_note"),
    advice: text("advice"),
    legalBasisIds: text("legal_basis_ids").array().notNull().default([]),
    verificationStatus: statusVerifikasi("verification_status")
      .notNull()
      .default("needs_verification"),
    verifiedAt: timestamp("verified_at", { withTimezone: true }),
    isActive: boolean("is_active").notNull().default(true),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [index("rules_category_idx").on(table.category)],
);

export const legalBasis = pgTable("legal_basis", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  type: text("type").notNull(),
  summary: text("summary").notNull(),
  sourceUrl: text("source_url").notNull(),
  verificationStatus: statusVerifikasi("verification_status")
    .notNull()
    .default("needs_verification"),
  verifiedAt: timestamp("verified_at", { withTimezone: true }),
});

export const regionalWages = pgTable(
  "regional_wages",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    regionName: text("region_name").notNull(),
    regionType: jenisWilayah("region_type").notNull(),
    province: text("province").notNull(),
    wageType: jenisUpah("wage_type").notNull(),
    amount: integer("amount").notNull(),
    effectiveYear: integer("effective_year").notNull(),
    sourceUrl: text("source_url"),
    verifiedAt: timestamp("verified_at", { withTimezone: true }),
  },
  (table) => [
    index("regional_wages_province_idx").on(table.province),
    index("regional_wages_effective_year_idx").on(table.effectiveYear),
  ],
);

export const scamPatterns = pgTable(
  "scam_patterns",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    slug: text("slug").notNull().unique(),
    title: text("title").notNull(),
    keywords: jsonb("keywords").$type<string[]>().notNull().default([]),
    explanation: text("explanation").notNull(),
    howToRespond: text("how_to_respond").notNull(),
    published: boolean("published").notNull().default(false),
  },
  (table) => [index("scam_patterns_published_idx").on(table.published)],
);

export const checks = pgTable(
  "checks",
  {
    id: text("id").primaryKey(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    region: text("region"),
    band: bandRisiko("band").notNull(),
    score: integer("score").notNull(),
    triggeredRuleCodes: text("triggered_rule_codes")
      .array()
      .notNull()
      .default([]),
    usedAi: boolean("used_ai").notNull().default(false),
    inputLength: integer("input_length").notNull(),
  },
  (table) => [
    index("checks_created_at_idx").on(table.createdAt),
    index("checks_band_idx").on(table.band),
    index("checks_region_idx").on(table.region),
  ],
);

export const adminAuditLog = pgTable(
  "admin_audit_log",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    admin: text("admin").notNull(),
    action: text("action").notNull(),
    entity: text("entity").notNull(),
    entityId: text("entity_id"),
    diff: jsonb("diff").$type<Record<string, unknown>>(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index("admin_audit_log_created_at_idx").on(table.createdAt),
    index("admin_audit_log_admin_idx").on(table.admin),
  ],
);

export const adminUsers = pgTable("admin_users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const schema = {
  rules,
  legalBasis,
  regionalWages,
  scamPatterns,
  checks,
  adminAuditLog,
  adminUsers,
};
