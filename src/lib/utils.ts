/** Join class names, skipping falsy values. */
export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

/** Deterministic "random" delay per letter, so server and client HTML match (no hydration errors). */
export function charDelay(index: number, max = 0.9) {
  const x = Math.sin(index * 12.9898 + 78.233) * 43758.5453;
  return +((x - Math.floor(x)) * max).toFixed(2);
}

export function formatPrice(value: number, currency = "USD") {
  return `${currency} ${value.toFixed(2)}`;
}

/** Flat delivery fee added at checkout — shared between the cart display and the order total. */
export const DELIVERY_FEE = 12;

/** Below this many units, the storefront shows a "only N left" warning on that color/size. */
export const LOW_STOCK_THRESHOLD = 15;

const NEW_TAG_WINDOW_DAYS = 10;

/** A product shows its "NEW" tag for its first 10 days — computed from createdAt, so it fades on its own. */
export function isRecentlyAdded(createdAt: string) {
  return Date.now() - new Date(createdAt).getTime() < NEW_TAG_WINDOW_DAYS * 24 * 60 * 60 * 1000;
}
