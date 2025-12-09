import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class CacheService {

  get<T>(key: string): T | null {
    try {
      const raw = localStorage.getItem(key);
      if (!raw) return null;
      return JSON.parse(raw) as T;
    } catch (err) {
      console.error(`❌ CacheService: Failed to parse key "${key}"`, err);
      return null;
    }
  }

  set<T>(key: string, value: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (err) {
      console.error(`❌ CacheService: Failed to set key "${key}"`, err);
    }
  }

  clear(key: string): void {
    localStorage.removeItem(key);
  }

  clearAll(): void {
    localStorage.clear();
  }

  has(key: string): boolean {
    return localStorage.getItem(key) !== null;
  }
}

