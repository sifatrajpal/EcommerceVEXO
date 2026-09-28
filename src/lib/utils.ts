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
