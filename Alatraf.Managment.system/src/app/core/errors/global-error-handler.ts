import { Injectable, ErrorHandler, inject, NgZone } from "@angular/core";
import { ToastService } from "../services/toast.service";

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  private toast = inject(ToastService);
  private zone = inject(NgZone);

  handleError(error: any): void {
    console.error('🔥 Global Application Error:', error);

    this.zone.run(() => {
      this.toast.error("حدث خطأ غير متوقع داخل التطبيق.Angular Error  .");
    });
  }
}
