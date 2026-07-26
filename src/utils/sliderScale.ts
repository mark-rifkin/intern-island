export const CUSTOM_MAX_CENTS = 100_000_000;

export function positionToAmountCents(position: number): number {
  if (position <= 0) return 0;
  if (position >= 1000) return CUSTOM_MAX_CENTS;
  const normalized = position / 1000;
  return Math.round(10 ** (normalized * 6) * 100);
}

export function snapCustomAmountCents(amountCents: number): number {
  const dollars = amountCents / 100;
  const step = dollars < 10 ? 0.25 : dollars < 100 ? 1 : dollars < 1000 ? 5 : dollars < 10000 ? 25 : dollars < 100000 ? 100 : 1000;
  return Math.max(0, Math.min(CUSTOM_MAX_CENTS, Math.round(Math.round(dollars / step) * step * 100)));
}
