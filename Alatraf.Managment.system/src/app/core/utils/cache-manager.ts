export class CacheManager<T> {
  private store = new Map<string, { data: T; timestamp: number }>();
  private expirationMs: number;

  constructor(expirationMinutes: number = 5) {
    this.expirationMs = expirationMinutes * 60 * 1000; // convert minutes → ms
  }

  private isValid(key: string): boolean {
    const entry = this.store.get(key);
    if (!entry) return false;

    const age = Date.now() - entry.timestamp;
    return age < this.expirationMs;
  }

  get(key: string): T | null {
    if (!this.isValid(key)) return null;
    return this.store.get(key)!.data;
  }

  set(key: string, data: T): void {
    this.store.set(key, { data, timestamp: Date.now() });
  }

  remove(key: string): void {
    this.store.delete(key);
  }

  clear(): void {
    this.store.clear();
  }

  setExpiration(minutes: number): void {
    this.expirationMs = minutes * 60 * 1000;
  }
}
