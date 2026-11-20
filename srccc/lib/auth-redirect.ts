const REDIRECT_ORIGIN = "https://sms-farmstead.invalid";

export function getSafeNextPath(value: string | null, fallback = "/"): string {
  if (!value || !value.startsWith("/") || value.startsWith("//") || value.includes("\\") || /[\u0000-\u001f]/.test(value)) {
    return fallback;
  }

  try {
    const destination = new URL(value, REDIRECT_ORIGIN);
    if (destination.origin !== REDIRECT_ORIGIN) return fallback;
    return `${destination.pathname}${destination.search}${destination.hash}`;
  } catch {
    return fallback;
  }
}
