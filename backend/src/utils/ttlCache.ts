interface CacheEntry<T> {
  value: T;
  expiresAt: number;
}

export class TtlCache<T> {
  private entry: CacheEntry<T> | null = null;

  constructor(private readonly ttlMs: number) {}

  get(): T | null {
    if (!this.entry || Date.now() > this.entry.expiresAt) {
      return null;
    }
    return this.entry.value;
  }

  set(value: T): void {
    this.entry = { value, expiresAt: Date.now() + this.ttlMs };
  }
}

export class KeyedTtlCache<T> {
  private readonly entries = new Map<string, CacheEntry<T>>();

  constructor(private readonly ttlMs: number) {}

  get(key: string): T | null {
    const entry = this.entries.get(key);
    if (!entry || Date.now() > entry.expiresAt) {
      this.entries.delete(key);
      return null;
    }
    return entry.value;
  }

  set(key: string, value: T): void {
    this.entries.set(key, { value, expiresAt: Date.now() + this.ttlMs });
  }
}
