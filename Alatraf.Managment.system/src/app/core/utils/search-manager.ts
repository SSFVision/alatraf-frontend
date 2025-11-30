import { Subject, Observable, of } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap, tap, finalize } from 'rxjs/operators';
import { signal } from '@angular/core';
import { CacheManager } from './cache-manager';

export class SearchManager<T> {
  private input$ = new Subject<string>();
  loading = signal(false);

  constructor(
    private fetchFn: (term: string) => Observable<T>,     // backend call
    private cache: CacheManager<T> | null,                // optional cache
    private onResult: (result: T) => void,                // callback
    private debounceMs = 300
  ) {
    this.setup();
  }

  private setup() {
    this.input$
      .pipe(
        debounceTime(this.debounceMs),
        distinctUntilChanged(),

        switchMap((term) => {
          const key = term.trim().toLowerCase();

          // Use cache if provided
          if (this.cache) {
            const cached = this.cache.get(key);
            if (cached) {
              this.onResult(cached);
              return of(null);
            }
          }

          this.loading.set(true);

          return this.fetchFn(term).pipe(
            tap((result) => {
              if (!result) return;

              if (this.cache) {
                this.cache.set(key, result);
              }

              this.onResult(result);
            }),
            finalize(() => this.loading.set(false))
          );
        })
      )
      .subscribe();
  }

  search(term: string) {
    this.input$.next(term);
  }
}
