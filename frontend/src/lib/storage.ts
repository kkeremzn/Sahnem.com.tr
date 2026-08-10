const PREFIX = 'sahnem:';

export function readStore<T>(key: string, seed: T): T {
  try {
    const raw = localStorage.getItem(PREFIX + key);
    if (!raw) {
      localStorage.setItem(PREFIX + key, JSON.stringify(seed));
      return seed;
    }
    return JSON.parse(raw) as T;
  } catch {
    return seed;
  }
}

export function writeStore<T>(key: string, value: T): void {
  localStorage.setItem(PREFIX + key, JSON.stringify(value));
}

export function nextId(items: { id: number }[]): number {
  return items.reduce((max, item) => Math.max(max, item.id), 0) + 1;
}

export function resetAllStores(): void {
  Object.keys(localStorage)
    .filter((k) => k.startsWith(PREFIX))
    .forEach((k) => localStorage.removeItem(k));
}
