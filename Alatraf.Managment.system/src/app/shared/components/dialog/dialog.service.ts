import {
  ApplicationRef,
  ComponentRef,
  createComponent,
  EnvironmentInjector,
  Injectable,
  Injector,
} from '@angular/core';
import { firstValueFrom, Observable, Subject, EMPTY } from 'rxjs'; // ✅ NEW
import { DialogConfig, DialogType } from './DialogConfig';
import {
  DialogResult,
  SharedDialogComponent,
} from './shared-dialog/shared-dialog.component';
import { UiLockService } from '../../../core/services/ui-lock.service';

@Injectable({
  providedIn: 'root',
})
export class DialogService {

  // ===============================
  // ✅ NEW: prevent multiple dialogs
  // ===============================
  private isDialogOpen = false;

  constructor(
    private injector: Injector,
    private appRef: ApplicationRef,
    private envInjector: EnvironmentInjector,
    private uiLock: UiLockService
  ) {}

  open(config: DialogConfig): Observable<DialogResult> {

    // =====================================
    // ✅ NEW GUARD (do NOT change logic)
    // =====================================
    if (this.isDialogOpen) {
      return EMPTY; // prevent reopening dialog
    }
    this.isDialogOpen = true;

    const subject = new Subject<DialogResult>();
    this.uiLock.lock();

    const compRef = createComponent(SharedDialogComponent, {
      environmentInjector: this.envInjector,
      elementInjector: this.injector,
    });

    compRef.instance.config = config;

    const sub = compRef.instance.closed.subscribe((res: DialogResult) => {
      subject.next(res);
      subject.complete();
      sub.unsubscribe();
      this.destroy(compRef);
      this.uiLock.unlock();

      // ===============================
      // ✅ RESET FLAG WHEN CLOSED
      // ===============================
      this.isDialogOpen = false;
    });

    this.appRef.attachView(compRef.hostView);
    const domElem = (compRef.hostView as any).rootNodes[0] as HTMLElement;
    document.body.appendChild(domElem);

    return subject.asObservable();
  }

  confirm(config: DialogConfig): Observable<boolean> {
    return new Observable<boolean>((observer) => {
      const sub = this.open(config).subscribe({
        next: (res) => {
          observer.next(!!res.confirmed);
          observer.complete();
        },
        error: (err) => observer.error(err),
      });

      return () => sub.unsubscribe();
    });
  }

  async confirmPromise(config: DialogConfig): Promise<boolean> {
    return firstValueFrom(this.confirm(config));
  }

  confirmDelete(config: DialogConfig): Observable<boolean> {
    return this.confirm({
      type: DialogType.Delete,
      title: config.title ?? 'حذف',
      message: config.message,
      payload: config.payload,
      confirmText: 'حذف',
      cancelText: 'إلغاء',
      showCancel: true,
    });
  }

  confirmSuccess(message: string, title = 'نجاح'): Observable<boolean> {
    return this.confirm({
      type: DialogType.Success,
      title,
      message,
      showCancel: false,
    });
  }

  private destroy(compRef: ComponentRef<any>) {
    try {
      this.appRef.detachView(compRef.hostView);
      compRef.destroy();
    } catch (e) {
      console.warn('Dialog destroy error', e);
    }
  }
}
