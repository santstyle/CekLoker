type Nilai = string | false | null | undefined;

export function cn(...nilai: Nilai[]): string {
  return nilai.filter((n): n is string => Boolean(n)).join(" ");
}
