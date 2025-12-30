// shared/directives/positive-number.directive.ts
import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[appPositiveNumber]',
  standalone: true,
})
export class PositiveNumberDirective {
  private regex = /^[0-9]*\.?[0-9]*$/;

  @HostListener('input', ['$event'])
  onInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const value = input.value;

    // احذف أي شيء غير رقم أو نقطة
    if (!this.regex.test(value)) {
      input.value = value.replace(/[^0-9.]/g, '');
      input.dispatchEvent(new Event('input'));
    }
  }

  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent): void {
    if (['e', 'E', '+', '-'].includes(event.key)) {
      event.preventDefault();
    }
  }
}
