import { z } from "zod";

const optionalNonEmpty = z
  .string()
  .optional()
  .transform((value) => {
    const trimmed = value?.trim();
    return trimmed ? trimmed : undefined;
  });

function booleanFromString(fallback: boolean) {
  return z
    .string()
    .optional()
    .transform((value, ctx) => {
      if (value === undefined || value.trim() === "") {
        return fallback;
      }

      const normalized = value.trim().toLowerCase();
      if (normalized === "true" || normalized === "1") {
        return true;
      }

      if (normalized === "false" || normalized === "0") {
        return false;
      }

      ctx.addIssue({
        code: "custom",
        message: `harus "true"/"1" atau "false"/"0", ditemukan: "${value}"`,
      });
      return z.NEVER;
    });
}

const optionalUrl = z
  .string()
  .optional()
  .transform((value, ctx) => {
    const trimmed = value?.trim();
    if (!trimmed) {
      return undefined;
    }

    try {
      return new URL(trimmed).toString();
    } catch {
      ctx.addIssue({
        code: "custom",
        message: `bukan URL yang valid: "${value}"`,
      });
      return z.NEVER;
    }
  });

const envSchema = z.object({
  DATABASE_URL: optionalNonEmpty,
  GEMINI_API_KEY: optionalNonEmpty,
  AI_EXTRACTION_ENABLED: booleanFromString(false),
  ADMIN_EMAIL: optionalNonEmpty,
  ADMIN_PASSWORD_HASH: optionalNonEmpty,
  AUTH_SECRET: optionalNonEmpty,
  NEXT_PUBLIC_SITE_URL: optionalUrl,
});

export type Env = z.infer<typeof envSchema>;

export function parseEnv(source: Record<string, string | undefined>): Env {
  const result = envSchema.safeParse(source);
  if (!result.success) {
    const issues = result.error.issues.map(
      (issue) => `${issue.path.join(".")}: ${issue.message}`,
    );
    throw new Error(`Variabel lingkungan tidak valid: ${issues.join("; ")}`);
  }

  return result.data;
}

export function getEnv(): Env {
  const globalForEnv = globalThis as unknown as { __ceklokerEnv?: Env };
  if (!globalForEnv.__ceklokerEnv) {
    globalForEnv.__ceklokerEnv = parseEnv(process.env);
  }

  return globalForEnv.__ceklokerEnv;
}

type RequireEnvKey = {
  [K in keyof Env]: Env[K] extends string | undefined ? K : never;
}[keyof Env];

export function requireEnv(key: RequireEnvKey, env: Env = getEnv()): string {
  const value = env[key];
  if (!value) {
    throw new Error(
      `Variabel lingkungan ${key} wajib diisi untuk operasi ini. Isi ${key} di file .env Anda (lihat .env.example).`,
    );
  }

  return value;
}
