import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class UiLockService {
  readonly isLocked = signal(false);

  lock() {
    this.isLocked.set(true);
  }

  unlock() {
    this.isLocked.set(false);
  }
}
